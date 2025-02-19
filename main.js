// Ensure `posts.js` is loaded before this script in `index.html`

import blogPosts from './posts.js'
// DOM Elements
const postsGrid = document.querySelector('.posts-grid');
const searchBar = document.querySelector('.search-bar');
const tags = document.querySelectorAll('.tag');
const header = document.querySelector('header');

// Function to load blog posts dynamically
function loadPosts() {
    postsGrid.innerHTML = blogPosts.map(post => `
        <article class="post" data-id="${post.id}">
            <div class="post-cover" style="background-image: url('${post.coverImage}')"></div>
            <div class="post-content-wrapper">
                <h2 class="post-title">${post.title}</h2>
                <div class="post-meta">
                    <span>${post.date}</span>
                    <span>${post.readTime}</span>
                </div>
                <div class="post-content">
                    <p>${post.content.substring(0, 100)}...</p>
                </div>
                <a href="#" class="read-more">Read More →</a>
            </div>
        </article>
    `).join('');

    // Attach event listener to each blog post
    document.querySelectorAll(".post").forEach(post => {
        post.addEventListener("click", function (event) {
            event.preventDefault();  // Prevents the default behavior
            const postId = this.getAttribute("data-id");
            openBlog(postId);
        });
    });
}

// Function to open a blog post
function openBlog(id) {
    localStorage.setItem("selectedPost", id); // Store ID in localStorage
    document.body.classList.add("fade-out");  // Apply animation effect
    setTimeout(() => {
        window.location.href = "blog.html";  // Navigate to blog page
    }, 500);
}

// Function to handle search functionality with debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const handleSearch = debounce((searchTerm) => {
    const filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm)
    );
    loadFilteredPosts(filteredPosts);
}, 300);

// Function to load filtered posts
function loadFilteredPosts(posts) {
    postsGrid.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.setAttribute('data-id', post.id);

        postElement.innerHTML = `
            <div class="post-cover" style="background-image: url('${post.coverImage}')"></div>
            <div class="post-content-wrapper">
                <h2 class="post-title">${post.title}</h2>
                <div class="post-meta">
                    <span>${post.date}</span>
                    <span>${post.readTime}</span>
                </div>
                <div class="post-content">
                    <p>${post.content.substring(0, 100)}...</p>
                </div>
                <a href="#" class="read-more">Read More →</a>
            </div>
        `;

        // Attach click event listener
        postElement.addEventListener("click", function (event) {
            event.preventDefault();
            openBlog(post.id);
        });

        postsGrid.appendChild(postElement);
    });
}

// Add event listener for search
searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    handleSearch(searchTerm);
});

// Add event listeners for tag filtering
tags.forEach(tag => {
    tag.addEventListener("click", () => {
        tags.forEach(t => t.classList.remove("active"));
        tag.classList.add("active");

        const selectedTag = tag.textContent;
        const filteredPosts = selectedTag === "All" 
            ? blogPosts 
            : blogPosts.filter(post => post.tags.includes(selectedTag));

        loadFilteredPosts(filteredPosts);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: "smooth"
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0)";
    }

    if (currentScroll > 100) {
        header.style.background = "rgba(0, 0, 0, 0.9)";
    } else {
        header.style.background = "rgba(0, 0, 0, 0.8)";
    }

    lastScroll = currentScroll;
});

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
});
