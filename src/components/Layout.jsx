// src/components/Layout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const currentPath = location.pathname;

  const handleNavClick = () => setExpanded(false);

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
          {/* Brand靠左 */}
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={handleNavClick}
          className="fw-bold d-flex align-items-center brand-logo"
          style={{ fontSize: "1.3rem" }}
        >
          {/* 左边圆形图标 */}
          <span className="brand-icon me-2">
            <span className="brand-icon-globe" aria-hidden="true">
              🌐
            </span>
          </span>

  {/* 渐变蓝色文字 */}
  <span className="brand-text">Global Explorer</span>
</Navbar.Brand>


          {/* 折叠按钮 */}
          <Navbar.Toggle aria-controls="navbar-nav" />

          {/* 导航靠右 */}
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
                className="mx-3"
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/search?q=all"
                active={currentPath.startsWith("/search")}
                onClick={handleNavClick}
                className="mx-3"
              >
                Explore
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/favorites"
                active={currentPath.startsWith("/favorites")}
                onClick={handleNavClick}
                className="mx-3"
              >
                Favorites
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/ai-search"
                active={currentPath.startsWith("/ai-search")}
                onClick={handleNavClick}
                className="mx-3"
              >
                Try AI Search
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
