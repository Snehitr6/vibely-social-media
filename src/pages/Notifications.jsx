
import { Bell, Heart, MessageCircle, UserPlus, CheckCheck } from "lucide-react";
import { useSocial } from "../context/SocialContext";

export default function Notifications() {
  const { notifications, markNotificationsRead } = useSocial();

  const getIcon = (type) => {
    if (type === "like") return <Heart size={17} />;
    if (type === "comment") return <MessageCircle size={17} />;
    return <UserPlus size={17} />;
  };

  return (
    <div className="min-h-screen bg-[#0e1017] px-4 py-7 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="mt-1 text-sm text-gray-400">
              Your latest activity on Vibely
            </p>
          </div>

          <button
            onClick={markNotificationsRead}
            disabled={!notifications.some((item) => !item.read)}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-purple-400 transition hover:bg-white/5 disabled:opacity-40"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#191c27]">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 border-b border-white/5 p-4 ${
                  !item.read ? "bg-purple-500/[0.06]" : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-purple-400">
                  {getIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-200">{item.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                {!item.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-purple-500" />
                )}
              </div>
            ))
          ) : (
            <div className="px-5 py-16 text-center">
              <Bell size={35} className="mx-auto mb-4 text-gray-500" />
              <h2 className="font-semibold">You're all caught up!</h2>
              <p className="mt-2 text-sm text-gray-400">
                New activity will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
