# Concorrência ("Farol")

`/dashboard/competitors` lista negócios da mesma categoria perto de uma
unidade — quem está competindo pelo mesmo cliente na Busca/Maps, e como a
nota deles se compara à da unidade. `CompetitiveDiscoveryProvider`
(`packages/providers/src/competitive/`) é a interface, com duas
implementações:

- **`MockCompetitiveDiscoveryProvider`** — dados fixos, o padrão hoje. É o
  que a página do dashboard usa (`apps/web/lib/demo-repository.ts`), porque
  não há Supabase real conectado nem chave de API configurada neste
  ambiente (ver [DEPLOYMENT.md](DEPLOYMENT.md)).
- **`GooglePlacesCompetitiveDiscoveryProvider`** — implementação real,
  chama a [Nearby Search da API do Google
  Places](https://developers.google.com/maps/documentation/places/web-service/search-nearby)
  de verdade. Ao contrário do `GoogleBusinessProfileProvider`, **não exige
  um pedido de acesso revisado manualmente pelo Google** — só uma chave de
  API com a Places API habilitada e faturamento ativo no projeto do Google
  Cloud (ver [GOOGLE_API.md](GOOGLE_API.md) para o contraste com a Business
  Profile API).

## Como ativar a versão real

1. No Google Cloud Console, habilite a **Places API** no projeto e ative
   faturamento (a API tem cota gratuita mensal, mas exige um cartão
   cadastrado).
2. Gere uma chave de API e defina `GOOGLE_PLACES_API_KEY` no ambiente (ver
   `.env.example`).
3. A unidade (`Location`) precisa de `latitude`/`longitude` preenchidos —
   a Nearby Search exige coordenadas, não aceita endereço em texto. Sem
   Supabase real conectado ainda, isso significa editar
   `apps/web/lib/demo-repository.ts` ou geocodificar o endereço manualmente
   (ex.: via `https://www.google.com/maps`, clique direito → "O que há
   aqui?") até existir um fluxo de geocodificação automática.
4. Troque `MockCompetitiveDiscoveryProvider` por
   `new GooglePlacesCompetitiveDiscoveryProvider(apiKey, locationLookup)`
   onde a página hoje usa o mock — `locationLookup` é uma função
   `(locationId) => Promise<{ latitude, longitude, primaryCategory } | null>`
   que busca a unidade na fonte de dados real.

## Por que não geocodificar automaticamente ainda

Geocodificar um endereço em coordenadas é outra chamada de API paga (a
Geocoding API do Google), e o MVP não tem hoje nenhuma unidade com endereço
mas sem coordenada que precise disso de verdade — a única unidade existente
é a demo, com coordenadas fixas. Adicionar geocodificação automática antes
de haver uma segunda unidade real seria adiantar trabalho sem um caso de
uso concreto (ver o princípio YAGNI usado em todo o projeto,
[ARCHITECTURE.md](ARCHITECTURE.md)).

## Limites conhecidos

- A Nearby Search não devolve uma categoria amigável — usamos o primeiro
  `type` do resultado (ex.: `dentist` → "Dentist"), que pode não bater
  exatamente com `primaryCategory` da unidade.
- O raio máximo aceito pela API é 50&nbsp;km; um raio maior é limitado a
  esse valor automaticamente (`GooglePlacesCompetitiveDiscoveryProvider`).
- Distância até cada concorrente é calculada localmente (fórmula de
  haversine, linha reta) — não é distância de rota.
