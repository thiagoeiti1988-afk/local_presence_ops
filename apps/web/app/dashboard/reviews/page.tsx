import { getDemoRepository, DEMO_AGGREGATES } from "../../../lib/demo-repository";
import { StatusBadge } from "../../../components/StatusBadge";
import { reviewStatus } from "../../../lib/status";

export default async function ReviewsPage() {
  const { reviews } = await getDemoRepository();

  return (
    <div>
      <div className="page-header">
        <h1>Avaliações</h1>
        <p>
          Exibindo as {reviews.length} mais recentes de {DEMO_AGGREGATES.reviewCount}{" "}
          no total. Avaliações negativas sempre exigem aprovação humana antes de
          publicar a resposta — nunca é automático. Veja o fluxo completo no{" "}
          <a href="/dashboard/help">Glossário</a>.
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Autor</th>
            <th>Nota</th>
            <th>Comentário</th>
            <th>Status</th>
            <th>Rascunho de resposta</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.author}</td>
              <td>{"★".repeat(review.rating)}</td>
              <td>{review.comment ?? "—"}</td>
              <td>
                <StatusBadge {...reviewStatus(review.status)} />
              </td>
              <td>{review.reply ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
