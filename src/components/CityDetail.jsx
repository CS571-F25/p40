// src/components/CityDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Image, Card, Button, Badge } from "react-bootstrap";
import citiesData from "../data/cities.json";

export default function CityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const city = citiesData.find((c) => c.id === Number(id));
  const [details, setDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);

   // 加载收藏状态
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  // 增加一个动画控制状态
  const [animate, setAnimate] = useState(false);

    // 切换收藏状态
  const toggleFavorite = () => {
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

    //  触发一次动画
    if (willAnimate) {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300); // 动画结束后恢复
  }
  };

  // 判断是否收藏
  const isFav = favorites.includes(city?.id);

  useEffect(() => {
    if (city) {
      import(`../data/details/${city.detailFile}`)
        .then((res) => setDetails(res.default))
        .catch(() => setDetails(null));
    }
  }, [city]);

  // 1️⃣ 城市不存在时
  if (!city) {
    return (
      <Container className="text-center mt-5">
        <h2>City not found 🏙️</h2>
        <Button variant="outline-primary" className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  // 2️⃣ 加载中
  if (!details) {
    return (
      <Container className="text-center mt-5">
        <p>Loading city details...</p>
      </Container>
    );
  }

  // 3️⃣ 页面内容
  return (
    <Container className="mt-4 mb-5">
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
          <h2 className="fw-bold">{city.name}, {city.country}</h2>
          <p className="text-muted mb-1">{city.region}</p>
          <p style={{ fontSize: "1.05rem" }}>{city.summary}</p>

          {/* 标签 */}
          <div className="mb-3">
            {city.tags.map((tag) => (
              <Badge key={tag} bg="info" text="dark" className="me-2">
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
              variant="outline-primary"
              className="me-2"
              onClick={() => navigate("/search?q=all")}
            >
              ← Back to Explore
            </Button>
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
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    src={place.image}
                    alt={place.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">{place.name}</Card.Title>
                    <Card.Text style={{ fontSize: "0.9rem" }}>
                      {place.description}
                    </Card.Text>
                    <Card.Text
                      className="text-muted"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <em>Recommendation:</em> {place.recommend}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <div className="text-center mt-5">
        <Button variant="primary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>
    </Container>
  );
}
