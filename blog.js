import blogPosts from "./posts.js";

document.addEventListener("DOMContentLoaded", function () {
    const blogId = parseInt(localStorage.getItem("selectedPost"), 10);  // Convert back to number
    const blogContentDiv = document.getElementById("blog-content");

    const post = blogPosts.find(p => p.id === blogId);
    if (post) {
        blogContentDiv.innerHTML = `
            <h1>${post.title}</h1>
            <p><em>${post.date} - ${post.readTime}</em></p>
            <img src="${post.coverImage}" alt="Cover Image" style="width:100%; border-radius:10px;">
            <p>${post.content}</p>
        `;
    } else {
        blogContentDiv.innerHTML = "<p>Blog post not found.</p>";
    }
});
