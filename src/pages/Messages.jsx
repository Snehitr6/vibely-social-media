
import { useState } from "react";
import { Send, Search, MessageCircle } from "lucide-react";
import { useSocial } from "../context/SocialContext";
import { useAuth } from "../context/AuthContext";
import { users } from "../data/users";

export default function Messages() {
  const { messages, sendMessage } = useSocial();
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState(users?.[0] || null);
  const [messageText, setMessageText] = useState("");
  const [search, setSearch] = useState("");

  const currentUserId = user?.id || user?.email;
  const selectedUserId = selectedUser?.id || selectedUser?.email;

  const filteredUsers = (users || []).filter((person) =>
    person.name?.toLowerCase().includes(search.toLowerCase())
  );

  const conversation = messages.filter((message) => {
    return (
      (message.senderId === currentUserId &&
        message.receiverId === selectedUserId) ||
      (message.senderId === selectedUserId &&
        message.receiverId === currentUserId)
    );
  });

  const handleSend = (e) => {
    e.preventDefault();

    if (!messageText.trim() || !selectedUser) return;

    sendMessage({
      senderId: currentUserId,
      receiverId: selectedUserId,
      text: messageText.trim(),
    });

    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-[#0e1017] p-3 text-white sm:p-5">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-5 text-2xl font-bold">Messages</h1>

        <div className="grid h-[calc(100vh-150px)] min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#191c27] md:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col border-b border-white/10 md:border-b-0 md:border-r">
            <div className="border-b border-white/10 p-4">
              <h2 className="mb-4 font-semibold">Chats</h2>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search people..."
                  className="w-full rounded-xl border border-white/10 bg-[#252938] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-y-auto">
              {filteredUsers.map((person) => {
                const personId = person.id || person.email;

                return (
                  <button
                    key={personId}
                    onClick={() => setSelectedUser(person)}
                    className={`flex min-w-[180px] items-center gap-3 rounded-xl p-3 text-left transition md:min-w-0 ${
                      selectedUserId === personId
                        ? "bg-purple-600/20"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <img
                      src={person.avatar || "https://i.pravatar.cc/100"}
                      alt={person.name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-400">Start a conversation</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col">
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 border-b border-white/10 p-4">
                  <img
                    src={selectedUser.avatar || "https://i.pravatar.cc/100"}
                    alt={selectedUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-sm font-semibold">
                      {selectedUser.name}
                    </h2>
                    <p className="text-xs text-gray-400">Vibely member</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                  {conversation.length ? (
                    conversation.map((message) => {
                      const mine = message.senderId === currentUserId;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                              mine
                                ? "rounded-br-sm bg-purple-600 text-white"
                                : "rounded-bl-sm bg-[#252938] text-gray-200"
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="m-auto text-center">
                      <MessageCircle
                        size={35}
                        className="mx-auto mb-3 text-purple-400"
                      />
                      <p className="font-semibold">Start a conversation</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Send your first message to {selectedUser.name}.
                      </p>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex gap-2 border-t border-white/10 p-4"
                >
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message..."
                    className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#252938] px-4 py-3 text-sm outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white transition hover:bg-purple-500 disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="m-auto p-6 text-center text-gray-400">
                Select a person to start chatting.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
