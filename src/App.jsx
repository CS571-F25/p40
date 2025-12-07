import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import GlobalExplorerRouter from "./components/GlobalExplorerRouter";

export default function App() {
  return (
    <ThemeProvider>
      <GlobalExplorerRouter />
    </ThemeProvider>
  );
}
