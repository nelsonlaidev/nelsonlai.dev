CREATE TYPE "public"."unsubscribe_scope" AS ENUM('comment_replies_user', 'comment_replies_comment');--> statement-breakpoint
CREATE TABLE "unsubscribes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" text,
	"scope" "unsubscribe_scope" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "unsubscribes_user_id_scope_comment_id_uq" UNIQUE("user_id","scope","comment_id"),
	CONSTRAINT "unsubscribes_scope_comment_id_check" CHECK ((
        ("unsubscribes"."scope" = 'comment_replies_user' AND "unsubscribes"."comment_id" IS NULL)
        OR
        ("unsubscribes"."scope" = 'comment_replies_comment' AND "unsubscribes"."comment_id" IS NOT NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "unsubscribes" ADD CONSTRAINT "unsubscribes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unsubscribes" ADD CONSTRAINT "unsubscribes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "unsubscribes_user_id_idx" ON "unsubscribes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "unsubscribes_comment_id_idx" ON "unsubscribes" USING btree ("comment_id");