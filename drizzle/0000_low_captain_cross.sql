CREATE TYPE "public"."placement_rank" AS ENUM('1°', '2°', '3°');--> statement-breakpoint
CREATE TYPE "public"."classification_enum" AS ENUM('Microcontrolador', 'Atuador', 'Componente Mecânico', 'Sensor', 'Conector', 'Energia', 'Variados', 'Dispositivo de saída');--> statement-breakpoint
CREATE TYPE "public"."collection_enum" AS ENUM('Arduino', 'LEGO SPIKE', 'LEGO EV3');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('Funcionando', 'Sem funcionamento', 'A analisar');--> statement-breakpoint
CREATE TYPE "public"."attendance_status" AS ENUM('Presente', 'Falta Justificada', 'Falta');--> statement-breakpoint
CREATE TYPE "public"."quarters" AS ENUM('1°', '2°', '3°');--> statement-breakpoint
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
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"status" "attendance_status" DEFAULT 'Falta' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data" timestamp NOT NULL,
	"quarter" "quarters" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "meetings_data_unique" UNIQUE("data")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome_de_guerra" text NOT NULL,
	"nome_completo" text NOT NULL,
	"número" text NOT NULL,
	"turma" text NOT NULL,
	"contato" text,
	"nível" text DEFAULT 'Indefinido',
	"área" text DEFAULT 'Indefinido',
	"diretoria" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "members_número_unique" UNIQUE("número")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"senha" text NOT NULL,
	"cargo" text DEFAULT 'diretoria' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
ALTER TABLE "competition_results" ADD CONSTRAINT "competition_results_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "number_competition_unique_idx" ON "competition_results" USING btree ("member_number","competition_id");--> statement-breakpoint
CREATE UNIQUE INDEX "member_meeting_unique_idx" ON "attendance" USING btree ("member_id","meeting_id");