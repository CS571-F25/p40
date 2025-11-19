// src/components/SearchBar.jsx
import { Form, InputGroup } from "react-bootstrap";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <InputGroup>
      <InputGroup.Text className="bg-white border-end-0">
        {/* 简单小图标，可以后面换成你自己的 */}
        <span role="img" aria-label="search">
          ⌕
        </span>
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-start-0"
        aria-label={placeholder}
      />
    </InputGroup>
  );
}
