
import { useSocial } from "../context/SocialContext";
import { useAuth } from "../context/AuthContext";
import { UserPlus, UserCheck } from "lucide-react";

export default function UserCard({ user: person }) {
  const { following, followUser } = useSocial();
  const { user: currentUser } = useAuth();

  if (!person) return null;

  const personId = person.id || person.email;
  const currentUserId = currentUser?.id || currentUser?.email;

  const isFollowing = following.includes(personId);
  const isCurrentUser = personId === currentUserId;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={person.avatar || "https://i.pravatar.cc/100"}
          alt={person.name || "User"}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white">
            {person.name || "Vibely User"}
          </h3>

          <p className="truncate text-xs text-gray-400">
            @{person.username || person.name?.toLowerCase().replace(/\s+/g, "") || "user"}
          </p>
        </div>
      </div>

      {!isCurrentUser && (
        <button
          onClick={() => followUser(personId)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
            isFollowing
              ? "border border-white/10 bg-white/5 text-gray-300 hover:border-red-500/40 hover:text-red-400"
              : "bg-purple-600 text-white hover:bg-purple-500"
          }`}
        >
          {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}
