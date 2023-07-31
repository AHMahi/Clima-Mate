import { Route, Routes } from "react-router-dom";
import App from "../App";
import Navbar from "../components/navbar";
import NotFound from "../pages/NotFound";

function Root() {

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
        <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
    </div>
  );
}

export default Root;
