import Login from "./components/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
