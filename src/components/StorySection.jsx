
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ImagePlus,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocial } from "../context/SocialContext";

export default function StorySection() {
  const { user } = useAuth();

  const {
    stories,
    createStory,
    deleteStory,
    viewStory,
  } = useSocial();

  const [showCreate, setShowCreate] = useState(false);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [progress, setProgress] = useState(0);

  const fileRef = useRef(null);

  const currentUserId = user?.id || user?.email;

  const isOwnStory = (story) => {
    const storyUserId = story.user?.id || story.user?.email;
    return storyUserId === currentUserId;
  };

  const activeStories = stories.filter(
    (story) => Date.now() - story.createdAt < 86400000
  );

  const ownStories = activeStories.filter(isOwnStory);
  const otherStories = activeStories.filter(
    (story) => !isOwnStory(story)
  );

  const selectedIndex = activeStories.findIndex(
    (story) => String(story.id) === String(selectedId)
  );

  const selectedStory = activeStories[selectedIndex];

  // OPEN STORY
  const openStory = (story) => {
    setSelectedId(story.id);
    setProgress(0);
    viewStory(story.id, currentUserId || "guest");
  };

  // NEXT STORY
  const nextStory = () => {
    if (selectedIndex >= 0 && selectedIndex < activeStories.length - 1) {
      const next = activeStories[selectedIndex + 1];
      openStory(next);
    } else {
      setSelectedId(null);
    }
  };

  // PREVIOUS STORY
  const previousStory = () => {
    if (selectedIndex > 0) {
      const previous = activeStories[selectedIndex - 1];
      openStory(previous);
    }
  };

  // STORY PROGRESS AND AUTO NEXT
  useEffect(() => {
    if (!selectedId || !selectedStory) return;

    setProgress(0);

    const startedAt = Date.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const value = Math.min(
        100,
        ((Date.now() - startedAt) / duration) * 100
      );

      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);

        const nextIndex = selectedIndex + 1;

        if (nextIndex < activeStories.length) {
          const next = activeStories[nextIndex];
          setSelectedId(next.id);
          viewStory(next.id, currentUserId || "guest");
        } else {
          setSelectedId(null);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [selectedId, activeStories.length]);

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
      setError("");
    };

    reader.onerror = () => {
      setError("Unable to read image.");
    };

    reader.readAsDataURL(file);
  };

  // PUBLISH STORY
  const handlePublish = () => {
    if (!preview) {
      setError("Please select an image first.");
      return;
    }

    try {
      createStory({
        image: preview,
        caption: caption.trim(),
      });

      setPreview("");
      setCaption("");
      setError("");
      setShowCreate(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch {
      setError("Unable to publish story. Try a smaller image.");
    }
  };

  // DELETE OWN STORY
  const handleDeleteStory = () => {
    if (!selectedStory || !isOwnStory(selectedStory)) return;

    deleteStory(selectedStory.id);
    setSelectedId(null);
  };

  return (
    <>
      {/* STORIES SECTION */}
      <section className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#191c27] p-4 text-white sm:p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Stories</h2>
            <p className="mt-1 text-xs text-gray-400">
              Share moments that disappear after 24 hours
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-purple-400">
            <Clock size={14} />
            24h
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* ADD YOUR STORY */}
          <button
            type="button"
            onClick={() => {
              setShowCreate(true);
              setError("");
            }}
            className="flex w-[70px] shrink-0 flex-col items-center gap-2"
          >
            <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-dashed border-purple-500 bg-purple-500/10 transition hover:bg-purple-500/20">
              <img
                src={user?.avatar || "https://i.pravatar.cc/100"}
                alt="Your profile"
                className="h-full w-full rounded-full object-cover opacity-70"
              />

              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-[#191c27] bg-purple-600 text-white">
                <Plus size={15} />
              </span>
            </div>

            <span className="w-full truncate text-center text-xs text-gray-300">
              Your story
            </span>
          </button>

          {/* YOUR EXISTING STORIES */}
          {ownStories.length > 0 && (
            <button
              type="button"
              onClick={() => openStory(ownStories[0])}
              className="flex w-[70px] shrink-0 flex-col items-center gap-2"
            >
              <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px]">
                <img
                  src={user?.avatar || "https://i.pravatar.cc/100"}
                  alt="My story"
                  className="h-[62px] w-[62px] rounded-full border-2 border-[#191c27] object-cover"
                />
              </div>

              <span className="w-full truncate text-center text-xs text-gray-300">
                My story
              </span>
            </button>
          )}

          {/* OTHER USERS' STORIES */}
          {otherStories.map((story) => {
            const viewed = (story.viewedBy || []).includes(
              currentUserId
            );

            return (
              <button
                type="button"
                key={story.id}
                onClick={() => openStory(story)}
                className="flex w-[70px] shrink-0 flex-col items-center gap-2"
              >
                <div
                  className={`rounded-full p-[3px] ${
                    viewed
                      ? "bg-gray-600"
                      : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                  }`}
                >
                  <img
                    src={
                      story.user?.avatar ||
                      "https://i.pravatar.cc/100"
                    }
                    alt={story.user?.name || "User"}
                    className="h-[62px] w-[62px] rounded-full border-2 border-[#191c27] object-cover"
                  />
                </div>

                <span className="w-full truncate text-center text-xs text-gray-300">
                  {story.user?.name?.split(" ")[0] || "User"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CREATE STORY MODAL */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#191c27] p-5 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Create your story
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Share a moment with your followers
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {preview ? (
              <div className="relative overflow-hidden rounded-xl bg-black">
                <img
                  src={preview}
                  alt="Story preview"
                  className="max-h-[380px] w-full object-contain"
                />

                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    if (fileRef.current) {
                      fileRef.current.value = "";
                    }
                  }}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white"
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-[#252938] text-gray-400 transition hover:border-purple-500 hover:text-purple-400"
              >
                <ImagePlus size={38} />
                <span className="text-sm font-medium">
                  Upload a story image
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG or WEBP · Maximum 2 MB
                </span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              maxLength={100}
              className="mt-4 w-full rounded-xl border border-white/10 bg-[#252938] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-purple-500"
            />

            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handlePublish}
              disabled={!preview}
              className="mt-4 w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Share Story
            </button>
          </div>
        </div>
      )}

      {/* FULL SCREEN STORY VIEWER */}
      {selectedStory && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-2 backdrop-blur-sm sm:p-5">
          <div className="relative h-[92vh] max-h-[850px] w-full max-w-[440px] overflow-hidden rounded-2xl bg-[#191c27] shadow-2xl">

            {/* STORY IMAGE */}
            <img
              src={selectedStory.image}
              alt="Story"
              className="absolute inset-0 h-full w-full bg-black object-contain"
            />

            {/* DARK GRADIENT */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent" />

            {/* PROGRESS BAR */}
            <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
              {activeStories
                .filter((story, index) => index <= selectedIndex)
                .map((story, index) => (
                  <div
                    key={story.id}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                  >
                    <div
                      className="h-full rounded-full bg-white"
                      style={{
                        width:
                          index < selectedIndex
                            ? "100%"
                            : `${progress}%`,
                      }}
                    />
                  </div>
                ))}
            </div>

            {/* USER DETAILS */}
            <div className="absolute inset-x-0 top-5 z-20 flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedStory.user?.avatar ||
                    "https://i.pravatar.cc/100"
                  }
                  alt=""
                  className="h-10 w-10 rounded-full border border-white/30 object-cover"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedStory.user?.name || "Vibely User"}
                  </p>
                  <p className="text-[11px] text-white/70">
                    {new Date(
                      selectedStory.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isOwnStory(selectedStory) && (
                  <button
                    type="button"
                    onClick={handleDeleteStory}
                    className="rounded-full bg-black/40 p-2 text-white transition hover:bg-red-500"
                    aria-label="Delete story"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-full bg-black/40 p-2 text-white transition hover:bg-white/20"
                  aria-label="Close story"
                >
                  <X size={21} />
                </button>
              </div>
            </div>

            {/* STORY CAPTION */}
            {selectedStory.caption && (
              <div className="absolute bottom-8 left-0 right-0 z-20 px-6 text-center">
                <p className="text-sm font-medium text-white drop-shadow-lg">
                  {selectedStory.caption}
                </p>
              </div>
            )}

            {/* PREVIOUS / NEXT CONTROLS */}
            <button
              type="button"
              onClick={previousStory}
              disabled={selectedIndex <= 0}
              className="absolute bottom-20 left-0 top-24 z-10 flex w-1/4 items-center justify-start pl-2 text-white/70 transition hover:text-white disabled:opacity-0"
              aria-label="Previous story"
            >
              <ChevronLeft size={30} />
            </button>

            <button
              type="button"
              onClick={nextStory}
              className="absolute bottom-20 right-0 top-24 z-10 flex w-1/4 items-center justify-end pr-2 text-white/70 transition hover:text-white"
              aria-label="Next story"
            >
              <ChevronRight size={30} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
