import { useEffect, useState } from "react";
import blogs from "../data/blogs.json";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(blogs);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">Latest Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-4 group"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-2">By {post.author} • {new Date(post.date).toDateString()}</p>
            <p className="text-gray-600">{post.excerpt}</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
