// src/components/CityCard.jsx
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

/**
 * 通用城市卡片组件，用于 Search 和 Favorites 页面。
 *
 * Props:
 * - city: 城市对象 { id, name, country, region, image, summary, tags, ... }
 * - isFavorite: 当前是否在收藏夹中（用于显示 ♥ 颜色）
 * - onToggleFavorite: (id) => void，点击 ♥ 时触发（可选）
 * - onClick: () => void，点击整张卡片时触发（例如跳转到详情页，可选）
 * - showRemoveButton: 是否显示底部 Remove 按钮（收藏页用，可选，默认 false）
 * - onRemove: (id) => void，点击 Remove 时触发（可选）
 */
export default function CityCard({
  city,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  showRemoveButton = false,
  onRemove,
}) {
  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(city.id);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(city.id);
  };

  return (
    <Card
      className="city-card h-100 border-0 shadow-sm"
      style={{
        cursor: onClick ? "pointer" : "default",
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={handleCardClick}
    >
      {/* 图片 + 右上角 ♥ */}
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={city.image}
          alt={city.name}
          className="city-img"
        />

        {onToggleFavorite && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="btn btn-light rounded-circle shadow-sm position-absolute"
            style={{
              top: "12px",
              right: "12px",
              width: "32px",
              height: "32px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <span
              style={{
                color: isFavorite ? "#dc3545" : "#aaaaaa",
                fontSize: "1rem",
              }}
            >
              {isFavorite ? "♥" : "♡"}
            </span>
          </button>
        )}
      </div>

      {/* 关键：Body 变成 flex-column，下面的 Remove 贴底 */}
      <Card.Body className="d-flex flex-column">
        {/* 上半部分：标题 + 文本 + 标签，用 flex-grow-1 吃掉高度 */}
        <div className="d-flex flex-column flex-grow-1">
          <div className="mb-2 text-center">
            <Card.Title className="mb-1">{city.name}</Card.Title>
            <div className="text-muted small">
              {city.country} · {city.region}
            </div>
          </div>

          {city.summary && (
            <Card.Text
              className="text-muted mb-2 flex-grow-1"
              style={{ fontSize: "0.9rem" }}
            >
              {city.summary}
            </Card.Text>
          )}

          {Array.isArray(city.tags) && city.tags.length > 0 && (
            <div className="d-flex flex-wrap justify-content-center gap-1 mb-2">
              {city.tags.map((tag) => (
                <Badge
                  key={tag}
                  bg="light"
                  text="dark"
                  className="border"
                  style={{ fontSize: "0.75rem" }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 下半部分：Remove 按钮，用 mt-auto 把它压到底部 */}
        {showRemoveButton && (
          <div className="mt-auto pt-2 text-center">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleRemoveClick}
            >
              Remove
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
