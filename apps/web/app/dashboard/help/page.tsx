export default function HelpPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Glossário e guia de uso</h1>
        <p>
          O que cada número, status e tela do painel significa — e como usar
          isso no dia a dia com um cliente.
        </p>
      </div>

      <h2 className="section-title">Como usar o painel, passo a passo</h2>
      <ol style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <li>
          <strong>Visão geral</strong> — comece por aqui a cada visita. O score
          e os números de desempenho dizem se algo piorou desde a última vez.
        </li>
        <li>
          <strong>Auditoria</strong> — veja exatamente o que está puxando o
          score pra baixo e a ação recomendada para cada item, já priorizado.
        </li>
        <li>
          <strong>Avaliações</strong> — responda primeiro as negativas. Toda
          resposta passa por aprovação humana antes de publicar — nunca é
          automático.
        </li>
        <li>
          <strong>Publicações</strong> — revise os rascunhos e aprove os que
          fizer sentido publicar.
        </li>
        <li>
          <strong>Desempenho</strong> — atualize os números manualmente (por
          enquanto — veja por quê abaixo) e acompanhe a variação mês a mês.
        </li>
      </ol>

      <h2 className="section-title">Local Presence Score</h2>
      <p className="callout">
        Um número de 0 a 100, calculado por regras fixas — nenhuma
        inteligência artificial decide a nota. O mesmo dado sempre gera o
        mesmo score.
      </p>
      <dl>
        <div className="glossary-term">
          <dt>Completude do perfil (peso 35%)</dt>
          <dd>
            Nome, categoria, endereço, telefone, site, horário, descrição,
            serviços e fotos preenchidos no Google Business Profile.
          </dd>
        </div>
        <div className="glossary-term">
          <dt>Reputação (peso 30%)</dt>
          <dd>Volume de avaliações, nota média e quantas estão sem resposta.</dd>
        </div>
        <div className="glossary-term">
          <dt>Atividade de conteúdo (peso 15%)</dt>
          <dd>Há quanto tempo foi a última publicação no perfil.</dd>
        </div>
        <div className="glossary-term">
          <dt>Pronto para converter (peso 20%)</dt>
          <dd>
            Se existe link de agendamento, site e telefone — os caminhos que um
            cliente em potencial usa para agir.
          </dd>
        </div>
      </dl>

      <h3 style={{ fontSize: "0.95rem" }}>Faixas de cor do score</h3>
      <table>
        <thead>
          <tr>
            <th>Faixa</th>
            <th>Significado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className="badge good">✓ 80–100</span></td>
            <td>Bom — manter o ritmo.</td>
          </tr>
          <tr>
            <td><span className="badge warning">! 60–79</span></td>
            <td>Atenção — dá pra melhorar sem urgência.</td>
          </tr>
          <tr>
            <td><span className="badge serious">▲ 40–59</span></td>
            <td>Sério — vale priorizar nas próximas semanas.</td>
          </tr>
          <tr>
            <td><span className="badge critical">✕ 0–39</span></td>
            <td>Crítico — provavelmente perdendo clientes por isso.</td>
          </tr>
        </tbody>
      </table>

      <h2 className="section-title">Fluxo de avaliações (reviews)</h2>
      <p className="callout">
        Uma avaliação negativa <strong>nunca</strong> é respondida
        automaticamente. O sistema não permite publicar uma resposta sem que
        um humano aprove antes — essa é uma regra do próprio código, não uma
        preferência de configuração.
      </p>
      <dl>
        <div className="glossary-term">
          <dt>Novo — sem resposta</dt>
          <dd>Avaliação recebida, ainda sem rascunho de resposta.</dd>
        </div>
        <div className="glossary-term">
          <dt>Rascunho</dt>
          <dd>Já existe uma resposta sugerida, aguardando revisão humana.</dd>
        </div>
        <div className="glossary-term">
          <dt>Aprovado</dt>
          <dd>Um humano aprovou o texto — pronto para publicar.</dd>
        </div>
        <div className="glossary-term">
          <dt>Respondido</dt>
          <dd>A resposta foi publicada no Google.</dd>
        </div>
        <div className="glossary-term">
          <dt>Escalado</dt>
          <dd>Caso sensível demais para uma resposta padrão — precisa de decisão específica.</dd>
        </div>
      </dl>

      <h2 className="section-title">Status de publicações (posts)</h2>
      <dl>
        <div className="glossary-term">
          <dt>Rascunho</dt>
          <dd>Sugestão gerada, ainda não revisada.</dd>
        </div>
        <div className="glossary-term">
          <dt>Aprovado</dt>
          <dd>Revisado e pronto para publicar no Google.</dd>
        </div>
        <div className="glossary-term">
          <dt>Publicado</dt>
          <dd>Já está no ar no perfil do Google.</dd>
        </div>
      </dl>

      <h2 className="section-title">Métricas de desempenho</h2>
      <dl>
        <div className="glossary-term">
          <dt>Visualizações / Buscas</dt>
          <dd>Quantas vezes o perfil apareceu no Google Search ou Maps.</dd>
        </div>
        <div className="glossary-term">
          <dt>Ligações / Cliques no site / Rotas traçadas</dt>
          <dd>Ações diretas que um cliente em potencial tomou a partir do perfil.</dd>
        </div>
        <div className="glossary-term">
          <dt>Agendamentos</dt>
          <dd>Cliques no link de agendamento, quando configurado.</dd>
        </div>
      </dl>
      <p className="callout">
        Esses números são digitados manualmente por enquanto — a integração
        direta com a API do Google Business Profile ainda não está disponível
        (o acesso é revisado manualmente pelo Google e pode levar semanas).
        Isso não bloqueia o uso do painel hoje.
      </p>

      <h2 className="section-title">Por que a nota não é decidida por IA</h2>
      <p style={{ color: "var(--text-secondary)" }}>
        O score usa regras fixas e documentadas — o mesmo dado sempre gera o
        mesmo resultado, e dá pra explicar pra qualquer cliente exatamente por
        que a nota é a que é. A geração de texto (respostas e publicações)
        usa modelos de linguagem apenas para *sugerir* rascunhos — nunca para
        decidir números, e nunca para publicar sem aprovação.
      </p>
    </div>
  );
}
