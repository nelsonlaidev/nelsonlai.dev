ALTER TABLE "post_like" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "post_like" ADD COLUMN "post_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "post_like" ADD COLUMN "anon_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "post_like" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_post_id_anon_key_pk" PRIMARY KEY("post_id","anon_key");--> statement-breakpoint
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_post_id_post_slug_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_post_like_post" ON "post_like" USING btree ("post_id");
