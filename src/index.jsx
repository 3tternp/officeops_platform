import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import SimpleApp from "./SimpleApp";
// import CleanApp from "./CleanApp";
// import CompleteApp from "./CompleteApp";
// import ProfessionalApp from "./ProfessionalApp";
import "./styles/tailwind.css";
import "./styles/index.css";

console.log('Starting React app...');

const container = document.getElementById("root");
if (!container) {
  console.error('Could not find root element!');
} else {
  console.log('Root element found, creating React app...');
  const root = createRoot(container);
  root.render(<App />);
  console.log('React app rendered!');
}
