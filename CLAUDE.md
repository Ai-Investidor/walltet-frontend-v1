# CLAUDE.md

## Sobre o projeto

`wallet-app-v1` é um projeto para carteiras de investimentos digitais. Stack: Vue 3 (`<script setup>` + TypeScript strict), Vite + bun, Tailwind CSS v4 (configurado em `src/assets/index.css`), shadcn-vue sobre primitivas reka-ui, Pinia + vue-router, Biome (lint + formatter).

Fluxo de composição: `routers → layouts → pages → views (seções) → components/<dominio> → components/ui`.

Conteúdo de página vem do backend `carteira-sistema-backend` (NestJS + Prisma + PostgreSQL, projeto separado) via `src/services/<dominio>.ts`, com sessão em `src/stores/auth.ts` (Pinia). `src/data/<dominio>.ts` sobra só para conteúdo genuinely estático sem endpoint (menu de navegação, prova social das telas públicas) — ver `docs/AUDITORIA-INTEGRACAO.md` para o mapeamento completo frontend↔backend e `docs/PROPOSTA-BACKEND-PATRIMONIO.md` para o único gap de dado ainda em aberto. Páginas novas nascem via `/build-prep` (extrai design do Figma/Pencil) seguido de `/build-page` (implementa seções e componentes) e depois plugam no backend seguindo R8.

## Regra obrigatória

**Sempre ler e seguir `.claude/RULES.md` antes de escrever, revisar ou explicar código.** Esse arquivo é a **única fonte da verdade** para as regras de código do projeto — tokens, tipografia, aliases, anatomia de componente, estado e dados, ícones, imagens, responsividade, semântica e tooling. Nenhuma convenção deste projeto deve ser inventada ou assumida fora dele; se `RULES.md` não cobrir um caso, perguntar antes de decidir por conta própria.

## Boas práticas

Ao escrever código, seguir Clean Code e os princípios SOLID: nomes claros, funções pequenas com responsabilidade única, baixo acoplamento, sem duplicação, sem abstração prematura. Isso vale além do que `RULES.md` especifica — `RULES.md` define as convenções deste projeto; Clean Code e SOLID guiam a qualidade do código em si.
