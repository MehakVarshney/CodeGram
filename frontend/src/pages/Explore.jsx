// src/pages/Explore.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/post");
        setPosts(res.data);
      } catch (error) {
        console.error("❌ Error fetching posts:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading posts...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Explore Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
  <div
    key={post._id}
    className="border rounded-xl shadow-md hover:shadow-lg p-4 transition relative"
  >
    {post.image && (
      <img
        src={post.image}
        alt="Post"
        className="w-full h-48 object-cover rounded-lg mb-3"
      />
    )}
    <h3 className="font-semibold">{post.caption}</h3>
    <p className="text-sm text-gray-500 mt-1">#{post.category}</p>
    <p className="text-xs text-gray-400 mt-1">
      {new Date(post.createdAt).toLocaleString()}
    </p>

    <button
      onClick={async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
          try {
            await axios.delete(`http://localhost:5000/api/post/${post._id}`);
            alert("✅ Post deleted successfully");
            setPosts(posts.filter((p) => p._id !== post._id));
          } catch (error) {
            alert("❌ Failed to delete post");
            console.error("Delete error:", error);
          }
        }
      }}
      className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
    >
      Delete
    </button>
  </div>
))}

        </div>
      )}
    </div>
  );
}

export default Explore;
