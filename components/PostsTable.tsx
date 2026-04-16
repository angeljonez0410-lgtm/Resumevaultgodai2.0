type PostEntry = {
  id: string;
  platform: string;
  topic: string;
  status: string;
  created_at: string;
};

export default function PostsTable({
  posts,
}: {
  posts: PostEntry[];
}) {
  return (
    <div className="studio-card">
      <h2 className="text-xl font-bold text-white">Posts</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm text-slate-200">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              <th className="py-3 pr-4">Platform</th>
              <th className="py-3 pr-4">Topic</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-white/5">
                <td className="py-3 pr-4 capitalize">{post.platform}</td>
                <td className="py-3 pr-4">{post.topic}</td>
                <td className="py-3 pr-4 capitalize">{post.status}</td>
                <td className="py-3 pr-4">{new Date(post.created_at).toLocaleString()}</td>
              </tr>
            ))}

            {!posts.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  No posts yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
