import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend server
});

// Example API calls
export const createPost = (postData) => API.post("/post", postData);
export const getPosts = () => API.get("/post");

export default API;
