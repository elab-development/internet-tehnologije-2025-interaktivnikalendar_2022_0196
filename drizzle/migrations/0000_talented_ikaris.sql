CREATE TABLE `category` (
	`idCategory` int AUTO_INCREMENT NOT NULL,
	`naziv` varchar(255) NOT NULL,
	`boja` varchar(7) NOT NULL DEFAULT '#787a7c',
	CONSTRAINT `category_idCategory` PRIMARY KEY(`idCategory`)
);
--> statement-breakpoint
CREATE TABLE `event` (
	`idEvent` int AUTO_INCREMENT NOT NULL,
	`naziv` varchar(100) NOT NULL,
	`pocetakDogadjaja` timestamp NOT NULL,
	`krajDogadjaja` timestamp NOT NULL,
	`opis` varchar(255),
	`vazan` boolean NOT NULL DEFAULT false,
	`privatnost` varchar(20) NOT NULL DEFAULT 'privatan',
	`idUser` int NOT NULL,
	`idCategory` int,
	CONSTRAINT `event_idEvent` PRIMARY KEY(`idEvent`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`idNotification` int AUTO_INCREMENT NOT NULL,
	`zakazanoVreme` timestamp NOT NULL,
	`status` varchar(20) NOT NULL,
	`vremenskiOffset` int NOT NULL,
	`idEvent` int NOT NULL,
	`idUser` int NOT NULL,
	CONSTRAINT `notification_idNotification` PRIMARY KEY(`idNotification`)
);
--> statement-breakpoint
CREATE TABLE `recurrence` (
	`idRecurrence` int AUTO_INCREMENT NOT NULL,
	`tip` varchar(50) NOT NULL,
	`krajPonavljanja` timestamp NOT NULL,
	`daniUNedelji` varchar(100) NOT NULL,
	`idEvent` int NOT NULL,
	CONSTRAINT `recurrence_idRecurrence` PRIMARY KEY(`idRecurrence`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`idUser` int AUTO_INCREMENT NOT NULL,
	`ime` varchar(20) NOT NULL,
	`prezime` varchar(20) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`userRole` enum('ADMIN','REGISTROVANI_USER','GOST') NOT NULL DEFAULT 'REGISTROVANI_USER',
	CONSTRAINT `user_idUser` PRIMARY KEY(`idUser`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `event` ADD CONSTRAINT `event_idUser_user_idUser_fk` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event` ADD CONSTRAINT `event_idCategory_category_idCategory_fk` FOREIGN KEY (`idCategory`) REFERENCES `category`(`idCategory`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_idEvent_event_idEvent_fk` FOREIGN KEY (`idEvent`) REFERENCES `event`(`idEvent`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_idUser_user_idUser_fk` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recurrence` ADD CONSTRAINT `recurrence_idEvent_event_idEvent_fk` FOREIGN KEY (`idEvent`) REFERENCES `event`(`idEvent`) ON DELETE cascade ON UPDATE no action;