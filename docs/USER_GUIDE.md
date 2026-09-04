# Guia de uso do painel

Este é o manual de operação do Local Presence Ops — para quem usa o painel no
dia a dia (equipe interna) ou é dono/gestor de uma unidade sendo atendida.
Para os termos técnicos usados aqui, veja [GLOSSARY.md](GLOSSARY.md). A mesma
explicação também vive dentro do produto em `/dashboard/help`.

## Rotina recomendada

1. **Visão geral** (`/dashboard`) — comece toda sessão por aqui. O Local
   Presence Score e os números de desempenho dizem, em segundos, se algo
   piorou desde a última visita.
2. **Auditoria** (`/dashboard/audits`) — veja a lista de "Top prioridades":
   são os itens que mais pesam contra o score, já ordenados. Cada um tem uma
   ação recomendada — não adivinhe, leia a ação.
3. **Avaliações** (`/dashboard/reviews`) — responda as negativas primeiro.
   Toda resposta (positiva ou negativa) passa por aprovação humana antes de
   ir ao ar — o sistema não permite pular essa etapa.
4. **Publicações** (`/dashboard/posts`) — revise os rascunhos sugeridos e
   aprove os que fizerem sentido publicar naquele mês.
5. **Desempenho** (`/dashboard/performance`) — hoje os números são digitados
   à mão (ver "Por que os números são manuais" abaixo). Atualize
   semanalmente ou mensalmente, o que for combinado com o cliente.

## Como ler o Local Presence Score

O score (0-100) é a soma ponderada de 4 áreas — 35% completude do perfil,
30% reputação, 15% atividade de conteúdo, 20% pronto para converter. Ele é
**determinístico**: os mesmos dados sempre produzem o mesmo número, porque
não existe modelo de linguagem decidindo a nota (ver
[AUDIT_SCORE.md](AUDIT_SCORE.md) para o cálculo completo).

| Faixa | Cor | O que fazer |
|---|---|---|
| 80-100 | Verde (bom) | Manter o ritmo — monitorar. |
| 60-79 | Amarelo (atenção) | Melhorar sem urgência. |
| 40-59 | Laranja (sério) | Priorizar nas próximas semanas. |
| 0-39 | Vermelho (crítico) | Provavelmente perdendo clientes por isso — agir logo. |

## Usando a auditoria pra conversar com o cliente

A página de Auditoria é pensada para ser mostrada na tela durante uma
reunião: cada item tem um selo de status (✓/!/▲/✕), uma descrição do que foi
observado, e uma ação recomendada em uma frase — nada de jargão técnico. Use
o formulário público (`/audit`) para gerar uma auditoria de um prospect
antes de ele virar cliente — é a mesma lógica de cálculo, sem precisar de
acesso ao painel interno dele. Toda auditoria rodada por lá vira um registro
em `/dashboard/leads`, pra equipe acompanhar quem já foi avaliado.

## O fluxo de aprovação de avaliações, na prática

```
avaliação chega → classificada (positiva/neutra/negativa) → rascunho de
resposta gerado → APROVAÇÃO HUMANA (obrigatória) → publicada
```

Não existe atalho no código para pular a aprovação — nem para avaliações
positivas. Isso é intencional: uma resposta ruim publicada automaticamente
custa mais caro do que o tempo de revisar.

## Por que os números de desempenho são manuais

A Google Business Profile API (que forneceria visualizações, ligações,
cliques etc. automaticamente) exige um pedido de acesso revisado
manualmente pelo Google — pode levar semanas e não tem aprovação garantida
(ver [GOOGLE_API.md](GOOGLE_API.md)). Por isso, hoje, alguém da equipe olha
o painel do Google Business Profile do cliente e digita os números aqui. Não
é uma limitação técnica — é a decisão deliberada de não depender de uma
aprovação externa para começar a vender o serviço.

## Adicionando um segundo cliente

Veja [ADDING_CLIENT.md](ADDING_CLIENT.md) — hoje isso é uma operação de
banco de dados (Supabase), quando o projeto estiver conectado a um Supabase
real (ver [DEPLOYMENT.md](DEPLOYMENT.md)).

## Perguntas frequentes

**Por que uma avaliação de 5 estrelas também precisa de aprovação antes de
responder?**
Porque a regra é "toda resposta passa por revisão humana", não "só as
negativas" — isso evita que um texto genérico saia errado por descuido,
mesmo numa avaliação boa.

**Posso mudar o peso das 4 áreas do score?**
Tecnicamente sim, mas é uma mudança de política de negócio, não uma
configuração trivial — ela muda o que "bom" significa para todo cliente ao
mesmo tempo. Veja [AUDIT_SCORE.md](AUDIT_SCORE.md) antes de mexer.

**O formulário público em `/audit` salva os dados em algum lugar?**
Sim — cada auditoria roda o cálculo na hora **e** grava um lead (nome do
negócio, cidade, score, links) na lista em `/dashboard/leads`. Essa lista
hoje vive na memória do processo do servidor: funciona para acompanhar
prospects no dia a dia, mas some se o app reiniciar ou for feito um novo
deploy — para persistência de verdade entre deploys, é preciso conectar um
Supabase real (tabela `leads`, já criada em
`supabase/migrations/0002_leads.sql`).
