// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 从 localStorage 读取之前保存的主题，默认为 light
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      // 验证 saved 值是否为有效的主题之一
      const validThemes = ["light", "dark", "badger"];
      if (saved && validThemes.includes(saved)) {
        return saved;
      }
      return "light";
    } catch {
      return "light";
    }
  });

  // 当主题变化时，更新 localStorage 和 DOM
  useEffect(() => {
    localStorage.setItem("theme", theme);

    // 更新 HTML 元素的 data-theme 属性
    document.documentElement.setAttribute("data-theme", theme);

    // 更新 Bootstrap 主题（通过 CSS 变量或类名）
    if (theme === "dark") {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-bs-theme");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "badger";
      return "light";
    });
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
    isBadger: theme === "badger",
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 Hook，方便其他组件使用主题
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
