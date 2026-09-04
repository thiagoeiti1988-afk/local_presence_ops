import { getDemoRepository } from "../../../lib/demo-repository";
import { StatusBadge } from "../../../components/StatusBadge";
import { postStatus } from "../../../lib/status";

const TYPE_LABELS: Record<string, string> = {
  update: "Atualização",
  offer: "Oferta",
  event: "Evento",
};

export default async function PostsPage() {
  const { posts } = await getDemoRepository();

  return (
    <div>
      <div className="page-header">
        <h1>Publicações</h1>
        <p>
          Rascunhos gerados automaticamente — nada é publicado sem aprovação. Veja
          como funciona no <a href="/dashboard/help">Glossário</a>.
        </p>
      </div>
      <div className="grid">
        {posts.map((post) => (
          <div className="card" key={post.id}>
            <StatusBadge {...postStatus(post.status)} />
            <span
              style={{
                marginLeft: "0.4rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              {TYPE_LABELS[post.type] ?? post.type}
            </span>
            <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{post.title}</h3>
            <p style={{ margin: "0 0 0.5rem", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              {post.body}
            </p>
            {post.cta ? <strong>{post.cta}</strong> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
