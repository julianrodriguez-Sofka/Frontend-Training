// src/pages/ProfileSettings/ProfileSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileSettings.css";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    dni: "",
    username: "",
    email: "",
    password: "",
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      navigate("/login");
      return;
    }

    // 🔹 Obtener usuario desde backend con el ID guardado
    axios
      .get(`http://localhost:8080/api/users/${storedUser.id}`)
      .then((res) => {
        setUser({
          id: res.data.id,
          dni: res.data.dni || "",
          username: res.data.username || "",
          email: res.data.email || "",
          password: "",
        });
      })
      .catch((err) => {
        console.error("Error al cargar usuario:", err);
        showNotification("❌ Error al cargar los datos del perfil.", "error");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: user.id,
        dni: user.dni,
        username: user.username,
        email: user.email,
      };

      if (user.password.trim() !== "") {
        payload.password = user.password;
      }

      await axios.put("http://localhost:8080/api/users/update", payload);

      // 🔹 Actualizar el localStorage con los nuevos datos
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), ...payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      showNotification("✅ Perfil actualizado correctamente.", "success");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      if (error.response && error.response.data) {
        showNotification(
          `❌ ${error.response.data.message || "No se pudo actualizar el perfil."}`,
          "error"
        );
      } else {
        showNotification("❌ No se pudo actualizar el perfil.", "error");
      }
    }
  };

  return (
    <div className="profile-settings-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* 🔹 Botón superior BANKO */}
      <button className="banko-button" onClick={() => navigate("/dashboard")}>
        BANKO
      </button>

      <div className="profile-card">
        <h2>Configuración de Perfil</h2>

        <div className="form-group">
          <label htmlFor="dni">DNI</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={user.dni}
            onChange={handleChange}
            placeholder="Tu número de DNI"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Tu correo electrónico"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <button className="save-button" onClick={handleSave}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
