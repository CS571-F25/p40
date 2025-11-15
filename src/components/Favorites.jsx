// src/components/Favorites.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import citiesData from "../data/cities.json";
import CityCard from "./CityCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // 从 localStorage 加载收藏
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  // 点击 ♥ 切换收藏状态
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fid) => fid !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };


  // 移除收藏
  const handleRemove = (id) => {
    const updated = favorites.filter((fid) => fid !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const favoriteCities = citiesData.filter((city) =>
    favorites.includes(city.id)
  );

  return (
    <Container className="mt-4 mb-5">
      <h2 className="fw-bold mb-3">❤️ My Favorites</h2>

      {favoriteCities.length === 0 ? (
        <div className="text-center mt-5">
          <p className="text-muted">You haven't added any favorites yet.</p>
          <Button variant="outline-primary" onClick={() => navigate("/search?q=all")}>
            Explore Destinations
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {favoriteCities.map((city) => (
            <Col key={city.id} xs={12} sm={6} md={4}>
              <CityCard
                city={city}
                isFavorite={true}                  // 在收藏页默认就是收藏状态
                onToggleFavorite={toggleFavorite}  // 仍然可以通过 ♥ 取消收藏
                showRemoveButton={true}            // 比 Search 多出的 Remove 按钮
                onRemove={handleRemove}
                onClick={() => navigate(`/city/${city.id}`)}
              />
            </Col>
          ))}

        </Row>
      )}
    </Container>
  );
}
