CREATE TABLE "settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"reply_notifications_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "unsubscribes" DROP CONSTRAINT "unsubscribes_scope_comment_id_check";--> statement-breakpoint
ALTER TABLE "unsubscribes" ALTER COLUMN "scope" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."unsubscribe_scope";--> statement-breakpoint
CREATE TYPE "public"."unsubscribe_scope" AS ENUM('comment');--> statement-breakpoint
ALTER TABLE "unsubscribes" ALTER COLUMN "scope" SET DATA TYPE "public"."unsubscribe_scope" USING "scope"::"public"."unsubscribe_scope";--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unsubscribes" ADD CONSTRAINT "unsubscribes_scope_comment_id_check" CHECK (("unsubscribes"."scope" = 'comment' AND "unsubscribes"."comment_id" IS NOT NULL));