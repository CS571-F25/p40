// src/components/AISearch.jsx

import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Form,
  Button,
  Spinner,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import citiesData from "../data/cities.json";
import CityCard from "./CityCard";

// ----- 数据常量：从城市数据中抽出可用的 filters -----
const allRegions = Array.from(new Set(citiesData.map((c) => c.region)));
const allTags = Array.from(
  new Set(citiesData.flatMap((c) => c.tags || []).filter(Boolean))
);
const allSeasons = ["Spring", "Summer", "Autumn", "Winter"];

const CS571_COMPLETIONS_ENDPOINT =
  "https://cs571api.cs.wisc.edu/rest/f25/hw11/completions";

const AI_SEARCH_STORAGE_KEY = "aiSearchFilters_v1";

// 从 AI 文本里尽量抽出 JSON
function extractJsonFromText(text) {
  if (!text) throw new Error("Empty AI response");
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response did not contain JSON.");
    return JSON.parse(match[0]);
  }
}

export default function AISearch() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [aiRegions, setAiRegions] = useState([]);
  const [aiTags, setAiTags] = useState([]);
  const [aiSeasons, setAiSeasons] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const hasFilters =
    aiRegions.length > 0 || aiTags.length > 0 || aiSeasons.length > 0;

  // 示例 prompt 小按钮
  const examplePrompts = [
    "A romantic city in Europe with great food and museums",
    "Quiet coastal town with beaches and nature walks",
    "Modern city with nightlife, tech, and good public transit",
    "Cool weather, mountain views, and hot springs",
  ];

  // ---- 首次挂载：读 favorites 和 上次 AI 搜索状态 ----
  useEffect(() => {
    try {
      const storedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(Array.isArray(storedFavs) ? storedFavs : []);
    } catch {
      setFavorites([]);
    }

    try {
      const saved = JSON.parse(localStorage.getItem(AI_SEARCH_STORAGE_KEY));
      if (saved && typeof saved === "object") {
        if (typeof saved.description === "string") {
          setDescription(saved.description);
        }
        if (Array.isArray(saved.regions)) {
          setAiRegions(saved.regions.filter((r) => allRegions.includes(r)));
        }
        if (Array.isArray(saved.tags)) {
          setAiTags(saved.tags.filter((t) => allTags.includes(t)));
        }
        if (Array.isArray(saved.seasons)) {
          setAiSeasons(saved.seasons.filter((s) => allSeasons.includes(s)));
        }
        if (
          (saved.regions && saved.regions.length) ||
          (saved.tags && saved.tags.length) ||
          (saved.seasons && saved.seasons.length)
        ) {
          setHasSearched(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // ---- 持久化当前搜索状态 ----
  useEffect(() => {
    const isEmpty =
      !description.trim() &&
      aiRegions.length === 0 &&
      aiTags.length === 0 &&
      aiSeasons.length === 0;

    if (isEmpty) {
      localStorage.removeItem(AI_SEARCH_STORAGE_KEY);
      return;
    }

    const payload = {
      description,
      regions: aiRegions,
      tags: aiTags,
      seasons: aiSeasons,
    };

    try {
      localStorage.setItem(AI_SEARCH_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [description, aiRegions, aiTags, aiSeasons]);

  // ---- 用 filters 过滤城市 ----
  const filteredCities = useMemo(() => {
    if (!hasFilters) return [];

    return citiesData.filter((city) => {
      if (aiRegions.length > 0 && !aiRegions.includes(city.region)) {
        return false;
      }

      if (aiTags.length > 0) {
        const cityTags = city.tags || [];
        if (!cityTags.some((t) => aiTags.includes(t))) return false;
      }

      if (aiSeasons.length > 0) {
        const seasons = city.bestSeasons || [];
        if (!seasons.some((s) => aiSeasons.includes(s))) return false;
      }

      return true;
    });
  }, [hasFilters, aiRegions, aiTags, aiSeasons]);

  // ---- 收藏开关 ----
  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // ---- 调用 CS571 AI 接口 ----
  const handleAISearch = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = description.trim();
    if (!trimmed) {
      setError("Please describe your trip before asking AI.");
      return;
    }

    let badgerId;
    try {
      badgerId = CS571.getBadgerId();
    } catch (err) {
      console.error(err);
      setError("CS571 helper is not available.");
      return;
    }

    setLoading(true);
    setHasSearched(false);

    try {
      const developerPrompt = `
You are a travel preference parser for a travel website.

The user will describe their dream trip in ANY language (for example, English or Chinese),
but you MUST output ONLY English.

You must convert the description into structured filters with this JSON format:

{
  "regions": ["region1", "region2"],
  "tags": ["tag1", "tag2"],
  "seasons": ["Spring", "Winter"]
}

Rules:

1. "regions" can ONLY be selected from this list (exact spelling):
${JSON.stringify(allRegions)}

2. "tags" can ONLY be selected from this list (exact spelling):
${JSON.stringify(allTags)}

3. "seasons" can ONLY be selected from this list (exact spelling):
${JSON.stringify(allSeasons)}

4. If the user description does not clearly indicate something, leave that array empty.

5. VERY IMPORTANT: output MUST be STRICT JSON:
   - no comments
   - no trailing commas
   - no code block markers
   - no extra text before or after JSON.

Output ONLY the JSON object.
`;

      const conversation = [
        { role: "developer", content: developerPrompt },
        { role: "user", content: trimmed },
      ];

      const res = await fetch(CS571_COMPLETIONS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": badgerId,
        },
        body: JSON.stringify(conversation),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      const parsed = extractJsonFromText((data?.msg || "").trim());

      const regions = Array.isArray(parsed.regions) ? parsed.regions : [];
      const tags = Array.isArray(parsed.tags) ? parsed.tags : [];
      const seasons = Array.isArray(parsed.seasons) ? parsed.seasons : [];

      setAiRegions(regions.filter((r) => allRegions.includes(r)));
      setAiTags(tags.filter((t) => allTags.includes(t)));
      setAiSeasons(seasons.filter((s) => allSeasons.includes(s)));
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError(
        "AI couldn't understand that. Try adding a bit more detail or different words."
      );
      setAiRegions([]);
      setAiTags([]);
      setAiSeasons([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToExplore = () => {
    const params = new URLSearchParams();
    params.set("q", "all");
    if (aiRegions.length > 0) params.set("regions", aiRegions.join(","));
    if (aiTags.length > 0) params.set("tags", aiTags.join(","));
    if (aiSeasons.length > 0) params.set("seasons", aiSeasons.join(","));
    navigate({ pathname: "/search", search: params.toString() });
  };

  // ---- 渲染 ----
  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header 区域 */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center px-3 py-1 rounded-pill mb-3"
            style={{
              backgroundColor: "rgba(13,110,253,0.08)",
              color: "#0d6efd",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            <span role="img" aria-label="sparkles" className="me-2">
              ✨
            </span>
            AI-Powered Search
          </div>

          <h1 className="fw-bold display-5 mb-3">
            Where to next? <span className="text-primary">Ask AI.</span>
          </h1>
          <p className="text-muted fs-5 mb-0">
            Our AI helper will turn your description into structured tags and
            search filters. You can write in any language; the AI output will be
            in English.
          </p>
        </div>

        {/* 输入卡片 */}
        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-4">
            <Form onSubmit={handleAISearch}>
              <Form.Label className="fw-semibold mb-2">
                Trip description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='For example: "A romantic city in Europe with great food and museums"'
                style={{ resize: "vertical" }}
              />
              <div className="mt-3 d-flex justify-content-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !description.trim()}
                  className="px-4 d-inline-flex align-items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>AI is thinking…</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze with AI</span>
                    </>
                  )}
                </Button>
              </div>
            </Form>

            {error && (
              <div className="mt-3">
                <p className="text-danger mb-0">{error}</p>
              </div>
            )}

            {/* 示例 prompts：只在尚未搜索时显示 */}
            {!hasSearched && (
              <div className="mt-4">
                <div className="d-flex align-items-center mb-2">
                  <span
                    role="img"
                    aria-label="idea"
                    className="me-2"
                    style={{ fontSize: "1rem" }}
                  >
                    💡
                  </span>
                  <span className="text-muted small">
                    Try one of these ideas:
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {examplePrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setDescription(prompt)}
                    >
                      {`"${prompt.slice(0, 45)}..."`}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* AI 结果部分 */}
        {hasSearched && (
          <div className="mt-3">
            {/* Filters 卡片：重新设计版本 */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                {/* 标题 + 简短说明 */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                  <h5 className="fw-semibold mb-0">AI-generated filters</h5>
                  {hasFilters && (
                    <span className="text-muted small">
                      {aiRegions.length +
                        aiTags.length +
                        aiSeasons.length}{" "}
                      filter
                      {aiRegions.length + aiTags.length + aiSeasons.length > 1
                        ? "s"
                        : ""}{" "}
                      applied
                    </span>
                  )}
                </div>

                {/* <p className="text-muted small mb-3">
                  AI will turn your description into filters tags. Tap a chip to remove
                  it, then search on the Explore page or look at the matches
                  below.
                </p> */}

                {/* 没有解析出任何 filter 的情况 */}
                {!hasFilters ? (
                  <p className="text-muted mb-0">
                    No clear filters were extracted. Try adding a bit more
                    detail about where you want to go or what you want to do.
                  </p>
                ) : (
                  <>
                    {/* 分组展示 Regions / Tags / Seasons */}
                    <div className="mb-3">
                      {aiRegions.length > 0 && (
                        <div className="mb-2">
                          <div className="text-muted small mb-1">Regions</div>
                          {aiRegions.map((r) => (
                            <Badge
                              key={r}
                              pill
                              bg="light"
                              text="dark"
                              className="border me-2 mb-2"
                              role="button"
                              onClick={() =>
                                setAiRegions((prev) =>
                                  prev.filter((x) => x !== r)
                                )
                              }
                            >
                              {r}
                              <span className="ms-1">×</span>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {aiTags.length > 0 && (
                        <div className="mb-2">
                          <div className="text-muted small mb-1">Tags</div>
                          {aiTags.map((t) => (
                            <Badge
                              key={t}
                              pill
                              bg="light"
                              text="dark"
                              className="border me-2 mb-2"
                              role="button"
                              onClick={() =>
                                setAiTags((prev) =>
                                  prev.filter((x) => x !== t)
                                )
                              }
                            >
                              #{t}
                              <span className="ms-1">×</span>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {aiSeasons.length > 0 && (
                        <div className="mb-2">
                          <div className="text-muted small mb-1">Seasons</div>
                          {aiSeasons.map((s) => (
                            <Badge
                              key={s}
                              pill
                              bg="light"
                              text="dark"
                              className="border me-2 mb-2"
                              role="button"
                              onClick={() =>
                                setAiSeasons((prev) =>
                                  prev.filter((x) => x !== s)
                                )
                              }
                            >
                              {s}
                              <span className="ms-1">×</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 按钮放在下面一列，居中 */}
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-primary"
                        disabled={!hasFilters}
                        onClick={handleGoToExplore}
                      >
                        Search on Explore page
                      </Button>
                      <div className="text-muted small mt-2">
                        Or scroll down to see the destinations that match these
                        filters.
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Matching destinations */}
            {hasFilters && (
              <>
                <h4 className="fw-semibold mb-3 text-center">
                  Matching destinations ({filteredCities.length})
                </h4>
                {filteredCities.length === 0 ? (
                  <p className="text-muted text-center">
                    No destinations match these filters yet. Try removing some
                    filters or describing a broader trip.
                  </p>
                ) : (
                  <Row className="g-4">
                    {filteredCities.map((city) => (
                      <Col key={city.id} xs={12} sm={6} md={4}>
                        <CityCard
                          city={city}
                          isFavorite={favorites.includes(city.id)}
                          onToggleFavorite={toggleFavorite}
                          onClick={() => navigate(`/city/${city.id}`)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
