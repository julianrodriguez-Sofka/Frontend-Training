import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Transaction from "./pages/Transaction/Transaction.jsx";
import AtmSimulator from "./pages/AtmSimulator/AtmSimulator.jsx";
import History from "./pages/History/History.jsx";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings.jsx";

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

