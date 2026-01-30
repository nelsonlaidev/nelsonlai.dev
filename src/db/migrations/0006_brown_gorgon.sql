ALTER TYPE "public"."unsubscribe_scope" RENAME TO "unsubscribe_type";--> statement-breakpoint
ALTER TABLE "unsubscribes" RENAME COLUMN "scope" TO "type";--> statement-breakpoint
ALTER TABLE "unsubscribes" DROP CONSTRAINT "unsubscribes_user_id_scope_comment_id_uq";--> statement-breakpoint
ALTER TABLE "unsubscribes" DROP CONSTRAINT "unsubscribes_scope_comment_id_check";--> statement-breakpoint
ALTER TABLE "unsubscribes" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."unsubscribe_type";--> statement-breakpoint
CREATE TYPE "public"."unsubscribe_type" AS ENUM('comment_reply');--> statement-breakpoint
ALTER TABLE "unsubscribes" ALTER COLUMN "type" SET DATA TYPE "public"."unsubscribe_type" USING "type"::"public"."unsubscribe_type";--> statement-breakpoint
ALTER TABLE "unsubscribes" ADD CONSTRAINT "unsubscribes_user_id_type_comment_id_uq" UNIQUE("user_id","type","comment_id");--> statement-breakpoint
ALTER TABLE "unsubscribes" ADD CONSTRAINT "unsubscribes_comment_reply_check" CHECK (("unsubscribes"."type" = 'comment_reply' AND "unsubscribes"."comment_id" IS NOT NULL));