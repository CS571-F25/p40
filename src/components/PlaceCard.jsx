// src/components/PlaceCard.jsx
import React from "react";
import { Card } from "react-bootstrap";

/**
 * 单个景点 / 推荐地点卡片
 *
 * Props:
 * - place: { name, image, description, recommend }
 */
export default function PlaceCard({ place }) {
  return (
    <Card className="h-100 shadow-sm border-0">
      {place.image && (
        <Card.Img
          variant="top"
          src={place.image}
          alt={place.name}
          style={{ height: "180px", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Card.Title className="fw-bold">{place.name}</Card.Title>
        {place.description && (
          <Card.Text style={{ fontSize: "0.9rem" }}>
            {place.description}
          </Card.Text>
        )}
        {place.recommend && (
          <Card.Text
            className="text-muted"
            style={{ fontSize: "0.85rem" }}
          >
            <em>Recommendation:</em> {place.recommend}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}
