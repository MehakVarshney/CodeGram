import React, { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [formData, setFormData] = useState({
    caption: "",
    category: "leetcode",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("caption", formData.caption);
      data.append("category", formData.category);
      if (formData.image) {
        // must be exactly 'image' to match upload.single("image")
        data.append("image", formData.image);
      }
      data.append("user", "GuestUser123");

      console.log("🟢 Sending FormData:", {
        caption: formData.caption,
        category: formData.category,
        image: formData.image ? formData.image.name : null,
      });

      const res = await axios.post("http://localhost:5000/api/post/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Post created successfully!");
      console.log(res.data);
    } catch (error) {
      console.error("❌ Failed to create post:", error.response?.data || error.message);
      alert("❌ Failed to create post: " + (error.response?.data?.message || error.message));
    }
  };


  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Caption"
          className="border p-2 rounded"
          value={formData.caption}
          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="leetcode">Leetcode</option>
          <option value="achievement">Achievement</option>
          <option value="meme">Meme</option>
          <option value="daily-question">Daily Question</option>
        </select>

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
        />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
