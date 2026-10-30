
import { useSocial } from "../context/SocialContext";
import StorySection from "../components/StorySection";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import RightSidebar from "../components/RightSidebar";

export default function Home() {
  const { posts } = useSocial();

  return (
    <div className="min-h-screen w-full bg-[#0e1017] px-3 py-5 text-white sm:px-5 xl:px-7">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">

        {/* Main Feed */}
        <main className="min-w-0 space-y-6">
          <StorySection />

          <CreatePost />

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Your Feed</h1>
                <p className="mt-1 text-sm text-gray-400">
                  See what's happening in your community.
                </p>
              </div>

              <span className="rounded-full bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400">
                {posts.length} posts
              </span>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#191c27] px-5 py-16 text-center">
                <h3 className="text-lg font-semibold">
                  Your feed is empty
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Create your first post and share something with your community.
                </p>
              </div>
            )}
          </section>
        </main>

        {/* Fixed Right Sidebar */}
        <aside className="hidden min-w-0 xl:block">
          <div className="fixed right-6 top-[96px] z-30 h-[calc(100vh-112px)] w-[300px] overflow-y-auto overscroll-contain">
            <RightSidebar />
          </div>
        </aside>

        {/* Mobile Right Sidebar */}
        <div className="xl:hidden">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
