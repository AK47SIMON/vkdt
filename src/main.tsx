import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set Cesium base URL for production assets
if (typeof window !== "undefined") {
  (window as any).CESIUM_BASE_URL = "/cesium/";
}

createRoot(document.getElementById("root")!).render(<App />);
