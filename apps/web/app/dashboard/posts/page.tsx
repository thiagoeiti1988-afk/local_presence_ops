import { getDemoRepository } from "../../../lib/demo-repository";

export default async function PostsPage() {
  const { posts } = await getDemoRepository();

  return (
    <div>
      <h1>Posts</h1>
      <p style={{ color: "var(--muted)" }}>
        Drafted by RuleBasedContentProvider — nothing here publishes without
        approval.
      </p>
      <div className="grid">
        {posts.map((post) => (
          <div className="card" key={post.id}>
            <span className="badge warning">{post.type}</span>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            {post.cta ? <strong>{post.cta}</strong> : null}
            <p className="stat-label">Status: {post.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
