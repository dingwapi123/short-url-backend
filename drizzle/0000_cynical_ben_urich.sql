CREATE TABLE "url_record" (
	"id" bigint PRIMARY KEY NOT NULL,
	"originalUrl" text NOT NULL,
	"shortUrl" text NOT NULL,
	"urlCode" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(255),
	"visitCount" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "url_record_urlCode_unique" UNIQUE("urlCode")
);
