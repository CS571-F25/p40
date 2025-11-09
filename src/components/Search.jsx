// src/components/Search.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Badge } from "react-bootstrap";
import citiesData from "../data/cities.json";
import FilterDropdown from "./FilterDropdown";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "all";

  const [input, setInput] = useState(query === "all" ? "" : query);
  const [results, setResults] = useState([]);

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);

  const allRegions = Array.from(new Set(citiesData.map((c) => c.region)));
  const allTags = Array.from(new Set(citiesData.flatMap((c) => c.tags)));
  const allSeasons = ["Spring", "Summer", "Autumn", "Winter"];

  // 🔹 新增收藏逻辑
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

  // 🔹 搜索过滤逻辑
  useEffect(() => {
    let filtered = citiesData;

    if (query !== "all") {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (city) =>
          city.name.toLowerCase().includes(q) ||
          city.country.toLowerCase().includes(q) ||
          city.summary.toLowerCase().includes(q) ||
          city.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter((city) => selectedRegions.includes(city.region));
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
  }, [query, selectedRegions, selectedTags, selectedSeasons]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    const target = trimmed === "" ? "all" : encodeURIComponent(trimmed);
    navigate(`/search?q=${target}`);
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
            onChange={setSelectedRegions}
          />
          <FilterDropdown
            title="Tag"
            options={allTags}
            selected={selectedTags}
            onChange={setSelectedTags}
          />
          <FilterDropdown
            title="Season"
            options={allSeasons}
            selected={selectedSeasons}
            onChange={setSelectedSeasons}
          />
        </div>
      </div>

      {/* 搜索结果区 */}
      <Container className="search-results">
        {results.length > 0 ? (
          <Row className="g-4">
            {results.map((city) => {
              const isFav = favorites.includes(city.id); // ✅ 判断是否收藏
              return (
                <Col key={city.id} xs={12} sm={6} md={4}>
                  <Card
                    className="city-card position-relative"
                    onClick={() => navigate(`/city/${city.id}`)}
                  >
                    {/* ❤️ 收藏按钮 */}
                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                      onClick={(e) => toggleFavorite(city.id, e)}
                      style={{
                        width: "44px",
                        height: "44px",
                        fontSize: "1.5rem",
                        color: isFav ? "red" : "#bbb",
                        border: "none",
                        zIndex: 10,
                      }}
                    >
                      {isFav ? "♥" : "♡"}
                    </Button>

                    <div className="card-img-wrapper">
                      <Card.Img
                        src={city.image}
                        alt={city.name}
                        className="city-img"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{city.name}</Card.Title>
                      <Card.Text className="summary">{city.summary}</Card.Text>
                      <div className="tags">
                        {city.tags.map((t) => (
                          <Badge key={t} bg="info" text="dark" className="me-1">
                            #{t}
                          </Badge>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
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
