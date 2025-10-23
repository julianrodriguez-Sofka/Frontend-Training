// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importa tus páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transaction from "./pages/Transaction";
import AtmSimulator from "./pages/AtmSimulator";
import History from "./pages/History";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Acceso y registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Área interna del usuario */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/atm" element={<AtmSimulator />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
