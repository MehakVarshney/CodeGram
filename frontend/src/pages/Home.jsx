import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/post");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

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
              {post.image && (
                <img
                  src={post.image}
                  alt={post.caption}
                  className="rounded-lg mb-3 w-full h-56 object-cover"
                />
              )}
              <h3 className="text-lg font-semibold">{post.caption}</h3>
              <p className="text-sm text-gray-500 mt-1">#{post.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
