CREATE TABLE `plant` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`plantName` text NOT NULL,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `plantType` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`potNumber` integer NOT NULL,
	`frequency` integer NOT NULL,
	`duration` integer NOT NULL,
	`plantId` integer NOT NULL,
	`userId` integer NOT NULL,
	`waterUsage` integer DEFAULT 0,
	`date` text,
	FOREIGN KEY (`plantId`) REFERENCES `plant`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`isLoggedIn` integer DEFAULT 0
);
