

# Plataforma de Ensino de Programação

Uma plataforma educacional gamificada para ensino de lógica de programação, com dashboards diferenciados para alunos e professores.

## Time
José Liedson da Silva, José Matheus Mendonça Farias, Márcio Souto Maior Sousa, Maria Clara Lau Santos

## Funcionalidades

### Para Alunos
- Dashboard interativo com sistema de níveis e pontos
- Mapa de desafios de programação
- Editor de blocos visual
- Avatar evolutivo personalizável
- Sistema de conquistas e ranking

### Para Professores
- Dashboard com estatísticas das turmas
- Gerenciamento de turmas e alunos
- Relatórios individuais de progresso
- Identificação de alunos com dificuldades
- Sistema de atividades desplugadas guiadas

## Tecnologias

- React 18 + TypeScript
- Supabase (Autenticação e Banco de Dados)
- Tailwind CSS para estilização
- Lucide React para ícones

## Configuração do Banco de Dados

Este projeto utiliza o **Supabase** como backend. Para configurar o seu próprio ambiente e garantir que todas as funcionalidades (incluindo o fluxo de login/cadastro e upload de arquivos) funcionem corretamente:

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No seu painel do Supabase, vá em **SQL Editor**.
3. Copie todo o conteúdo do arquivo `schema.sql` (disponível na raiz deste projeto) e cole no editor.
4. Execute o código SQL. Isso criará:
   - Todas as tabelas, relacionamentos e permissões RLS.
   - O gatilho (trigger) `on_auth_user_created` que cria automaticamente o perfil do usuário na tabela `public.profiles` após o cadastro no Auth do Supabase.
   - O bucket de storage `atividades_anexos` para anexar arquivos nas atividades desplugadas com suas devidas políticas de RLS.
5. No painel do Supabase, vá em **Authentication -> Providers -> Email** e **desative** a opção **Confirm email** (Confirmar email). 
   > [!IMPORTANT]
   > Se essa opção continuar ativa, novos usuários precisarão confirmar o email antes de conseguir logar no sistema. Desativá-la é necessário para que o login funcione imediatamente após o cadastro em ambiente de testes.

### Variáveis de Ambiente

1. Copie o arquivo de exemplo para criar o seu arquivo local:
   ```bash
   cp .env_example .env
   ```
2. Abra o arquivo `.env` e preencha com as suas credenciais do Supabase (URL e Anon Key).

## Como executar

```bash
npm install
npm run dev
```
  
