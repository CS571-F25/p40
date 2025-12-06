import { HashRouter, Routes, Route } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import Layout from "./Layout";
import Home from "./Home";
import Search from "./Search";
import Favorites from "./Favorites";
import CityDetail from "./CityDetail";
import AISearch from "./AISearch";
import AboutMe from "./AboutMe";


export default function GlobalExplorerRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* index 表示默认子路由（即 /） */}
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="city/:id" element={<CityDetail />} />
          <Route path="/ai-search" element={<AISearch />} />
          <Route path="about" element={<AboutMe />} />
          <Route path="*" element={<h2 className="text-center mt-5">404: Page Not Found</h2>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
