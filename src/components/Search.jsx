// src/components/Search.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import citiesData from "../data/cities.json";
import FilterDropdown from "./FilterDropdown";
import CityCard from "./CityCard";
import SearchBar from "./SearchBar";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 进入页面时滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // 从 URL 中读取参数
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

  // 输入框：q=all 的时候输入框为空
  const [input, setInput] = useState(
    queryFromParams === "all" ? "" : queryFromParams
  );
  const [results, setResults] = useState([]);

  // 下拉筛选
  const [selectedRegions, setSelectedRegions] = useState(regionsFromParams);
  const [selectedTags, setSelectedTags] = useState(tagsFromParams);
  const [selectedSeasons, setSelectedSeasons] = useState(seasonsFromParams);

  // 选项列表从本地数据里自动算
  const allRegions = Array.from(new Set(citiesData.map((city) => city.region)));
  const allTags = Array.from(
    new Set(
      citiesData
        .flatMap((city) => city.tags || [])
        .filter(Boolean)
    )
  );
  const allSeasons = ["Spring", "Summer", "Autumn", "Winter"];

  // 收藏逻辑：沿用你之前的本地存储 favorites
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  const toggleFavorite = (id, e) => {
    if (e) {
      e.stopPropagation();
    }
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fid) => fid !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 把当前搜索条件写回 URL
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

  // 是否有激活的筛选
  const hasActiveFilters =
    queryFromParams !== "all" ||
    selectedRegions.length > 0 ||
    selectedTags.length > 0 ||
    selectedSeasons.length > 0;

  const activeFilterCount =
    (queryFromParams !== "all" ? 1 : 0) +
    selectedRegions.length +
    selectedTags.length +
    selectedSeasons.length;

  // 过滤城市列表（基于 q / region / tags / seasons）
  useEffect(() => {
    let filtered = citiesData;

    if (queryFromParams !== "all") {
      const q = queryFromParams.toLowerCase();
      filtered = filtered.filter((city) => {
        const name = city.name?.toLowerCase() || "";
        const country = city.country?.toLowerCase() || "";
        const summary = city.summary?.toLowerCase() || "";
        const tags = (city.tags || []).map((t) => t.toLowerCase());

        return (
          name.includes(q) ||
          country.includes(q) ||
          summary.includes(q) ||
          tags.some((t) => t.includes(q))
        );
      });
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter((city) =>
        selectedRegions.includes(city.region)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((city) =>
        (city.tags || []).some((t) => selectedTags.includes(t))
      );
    }

    if (selectedSeasons.length > 0) {
      filtered = filtered.filter((city) =>
        (city.bestSeasons || []).some((s) => selectedSeasons.includes(s))
      );
    }

    setResults(filtered);
  }, [queryFromParams, selectedRegions, selectedTags, selectedSeasons]);

  // 点击“Search”按钮
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

  // 清空所有条件
  const clearAll = () => {
    setInput("");
    setSelectedRegions([]);
    setSelectedTags([]);
    setSelectedSeasons([]);
    updateURLParams("", [], [], []);
  };

  // 控制“Filters”区域显示/隐藏
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className=" min-vh-100">
      <Container className="py-4">
        {/* 顶部标题区域 */}
        <div className="mb-4">
          <h1 className="fw-bold mb-2">Search Cities</h1>
          <p className="text-muted mb-0">
            Use search and filters to find destinations you are interested in.
          </p>
        </div>

        {/* 搜索栏 + Filters 按钮 */}
        <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch mb-3">
          <Form onSubmit={handleSearch} className="flex-grow-1">
            <SearchBar
              value={input}
              onChange={setInput}
              placeholder="Search by city, country, or tag..."
            />
          </Form>

          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              className="w-100 w-md-auto"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              Filters
              {activeFilterCount > 0 && (
                <Badge bg="primary" pill className="ms-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filters 面板 */}
        {showFilters && (
          <div className="bg-white border rounded-3 shadow-sm p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Filters</h5>
              {hasActiveFilters && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  onClick={clearAll}
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2">
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
        )}

        {/* 当前激活的筛选条件（小 Badge） */}
        {hasActiveFilters && (
          <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted small">Active filters:</span>

            {queryFromParams !== "all" && (
              <Badge bg="secondary" className="d-flex align-items-center gap-1">
                <span>Search: {queryFromParams}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-light"
                  onClick={() => {
                    setInput("");
                    updateURLParams("", selectedRegions, selectedTags, selectedSeasons);
                  }}
                >
                  ×
                </button>
              </Badge>
            )}

            {selectedRegions.map((r) => (
              <Badge
                key={r}
                bg="secondary"
                className="d-flex align-items-center gap-1"
              >
                <span>Region: {r}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-light"
                  onClick={() =>
                    handleRegionsChange(
                      selectedRegions.filter((item) => item !== r)
                    )
                  }
                >
                  ×
                </button>
              </Badge>
            ))}

            {selectedTags.map((t) => (
              <Badge
                key={t}
                bg="secondary"
                className="d-flex align-items-center gap-1"
              >
                <span>Tag: {t}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-light"
                  onClick={() =>
                    handleTagsChange(selectedTags.filter((item) => item !== t))
                  }
                >
                  ×
                </button>
              </Badge>
            ))}

            {selectedSeasons.map((s) => (
              <Badge
                key={s}
                bg="secondary"
                className="d-flex align-items-center gap-1"
              >
                <span>Season: {s}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-light"
                  onClick={() =>
                    handleSeasonsChange(
                      selectedSeasons.filter((item) => item !== s)
                    )
                  }
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* 结果数量 */}
        <div className="mb-3">
          <p className="text-muted mb-0">
            Showing {results.length} of {citiesData.length} destinations
          </p>
        </div>

        {/* 搜索结果 */}
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
                        search: searchParams.toString(),
                      })
                    }
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className="text-center text-muted mt-5">
            No results found. Try to change your search or filters.
          </p>
        )}
      </Container>
    </div>
  );
}
