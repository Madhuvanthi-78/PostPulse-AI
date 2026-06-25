import { useState } from "react";

import {
  CalendarIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  SendIcon,
  X as XIcon,
} from "lucide-react";

// Adjust this path to wherever your dummyData file actually lives
// e.g. "../assets/dummyData" or "./dummyData"
import { PLATFORMS, dummyPostsData } from "../assets/assets";

// Type for a scheduled/published post, matching the dummy data shape
type ScheduledPost = {
  _id: string;
  platforms: string[];
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  scheduledFor: string; // ISO date string
  status: "scheduled" | "published";
  updatedAt?: string;   // ISO date string - used for Published timestamp
};

const Scheduler = () => {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Seed initial state from the dummy data file, split by status
  const [scheduled, setScheduled] = useState<ScheduledPost[]>(
    dummyPostsData.filter((p: ScheduledPost) => p.status === "scheduled")
  );

  const [published, setPublished] = useState<ScheduledPost[]>(
    dummyPostsData.filter((p: ScheduledPost) => p.status === "published")
  );

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Combine date + time into a single ISO timestamp
    const scheduledFor = new Date(
      `${scheduledDate}T${scheduledTime}`
    ).toISOString();

    // TODO: replace with your actual API call to schedule the post
    const newPost: ScheduledPost = {
      _id: Date.now().toString(),
      platforms: selectedPlatforms,
      content,
      mediaType: mediaFile
        ? mediaFile.type.startsWith("image/")
          ? "image"
          : "video"
        : undefined,
      scheduledFor,
      status: "scheduled",
    };

    setScheduled((prev) => [...prev, newPost]);

    // reset form
    setContent("");
    setSelectedPlatforms([]);
    setMediaFile(null);
    setScheduledDate("");
    setScheduledTime("");
    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Compose card */}
      <div className="w-full lg:w-[460px]">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h2 className="text-lg text-slate-700 mb-6">
            Compose Post
          </h2>

          {/* Platforms */}
          <div className="mb-6">
            <label className="block text-xs text-slate-500 uppercase mb-2">
              Platforms
            </label>

            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((p) => {
                const active = selectedPlatforms.includes(p.id);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center justify-center p-3 rounded-md border transition-all duration-150 ${
                      active
                        ? "bg-red-50 border-red-300 text-red-500 scale-105"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <p.icon />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-xs text-slate-500 uppercase mb-2">
              Content
            </label>

            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share today?"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm outline-none resize-none"
            />

            <div
              className={`text-right text-xs mt-1 font-medium ${
                content.length > 270
                  ? "text-red-500"
                  : "text-slate-400"
              }`}
            >
              {content.length}/280
            </div>
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <label className="block text-xs text-slate-500 uppercase mb-2">
              Media (Optional)
            </label>

            {mediaFile ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                {mediaFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(mediaFile)}
                    alt="preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(mediaFile)}
                    className="w-full h-48 object-cover"
                    controls
                  />
                )}

                <button
                  type="button"
                  onClick={() => setMediaFile(null)}
                  className="absolute top-2 right-2 size-7 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all">
                <span className="text-sm text-slate-500 hover:text-red-500">
                  Click to upload image or video
                </span>

                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    setMediaFile(e.target.files[0])
                  }
                />
              </label>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Date
              </label>

              <div className="relative">
                <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Time
              </label>

              <div className="relative">
                <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-6 bg-red-500 hover:bg-red-600 transition-all text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                Schedule Post
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Queue panels */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Upcoming */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <CalendarDaysIcon className="size-4 text-zinc-500" />

            <h3 className="text-slate-900 text-sm font-semibold">
              Upcoming
            </h3>

            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
              {scheduled.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {scheduled.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No posts scheduled yet
              </div>
            ) : (
              scheduled.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    {/* Platform icons */}
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);

                        return meta ? (
                          <meta.icon
                            key={pl}
                            className="size-3.5 text-slate-400"
                          />
                        ) : null;
                      })}
                    </div>

                    {/* Media type badge + scheduled time */}
                    <div className="flex items-center gap-2">
                      {post.mediaType && (
                        <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                          {post.mediaType}
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        {new Date(post.scheduledFor).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className="text-sm text-slate-500 line-clamp-2 max-w-md">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <SendIcon className="size-4 text-zinc-500" />

            <h3 className="text-slate-900 text-sm font-semibold">
              Published
            </h3>

            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
              {published.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {published.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No published posts yet
              </div>
            ) : (
              published.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    {/* Platform icons */}
                    <div className="flex gap-1.5 items-center">
                      {post.platforms.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);

                        return meta ? (
                          <meta.icon
                            key={pl}
                            className="size-3.5 text-slate-400"
                          />
                        ) : null;
                      })}
                    </div>

                    {/* Media type badge + Published timestamp + status badge */}
                    <div className="flex items-center gap-2">
                      {post.mediaType && (
                        <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                          {post.mediaType}
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        {new Date(post.updatedAt ?? post.scheduledFor).toLocaleString()}
                      </span>

                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                        Published
                      </span>
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className="text-sm text-slate-500 line-clamp-2 max-w-4/5">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;