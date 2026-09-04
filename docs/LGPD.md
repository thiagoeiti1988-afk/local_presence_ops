# LGPD — dados pessoais coletados no `/audit`

Este documento existe porque o formulário público `/audit` grava um
**Lead** (ver [DATA_MODEL.md](DATA_MODEL.md)) com dados que podem ser
pessoais — nome do negócio, telefone, cidade — sem que a pessoa que
preencheu o formulário tenha um vínculo de cliente com a empresa. A Lei
Geral de Proteção de Dados (Lei 13.709/2018) se aplica a esse tratamento.
Isto não é um parecer jurídico — é a documentação técnica de como o
sistema trata esses dados, para orientar quem opera o produto.

## O que é coletado e por quê

| Campo | Por quê | Base legal aplicável |
|---|---|---|
| `businessName`, `city` | Identificar o negócio avaliado | Legítimo interesse — o próprio objetivo declarado do formulário |
| `phone` | Permitir o follow-up comercial (fila T+0/T+24h/T+72h, ver [WHATSAPP.md](WHATSAPP.md)) | Consentimento — só é solicitado se a pessoa quiser retorno |
| `website`, `googleProfileUrl` | Entrada do cálculo do score, não é dado pessoal de indivíduo | — |
| `score` | Resultado do cálculo, derivado, não coletado diretamente | — |

O formulário não pede nome, e-mail ou CPF de uma pessoa física — os campos
pessoais são o telefone e, indiretamente, o nome do negócio quando este é
o nome do próprio profissional (ex.: consultórios individuais). Trate
"telefone" como dado pessoal em todos os casos, mesmo quando o número for
comercial.

## Onde isso é reforçado no produto

- `apps/web/app/audit/page.tsx` — o aviso abaixo do formulário informa que
  os dados viram um lead e como a pessoa pode pedir remoção (ver texto
  atual na página).
- `apps/web/lib/leads-store.ts` — hoje em memória (não persiste entre
  deploys); quando conectado a um Supabase real (ver
  [DEPLOYMENT.md](DEPLOYMENT.md)), a tabela `leads`
  (`supabase/migrations/0002_leads.sql`) passa a ser o registro
  duradouro e as obrigações abaixo passam a valer sobre ela.

## Direitos do titular (Art. 18 da LGPD) e como atendê-los hoje

Não existe ainda um endpoint de autoatendimento — no estágio atual (lead
em memória, sem Supabase conectado), atender esses pedidos é uma operação
manual:

- **Confirmação e acesso** — buscar o lead em `/dashboard/leads` pelo
  nome do negócio ou telefone informado no pedido.
- **Eliminação** — hoje, remover o lead exige acesso direto ao processo
  (reiniciar o deploy apaga a memória) ou, com Supabase conectado,
  `delete from leads where id = '...'`. Nenhuma UI de exclusão existe
  ainda — é um item pendente antes de operar com volume real de leads
  (ver "Pendências" abaixo).
- **Correção** — mesma via manual até existir uma tela de edição do lead.

Como o volume de leads é baixo neste estágio do produto (MVP, um único
canal de captação), o atendimento manual é aceitável — mas não escala. Se
o `/audit` passar a receber volume relevante de tráfego, self-service de
exclusão deixa de ser opcional.

## Retenção

Sem uma política de expurgo automática hoje. Um lead marcado como `lost`
(perdido) continua armazenado indefinidamente até alguém removê-lo à mão.
Isso é uma lacuna conhecida, não uma decisão de design — ver Pendências.

## Pendências (antes de operar com tráfego real)

1. Endpoint/rota de auto-exclusão de lead por telefone (com verificação
   básica, ex.: link único enviado por WhatsApp) — evita depender de
   pedido manual por e-mail/telefone.
2. Job de expurgo automático de leads `lost` após um prazo definido
   (ex.: 12 meses sem contato).
3. Ao conectar Supabase real, revisar se `SUPABASE_SERVICE_ROLE_KEY`
   (que ignora RLS) é usado em algum caminho que exponha leads de forma
   mais ampla do que a política `leads_staff_access` pretende — ver
   [SECURITY.md](SECURITY.md).

Nenhum destes bloqueia o uso do MVP com o próprio negócio operando o
produto (equipe interna como único usuário autenticado) — passam a
importar quando o formulário público começa a receber tráfego de
terceiros que a equipe não conhece pessoalmente.
