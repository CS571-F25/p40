// src/components/CityDetail.jsx
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Image, Card, Button, Badge } from "react-bootstrap";
import citiesData from "../data/cities.json";
import CityCard from "./CityCard";
import PlaceCard from "./PlaceCard";
import CommentSection from "./CommentSection";

export default function CityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const city = citiesData.find((c) => c.id === Number(id));
  const [searchParams] = useSearchParams();

  // 每次切换到新的城市详情时，让页面自动滚到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);


  // 之前的搜索参数字符串，比如 "q=kyoto&tags=food"
  const prevSearch = searchParams.toString();
  // 回到搜索页的地址：如果有之前的参数，就带回去；否则回到默认 all
  const backTo = prevSearch ? `/search?${prevSearch}` : "/search?q=all";

  const [details, setDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // 加载收藏状态
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
    window.dispatchEvent(new Event("favoritesUpdated"));
  }, []);

  // 控制主按钮的动画
  const [animate, setAnimate] = useState(false);

  // 切换当前城市的收藏状态
  const toggleFavorite = () => {
    if (!city) return;
    let updated;
    let willAnimate = false;

    if (favorites.includes(city.id)) {
      updated = favorites.filter((fid) => fid !== city.id);
    } else {
      updated = [...favorites, city.id];
      willAnimate = true;
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));

    if (willAnimate) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    }
  };

  // 判断当前城市是否收藏
  const isFav = city ? favorites.includes(city.id) : false;

  // 加载详情 JSON
  useEffect(() => {
    if (city) {
      const path = `${import.meta.env.BASE_URL}data/details/${city.detailFile}`;
      fetch(path)
        .then((res) => {
          if (!res.ok) throw new Error("File not found");
          return res.json();
        })
        .then((data) => setDetails(data))
        .catch(() => setDetails(null));
    }
  }, [city]);

  // 1️⃣ 城市不存在时
  if (!city) {
    return (
      <Container className="text-center mt-5">
        <h2>City not found 🏙️</h2>
        <Button
          variant="outline-primary"
          className="mt-3"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  // 2️⃣ 加载详情中 / 加载失败
  if (!details) {
    return (
      <Container className="text-center mt-5">
        <p>Loading city details...</p>
      </Container>
    );
  }

  // 3️⃣ 计算相似城市（同区域或共享标签，排除当前城市，最多 3 个）
  const similarCities = citiesData
    .filter((c) => c.id !== city.id)
    .filter(
      (c) =>
        c.region === city.region ||
        ((c.tags || []).some((tag) => (city.tags || []).includes(tag)))
    )
    .slice(0, 3);

  // 4️⃣ 页面内容
  return (
    <Container className="mt-4 mb-5">
      {/* 内容左上角返回按钮 */}
      <div
        className="text-start mb-3"
        style={{
          position: "relative",
          top: "-20px",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={() => navigate(backTo)}
          aria-label="Go back to explore destinations"
        >
          ← Back to Explore
        </Button>
      </div>

      {/* 顶部城市概览 */}
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <Image
            src={city.image}
            alt={city.name}
            fluid
            rounded
            style={{ maxHeight: "350px", objectFit: "cover", width: "100%" }}
          />
        </Col>

        <Col md={6} className="mt-3 mt-md-0">
          <h2 className="fw-bold">
            {city.name}, {city.country}
          </h2>
          <p className="text-muted mb-1">{city.region}</p>
          <p style={{ fontSize: "1.05rem" }}>{city.summary}</p>

          {/* 标签 */}
          <div className="mb-3">
            {city.tags.map((tag) => (
              <Badge 
                key={tag} 
                bg="info" 
                text="dark" 
                className="me-2 city-tag"
                style={{
                  cursor: "pointer",
                  border: "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* 最佳季节 */}
          <p className="mb-2">
            <strong>Best Seasons:</strong> {city.bestSeasons.join(", ")}
          </p>

          <div className="mt-3">
            <Button
              variant={isFav ? "danger" : "outline-danger"}
              onClick={toggleFavorite}
              className={animate ? "heart-pulse" : ""}
            >
              {isFav ? "♥ Saved" : "♡ Add to Favorites"}
            </Button>
          </div>
        </Col>
      </Row>

      {/* 城市详情（来自 detail JSON） */}
      <h4 className="fw-bold mb-4 text-primary">
        Discover the best of {city.name}
      </h4>

{Object.entries(details.sections).map(([tag, items]) => (
  <div key={tag} className="mb-5">
    <h5 className="text-capitalize fw-semibold mb-3">#{tag}</h5>
    <Row xs={1} md={2} lg={3} className="g-4">
      {items.map((place, idx) => (
        <Col key={idx}>
          <PlaceCard place={place} />
        </Col>
      ))}
    </Row>
  </div>
))}


      {/* 推荐相似城市 */}
      {similarCities.length > 0 && (
        <>
          <h4 className="fw-bold mb-4">
            Similar cities you might like
          </h4>
          <Row xs={1} md={3} className="g-4">
            {similarCities.map((simCity) => (
              <Col key={simCity.id}>
                <CityCard
                  city={simCity}
                  // 这里不放 ♥，纯推荐卡片，如果想加 ♥ 以后可以扩展
                  onClick={() =>
                    navigate({
                      pathname: `/city/${simCity.id}`,
                      search: searchParams.toString(), // 保留原来的搜索参数
                    })
                  }
                />
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* 评论系统 */}
      <CommentSection cityId={city.id} cityName={city.name} />

<div className="text-center mt-5">
  <Button
    variant="primary"
    onClick={() => navigate(backTo)}
    aria-label="Back to previous search results"
  >
    ← Back to Explore
  </Button>
</div>
    </Container>
  );
}
