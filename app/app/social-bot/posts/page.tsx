"use client";

import { useCallback, useEffect, useState } from "react";
import CalendarGenerator from "@/components/CalendarGenerator";
import CreatePostForm from "@/components/CreatePostForm";
import MediaLibrary from "@/components/MediaLibrary";
import PostsTable from "@/components/PostsTable";
import PublishingPanel from "@/components/PublishingPanel";
import { authFetch } from "@/lib/auth-fetch";

type Post = {
  id: string;
  platform: string;
  topic: string;
  status: string;
  created_at: string;
};

export default function SocialBotPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mediaRefreshKey, setMediaRefreshKey] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState("");

  const loadPosts = useCallback(async () => {
    const res = await authFetch("/api/posts");
    const data = await res.json();
    setPosts(data.posts || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPosts();
  }, [loadPosts]);

  async function refreshAll() {
    await loadPosts();
    setMediaRefreshKey((key) => key + 1);
  }

  return (
    <main className="studio-page">
      <section className="studio-card">
        <h1 className="text-2xl font-semibold text-white">Content Studio</h1>
        <p className="mt-1 text-sm text-slate-300">
          Build social campaigns with AI briefs, deep-dive strategy, hashtags, and generation-ready prompts.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CreatePostForm onCreated={refreshAll} />
        </div>
        <div className="space-y-6">
          <CalendarGenerator onGenerated={refreshAll} />
          <PublishingPanel onRun={refreshAll} />
        </div>
      </div>

      <PostsTable posts={posts} />

      <section className="space-y-3">
        <MediaLibrary
          refreshKey={mediaRefreshKey}
          onSelect={(url) => {
            setSelectedMedia(url);
          }}
        />
        {selectedMedia ? (
          <div className="studio-subcard text-sm text-slate-300">
            Selected media:{" "}
            <a href={selectedMedia} target="_blank" rel="noreferrer" className="font-medium text-cyan-300 underline">
              {selectedMedia}
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
}
