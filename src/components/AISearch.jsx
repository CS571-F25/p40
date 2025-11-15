// src/components/AISearch.jsx
import { useState } from "react";
import { Container, Form, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import citiesData from "../data/cities.json";

// 从数据里提取所有可用的 regions / tags / seasons
const allRegions = Array.from(new Set(citiesData.map((c) => c.region)));
const allTags = Array.from(new Set(citiesData.flatMap((c) => c.tags)));
const allSeasons = ["Spring", "Summer", "Autumn", "Winter"];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 你也可以换成别的模型名，比如 AI Studio 那边列出的 gemini-2.0-flash 等
const GEMINI_MODEL = "gemini-2.0-flash";

const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// 👇 辅助函数：从文本里尽可能抽出 JSON
function extractJsonFromText(text) {
  if (!text) {
    throw new Error("Empty AI response");
  }

  // 1️⃣ 先尝试整体就是 JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    // ignore，继续试下面的方法
  }

  // 2️⃣ 再用正则从中提取 { ... } 片段
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("AI response did not contain JSON.");
  }

  return JSON.parse(match[0]);
}

export default function AISearch() {
  const navigate = useNavigate();

  const [userText, setUserText] = useState("");
  const [aiRegions, setAiRegions] = useState([]);
  const [aiTags, setAiTags] = useState([]);
  const [aiSeasons, setAiSeasons] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 点击“Let AI Search”
  const handleAskAI = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = userText.trim();
    if (!trimmed) {
      setError("Please describe your trip before asking AI.");
      return;
    }

    if (!GEMINI_API_KEY) {
      setError(
        "AI search is not configured yet. Please set VITE_GEMINI_API_KEY in your .env file."
      );
      return;
    }

    setLoading(true);

    try {
      // 构造 prompt：让 AI 只从给定列表里选英文 tag
      const prompt = `
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

User description:
"""${trimmed}"""
`;

      const body = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      const res = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status}`);
      }

      const data = await res.json();

      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join(" ")
          .trim() || "";

      console.log("Gemini raw text:", text); // 🔍 调试用

      const parsed = extractJsonFromText(text);

      console.log("Gemini parsed JSON:", parsed); // 🔍 调试用

      const regions = Array.isArray(parsed.regions) ? parsed.regions : [];
      const tags = Array.isArray(parsed.tags) ? parsed.tags : [];
      const seasons = Array.isArray(parsed.seasons) ? parsed.seasons : [];

      setAiRegions(regions.filter((r) => allRegions.includes(r)));
      setAiTags(tags.filter((t) => allTags.includes(t)));
      setAiSeasons(seasons.filter((s) => allSeasons.includes(s)));

    } catch (err) {
      console.error(err);
      setError(
        "Sorry, AI could not understand this description. Please try a shorter or clearer request."
      );
    } finally {
      setLoading(false);
    }
  };

  // 允许用户点击删除某个 tag/region/season
  const removeRegion = (region) => {
    setAiRegions((prev) => prev.filter((r) => r !== region));
  };

  const removeTag = (tag) => {
    setAiTags((prev) => prev.filter((t) => t !== tag));
  };

  const removeSeason = (season) => {
    setAiSeasons((prev) => prev.filter((s) => s !== season));
  };

  // 点击“Search in Explore” → 跳转到 /search?...
  const handleGoToExplore = () => {
    const params = new URLSearchParams();
    // 对 AI 来的搜索，我们不靠 free-text query，交给结构化 filters 处理
    params.set("q", "all");

    if (aiRegions.length > 0) {
      params.set("regions", aiRegions.join(","));
    }
    if (aiTags.length > 0) {
      params.set("tags", aiTags.join(","));
    }
    if (aiSeasons.length > 0) {
      params.set("seasons", aiSeasons.join(","));
    }

    navigate({
      pathname: "/search",
      search: params.toString(),
    });
  };

  const hasFilters =
    aiRegions.length > 0 || aiTags.length > 0 || aiSeasons.length > 0;

  return (
    <Container className="mt-4 mb-5">
      <h1 className="fw-bold mb-3">Try AI Search ✨</h1>
      <p className="text-muted mb-4" style={{ maxWidth: "720px" }}>
        Describe your dream trip in your own words. Our AI helper will turn your
        description into structured tags and search filters for the Explore page.
        The AI output will be in English, but you can write in any language.
      </p>

      <Form onSubmit={handleAskAI} className="mb-4">
        <Form.Label htmlFor="ai-search-input">Trip description</Form.Label>
        <Form.Control
          as="textarea"
          id="ai-search-input"
          rows={4}
          placeholder='For example: "I want a quiet small town with good food, near the sea, not too hot."'
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          aria-describedby="ai-search-help"
        />
        <Form.Text id="ai-search-help" className="text-muted">
          You can describe destinations, weather, activities, mood, budget, etc.
        </Form.Text>

        <div className="mt-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                Thinking...
              </>
            ) : (
              "Let AI Search"
            )}
          </Button>
        </div>
      </Form>

      {error && (
        <Alert variant="danger" aria-live="polite">
          {error}
        </Alert>
      )}

      {/* AI 解析出来的结果 */}
      {(hasFilters) && (
        <div className="mt-4">
          <h4 className="fw-bold mb-3">AI-generated filters</h4>


          {aiRegions.length > 0 && (
            <div className="mb-3">
              <p className="mb-1">
                <strong>Regions:</strong>{" "}
                <span className="text-muted">
                  (click a badge to remove it)
                </span>
              </p>
              {aiRegions.map((region) => (
                <Badge
                  key={region}
                  bg="secondary"
                  className="me-2 mb-2"
                  role="button"
                  onClick={() => removeRegion(region)}
                  aria-label={`Remove region ${region}`}
                >
                  {region} ×
                </Badge>
              ))}
            </div>
          )}

          {aiTags.length > 0 && (
            <div className="mb-3">
              <p className="mb-1">
                <strong>Tags:</strong>{" "}
                <span className="text-muted">
                  (click a badge to remove it)
                </span>
              </p>
              {aiTags.map((tag) => (
                <Badge
                  key={tag}
                  bg="info"
                  text="dark"
                  className="me-2 mb-2"
                  role="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  #{tag} ×
                </Badge>
              ))}
            </div>
          )}

          {aiSeasons.length > 0 && (
            <div className="mb-3">
              <p className="mb-1">
                <strong>Seasons:</strong>{" "}
                <span className="text-muted">
                  (click a badge to remove it)
                </span>
              </p>
              {aiSeasons.map((season) => (
                <Badge
                  key={season}
                  bg="success"
                  className="me-2 mb-2"
                  role="button"
                  onClick={() => removeSeason(season)}
                  aria-label={`Remove season ${season}`}
                >
                  {season} ×
                </Badge>
              ))}
            </div>
          )}

          <p className="text-muted" style={{ maxWidth: "700px" }}>
            AI thinks these filters match your description. You can remove any
            filters that don&apos;t fit you. Then search with them on the Explore
            page.
          </p>

          <Button
            variant="outline-primary"
            onClick={handleGoToExplore}
            disabled={!hasFilters}
          >
            Search in Explore
          </Button>
        </div>
      )}
    </Container>
  );
}
