import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormBuilder from "./components/FormBuilder";
import DataGrid from "./components/DataGrid";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formbuilder" element={<FormBuilder />} />
        <Route path="/datagrid" element={<DataGrid />} />
      </Routes>
    </Router>
  );
}
