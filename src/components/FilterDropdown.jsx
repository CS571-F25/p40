// src/components/FilterDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

/**
 * 精致版 Filter 下拉菜单
 * - 方框在右边（右对齐）
 * - 左文字右方框，整齐排列
 * - 圆角白底 + 阴影 + 动画
 */
export default function FilterDropdown({ title, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // 点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const isAll = selected.length === 0;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* 顶部按钮 */}
      <Button
        variant={open ? "dark" : "outline-secondary"}
        onClick={() => setOpen(!open)}
        style={{
          minWidth: "110px",
          borderRadius: "20px",
          fontWeight: 500,
          backgroundColor: open ? "#212529" : "white",
          color: open ? "white" : "#333",
          border: open ? "none" : "1px solid #ccc",
          boxShadow: open ? "0 3px 10px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {title} {isAll ? "" : `(${selected.length})`}{" "}
        <span style={{ fontSize: "0.8rem" }}>{open ? "▲" : "▼"}</span>
      </Button>

      {/* 下拉框 */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            width: "220px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            padding: "14px 18px",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <div style={{ borderBottom: "1px solid #eee", marginBottom: "10px" }}>
            <h6
              style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              {title}
            </h6>
          </div>

          {/* 选项行 */}
          <div>
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="filter-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
                onClick={() => toggleOption(opt)}
              >
                <span>{opt}</span>
                <Form.Check
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleOption(opt)}
                  style={{
                    margin: 0,
                    padding: 0,
                    pointerEvents: "none", // 防止双击冲突
                  }}
                />
              </div>
            ))}
          </div>

          {/* Reset */}
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button
              size="sm"
              variant="link"
              onClick={() => onChange([])}
              style={{
                fontSize: "0.8rem",
                textDecoration: "none",
                color: "#0d6efd",
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
