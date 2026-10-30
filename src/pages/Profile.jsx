
import { useEffect, useRef, useState } from "react";
import {
  Grid3X3,
  Bookmark,
  Edit3,
  X,
  Check,
  Camera,
  ImageIcon,
  Users,
  Heart,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useSocial } from "../context/SocialContext";
import PostCard from "../components/PostCard";

const PROFILE_PHOTO = "/profile.jpeg";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { posts, following } = useSocial();

  const avatarInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("posts");
  const [editing, setEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(PROFILE_PHOTO);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Apply the uploaded profile photo to the logged-in account.
  useEffect(() => {
    if (!user) return;

    const currentAvatar = user.avatar || "";

    if (
      currentAvatar !== PROFILE_PHOTO &&
      !currentAvatar.startsWith("data:image/")
    ) {
      updateProfile({ avatar: PROFILE_PHOTO });
    }
  }, [user?.id, user?.email]);

  // Keep form values synchronized with the account.
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || PROFILE_PHOTO);
    }
  }, [user?.id, user?.email]);

  const currentUserId = user?.id;
  const currentEmail = user?.email?.toLowerCase();

  // Identify posts belonging to the logged-in user.
  const isMyPost = (post) => {
    const postUser = post.user || {};

    return (
      (currentEmail &&
        postUser.email?.toLowerCase() === currentEmail) ||
      (currentUserId &&
        postUser.id === currentUserId)
    );
  };

  const myPosts = posts.filter(isMyPost);

  const savedPosts = posts.filter((post) =>
    (post.savedBy || []).some(
      (id) =>
        id === currentUserId ||
        id === currentEmail ||
        id === user?.email
    )
  );

  // Upload profile photo.
  const handleAvatarUpload = (e) => {
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
      setAvatar(reader.result);
      setError("");
      setSuccess("");
    };

    reader.onerror = () => {
      setError("Unable to read this image.");
    };

    reader.readAsDataURL(file);
  };

  // Save profile.
  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      avatar,
    });

    setError("");
    setSuccess("Profile updated successfully!");
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0e1017] px-3 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* PROFILE HEADER */}
        <section className="rounded-2xl border border-white/10 bg-[#191c27] p-5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* PROFILE IMAGE */}
            <div className="relative mx-auto h-32 w-32 shrink-0 sm:mx-0">
              <img
                src={user?.avatar || PROFILE_PHOTO}
                alt="Your profile"
                className="h-32 w-32 rounded-full border-4 border-purple-500/30 object-cover"
                onError={(e) => {
                  e.currentTarget.src = PROFILE_PHOTO;
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setError("");
                }}
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#191c27] bg-purple-600 transition hover:bg-purple-500"
                aria-label="Change profile picture"
              >
                <Camera size={18} />
              </button>
            </div>

            {/* PROFILE INFORMATION */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="text-2xl font-bold">
                  {user?.name || "Vibely User"}
                </h1>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setError("");
                  }}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold transition hover:border-purple-500 hover:text-purple-400"
                >
                  <Edit3 size={14} />
                  Edit Profile
                </button>
              </div>

              <p className="mt-2 text-sm text-gray-400">
                @{user?.username || user?.email?.split("@")[0] || "user"}
              </p>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-300 sm:mx-0">
                {user?.bio || "Welcome to my Vibely profile. Let's connect!"}
              </p>

              {/* PROFILE STATISTICS */}
              <div className="mt-6 flex justify-center gap-9 sm:justify-start">
                <div>
                  <p className="text-xl font-bold">{myPosts.length}</p>
                  <p className="text-xs text-gray-400">Posts</p>
                </div>

                <div>
                  <p className="text-xl font-bold">{following.length}</p>
                  <p className="text-xs text-gray-400">Following</p>
                </div>

                <div>
                  <p className="text-xl font-bold">
                    {myPosts.reduce(
                      (total, post) => total + (post.likes?.length || 0),
                      0
                    )}
                  </p>
                  <p className="text-xs text-gray-400">Total Likes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {editing && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          >
            <form
              onSubmit={handleSaveProfile}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#191c27] p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Edit Profile</h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Update your personal information
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* PHOTO UPLOAD */}
              <div className="mb-6 flex items-center gap-4">
                <img
                  src={avatar || PROFILE_PHOTO}
                  alt="Profile preview"
                  className="h-20 w-20 rounded-full border-2 border-purple-500 object-cover"
                />

                <div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold transition hover:bg-purple-500"
                  >
                    Change Photo
                  </button>

                  <p className="mt-2 text-xs text-gray-500">
                    JPG, PNG or WEBP · Max 2 MB
                  </p>
                </div>
              </div>

              {/* NAME */}
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mb-4 w-full rounded-xl border border-white/10 bg-[#252938] px-4 py-3 text-sm outline-none transition focus:border-purple-500"
              />

              {/* EMAIL */}
              <label className="mb-2 block text-sm text-gray-300">
                Email Address
              </label>

              <input
                value={user?.email || ""}
                disabled
                className="mb-4 w-full cursor-not-allowed rounded-xl border border-white/10 bg-[#252938] px-4 py-3 text-sm text-gray-500 outline-none"
              />

              {/* BIO */}
              <label className="mb-2 block text-sm text-gray-300">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="Tell people about yourself..."
                className="mb-4 w-full resize-none rounded-xl border border-white/10 bg-[#252938] px-4 py-3 text-sm outline-none transition focus:border-purple-500"
              />

              {error && (
                <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold transition hover:bg-purple-500"
              >
                <Check size={18} />
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* PROFILE TABS */}
        <div className="mt-7 border-b border-white/10">
          <div className="flex justify-center gap-10 sm:justify-start">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition ${
                activeTab === "posts"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Grid3X3 size={18} />
              My Posts
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition ${
                activeTab === "saved"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Bookmark size={18} />
              Saved
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div className="py-7">
          {activeTab === "posts" && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">Your Posts</h2>
                <span className="text-xs text-gray-400">
                  {myPosts.length} posts
                </span>
              </div>

              {myPosts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
                  {myPosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setSelectedPost(post)}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-[#191c27] text-left"
                    >
                      {post.image ? (
                        <img
                          src={post.image}
                          alt="Your post"
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-4">
                          <p className="line-clamp-5 text-sm text-gray-300">
                            {post.content}
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/60 opacity-0 transition group-hover:opacity-100">
                        <span className="flex items-center gap-1 text-sm font-semibold">
                          <Heart size={17} fill="white" />
                          {post.likes?.length || 0}
                        </span>

                        <span className="flex items-center gap-1 text-sm font-semibold">
                          <ImageIcon size={17} />
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState message="You haven't shared any posts yet. Create your first post to see it here." />
              )}
            </>
          )}

          {/* SAVED POSTS */}
          {activeTab === "saved" && (
            <>
              <h2 className="mb-5 text-lg font-bold">Saved Posts</h2>

              {savedPosts.length > 0 ? (
                <div className="mx-auto max-w-2xl space-y-5">
                  {savedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Your saved posts will appear here." />
              )}
            </>
          )}
        </div>
      </div>

      {/* POST DETAIL MODAL */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="my-auto w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="rounded-full bg-[#252938] p-2 text-white transition hover:bg-purple-600"
                aria-label="Close post"
              >
                <X size={20} />
              </button>
            </div>

            <PostCard post={selectedPost} />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#191c27] px-5 py-16 text-center">
      <Users size={38} className="mx-auto mb-4 text-gray-500" />

      <h3 className="font-semibold">No posts yet</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
        {message}
      </p>
    </div>
  );
}
