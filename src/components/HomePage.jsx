import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActive] = useState("All");
  const [searchTerm, setSearch] = useState("");
  const [darkMode, setDark] = useState(true);

  const categories = [
    "All",
    "Business",
    "Entertainment",
    "General",
    "Health",
    "Science",
    "Sports",
    "Technology",
    "Finance",
  ];

  const API_KEY = "b09700dc282b45fb8518d09e864145c1";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const queryParam = activeCategory === "All" ? "Nepal" : activeCategory;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          queryParam
        )}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "ok" && data.articles.length > 0) {
          // Format articles
          let formattedArticles = data.articles.map((article, index) => ({
            id: index + 1,
            title: article.title || "No title available",
            excerpt: article.description || "No description available",
            category: activeCategory === "All" ? "General" : activeCategory,
            author: article.author || "Unknown author",
            timestamp: article.publishedAt
              ? new Date(article.publishedAt).toLocaleString()
              : "Unknown time",
            image:
              article.urlToImage ||
              "https://via.placeholder.com/400x250?text=No+Image+Available",
            url: article.url || "#",
          }));

          // Remove duplicates by title + excerpt
formattedArticles = formattedArticles.filter(
  (article, index, self) =>
    index ===
    self.findIndex(
      a => a.title === article.title && a.excerpt === article.excerpt
    )
);

          setArticles(formattedArticles);
        } else {
          setArticles([]);
          console.warn("No articles found or API error:", data.message || "");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setArticles([]);
      }
    };

    fetchNews();
  }, [activeCategory]);

  // Remove duplicates again before filtering (extra safety)
  const uniqueArticles = articles.filter(
    (article, index, self) =>
      index === self.findIndex((a) => a.url === article.url)
  );

  // Apply search filter
  const filtered = uniqueArticles.filter((a) => {
    const bySearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return bySearch;
  });

  const ArticleCard = ({ article }) => {
    const [hover, setHover] = useState(false);

    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <article
          className={`article-card ${hover ? "hovered" : ""}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            src={article.image}
            alt={article.title}
            className="article-image"
            style={{ objectFit: "cover" }}
          />
          <div className="article-content">
            <div className="article-meta">
              <span className="category-tag">{article.category}</span>
              <span>{article.timestamp}</span>
            </div>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta">
              <span className="author">By {article.author}</span>
            </div>
          </div>
        </article>
      </a>
    );
  };

  return (
    <div className={`news-container ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <nav className="nav">
          <div className="logo">NEWSLY</div>
          <div className="nav-controls">
            <Link to="/fake-news-detection" className="detect-fake-btn">
              Detect Fake News
            </Link>
            <input
              type="text"
              placeholder="Search news…"
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button
              className="theme-toggle"
              onClick={() => setDark(!darkMode)}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </header>

      <nav className="category-nav">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`category-button ${
              activeCategory === cat ? "active" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <main className="main">
        <div className="articles-grid">
          {filtered.length > 0 ? (
            filtered.map((article) => (
              <ArticleCard key={article.url} article={article} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No articles found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
