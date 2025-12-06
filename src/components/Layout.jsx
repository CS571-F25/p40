// src/components/Layout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function Layout() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const currentPath = location.pathname;

  const handleNavClick = () => setExpanded(false);

  // 读取 localStorage 里的 favorites 数量 + 监听更新
  useEffect(() => {
    const loadFavoritesCount = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavoritesCount(Array.isArray(stored) ? stored.length : 0);
      } catch {
        setFavoritesCount(0);
      }
    };

    loadFavoritesCount();

    // 1) 其他 tab 更新 localStorage 时
    const handleStorage = (e) => {
      if (!e.key || e.key === "favorites") {
        loadFavoritesCount();
      }
    };

    // 2) 当前页面里手动派发的 "favoritesUpdated" 事件（后面我会告诉你在哪加）
    const handleCustomUpdate = () => loadFavoritesCount();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("favoritesUpdated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("favoritesUpdated", handleCustomUpdate);
    };
  }, []);

  return (
    <>
      <Navbar
        bg="white"
        expand="lg"
        fixed="top"
        className="border-bottom"
        expanded={expanded}
        onToggle={(next) => setExpanded(next)}
        style={{
          padding: "0.5rem 0",
          letterSpacing: "0.2px",
        }}
      >
        <Container
          fluid
          className="px-4 d-flex justify-content-between align-items-center"
        >
          {/* Brand */}
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={handleNavClick}
            className="fw-bold d-flex align-items-center brand-logo"
            style={{ fontSize: "1.3rem" }}
          >
            <span className="brand-icon me-2">
              <span className="brand-icon-globe" aria-hidden="true">
                🌐
              </span>
            </span>
            <span className="brand-text">Global Explorer</span>
          </Navbar.Brand>

          {/* 折叠按钮 */}
          <Navbar.Toggle aria-controls="navbar-nav" />

          {/* 导航链接 */}
          <Navbar.Collapse
            id="navbar-nav"
            className="justify-content-end text-end"
          >
            <Nav>
              <Nav.Link
                as={Link}
                to="/"
                active={currentPath === "/"}
                onClick={handleNavClick}
                className="mx-2 nav-link-pill"
              >
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/search?q=all"
                active={currentPath.startsWith("/search")}
                onClick={handleNavClick}
                className="mx-2 nav-link-pill"
              >
                Explore
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/favorites"
                active={currentPath.startsWith("/favorites")}
                onClick={handleNavClick}
                className="mx-2 nav-link-pill favorites-link"
              >
                <span className="position-relative">
                  Favorites
                  {favoritesCount > 0 && (
                    <span className="favorites-count-badge">
                      {favoritesCount}
                    </span>
                  )}
                </span>
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/ai-search"
                active={currentPath.startsWith("/ai-search")}
                onClick={handleNavClick}
                className="mx-2 nav-link-pill"
              >
                Try AI Search
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/about"
                active={currentPath.startsWith("/about")}
                onClick={handleNavClick}
                className="mx-2 nav-link-pill"
              >
                About Us
              </Nav.Link>



            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 内容区 */}
      <div style={{ marginTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
}
