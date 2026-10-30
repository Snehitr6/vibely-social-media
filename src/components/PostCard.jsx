
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocial } from "../context/SocialContext";

export default function PostCard({ post }) {
  const { user } = useAuth();

  const {
    likePost,
    savePost,
    addComment,
    deleteComment,
    deletePost,
    editPost,
  } = useSocial();

  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [message, setMessage] = useState("");
  const [showHeart, setShowHeart] = useState(false);

  const heartTimeout = useRef(null);
  const lastTap = useRef(0);

  const userId = user?.id || user?.email;
  const ownerId = post.user?.id || post.user?.email;

  const isOwner = ownerId === userId;
  const likes = post.likes || [];
  const comments = post.comments || [];
  const savedBy = post.savedBy || [];

  const isLiked = likes.includes(userId);
  const isSaved = savedBy.includes(userId);

  // DOUBLE CLICK / DOUBLE TAP LIKE
  const handleDoubleLike = () => {
    if (!userId) return;

    // Only add a like if the post is not already liked.
    if (!isLiked) {
      likePost(post.id, userId);
    }

    // Show animated heart.
    setShowHeart(true);

    if (heartTimeout.current) {
      clearTimeout(heartTimeout.current);
    }

    heartTimeout.current = setTimeout(() => {
      setShowHeart(false);
    }, 850);
  };

  // MOBILE DOUBLE TAP
  const handleTouch = () => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      handleDoubleLike();
    }

    lastTap.current = now;
  };

  useEffect(() => {
    return () => {
      if (heartTimeout.current) {
        clearTimeout(heartTimeout.current);
      }
    };
  }, []);

  // NORMAL COMMENT
  const handleComment = (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    addComment(post.id, comment.trim());
    setComment("");
  };

  // SHARE POST
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${post.id}`
      );

      setMessage("Post link copied!");
    } catch {
      setMessage("Unable to copy link in this browser.");
    }

    setTimeout(() => setMessage(""), 2500);
  };

  // EDIT POST
  const handleEdit = (e) => {
    e.preventDefault();

    if (!editContent.trim()) return;

    editPost(post.id, {
      content: editContent.trim(),
      image: post.image,
    });

    setEditing(false);
    setShowMenu(false);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#191c27] text-white">

      {/* POST HEADER */}
      <div className="flex items-center justify-between p-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={post.user?.avatar || "https://i.pravatar.cc/100"}
            alt={post.user?.name || "User"}
            className="h-11 w-11 rounded-full object-cover"
          />

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">
              {post.user?.name || "Vibely User"}
            </h3>

            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleString()}
              {post.updatedAt && " · Edited"}
            </p>
          </div>
        </div>

        {/* POST OPTIONS */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Post options"
          >
            <MoreHorizontal size={21} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-white/10 bg-[#252938] p-2 shadow-xl">
              {isOwner ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditContent(post.content || "");
                      setEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                  >
                    <Pencil size={15} />
                    Edit post
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      deletePost(post.id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-white/10"
                  >
                    <Trash2 size={15} />
                    Delete post
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMenu(false)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  Close menu
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EDIT POST */}
      {editing ? (
        <form onSubmit={handleEdit} className="px-4 pb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-[#252938] p-3 text-sm outline-none focus:border-purple-500"
          />

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm text-gray-400 hover:bg-white/10"
            >
              <X size={15} />
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
            >
              Save changes
            </button>
          </div>
        </form>
      ) : (
        post.content && (
          <p className="whitespace-pre-wrap px-4 pb-4 text-sm leading-6 text-gray-200">
            {post.content}
          </p>
        )
      )}

      {/* POST IMAGE WITH DOUBLE CLICK LIKE */}
      {post.image && (
        <div
          onDoubleClick={handleDoubleLike}
          onTouchEnd={handleTouch}
          className="relative cursor-pointer select-none overflow-hidden"
        >
          <img
            src={post.image}
            alt="Post"
            loading="lazy"
            draggable="false"
            className="max-h-[600px] w-full object-cover"
          />

          {/* ANIMATED HEART */}
          {showHeart && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Heart
                size={105}
                fill="white"
                color="white"
                strokeWidth={1.5}
                className="animate-heart-pop drop-shadow-2xl"
              />
            </div>
          )}
        </div>
      )}

      {/* LIKE AND COMMENT COUNTS */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-gray-400">
        <span>{likes.length} likes</span>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="hover:text-white"
        >
          {comments.length} comments
        </button>
      </div>

      {/* POST ACTIONS */}
      <div className="flex items-center justify-around px-2 py-2">
        <button
          type="button"
          onClick={() => likePost(post.id, userId)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm transition hover:bg-white/5 ${
            isLiked ? "text-pink-500" : "text-gray-400"
          }`}
        >
          <Heart
            size={19}
            fill={isLiked ? "currentColor" : "none"}
          />
          Like
        </button>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm text-gray-400 hover:bg-white/5"
        >
          <MessageCircle size={19} />
          Comment
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm text-gray-400 hover:bg-white/5"
        >
          <Share2 size={19} />
          Share
        </button>

        <button
          type="button"
          onClick={() => savePost(post.id, userId)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm ${
            isSaved ? "text-purple-400" : "text-gray-400"
          } hover:bg-white/5`}
        >
          <Bookmark
            size={19}
            fill={isSaved ? "currentColor" : "none"}
          />
          Save
        </button>
      </div>

      {/* SHARE FEEDBACK */}
      {message && (
        <p className="px-4 pb-3 text-xs text-green-400">
          {message}
        </p>
      )}

      {/* COMMENTS */}
      {showComments && (
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#252938] px-4 py-3 text-sm outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={!comment.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600 transition hover:bg-purple-500 disabled:opacity-40"
              aria-label="Send comment"
            >
              <Send size={17} />
            </button>
          </form>

          <div className="mt-4 space-y-4">
            {comments.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">
                    {item.user?.name || "Vibely User"}
                  </p>

                  <p className="mt-1 break-words text-sm text-gray-300">
                    {item.text}
                  </p>
                </div>

                {(item.user?.email === user?.email ||
                  item.user?.id === user?.id) && (
                  <button
                    type="button"
                    onClick={() => deleteComment(post.id, item.id)}
                    className="shrink-0 text-gray-500 hover:text-red-400"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
