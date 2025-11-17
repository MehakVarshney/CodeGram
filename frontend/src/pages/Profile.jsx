import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [posts, setPosts] = useState([]);

  const USER_ID = "GuestUser123"; // mock user for now

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/post/user/${USER_ID}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Error loading profile posts:", error);
      }
    };

    fetchUserPosts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-4">My Profile</h2>

      <p className="text-center text-gray-600 mb-4">
        <strong>Total Posts:</strong> {posts.length}
      </p>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">You haven't posted anything yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="border rounded-lg shadow p-3 bg-white">
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <p className="mt-2 text-sm font-semibold">{post.caption}</p>
              <p className="text-xs text-gray-500">#{post.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
