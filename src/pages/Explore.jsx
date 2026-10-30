import { useState } from "react";
import { Search, TrendingUp, Hash } from "lucide-react";
import { useSocial } from "../context/SocialContext";
import PostCard from "../components/PostCard";
import { users } from "../data/users";

export default function Explore() {
  const [search, setSearch] = useState("");
  const { posts } = useSocial();

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase();

    return (
      (post.content || "").toLowerCase().includes(query) ||
      (post.user?.name || "").toLowerCase().includes(query)
    );
  });

  const popularTags = [
    "#Vibely",
    "#Photography",
    "#Travel",
    "#Lifestyle",
    "#Technology",
    "#Design",
  ];

  return (
    <div className="min-h-screen w-full bg-[#0e1017] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-purple-400">
            DISCOVER SOMETHING NEW
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">Explore</h1>

          <p className="mt-2 text-sm text-gray-400">
            Discover people, posts and communities.
          </p>
        </div>

        <div className="relative mb-8">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts and people..."
            className="w-full rounded-2xl border border-white/10 bg-[#191c27] py-4 pl-12 pr-4 text-sm text-white outline-none transition focus:border-purple-500"
          />
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold">Trending topics</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearch(tag.replace("#", ""))}
                className="rounded-full border border-white/10 bg-[#191c27] px-4 py-2 text-sm text-gray-300 transition hover:border-purple-500 hover:text-purple-400"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">People to discover</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(users || []).slice(0, 6).map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#191c27] p-4"
              >
                <img
                  src={person.avatar || "https://i.pravatar.cc/100"}
                  alt={person.name}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {person.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    @{person.username || person.name?.toLowerCase().replace(/\s/g, "")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Hash size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold">Discover posts</h2>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-5">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#191c27] px-4 py-12 text-center">
              <Search size={32} className="mx-auto mb-3 text-gray-500" />
              <h3 className="font-semibold">No posts found</h3>
              <p className="mt-1 text-sm text-gray-400">
                Try another search or create a new post.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}