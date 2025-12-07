// src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import uwMadisonCrest from "../assets/126-1265785_uw-madison-crest-university-of-wisconsin-madison.png";
import "./ThemeToggle.css";

const themeLabels = {
  light: "Light",     // 当前是light模式
  dark: "Dark",       // 当前是dark模式
  badger: "Badger",   // 当前是badger模式
};

const themeIcons = {
  light: <Sun size={18} className="theme-icon" />,       // 白天 = 太阳
  dark: <Moon size={18} className="theme-icon" />,       // 黑夜 = 月亮
  badger: <img src={uwMadisonCrest} alt="Badger" className="theme-icon badger-icon" style={{ height: "20px", width: "20px" }} />, // BadgerView = UW-Madison徽标
};

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "badger" : "light"} mode`}
      aria-label={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "badger" : "light"} mode`}
    >
      <div className="theme-toggle-inner">
        {themeIcons[theme]}
      </div>
      <span className="theme-label">{themeLabels[theme]}</span>
    </button>
  );
}
