CREATE TYPE "public"."unsubscribe_type" AS ENUM('all', 'comment');--> statement-breakpoint
CREATE TABLE "unsubscribe" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" text,
	"type" "unsubscribe_type" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "unsubscribe" ADD CONSTRAINT "unsubscribe_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unsubscribe" ADD CONSTRAINT "unsubscribe_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_unsubscribe_user_id" ON "unsubscribe" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_unsubscribe_comment_id" ON "unsubscribe" USING btree ("comment_id");