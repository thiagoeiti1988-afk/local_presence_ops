import { getDemoRepository } from "../../../lib/demo-repository";

const STATUS_BADGE: Record<string, string> = {
  new: "fail",
  drafted: "warning",
  approved: "warning",
  replied: "pass",
  escalated: "fail",
};

export default async function ReviewsPage() {
  const { reviews } = await getDemoRepository();

  return (
    <div>
      <h1>Reviews</h1>
      <p style={{ color: "var(--muted)" }}>
        Showing the latest {reviews.length} of 67 reviews on record. Negative
        reviews always require human approval before a reply is published —
        see docs/REVIEWS.md.
      </p>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Draft reply</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.author}</td>
              <td>{"★".repeat(review.rating)}</td>
              <td>{review.comment ?? "—"}</td>
              <td>
                <span className={`badge ${STATUS_BADGE[review.status] ?? "warning"}`}>
                  {review.status}
                </span>
              </td>
              <td>{review.reply ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
