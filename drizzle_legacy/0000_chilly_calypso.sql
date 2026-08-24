CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome_de_guerra" text NOT NULL,
	"nome_completo" text NOT NULL,
	"número" text NOT NULL,
	"turma" text NOT NULL,
	"contato" text,
	"nível" text DEFAULT 'Nível B',
	"área" text,
	"diretoria" boolean DEFAULT false NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"senha" text NOT NULL,
	"cargo" text DEFAULT 'diretoria' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
