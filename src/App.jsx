import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
// import TableData from "./components/Table-data";
import ScrapData from "./components/Scrap-data";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router basename="/scraped_data">
      <div className="flex flex-col h-screen">
  <div className="h-[10%]">
    <Navbar />
  </div>
  <main className="h-[90%] p-3  ">
      <Routes>
        <Route path="/" element={<ScrapData />} />
        {/* <Route path="/scrap-data" element={<ScrapData />} /> */}
      </Routes>
  </main>
</div>

    </Router>
  );
}

export default App;
