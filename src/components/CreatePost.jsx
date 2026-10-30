
import { useRef, useState } from "react";
import {
  ImagePlus,
  Smile,
  X,
  Send,
  LoaderCircle,
} from "lucide-react";
import { useSocial } from "../context/SocialContext";
import { useAuth } from "../context/AuthContext";

export default function CreatePost({ open, onClose }) {
  const { createPost } = useSocial();
  const { user } = useAuth();

  const fileRef = useRef(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Hide the global modal until Create Post is clicked.
  if (open === false) return null;

  const isModal = open === true;

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setError("");
    };

    reader.onerror = () => {
      setError("Unable to read this image.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!content.trim() && !image) {
      setError("Write something or select an image.");
      return;
    }

    setLoading(true);

    try {
      createPost({
        content: content.trim(),
        image,
      });

      setContent("");
      setImage("");
      if (fileRef.current) fileRef.current.value = "";

      setSuccess("Your post has been published!");

      setTimeout(() => {
        setSuccess("");
        onClose?.();
      }, 1000);
    } catch {
      setError("Unable to publish. Try a smaller image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isModal
          ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          : "w-full"
      }
      onClick={isModal ? onClose : undefined}
    >
      <div
        className={`w-full rounded-2xl border border-white/10 bg-[#191c27] p-4 text-white sm:p-5 ${
          isModal ? "max-w-xl shadow-2xl" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Create a post</h2>
            <p className="mt-1 text-xs text-gray-400">
              Share something with your community
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={19} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex items-start gap-3">
            <img
              src={user?.avatar || "https://i.pravatar.cc/100"}
              alt="Profile"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${user?.name || "friend"}?`}
              rows={2}
              className="h-14 min-h-0 flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-white outline-none placeholder:text-gray-500"
            />
          </div>

          {image && (
            <div className="relative mb-3 overflow-hidden rounded-xl">
              <img
                src={image}
                alt="Post preview"
                className="max-h-[350px] w-full object-cover"
              />

              <button
                type="button"
                onClick={() => {
                  setImage("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />

          {error && (
            <p className="mb-3 rounded-lg bg-red-500/10 p-2.5 text-xs text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="mb-3 rounded-lg bg-green-500/10 p-2.5 text-xs text-green-400">
              {success}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-400"
              >
                <ImagePlus size={19} />
                Photo
              </button>

              <button
                type="button"
                onClick={() => setContent((prev) => prev + " 😊")}
                className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-yellow-400"
              >
                <Smile size={19} />
                Emoji
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || (!content.trim() && !image)}
              className="flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
