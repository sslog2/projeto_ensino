


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
   BEGIN
     INSERT INTO public.profiles (id, nome, tipo)
     VALUES (new.id, new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'tipo');
     RETURN new;
   END;
   $$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."alunos_turmas" (
    "aluno_id" "uuid" NOT NULL,
    "turma_id" "uuid" NOT NULL
);


ALTER TABLE "public"."alunos_turmas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."atividades_desplugadas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "professor_id" "uuid",
    "turma_id" "uuid",
    "titulo" "text" NOT NULL,
    "descricao" "text" NOT NULL,
    "materiais" "text",
    "concluida" boolean DEFAULT false,
    "feedback" "text",
    "data_criacao" timestamp with time zone DEFAULT "now"(),
    "data_conclusao" timestamp with time zone,
    "data_agendada" timestamp with time zone,
    "anexo_url" "text"
);


ALTER TABLE "public"."atividades_desplugadas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."desafios" (
    "id" integer NOT NULL,
    "titulo" "text" NOT NULL,
    "descricao" "text",
    "objetivo" "text",
    "dificuldade" "text",
    "pontos_recompensa" integer DEFAULT 100,
    "config_tabuleiro" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "regras" "jsonb" DEFAULT '{}'::"jsonb",
    "professor_id" "uuid"
);


ALTER TABLE "public"."desafios" OWNER TO "postgres";


COMMENT ON COLUMN "public"."desafios"."regras" IS 'Restrições do nível, ex: {"max_blocos": 10, "limites": {"virar_direita": 2}}';



CREATE SEQUENCE IF NOT EXISTS "public"."desafios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."desafios_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."desafios_id_seq" OWNED BY "public"."desafios"."id";



CREATE TABLE IF NOT EXISTS "public"."inscricoes_atividades" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "atividade_id" "uuid",
    "aluno_id" "uuid",
    "data_inscricao" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."inscricoes_atividades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "nome" "text" NOT NULL,
    "tipo" "text" NOT NULL,
    "nivel" integer DEFAULT 1,
    "pontos" integer DEFAULT 0,
    "avatar_data" "jsonb" DEFAULT '{"corpo": "basic", "olhos": "normal", "acessorio": "none"}'::"jsonb",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "necessidades_cognitivas" boolean DEFAULT false,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "profiles_tipo_check" CHECK (("tipo" = ANY (ARRAY['aluno'::"text", 'professor'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."progresso_alunos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "aluno_id" "uuid",
    "desafio_id" integer,
    "concluido" boolean DEFAULT false,
    "pontuacao_obtida" integer DEFAULT 0,
    "data_conclusao" timestamp with time zone DEFAULT "now"(),
    "tentativas" integer DEFAULT 0 NOT NULL,
    "tempo_segundos" integer,
    "estrelas_obtidas" integer DEFAULT 0
);


ALTER TABLE "public"."progresso_alunos" OWNER TO "postgres";


COMMENT ON COLUMN "public"."progresso_alunos"."tempo_segundos" IS 'Tempo total em segundos desde o início do desafio até o sucesso';



COMMENT ON COLUMN "public"."progresso_alunos"."estrelas_obtidas" IS 'Quantidade de estrelas bônus coletadas (0 a 3)';



CREATE TABLE IF NOT EXISTS "public"."recursos_desplugados" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "professor_id" "uuid",
    "titulo" "text" NOT NULL,
    "url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."recursos_desplugados" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."turmas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nome" "text" NOT NULL,
    "codigo" "text" NOT NULL,
    "professor_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "meta_pontos" integer DEFAULT 500
);


ALTER TABLE "public"."turmas" OWNER TO "postgres";


ALTER TABLE ONLY "public"."desafios" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."desafios_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."alunos_turmas"
    ADD CONSTRAINT "alunos_turmas_pkey" PRIMARY KEY ("aluno_id", "turma_id");



ALTER TABLE ONLY "public"."atividades_desplugadas"
    ADD CONSTRAINT "atividades_desplugadas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."desafios"
    ADD CONSTRAINT "desafios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inscricoes_atividades"
    ADD CONSTRAINT "inscricoes_atividades_atividade_id_aluno_id_key" UNIQUE ("atividade_id", "aluno_id");



ALTER TABLE ONLY "public"."inscricoes_atividades"
    ADD CONSTRAINT "inscricoes_atividades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."progresso_alunos"
    ADD CONSTRAINT "progresso_alunos_aluno_id_desafio_id_key" UNIQUE ("aluno_id", "desafio_id");



ALTER TABLE ONLY "public"."progresso_alunos"
    ADD CONSTRAINT "progresso_alunos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recursos_desplugados"
    ADD CONSTRAINT "recursos_desplugados_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."turmas"
    ADD CONSTRAINT "turmas_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."turmas"
    ADD CONSTRAINT "turmas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."alunos_turmas"
    ADD CONSTRAINT "alunos_turmas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alunos_turmas"
    ADD CONSTRAINT "alunos_turmas_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "public"."turmas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."atividades_desplugadas"
    ADD CONSTRAINT "atividades_desplugadas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."atividades_desplugadas"
    ADD CONSTRAINT "atividades_desplugadas_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "public"."turmas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."desafios"
    ADD CONSTRAINT "desafios_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."inscricoes_atividades"
    ADD CONSTRAINT "inscricoes_atividades_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inscricoes_atividades"
    ADD CONSTRAINT "inscricoes_atividades_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "public"."atividades_desplugadas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progresso_alunos"
    ADD CONSTRAINT "progresso_alunos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progresso_alunos"
    ADD CONSTRAINT "progresso_alunos_desafio_id_fkey" FOREIGN KEY ("desafio_id") REFERENCES "public"."desafios"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recursos_desplugados"
    ADD CONSTRAINT "recursos_desplugados_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."turmas"
    ADD CONSTRAINT "turmas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Alunos gerenciam seu próprio progresso" ON "public"."progresso_alunos" TO "authenticated" USING (("auth"."uid"() = "aluno_id")) WITH CHECK (("auth"."uid"() = "aluno_id"));



CREATE POLICY "Alunos podem se vincular a turmas" ON "public"."alunos_turmas" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "aluno_id"));



CREATE POLICY "Alunos veem seu próprio progresso" ON "public"."progresso_alunos" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "aluno_id"));



CREATE POLICY "Desafios visíveis para todos" ON "public"."desafios" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Leitura de recursos permitida para autenticados" ON "public"."recursos_desplugados" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Perfis são visíveis por usuários autenticados" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Permitir leitura de atividades para autenticados" ON "public"."atividades_desplugadas" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Permitir leitura de inscrições para usuários autenticados" ON "public"."inscricoes_atividades" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Permitir que alunos cancelem a própria inscrição" ON "public"."inscricoes_atividades" FOR DELETE USING (("auth"."uid"() = "aluno_id"));



CREATE POLICY "Permitir que alunos se inscrevam usando seu próprio ID" ON "public"."inscricoes_atividades" FOR INSERT WITH CHECK (("auth"."uid"() = "aluno_id"));



CREATE POLICY "Permitir que professores atualizem perfis" ON "public"."profiles" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "profiles_1"
  WHERE (("profiles_1"."id" = "auth"."uid"()) AND ("profiles_1"."tipo" = 'professor'::"text")))));



CREATE POLICY "Professores podem atualizar suas atividades" ON "public"."atividades_desplugadas" FOR UPDATE USING (("auth"."uid"() = "professor_id"));



CREATE POLICY "Professores podem criar atividades" ON "public"."atividades_desplugadas" FOR INSERT WITH CHECK (("auth"."uid"() = "professor_id"));



CREATE POLICY "Professores podem criar desafios" ON "public"."desafios" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Professores podem criar e editar suas turmas" ON "public"."turmas" TO "authenticated" USING (("auth"."uid"() = "professor_id"));



CREATE POLICY "Professores podem deletar seus recursos" ON "public"."recursos_desplugados" FOR DELETE USING (("auth"."uid"() = "professor_id"));



CREATE POLICY "Professores podem deletar suas atividades" ON "public"."atividades_desplugadas" FOR DELETE USING (("auth"."uid"() = "professor_id"));



CREATE POLICY "Professores podem inserir recursos" ON "public"."recursos_desplugados" FOR INSERT WITH CHECK ((("auth"."uid"() = "professor_id") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."tipo" = 'professor'::"text"))))));



CREATE POLICY "Professores podem ver alunos de suas turmas" ON "public"."alunos_turmas" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."turmas"
  WHERE (("turmas"."id" = "alunos_turmas"."turma_id") AND ("turmas"."professor_id" = "auth"."uid"())))));



CREATE POLICY "Professores podem ver suas atividades" ON "public"."atividades_desplugadas" FOR SELECT USING (("auth"."uid"() = "professor_id"));



CREATE POLICY "Professores veem progresso de todos" ON "public"."progresso_alunos" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."tipo" = 'professor'::"text")))));



CREATE POLICY "Turmas visíveis por todos os autenticados" ON "public"."turmas" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Usuários podem atualizar o próprio perfil" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Vínculos de turmas são visíveis por todos autenticados" ON "public"."alunos_turmas" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."alunos_turmas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."atividades_desplugadas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."desafios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inscricoes_atividades" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progresso_alunos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recursos_desplugados" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."turmas" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."alunos_turmas" TO "anon";
GRANT ALL ON TABLE "public"."alunos_turmas" TO "authenticated";
GRANT ALL ON TABLE "public"."alunos_turmas" TO "service_role";



GRANT ALL ON TABLE "public"."atividades_desplugadas" TO "anon";
GRANT ALL ON TABLE "public"."atividades_desplugadas" TO "authenticated";
GRANT ALL ON TABLE "public"."atividades_desplugadas" TO "service_role";



GRANT ALL ON TABLE "public"."desafios" TO "anon";
GRANT ALL ON TABLE "public"."desafios" TO "authenticated";
GRANT ALL ON TABLE "public"."desafios" TO "service_role";



GRANT ALL ON SEQUENCE "public"."desafios_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."desafios_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."desafios_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."inscricoes_atividades" TO "anon";
GRANT ALL ON TABLE "public"."inscricoes_atividades" TO "authenticated";
GRANT ALL ON TABLE "public"."inscricoes_atividades" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."progresso_alunos" TO "anon";
GRANT ALL ON TABLE "public"."progresso_alunos" TO "authenticated";
GRANT ALL ON TABLE "public"."progresso_alunos" TO "service_role";



GRANT ALL ON TABLE "public"."recursos_desplugados" TO "anon";
GRANT ALL ON TABLE "public"."recursos_desplugados" TO "authenticated";
GRANT ALL ON TABLE "public"."recursos_desplugados" TO "service_role";



GRANT ALL ON TABLE "public"."turmas" TO "anon";
GRANT ALL ON TABLE "public"."turmas" TO "authenticated";
GRANT ALL ON TABLE "public"."turmas" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







