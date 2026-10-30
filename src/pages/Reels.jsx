
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Send,
  X,
  Video,
  Trash2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import demoReels from "../data/reels";

const STORAGE_KEY = "vibelyReels";

// Load reels and refresh existing demo video URLs
function loadReels() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(saved)) {
      const demoMap = new Map(
        demoReels.map((reel) => [String(reel.id), reel])
      );

      const updatedSaved = saved.map((reel) => {
        const freshDemo = demoMap.get(String(reel.id));

        if (!freshDemo) return reel;

        return {
          ...reel,
          video: freshDemo.video,
          username: freshDemo.username,
          handle: freshDemo.handle,
          avatar: freshDemo.avatar,
        };
      });

      const savedIds = new Set(
        updatedSaved.map((reel) => String(reel.id))
      );

      return [
        ...updatedSaved,
        ...demoReels.filter(
          (reel) => !savedIds.has(String(reel.id))
        ),
      ];
    }
  } catch (error) {
    console.error("Unable to load reels:", error);
  }

  return demoReels;
}

export default function Reels() {
  const { user } = useAuth();

  const [reels, setReels] = useState(loadReels);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [commentReelId, setCommentReelId] = useState(null);

  const [caption, setCaption] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");

  const [playing, setPlaying] = useState({});
  const [muted, setMuted] = useState(true);
  const [heartReel, setHeartReel] = useState(null);

  const fileRef = useRef(null);
  const videoRefs = useRef({});
  const observerRef = useRef(null);
  const heartTimer = useRef(null);

  const userId = user?.id || user?.email || "guest";

  const currentUsername =
    user?.username || user?.email?.split("@")[0] || "user";

  const currentHandle = `@${currentUsername}`;

  // Save reels
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
    } catch (err) {
      console.error("Unable to save reels:", err);
      setError("Storage is full. Remove an uploaded reel and try again.");
    }
  }, [reels]);

  // Automatically play visible videos and pause hidden videos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const id = video.dataset.reelId;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
            video.play().catch(() => {
              setPlaying((prev) => ({ ...prev, [id]: false }));
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: [0, 0.65, 1],
      }
    );

    observerRef.current = observer;

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [reels]);

  useEffect(() => {
    return () => clearTimeout(heartTimer.current);
  }, []);

  // Play and pause
  const togglePlay = (id) => {
    const video = videoRefs.current[id];

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        setError("Unable to play this video. Check its video URL.");
      });
    } else {
      video.pause();
    }
  };

  // Like
  const handleLike = (reel) => {
    if (userId === "guest") return;

    setReels((prev) =>
      prev.map((item) => {
        if (item.id !== reel.id) return item;

        const likes = item.likes || [];

        return {
          ...item,
          likes: likes.includes(userId)
            ? likes.filter((id) => id !== userId)
            : [...likes, userId],
        };
      })
    );

    setHeartReel(reel.id);
    clearTimeout(heartTimer.current);

    heartTimer.current = setTimeout(() => {
      setHeartReel(null);
    }, 750);
  };

  // Double click like
  const handleDoubleClick = (reel) => {
    const liked = (reel.likes || []).includes(userId);

    if (!liked) {
      handleLike(reel);
    } else {
      setHeartReel(reel.id);
      clearTimeout(heartTimer.current);

      heartTimer.current = setTimeout(() => {
        setHeartReel(null);
      }, 750);
    }
  };

  // Save
  const handleSave = (id) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id !== id) return reel;

        const savedBy = reel.savedBy || [];

        return {
          ...reel,
          savedBy: savedBy.includes(userId)
            ? savedBy.filter((item) => item !== userId)
            : [...savedBy, userId],
        };
      })
    );
  };

  // Upload video
  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Please select a video smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setVideoPreview(reader.result);
      setError("");
    };

    reader.onerror = () => {
      setError("Unable to read this video.");
    };

    reader.readAsDataURL(file);
  };

  // Publish
  const publishReel = (event) => {
    event.preventDefault();

    if (!videoPreview) {
      setError("Please select a video first.");
      return;
    }

    const newReel = {
      id: `reel-${Date.now()}`,
      username: user?.name || "Vibely User",
      handle: currentHandle,
      avatar: user?.avatar || "https://i.pravatar.cc/150",
      video: videoPreview,
      caption: caption.trim(),
      likes: [],
      savedBy: [],
      comments: [],
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };

    setReels((prev) => [newReel, ...prev]);

    setCaption("");
    setVideoPreview("");
    setUploadOpen(false);
    setError("");

    if (fileRef.current) fileRef.current.value = "";
  };

  // Delete
  const deleteReel = (reel) => {
    if (reel.ownerId !== userId) return;

    setReels((prev) =>
      prev.filter((item) => item.id !== reel.id)
    );

    if (commentReelId === reel.id) {
      setCommentReelId(null);
    }
  };

  // Share
  const handleShare = async (reel) => {
    const url = `${window.location.origin}/reels#${reel.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Vibely Reel",
          text: reel.caption || "Check out this reel!",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setError("Reel link copied!");
        setTimeout(() => setError(""), 2000);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Unable to share this reel.");
        setTimeout(() => setError(""), 2000);
      }
    }
  };

  // Add comment
  const handleComment = (event) => {
    event.preventDefault();

    if (!comment.trim() || !commentReelId) return;

    const newComment = {
      id: Date.now(),
      text: comment.trim(),
      user: {
        id: userId,
        name: user?.name || "Vibely User",
        avatar: user?.avatar || "https://i.pravatar.cc/100",
      },
    };

    setReels((prev) =>
      prev.map((reel) =>
        reel.id === commentReelId
          ? {
              ...reel,
              comments: [...(reel.comments || []), newComment],
            }
          : reel
      )
    );

    setComment("");
  };

  const closeUpload = () => {
    setUploadOpen(false);
    setVideoPreview("");
    setCaption("");
    setError("");

    if (fileRef.current) fileRef.current.value = "";
  };

  const activeCommentReel = reels.find(
    (reel) => reel.id === commentReelId
  );

  return (
<div className="min-h-screen -mx-3 -my-6 bg-[#0e1017] px-0 py-5 text-white sm:-mx-6 lg:-mx-9">
<div className="mx-auto w-full max-w-none">
            {/* HEADER */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Reels</h1>
            <p className="mt-1 text-sm text-gray-400">
              Discover videos from your community
            </p>
          </div>

          <button
            onClick={() => {
              setUploadOpen(true);
              setError("");
            }}
            className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
          >
            <Plus size={18} />
            Create Reel
          </button>
        </div>

        {error && !uploadOpen && (
          <p className="mb-4 rounded-xl bg-purple-500/10 p-3 text-sm text-purple-300">
            {error}
          </p>
        )}

        {/* REELS */}
        <div className="mx-auto flex max-w-[440px] flex-col gap-6">
          {reels.map((reel) => {
            const liked = (reel.likes || []).includes(userId);
            const saved = (reel.savedBy || []).includes(userId);

            const isOwner = reel.ownerId === userId;

            return (
              <article
                key={reel.id}
                id={reel.id}
                className="relative h-[75vh] min-h-[520px] max-h-[780px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl"
              >
                {/* VIDEO */}
                <video
                  ref={(element) => {
                    if (element) {
                      videoRefs.current[reel.id] = element;
                      observerRef.current?.observe(element);
                    } else {
                      delete videoRefs.current[reel.id];
                    }
                  }}
                  data-reel-id={reel.id}
                  src={reel.video}
                  muted={muted}
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  onClick={() => togglePlay(reel.id)}
                  onDoubleClick={() => handleDoubleClick(reel)}
                  onPlay={() =>
                    setPlaying((prev) => ({
                      ...prev,
                      [reel.id]: true,
                    }))
                  }
                  onPause={() =>
                    setPlaying((prev) => ({
                      ...prev,
                      [reel.id]: false,
                    }))
                  }
                  onError={() => {
                    setError(
                      `Unable to load video for ${reel.username}. Check the video URL.`
                    );
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer object-cover"
                />

                {/* GRADIENTS */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* HEART */}
                {heartReel === reel.id && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <Heart
                      size={100}
                      fill="white"
                      color="white"
                      className="animate-heart-pop drop-shadow-2xl"
                    />
                  </div>
                )}

                {/* VIDEO CONTROLS */}
                <div className="absolute right-4 top-4 z-20 flex gap-2">
                  {isOwner && (
                    <button
                      onClick={() => deleteReel(reel)}
                      className="rounded-full bg-black/50 p-2 hover:bg-red-600"
                      aria-label="Delete reel"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => setMuted((prev) => !prev)}
                    className="rounded-full bg-black/50 p-2"
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
                  </button>

                  <button
                    onClick={() => togglePlay(reel.id)}
                    className="rounded-full bg-black/50 p-2"
                    aria-label={playing[reel.id] ? "Pause" : "Play"}
                  >
                    {playing[reel.id] ? <Pause size={19} /> : <Play size={19} />}
                  </button>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-5">
                  <button
                    onClick={() => handleLike(reel)}
                    className="flex flex-col items-center gap-1 transition hover:scale-110"
                  >
                    <Heart
                      size={29}
                      fill={liked ? "#ec4899" : "none"}
                      color={liked ? "#ec4899" : "white"}
                    />
                    <span className="text-xs font-semibold">
                      {reel.likes?.length || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => setCommentReelId(reel.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <MessageCircle size={28} />
                    <span className="text-xs font-semibold">
                      {reel.comments?.length || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => handleShare(reel)}
                    className="flex flex-col items-center gap-1"
                  >
                    <Share2 size={27} />
                    <span className="text-xs font-semibold">Share</span>
                  </button>

                  <button
                    onClick={() => handleSave(reel.id)}
                    className={`flex flex-col items-center gap-1 ${
                      saved ? "text-purple-400" : "text-white"
                    }`}
                  >
                    <Bookmark
                      size={27}
                      fill={saved ? "currentColor" : "none"}
                    />
                    <span className="text-xs font-semibold">
                      {saved ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>

                {/* USER DETAILS */}
                <div className="absolute bottom-0 left-0 z-20 w-full p-5 pr-20">
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={reel.avatar || "https://i.pravatar.cc/100"}
                      alt={reel.username}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                    />

                    <div>
                      <span className="block text-sm font-bold">
                        {reel.username}
                      </span>
                      <span className="text-xs text-gray-300">
                        {reel.handle}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-6">
                    {reel.caption}
                  </p>

                  <p className="mt-2 text-xs text-gray-300">
                    ♫ Original audio · {reel.username}
                  </p>
                </div>
              </article>
            );
          })}

          {reels.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#191c27] p-10 text-center">
              <Video
                size={42}
                className="mx-auto mb-4 text-purple-400"
              />
              <h2 className="font-bold">No Reels yet</h2>
              <p className="mt-2 text-sm text-gray-400">
                Upload your first video and share it with your community.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeUpload}
        >
          <form
            onSubmit={publishReel}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#191c27] p-5 text-white"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Create a Reel</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Share a short video
                </p>
              </div>

              <button
                type="button"
                onClick={closeUpload}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {videoPreview ? (
              <video
                src={videoPreview}
                controls
                playsInline
                className="max-h-[350px] w-full rounded-xl bg-black"
              />
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-[#252938] text-gray-400 hover:border-purple-500 hover:text-purple-400"
              >
                <Video size={38} />
                <span className="text-sm font-medium">
                  Select a video
                </span>
                <span className="text-xs">
                  MP4, WEBM · Maximum 2 MB
                </span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={handleUpload}
              className="hidden"
            />

            <input
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={180}
              placeholder="Write a caption..."
              className="mt-4 w-full rounded-xl border border-white/10 bg-[#252938] px-4 py-3 text-sm outline-none focus:border-purple-500"
            />

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={!videoPreview}
              className="mt-4 w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold hover:bg-purple-500 disabled:opacity-40"
            >
              Publish Reel
            </button>
          </form>
        </div>
      )}

      {/* COMMENTS MODAL */}
      {activeCommentReel && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
          onClick={() => setCommentReelId(null)}
        >
          <div
            className="max-h-[75vh] w-full max-w-lg rounded-t-2xl border border-white/10 bg-[#191c27] p-5 sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold">Comments</h2>
              <button
                onClick={() => setCommentReelId(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10"
                aria-label="Close comments"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[45vh] space-y-4 overflow-y-auto">
              {(activeCommentReel.comments || []).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={
                      item.user?.avatar ||
                      item.avatar ||
                      "https://i.pravatar.cc/100"
                    }
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold">
                      {item.user?.name || item.username || "Vibely User"}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}

              {!activeCommentReel.comments?.length && (
                <p className="py-8 text-center text-sm text-gray-400">
                  No comments yet. Be the first!
                </p>
              )}
            </div>

            <form onSubmit={handleComment} className="mt-5 flex gap-2">
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a comment..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#252938] px-4 py-3 text-sm outline-none focus:border-purple-500"
              />

              <button
                type="submit"
                disabled={!comment.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 disabled:opacity-40"
                aria-label="Send comment"
              >
                <Send size={17} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
