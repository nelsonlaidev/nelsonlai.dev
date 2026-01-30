-- Custom SQL migration file, put your code below! --
INSERT INTO "users" (
    "id",
    "name",
    "email",
    "email_verified",
    "image",
    "created_at",
    "updated_at",
    "role"
)
SELECT
    'ghost',
    'Deleted User',
    'ghost@nelsonlai.dev',
    TRUE,
    NULL,
    NOW(),
    NOW(),
    'user'
WHERE NOT EXISTS (
    SELECT 1 FROM "users" WHERE "id" = 'ghost'
);
