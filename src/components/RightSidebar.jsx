
import { TrendingUp, Users, Sparkles } from "lucide-react";
import UserCard from "./UserCard";
import { users } from "../data/users";

export default function RightSidebar() {
  const trends = [
    {
      category: "Technology",
      tag: "#ArtificialIntelligence",
      posts: "12.5K posts",
    },
    {
      category: "Photography",
      tag: "#Photography",
      posts: "8.2K posts",
    },
    {
      category: "Lifestyle",
      tag: "#DailyInspiration",
      posts: "5.4K posts",
    },
    {
      category: "Travel",
      tag: "#ExploreTheWorld",
      posts: "3.8K posts",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/10 bg-[#191c27] p-5">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp size={19} className="text-purple-400" />
          <h2 className="font-semibold text-white">Trending topics</h2>
        </div>

        <div className="space-y-4">
          {trends.map((trend, index) => (
            <div key={trend.tag} className="group cursor-pointer">
              <p className="text-xs text-gray-500">
                {index + 1} · {trend.category}
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-200 transition group-hover:text-purple-400">
                {trend.tag}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {trend.posts}
              </p>
            </div>
          ))}
        </div>

        <button className="mt-5 text-sm font-medium text-purple-400 hover:text-purple-300">
          Explore more
        </button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#191c27] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users size={19} className="text-purple-400" />
          <h2 className="font-semibold text-white">Who to follow</h2>
        </div>

        <div className="space-y-4">
          {(users || []).slice(0, 4).map((person) => (
            <UserCard key={person.id} user={person} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 to-[#191c27] p-5">
        <Sparkles size={22} className="mb-3 text-purple-400" />

        <h3 className="font-semibold text-white">
          Make your space shine
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Share your moments, connect with people and discover something new
          every day.
        </p>
      </section>

      <p className="px-2 text-xs leading-6 text-gray-500">
        About · Privacy · Terms · Community Guidelines · © 2026 Vibely
      </p>
    </div>
  );
}
