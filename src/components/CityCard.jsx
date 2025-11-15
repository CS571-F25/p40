// src/components/CityCard.jsx
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

/**
 * 通用城市卡片组件，用于 Search 和 Favorites 页面。
 *
 * Props:
 * - city: 城市对象 { id, name, country, image, summary, tags, ... }
 * - isFavorite: 当前是否在收藏夹中（用于显示 ♥ 颜色）
 * - onToggleFavorite: (id, event) => void，点击 ♥ 时触发（可选）
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
  // 让卡片支持键盘回车/空格激活（无障碍）
  const handleCardKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className="city-card position-relative h-100"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleCardKeyDown}
    >
      {/* ❤️ 收藏按钮（只有传了 onToggleFavorite 才显示） */}
      {onToggleFavorite && (
        <Button
          variant="light"
          className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
          onClick={(e) => onToggleFavorite(city.id, e)} // 父组件负责 stopPropagation
          style={{
            width: "44px",
            height: "44px",
            fontSize: "1.5rem",
            color: isFavorite ? "red" : "#bbb",
            border: "none",
            zIndex: 10,
          }}
          aria-label={
            isFavorite
              ? `Remove ${city.name} from favorites`
              : `Add ${city.name} to favorites`
          }
        >
          {isFavorite ? "♥" : "♡"}
        </Button>
      )}

      {/* 城市图片区域 */}
      <div className="card-img-wrapper">
        <Card.Img src={city.image} alt={city.name} className="city-img" />
      </div>

      <Card.Body>
        <Card.Title>{city.name}</Card.Title>

        {city.summary && (
          <Card.Text className="summary">{city.summary}</Card.Text>
        )}

        {/* 标签 */}
        {city.tags && city.tags.length > 0 && (
          <div className="tags mb-2">
            {city.tags.map((t) => (
              <Badge key={t} bg="info" text="dark" className="me-1">
                #{t}
              </Badge>
            ))}
          </div>
        )}

        {/* 收藏页的 Remove 按钮 */}
        {showRemoveButton && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove(city.id);
            }}
          >
            Remove
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
