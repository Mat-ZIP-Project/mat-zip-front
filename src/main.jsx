import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppCourse from "./AppCourse";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  {
    /* <AppCourse/> */
  }
);
