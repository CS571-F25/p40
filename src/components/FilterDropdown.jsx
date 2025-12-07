// src/components/FilterDropdown.jsx
import { Badge, Button } from "react-bootstrap";

/**
 * Filter 按钮组（Region / Tag / Season）
 * - 不再有外面的方框 / 卡片
 * - 只显示标题 + 一排圆角标签
 */
export default function FilterDropdown({ title, options, selected, onChange }) {
  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const isAll = selected.length === 0;

  return (
    <div
      className="filter-group d-flex flex-column"
      style={{
        gap: "4px",
        marginRight: "12px",
        marginBottom: "8px",
      }}
    >
      {/* 标题 + Reset（小字，只占一行） */}
      <div className="d-flex align-items-center flex-wrap">
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--color-text-muted, #6c757d)",
            marginRight: "8px",
          }}
        >
          {title}
          {!isAll && ` (${selected.length})`}
        </span>

        {!isAll && (
          <Button
            variant="link"
            size="sm"
            onClick={() => onChange([])}
            style={{
              fontSize: "0.75rem",
              padding: 0,
              textDecoration: "none",
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 选项 pill 按钮 */}
      <div className="d-flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <Badge
              key={opt}
              pill
              bg={active ? "primary" : "light"}
              text={active ? "light" : "dark"}
              className="filter-pill"
              onClick={() => toggleOption(opt)}
              style={{
                cursor: "pointer",
                fontSize: "0.8rem",
                padding: "0.35rem 0.75rem",
                border: active ? "none" : "1px solid #e0e0e0",
                transition: "all 0.2s ease",
              }}
            >
              {opt}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
