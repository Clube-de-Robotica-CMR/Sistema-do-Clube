CREATE TYPE "public"."placement_rank" AS ENUM('1°', '2°', '3°');--> statement-breakpoint
CREATE TYPE "public"."classification_enum" AS ENUM('Microcontrolador', 'Atuador', 'Componente Mecânico', 'Sensor', 'Conector', 'Energia', 'Variados', 'Dispositivo de saída');--> statement-breakpoint
CREATE TYPE "public"."collection_enum" AS ENUM('Arduino', 'LEGO SPIKE', 'LEGO EV3');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('Funcionando', 'Sem funcionamento');--> statement-breakpoint
CREATE TABLE "competition_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"member_war_name" text NOT NULL,
	"member_number" text NOT NULL,
	"placement" "placement_rank" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"date" timestamp NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"classification" "classification_enum" NOT NULL,
	"collection" "collection_enum" NOT NULL,
	"status" "status_enum" NOT NULL,
	"location" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competition_results" ADD CONSTRAINT "competition_results_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "number_competition_unique_idx" ON "competition_results" USING btree ("member_number","competition_id");