CREATE TABLE `previews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`description` text,
	`image` text,
	`site_name` text,
	`favicon` text,
	`raw_meta` text,
	`fetched_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `previews_url_unique` ON `previews` (`url`);