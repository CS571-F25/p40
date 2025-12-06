import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import citiesData from "../data/cities.json";
import CityCard from "./CityCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(stored);
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      setFavorites([]);
    }
  }, []);

  const favoriteCities = useMemo(
    () => citiesData.filter((city) => favorites.includes(city.id)),
    [favorites]
  );

  const regionsSummary = useMemo(() => {
    const counts = new Map();
    favoriteCities.forEach((city) => {
      const region = city.region || "Other";
      counts.set(region, (counts.get(region) || 0) + 1);
    });
    return Array.from(counts.entries());
  }, [favoriteCities]);

  const handleRemove = (id) => {
    const updated = favorites.filter((favId) => favId !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

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

  const hasFavorites = favoriteCities.length > 0;

  return (
    <Container className="py-4">
      {/* 顶部标题区：全部居中 */}
      <div className="text-center mb-4">
        <div className="mb-4">
          <h1 className="fw-bold mb-2">Your Favorites</h1> 
          <div className="mb-4"></div>
          <Button
              variant="outline-secondary"
              size="lg"
              className="mb-3"
              onClick={() => navigate("/search?q=all")}
            >
              + Add more places
          </Button>
        </div>
        <p className="text-muted mb-1">
          {hasFavorites
            ? "Keep track of the cities you're most excited about and jump back in when you're ready to plan."
            : "Tap the heart icon on any city to save it here and build your own shortlist."}
        </p>
        {hasFavorites && (
          <p className="text-muted mb-3">
            Click a card to see more details, food recommendations, and nearby highlights.
          </p>
        )}


      </div>

      {/* 没有收藏时的空状态卡片 */}
      {!hasFavorites && (
        <Card className="border-0 shadow-sm mt-2">
          <Card.Body className="text-center py-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "rgba(220, 53, 69, 0.06)",
              }}
            >
              <span style={{ fontSize: "2rem", color: "#dc3545" }}>♡</span>
            </div>
            <h2 className="h5 mb-2">No favorites yet</h2>
            <p className="text-muted mb-4">
              Start exploring destinations and tap the heart icon on any city you love.
              They&apos;ll appear here so you can compare and plan later.
            </p>
            <Button variant="primary" onClick={() => navigate("/search?q=all")}>
              Explore destinations
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* 有收藏时的 region 小标签 + 卡片网格 */}
      {hasFavorites && (
        <>
      {hasFavorites && (
        <div className="mb-3 text-center">
          <Badge bg="primary" pill className="me-2">
            {favoriteCities.length}{" "}
            {favoriteCities.length === 1 ? "destination" : "destinations"}
          </Badge>
          {regionsSummary.length > 0 && (
            <>
              <span className="text-muted me-2">Where your favorites are:</span>
              {regionsSummary.map(([region, count]) => (
                <Badge
                  key={region}
                  bg="light"
                  text="dark"
                  className="me-2 mb-2 border"
                  pill
                >
                  {region} · {count}
                </Badge>
              ))}
            </>
          )}
        </div>
      )}

          <Row className="g-4">
            {favoriteCities.map((city) => (
              <Col key={city.id} xs={12} sm={6} md={4}>
                <CityCard
                  city={city}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  showRemoveButton={true}
                  onRemove={handleRemove}
                  onClick={() => navigate(`/city/${city.id}`)}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}
