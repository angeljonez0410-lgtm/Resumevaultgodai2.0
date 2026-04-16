"use client";

import { useMemo, useState } from "react";
import { authFetch } from "../lib/auth-fetch";

type Props = {
  onCreated: () => Promise<void>;
};

type BriefResponse = {
  topic: string;
  description: string;
  deepDive: string;
  hashtags: string[];
  caption: string;
  imagePrompt: string;
  videoPrompt: string;
};

const PLATFORM_OPTIONS = [
  "instagram",
  "twitter",
  "linkedin",
  "tiktok",
  "reddit",
  "threads",
  "youtube",
  "pinterest",
];

export default function CreatePostForm({ onCreated }: Props) {
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [deepDive, setDeepDive] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [scheduledTime, setScheduledTime] = useState("");
  const [visualPrompt, setVisualPrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [visualStyle, setVisualStyle] = useState("Premium SaaS Ad");
  const [message, setMessage] = useState("");

  const [loadingBrief, setLoadingBrief] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [loadingImagePrompt, setLoadingImagePrompt] = useState(false);
  const [loadingVideoPrompt, setLoadingVideoPrompt] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [uploading, setUploading] = useState(false);

  const hashtagLine = useMemo(() => hashtags.map((tag) => `#${tag}`).join(" "), [hashtags]);

  async function generateBrief() {
    if (!topic.trim()) {
      setMessage("Enter a topic seed first.");
      return;
    }

    setLoadingBrief(true);
    setMessage("");
    try {
      const res = await authFetch("/api/generate-content-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform }),
      });
      const data = (await res.json()) as Partial<BriefResponse> & { error?: string };

      if (!res.ok) {
        setMessage(data.error || "Failed to generate content brief.");
        return;
      }

      if (data.topic) setTopic(data.topic);
      if (data.description) setDescription(data.description);
      if (data.deepDive) setDeepDive(data.deepDive);
      if (Array.isArray(data.hashtags)) setHashtags(data.hashtags);
      if (data.caption) setCaption(data.caption);
      if (data.imagePrompt) setVisualPrompt(data.imagePrompt);
      if (data.videoPrompt) setVideoPrompt(data.videoPrompt);
      setMessage("AI content brief generated.");
    } catch {
      setMessage("Could not generate content brief.");
    } finally {
      setLoadingBrief(false);
    }
  }

  async function generateCaption() {
    if (!topic.trim()) {
      setMessage("Enter a topic first.");
      return;
    }

    setLoadingCaption(true);
    setMessage("");
    try {
      const res = await authFetch("/api/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to generate caption.");
        return;
      }

      setCaption(data.caption || "");
      setMessage("Caption generated.");
    } catch {
      setMessage("Could not generate caption.");
    } finally {
      setLoadingCaption(false);
    }
  }

  async function generateImagePrompt() {
    if (!topic.trim()) {
      setMessage("Enter a topic first.");
      return;
    }

    setLoadingImagePrompt(true);
    setMessage("");
    try {
      const res = await authFetch("/api/generate-real-photo-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, visualStyle }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to generate image prompt.");
        return;
      }

      setVisualPrompt(data.prompt || "");
      setMessage("Image prompt generated.");
    } catch {
      setMessage("Could not generate image prompt.");
    } finally {
      setLoadingImagePrompt(false);
    }
  }

  async function generateVideoPrompt() {
    if (!topic.trim()) {
      setMessage("Enter a topic first.");
      return;
    }

    setLoadingVideoPrompt(true);
    setMessage("");
    try {
      const res = await authFetch("/api/generate-video-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, visualStyle }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to generate video prompt.");
        return;
      }

      setVideoPrompt(data.prompt || "");
      setMessage("Video prompt generated.");
    } catch {
      setMessage("Could not generate video prompt.");
    } finally {
      setLoadingVideoPrompt(false);
    }
  }

  async function generateImage() {
    const prompt = visualPrompt.trim() || topic.trim();
    if (!prompt) {
      setMessage("Generate or enter an image prompt first.");
      return;
    }

    setLoadingImage(true);
    setMessage("");
    try {
      const res = await authFetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to generate image.");
        return;
      }

      setImageUrl(data.imageUrl || "");
      setMessage("Image generated.");
    } catch {
      setMessage("Could not generate image.");
    } finally {
      setLoadingImage(false);
    }
  }

  async function generateVideo() {
    const prompt = videoPrompt.trim() || topic.trim();
    if (!prompt) {
      setMessage("Generate or enter a video prompt first.");
      return;
    }

    setLoadingVideo(true);
    setMessage("");
    try {
      const createRes = await authFetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const createData = await createRes.json();

      if (!createRes.ok) {
        setMessage(createData.error || "Failed to start video generation.");
        return;
      }

      const predictionId = createData.predictionId as string | undefined;
      if (!predictionId) {
        setVideoUrl(createData.videoUrl || "");
        setMessage("Video request submitted.");
        return;
      }

      for (let i = 0; i < 30; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const statusRes = await authFetch(`/api/generate-video?id=${predictionId}`);
        const statusData = await statusRes.json();

        if (!statusRes.ok) {
          setMessage(statusData.error || "Failed to check video generation status.");
          return;
        }

        if (statusData.status === "succeeded" && statusData.videoUrl) {
          setVideoUrl(statusData.videoUrl);
          setMessage("Video generated.");
          return;
        }

        if (statusData.status === "failed" || statusData.status === "canceled") {
          setMessage(statusData.error || `Video generation ${statusData.status}.`);
          return;
        }
      }

      setMessage("Video generation is still running. Try again in a moment.");
    } catch {
      setMessage("Could not generate video.");
    } finally {
      setLoadingVideo(false);
    }
  }

  async function uploadMediaFile(file: File) {
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await authFetch("/api/upload-media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to upload media.");
        return;
      }

      if (file.type.startsWith("video/")) {
        setVideoUrl(data.publicUrl || "");
      } else {
        setImageUrl(data.publicUrl || "");
      }
      setMessage("Media uploaded.");
    } catch {
      setMessage("Could not upload media.");
    } finally {
      setUploading(false);
    }
  }

  async function savePost() {
    setMessage("");

    if (!platform || !topic.trim()) {
      setMessage("Platform and topic are required.");
      return;
    }

    const captionWithExtras = [
      caption.trim(),
      description.trim() ? `\n\nDescription:\n${description.trim()}` : "",
      deepDive.trim() ? `\n\nDeep Dive:\n${deepDive.trim()}` : "",
      hashtagLine.trim() ? `\n\n${hashtagLine.trim()}` : "",
      videoUrl.trim() ? `\n\nVideo URL: ${videoUrl.trim()}` : "",
    ]
      .filter(Boolean)
      .join("");

    try {
      const res = await authFetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          topic: topic.trim(),
          caption: captionWithExtras || null,
          image_url: imageUrl || null,
          status,
          scheduled_time: scheduledTime || null,
          visual_prompt: visualPrompt || null,
          video_prompt: videoPrompt || null,
          visual_style: visualStyle || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to save post.");
        return;
      }

      setTopic("");
      setDescription("");
      setDeepDive("");
      setHashtags([]);
      setCaption("");
      setImageUrl("");
      setVideoUrl("");
      setStatus("draft");
      setScheduledTime("");
      setVisualPrompt("");
      setVideoPrompt("");
      setVisualStyle("Premium SaaS Ad");
      setMessage("Post saved.");
      await onCreated();
    } catch {
      setMessage("Could not save post.");
    }
  }

  function parseHashtagInput(input: string) {
    const parsed = input
      .split(/[,\s]+/)
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean);
    setHashtags(parsed);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">AI Content Studio</h2>
          <p className="text-sm text-slate-500">
            Generate topic strategy, deep-dive copy, hashtags, and image/video assets in one workflow.
          </p>
        </div>
        <button
          type="button"
          onClick={generateBrief}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {loadingBrief ? "Generating brief..." : "Generate AI Brief"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Platform</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            {PLATFORM_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Topic</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Product launch story"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            className="min-h-[110px] w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Strategic context for the post."
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Deep Dive</span>
          <textarea
            className="min-h-[110px] w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={deepDive}
            onChange={(e) => setDeepDive(e.target.value)}
            placeholder="Expanded talking points for long-form adaptation."
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="space-y-1 block">
          <span className="text-sm font-medium text-slate-700">Hashtags</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={hashtags.map((tag) => `#${tag}`).join(" ")}
            onChange={(e) => parseHashtagInput(e.target.value)}
            placeholder="#socialmedia #contentmarketing #growth"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generateCaption}
          className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {loadingCaption ? "Generating caption..." : "Generate Caption"}
        </button>
        <button
          type="button"
          onClick={generateImagePrompt}
          className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {loadingImagePrompt ? "Generating image prompt..." : "Generate Image Prompt"}
        </button>
        <button
          type="button"
          onClick={generateVideoPrompt}
          className="rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          {loadingVideoPrompt ? "Generating video prompt..." : "Generate Video Prompt"}
        </button>
      </div>

      <div className="mt-4">
        <label className="space-y-1 block">
          <span className="text-sm font-medium text-slate-700">Caption</span>
          <textarea
            className="min-h-[140px] w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Publish-ready caption appears here."
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Image Prompt</span>
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={visualPrompt}
            onChange={(e) => setVisualPrompt(e.target.value)}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Video Prompt</span>
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Visual Style</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value)}
          >
            <option value="Premium SaaS Ad">Premium SaaS Ad</option>
            <option value="Editorial Documentary">Editorial Documentary</option>
            <option value="Studio Product">Studio Product</option>
            <option value="Lifestyle Creator">Lifestyle Creator</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Upload Media (Optional)</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadMediaFile(file);
            }}
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generateImage}
          className="rounded-lg bg-cyan-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
        >
          {loadingImage ? "Generating image..." : "Generate AI Image"}
        </button>
        <button
          type="button"
          onClick={generateVideo}
          className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {loadingVideo ? "Generating video..." : "Generate AI Video"}
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Image URL</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Video URL</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Scheduled Time</span>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={savePost}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Save Post
        </button>
        {(uploading || message) && (
          <p className="text-sm text-slate-600">
            {uploading ? "Uploading media..." : message}
          </p>
        )}
      </div>
    </section>
  );
}
