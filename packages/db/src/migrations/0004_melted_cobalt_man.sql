DROP INDEX "votes_comment_id_like_idx";--> statement-breakpoint
CREATE INDEX "votes_comment_id_is_like_idx" ON "votes" USING btree ("comment_id","is_like");