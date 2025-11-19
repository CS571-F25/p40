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
  // // 让卡片支持键盘回车/空格激活（无障碍）
  // const handleCardKeyDown = (e) => {
  //   if (!onClick) return;
  //   if (e.key === "Enter" || e.key === " ") {
  //     e.preventDefault();
  //     onClick();
  //   }
  // };

  const handleCardClick = () => {
      if (onClick) onClick();
    };

  return (
    <Card
      // className="city-card position-relative h-100"
      // onClick={onClick}
      // role={onClick ? "button" : undefined}
      // tabIndex={onClick ? 0 : undefined}
      // onKeyDown={handleCardKeyDown}
      className="h-100 shadow-sm border-0 city-card"
      style={{
              cursor: onClick ? "pointer" : "default",
              position: "relative",
              borderRadius: "20px",   // 卡片整体圆角
              overflow: "hidden",     // 让图片刚好贴住卡片边缘
            }}
      onClick={handleCardClick}
    >
      {/* ❤️ 收藏按钮（只有传了 onToggleFavorite 才显示） */}
      {onToggleFavorite && (
        <Button
          variant="light"
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
          onClick={(e) => {e.stopPropagation(); onToggleFavorite(city.id, e)}} // 父组件负责 stopPropagation
          style={{
            // width: "44px",
            // height: "44px",
            // fontSize: "1.5rem",
            // color: isFavorite ? "red" : "#bbb",
            // border: "none",
            // zIndex: 10,
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            borderRadius: "999px",
            width: "2rem",
            height: "2rem",
            padding: 0,
            boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.15)",
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

      {/* 城市图片区域 外层包一层，方便做 overflow hidden + 缩放*/}
      <div className="card-img-wrapper">
        <Card.Img
          src={city.image}
          alt={city.name}
          className="city-img"
          variant="top"
        />
      </div>

      <Card.Body>
        <Card.Title  className="mb-1">{city.name}</Card.Title>

        {city.country && (
          <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "0.85rem" }}>
            {city.country} {city.region ? `· ${city.region}` : ""}
          </Card.Subtitle>
        )}

        {city.summary && (
          <Card.Text className="text-muted mb-2"
            style={{ fontSize: "0.9rem", minHeight: "3rem" }}>{city.summary}</Card.Text>
        )}

        {/* 标签 */}
        {Array.isArray(city.tags) && city.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {/* {city.tags.map((t) => (
              <Badge key={t} bg="info" text="dark" className="me-1">
                #{t} */}
                          {city.tags.map((tag) => (
              <Badge
                bg="light"
                text="dark"
                key={tag}
                style={{ fontSize: "0.75rem" }}
              >
                {tag}
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
