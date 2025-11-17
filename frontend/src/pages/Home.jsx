// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const CURRENT_USER_ID = "sampleUser123"; // replace with real id when available

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loadingLike, setLoadingLike] = useState({}); // { [postId]: boolean }

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/post`);
      console.log("Fetched posts:", res.data);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId) => {
    // prevent double clicks
    if (loadingLike[postId]) return;

    setLoadingLike((s) => ({ ...s, [postId]: true }));
    try {
      const res = await axios.put(`${API_BASE}/post/${postId}/like`, {
        userId: CURRENT_USER_ID,
      });

      // Log response to inspect its shape
      console.log("Like response for", postId, res.data);

      // res.data.likedBy should be an array of userIds
      const likedBy = Array.isArray(res.data.likedBy) ? res.data.likedBy : [];

      // Update posts state using the returned likedBy array
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: likedBy } : p))
      );
    } catch (err) {
      console.error("Error liking post:", err.response?.data || err.message);
      // fallback: refresh from server
      await fetchPosts();
    } finally {
      setLoadingLike((s) => ({ ...s, [postId]: false }));
    }
  };

  const isLikedByCurrentUser = (post) => {
    const likes = post.likes || [];
    return likes.includes(CURRENT_USER_ID);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Explore Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-xl shadow p-4 flex flex-col items-center bg-white"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.caption}
                  className="rounded-lg mb-3 w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 flex items-center justify-center bg-gray-100 rounded-lg mb-3">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              <h3 className="text-lg font-semibold">{post.caption}</h3>
              <p className="text-sm text-gray-500 mt-1">#{post.category}</p>

              <button
                className={`mt-3 px-3 py-1 rounded flex items-center gap-2 ${isLikedByCurrentUser(post)
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-800"
                  }`}
                onClick={() => handleLike(post._id)}
                disabled={!!loadingLike[post._id]}
              >
                {isLikedByCurrentUser(post) ? "💖 Liked" : "🤍 Like"} (
                {post.likes ? post.likes.length : 0})
              </button>

              <button
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to delete this post?")) return;

                  try {
                    await axios.delete(`http://localhost:5000/api/post/${post._id}`);
                    // remove it from UI
                    setPosts((prev) => prev.filter((p) => p._id !== post._id));
                    alert("🗑️ Post deleted!");
                  } catch (error) {
                    console.error("Delete error:", error);
                    alert("Failed to delete post");
                  }
                }}
              >
                Delete Post
              </button>

              {/* Comments List */}
              <div className="mt-3 w-full">
                {post.comments?.map((c, idx) => (
                  <p key={idx} className="text-sm text-gray-700 border-b py-1">
                    <strong>{c.user}: </strong> {c.text}
                  </p>
                ))}
              </div>

              {/* Add New Comment */}
              <div className="mt-2 flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="border p-1 flex-1 rounded"
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      try {
                        const res = await axios.post(
                          `http://localhost:5000/api/post/${post._id}/comment`,
                          { text: e.target.value, user: "GuestUser" }
                        );

                        // Update UI
                        setPosts((prev) =>
                          prev.map((p) => (p._id === post._id ? res.data : p))
                        );

                        e.target.value = "";
                      } catch (error) {
                        console.error("Comment error:", error);
                      }
                    }
                  }}
                />
              </div>


            </div>
          ))}
        </div>
      )}
    </div>
  );
}
