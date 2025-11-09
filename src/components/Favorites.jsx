// src/components/Favorites.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import citiesData from "../data/cities.json";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // 从 localStorage 加载收藏
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

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
              <Card
                className="city-card"
                onClick={() => navigate(`/city/${city.id}`)}
              >
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
                  <div className="tags mb-2">
                    {city.tags.map((t) => (
                      <Badge key={t} bg="info" text="dark" className="me-1">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(city.id);
                    }}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
