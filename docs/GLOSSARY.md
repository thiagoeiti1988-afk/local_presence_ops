# Glossário

Termos usados no painel e neste repositório, em ordem alfabética. Para o
passo a passo de uso, veja [USER_GUIDE.md](USER_GUIDE.md).

**Auditoria (Audit)** — uma avaliação pontual da presença de uma unidade no
Google, gerada a partir de dados observados (preenchidos manualmente ou
vindos de um provider). Produz um score e uma lista de itens com status e
ação recomendada. Ver `packages/audit`.

**BusinessProfileProvider** — a interface que abstrai a fonte dos dados do
Google Business Profile (localização, avaliações, desempenho, posts). Tem
três implementações: `Mock` (testes), `Manual` (dado real digitado por um
humano — o caminho usado hoje) e `Google` (esqueleto, não funcional até
haver acesso à API — ver [GOOGLE_API.md](GOOGLE_API.md)).

**Cliente (Client)** — o negócio contratante (ex.: "Clínica Odonto Vale").
Pode ter uma ou mais Unidades.

**ContentProvider** — a interface que gera rascunhos de texto (respostas a
avaliações, posts). Implementações: `Mock` (fixo, testes), `RuleBased`
(templates, o padrão hoje) e `OpenAI` (opcional, só ativa com uma chave de
API configurada).

**Escalado (Escalated)** — status de uma avaliação sensível demais para uma
resposta padrão; precisa de uma decisão específica de alguém, fora do fluxo
automático de rascunho.

**Fila de follow-up** — os leads agrupados por urgência em
`/dashboard/leads`: Atrasado (passou da hora), Próximas 24h, Agendado,
Concluído. Calculada por `packages/followup` a partir de quando o lead
chegou — nunca por um humano marcando manualmente a urgência.

**Lead** — um registro criado automaticamente sempre que alguém roda uma
auditoria no formulário público (`/audit`). Aparece em `/dashboard/leads`,
já dentro da fila de follow-up T+0/T+24h/T+72h. Hoje vive em memória (some
em um novo deploy) até haver um Supabase real conectado — ver
`supabase/migrations/0002_leads.sql`.

**LGPD (Lei Geral de Proteção de Dados)** — lei brasileira que rege o
tratamento de dados pessoais; se aplica aos dados coletados no formulário
público `/audit` (telefone, nome do negócio). Ver [LGPD.md](LGPD.md) para
base legal, direitos do titular e pendências.

**Local Presence Score** — a nota de 0 a 100 que resume a presença de uma
unidade no Google. Determinística (sem IA no cálculo) — ver
[AUDIT_SCORE.md](AUDIT_SCORE.md).

**Local Presence Ops** — o nome deste produto/repositório.

**Meter (medidor)** — o componente visual de barra usado para o score e
para as notas de cada seção da auditoria; a cor da barra muda por faixa
(bom/atenção/sério/crítico).

**Post (LocalPost)** — uma publicação (atualização, oferta ou evento) para o
perfil do Google. Estados: rascunho → aprovado → publicado.

**RLS (Row Level Security)** — a trava do banco de dados (Supabase/Postgres)
que garante que os dados de um cliente nunca aparecem para outro, mesmo que
haja um erro de código no aplicativo. Ver [SECURITY.md](SECURITY.md).

**Review (Avaliação)** — uma avaliação deixada por um cliente final no
Google. Tem uma nota (1-5 estrelas), um comentário opcional, e passa por um
fluxo de resposta com aprovação humana obrigatória (ver
[REVIEWS.md](REVIEWS.md)).

**Score da seção** — a nota (0-100) de uma das 4 áreas que compõem o Local
Presence Score: Completude do perfil, Reputação, Atividade de conteúdo,
Pronto para converter.

**Severidade** — quão grave é um item da auditoria que não passou:
`warning` (atenção) ou `fail`/crítico. Não é a mesma coisa que o score —
é uma classificação por item, não pelo total.

**Status (avaliação)** — onde uma avaliação está no fluxo de resposta:
`new` (nova, sem resposta) → `drafted` (rascunho) → `approved` (aprovado por
humano) → `replied` (publicado). Também existe `escalated`.

**Status (item de auditoria)** — `pass` (ok), `warning` (atenção) ou `fail`
(crítico) — o resultado de checar um item específico (ex.: "tem foto?").

**Tenant / multi-tenancy** — o isolamento de dados entre clientes diferentes
no mesmo banco de dados. Toda tabela carrega um `client_id`; ver
[DATA_MODEL.md](DATA_MODEL.md) e [SECURITY.md](SECURITY.md).

**Unidade (Location)** — um endereço físico/serviço específico de um
Cliente, com seu próprio perfil do Google e seu próprio score.

**WhatsAppProvider** — a interface que abstrai o envio de mensagem no
WhatsApp. `ManualWhatsAppProvider` (o padrão hoje) gera um link `wa.me` que
um humano confirma o envio; `MetaWhatsAppProvider` é um esqueleto que só
funciona quando houver número comercial e template aprovados pela Meta —
ver [WHATSAPP.md](WHATSAPP.md).
