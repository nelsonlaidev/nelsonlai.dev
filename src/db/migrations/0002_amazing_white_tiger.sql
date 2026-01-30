-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION update_comments_reply_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE comments SET reply_count = reply_count + 1 WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE comments SET reply_count = reply_count - 1 WHERE id = OLD.parent_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comments_vote_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_like = true THEN
      UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE comments SET dislike_count = dislike_count + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_like = true THEN
      UPDATE comments SET like_count = like_count - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE comments SET dislike_count = dislike_count - 1 WHERE id = OLD.comment_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_like = true AND NEW.is_like = false THEN
      UPDATE comments SET like_count = like_count - 1, dislike_count = dislike_count + 1 WHERE id = NEW.comment_id;
    ELSIF OLD.is_like = false AND NEW.is_like = true THEN
      UPDATE comments SET like_count = like_count + 1, dislike_count = dislike_count - 1 WHERE id = NEW.comment_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comments_reply_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_comments_reply_count();

CREATE TRIGGER update_comments_vote_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_comments_vote_count();
