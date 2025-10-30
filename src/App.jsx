import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormBuilder from "./components/FormBuilder";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formbuilder" element={<FormBuilder />} />
      </Routes>
    </Router>
  );
}
