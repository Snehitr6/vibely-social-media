
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SocialContext = createContext(null);

// DEMO USERS
const demoUsers = [
  { id: "demo-1", name: "Sophia Wilson", username: "sophiaw", email: "sophia@demo.com", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: "demo-2", name: "Daniel Smith", username: "danielsmith", email: "daniel@demo.com", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "demo-3", name: "Olivia Martin", username: "oliviam", email: "olivia@demo.com", avatar: "https://i.pravatar.cc/150?img=44" },
  { id: "demo-4", name: "James Wilson", username: "jamesw", email: "james@demo.com", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: "demo-5", name: "Emma Taylor", username: "emmat", email: "emma@demo.com", avatar: "https://i.pravatar.cc/150?img=45" },
  { id: "demo-6", name: "Noah Anderson", username: "noaha", email: "noah@demo.com", avatar: "https://i.pravatar.cc/150?img=13" },
  { id: "demo-7", name: "Ava Johnson", username: "avaj", email: "ava@demo.com", avatar: "https://i.pravatar.cc/150?img=32" },
  { id: "demo-8", name: "Liam Brown", username: "liamb", email: "liam@demo.com", avatar: "https://i.pravatar.cc/150?img=14" },
  { id: "demo-9", name: "Mia Davis", username: "miad", email: "mia@demo.com", avatar: "https://i.pravatar.cc/150?img=49" },
  { id: "demo-10", name: "Ethan Clark", username: "ethanc", email: "ethan@demo.com", avatar: "https://i.pravatar.cc/150?img=15" },
];

// DEMO POSTS
const demoPosts = [
  {
    id: 1001,
    user: demoUsers[0],
    content: "Golden hour, good coffee and a little time for myself. Sometimes the simplest moments are the best ones. ✨☕",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200",
    likes: ["demo-2", "demo-3", "demo-4", "demo-5"],
    comments: [
      { id: 1, text: "Such a beautiful vibe!", user: demoUsers[1] },
      { id: 2, text: "Love this place!", user: demoUsers[2] },
    ],
    savedBy: [],
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 1002,
    user: demoUsers[1],
    content: "Weekend adventures 🌿 Exploring new places, meeting new people and making memories.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    likes: ["demo-1", "demo-3", "demo-5"],
    comments: [{ id: 3, text: "Amazing view!", user: demoUsers[0] }],
    savedBy: [],
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 1003,
    user: demoUsers[2],
    content: "A little reminder to slow down, breathe and enjoy the beautiful things around you. 🌸",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200",
    likes: ["demo-1", "demo-2", "demo-5", "demo-6"],
    comments: [],
    savedBy: [],
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 1004,
    user: demoUsers[3],
    content: "City lights and late night drives. 🌃",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200",
    likes: ["demo-1", "demo-5"],
    comments: [],
    savedBy: [],
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 1005,
    user: demoUsers[4],
    content: "Little moments, big memories. Weekend well spent! ❤️",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
    likes: ["demo-1", "demo-2", "demo-3", "demo-7"],
    comments: [],
    savedBy: [],
    createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),
  },
  {
    id: 1006,
    user: demoUsers[5],
    content: "Chasing mountains and collecting unforgettable views. 🏔️",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    likes: ["demo-2", "demo-4", "demo-8"],
    comments: [],
    savedBy: [],
    createdAt: new Date(Date.now() - 9 * 3600000).toISOString(),
  },
  {
    id: 1007,
    user: demoUsers[6],
    content: "Sunday brunch is always a good idea. Good food, better company! 🥑",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200",
    likes: ["demo-1", "demo-3", "demo-5"],
    comments: [],
    savedBy: [],
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: 1008,
    user: demoUsers[7],
    content: "Finding beauty in the little details. Keep creating, keep exploring. 📸",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200",
    likes: ["demo-2", "demo-6", "demo-9"],
    comments: [],
    savedBy: [],
    createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
  },
  {
    id: 1009,
    user: demoUsers[8],
    content: "Ocean air, sunshine and absolutely no plans. This is happiness. 🌊",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    likes: ["demo-1", "demo-4", "demo-7", "demo-10"],
    comments: [],
    savedBy: [],
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
];

// DEMO STORIES
const storyImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900",
];

const storyCaptions = [
  "A beautiful day outdoors ✨",
  "Morning views 🌄",
  "Ocean state of mind 🌊",
  "Nature is the best therapy 🌿",
  "Making memories ❤️",
  "Mountain mood 🏔️",
  "Brunch time 🥑",
  "Night vibes 🌃",
  "Vitamin sea 🌊",
  "Into the wild 🌲",
];

const demoStories = demoUsers.map((person, index) => ({
  id: 2001 + index,
  user: person,
  image: storyImages[index],
  caption: storyCaptions[index],
  createdAt: Date.now() - index * 20 * 60000,
  viewedBy: [],
}));

// LOCAL STORAGE HELPERS
function readStorage(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

// ADD MISSING DEMO DATA WITHOUT REMOVING USER DATA
function loadCollection(key, demoData) {
  const existing = readStorage(key, null);

  if (!Array.isArray(existing)) {
    return demoData;
  }

  const existingIds = new Set(
    existing.map((item) => String(item.id))
  );

  const missingItems = demoData.filter(
    (item) => !existingIds.has(String(item.id))
  );

  return [...existing, ...missingItems];
}

export function SocialProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    loadCollection("vibelyPosts", demoPosts)
  );

  const [stories, setStories] = useState(() =>
    loadCollection("vibelyStories", demoStories).filter(
      (story) => Date.now() - story.createdAt < 86400000
    )
  );

  const [following, setFollowing] = useState(() =>
    readStorage("vibelyFollowing")
  );

  const [messages, setMessages] = useState(() =>
    readStorage("vibelyMessages")
  );

  const [notifications, setNotifications] = useState(() =>
    readStorage("vibelyNotifications")
  );

  useEffect(() => {
    localStorage.setItem("vibelyPosts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("vibelyStories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem("vibelyFollowing", JSON.stringify(following));
  }, [following]);

  useEffect(() => {
    localStorage.setItem("vibelyMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("vibelyNotifications", JSON.stringify(notifications));
  }, [notifications]);

  const getCurrentUser = () =>
    readStorage("vibelyUser", null);

  const addNotification = (type, message, postId = null) => {
    setNotifications((prev) => [
      {
        id: Date.now() + Math.random(),
        type,
        message,
        postId,
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const createPost = (postData) => {
    const newPost = {
      id: Date.now(),
      user: getCurrentUser(),
      content: postData.content || "",
      image: postData.image || "",
      likes: [],
      comments: [],
      savedBy: [],
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const editPost = (postId, updatedData) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              ...updatedData,
              updatedAt: new Date().toISOString(),
            }
          : post
      )
    );
  };

  const deletePost = (postId) => {
    setPosts((prev) =>
      prev.filter((post) => post.id !== postId)
    );
  };

  const likePost = (postId, userId) => {
    if (!userId) return;

    const target = posts.find((post) => post.id === postId);
    const alreadyLiked = target?.likes?.includes(userId);

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: alreadyLiked
                ? (post.likes || []).filter((id) => id !== userId)
                : [...(post.likes || []), userId],
            }
          : post
      )
    );

    if (!alreadyLiked) {
      addNotification("like", "Someone liked a post.", postId);
    }
  };

  const addComment = (postId, comment) => {
    const newComment = {
      id: Date.now(),
      text: comment,
      user: getCurrentUser(),
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
            }
          : post
      )
    );

    addNotification("comment", "Someone commented on a post.", postId);
  };

  const deleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).filter(
                (item) => item.id !== commentId
              ),
            }
          : post
      )
    );
  };

  const savePost = (postId, userId) => {
    if (!userId) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const savedBy = post.savedBy || [];

        return {
          ...post,
          savedBy: savedBy.includes(userId)
            ? savedBy.filter((id) => id !== userId)
            : [...savedBy, userId],
        };
      })
    );
  };

  const followUser = (userId) => {
    if (!userId) return;

    const isFollowing = following.includes(userId);

    setFollowing((prev) =>
      isFollowing
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );

    if (!isFollowing) {
      addNotification("follow", "Someone started following you.");
    }
  };

  const createStory = (storyData) => {
    const newStory = {
      id: Date.now(),
      user: getCurrentUser(),
      image: storyData.image,
      caption: storyData.caption || "",
      createdAt: Date.now(),
      viewedBy: [],
    };

    setStories((prev) => [newStory, ...prev]);
    return newStory;
  };

  const deleteStory = (storyId) => {
    setStories((prev) =>
      prev.filter((story) => story.id !== storyId)
    );
  };

  const viewStory = (storyId, viewerId) => {
    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId
          ? {
              ...story,
              viewedBy: [
                ...new Set([...(story.viewedBy || []), viewerId]),
              ],
            }
          : story
      )
    );
  };

  const sendMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...message,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true }))
    );
  };

  return (
    <SocialContext.Provider
      value={{
        posts,
        setPosts,
        stories,
        following,
        messages,
        notifications,
        createPost,
        editPost,
        deletePost,
        likePost,
        addComment,
        deleteComment,
        savePost,
        followUser,
        createStory,
        deleteStory,
        viewStory,
        sendMessage,
        markNotificationsRead,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);

  if (!context) {
    throw new Error("useSocial must be used inside SocialProvider");
  }

  return context;
}
