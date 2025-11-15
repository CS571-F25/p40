// src/components/Search.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import citiesData from "../data/cities.json";
import FilterDropdown from "./FilterDropdown";
import CityCard from "./CityCard";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",   // 如果不想要动画，可以改成 "auto"
    });
  }, []);

  // 从 URL 读出当前的 query 和 filters
  const queryFromParams = searchParams.get("q") || "all";
  const regionsFromParams = (searchParams.get("regions") || "")
    .split(",")
    .filter(Boolean);
  const tagsFromParams = (searchParams.get("tags") || "")
    .split(",")
    .filter(Boolean);
  const seasonsFromParams = (searchParams.get("seasons") || "")
    .split(",")
    .filter(Boolean);

  // 输入框文本：如果是 all 就显示空
  const [input, setInput] = useState(
    queryFromParams === "all" ? "" : queryFromParams
  );
  const [results, setResults] = useState([]);

  // filters 的 state：初始值来自 URL
  const [selectedRegions, setSelectedRegions] = useState(regionsFromParams);
  const [selectedTags, setSelectedTags] = useState(tagsFromParams);
  const [selectedSeasons, setSelectedSeasons] = useState(seasonsFromParams);

  const allRegions = Array.from(new Set(citiesData.map((c) => c.region)));
  const allTags = Array.from(new Set(citiesData.flatMap((c) => c.tags)));
  const allSeasons = ["Spring", "Summer", "Autumn", "Winter"];

  // 🔹 收藏逻辑
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation(); // 阻止点击卡片跳转
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fid) => fid !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 🔧 工具函数：把当前 query + filters 同步到 URL
  const updateURLParams = (nextQuery, regions, tags, seasons) => {
    const params = new URLSearchParams();

    const trimmed = (nextQuery || "").trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.set("q", "all");
    }

    if (regions.length > 0) {
      params.set("regions", regions.join(","));
    }
    if (tags.length > 0) {
      params.set("tags", tags.join(","));
    }
    if (seasons.length > 0) {
      params.set("seasons", seasons.join(","));
    }

    setSearchParams(params);
  };

  // 🔹 搜索过滤逻辑（queryFromParams 总是跟 URL 当前一致）
  useEffect(() => {
    let filtered = citiesData;

    if (queryFromParams !== "all") {
      const q = queryFromParams.toLowerCase();
      filtered = filtered.filter(
        (city) =>
          city.name.toLowerCase().includes(q) ||
          city.country.toLowerCase().includes(q) ||
          city.summary.toLowerCase().includes(q) ||
          city.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter((city) =>
        selectedRegions.includes(city.region)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((city) =>
        city.tags.some((t) => selectedTags.includes(t))
      );
    }

    if (selectedSeasons.length > 0) {
      filtered = filtered.filter((city) =>
        city.bestSeasons.some((s) => selectedSeasons.includes(s))
      );
    }

    setResults(filtered);
  }, [queryFromParams, selectedRegions, selectedTags, selectedSeasons]);

  // 提交搜索按钮
  const handleSearch = (e) => {
    e.preventDefault();
    updateURLParams(input, selectedRegions, selectedTags, selectedSeasons);
  };

  // Filter 变化时，同时更新 state + URL
  const handleRegionsChange = (newRegions) => {
    setSelectedRegions(newRegions);
    updateURLParams(input, newRegions, selectedTags, selectedSeasons);
  };

  const handleTagsChange = (newTags) => {
    setSelectedTags(newTags);
    updateURLParams(input, selectedRegions, newTags, selectedSeasons);
  };

  const handleSeasonsChange = (newSeasons) => {
    setSelectedSeasons(newSeasons);
    updateURLParams(input, selectedRegions, selectedTags, newSeasons);
  };

  return (
    <div className="search-page">
      {/* 固定上部区域 */}
      <div className="search-header">
        <Form onSubmit={handleSearch} className="search-form">
          <Form.Control
            type="text"
            placeholder="Search cities, countries, or tags..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="search-input"
            aria-label="Search cities, countries, or tags"
          />
          <Button type="submit" variant="primary" className="ms-2">
            Search
          </Button>
        </Form>

        {/* Filter 区域 */}
        <div className="filter-bar">
          <FilterDropdown
            title="Region"
            options={allRegions}
            selected={selectedRegions}
            onChange={handleRegionsChange}
          />
          <FilterDropdown
            title="Tag"
            options={allTags}
            selected={selectedTags}
            onChange={handleTagsChange}
          />
          <FilterDropdown
            title="Season"
            options={allSeasons}
            selected={selectedSeasons}
            onChange={handleSeasonsChange}
          />
        </div>
      </div>

      {/* 搜索结果区 */}
      <Container className="search-results">
        {results.length > 0 ? (
          <Row className="g-4">
            {results.map((city) => {
              const isFav = favorites.includes(city.id);
              return (
                <Col key={city.id} xs={12} sm={6} md={4}>
                  <CityCard
                    city={city}
                    isFavorite={isFav}
                    onToggleFavorite={toggleFavorite}
                    onClick={() =>
                      navigate({
                        pathname: `/city/${city.id}`,
                        search: searchParams.toString(), // 带上 q + regions + tags + seasons
                      })
                    }
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className="text-center text-muted mt-5">No results found 😢</p>
        )}
      </Container>
    </div>
  );
}
