import React, { useState } from "react";
import "../styles/styles.css"; // ✅ ruta corregida a la carpeta de estilos

// Más adelante conectaremos estas funciones reales desde bankUtils.js:
// import { updateUserProfile, changePassword } from "../utils/bankUtils";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    userId: "TEST_ID_1",
    dni: "98765432Y",
    username: "NewName",
    email: "test@bank.com",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // 🔹 Manejadores de cambios
  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  // 🔹 Simula actualizar perfil (luego se usará bankUtils)
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Datos actualizados:", profile);
    alert("✅ Cambios guardados con éxito (simulado).");
  };

  // 🔹 Simula cambiar contraseña (luego se usará bankUtils)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("⚠️ Las contraseñas no coinciden.");
      return;
    }
    console.log("Contraseña actualizada:", passwords);
    alert("🔒 Contraseña actualizada correctamente (simulado).");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <a href="/dashboard">BANKO</a>
        </div>
        <div>
          <a href="/dashboard">Volver al Dashboard</a>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container" style={{ maxWidth: "600px" }}>
        <h1
          style={{
            color: "var(--color-primary)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Configuración de Perfil
        </h1>

        {/* SECCIÓN: INFORMACIÓN PERSONAL */}
        <div className="card">
          <h2
            style={{
              marginBottom: "1.5rem",
              borderBottom: "2px solid #ccc",
              paddingBottom: "0.5rem",
            }}
          >
            Información Personal
          </h2>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="userId">ID de Usuario (Solo Lectura)</label>
              <input
                type="text"
                id="userId"
                value={profile.userId}
                disabled
                style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dni">DNI / Identificación</label>
              <input
                type="text"
                id="dni"
                value={profile.dni}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                value={profile.username}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Guardar Cambios en Perfil
            </button>
          </form>
        </div>

        {/* SECCIÓN: CAMBIAR CONTRASEÑA */}
        <div className="card" style={{ marginTop: "30px" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              color: "var(--color-danger)",
              borderBottom: "2px solid var(--color-danger)",
              paddingBottom: "0.5rem",
            }}
          >
            Cambiar Contraseña
          </h2>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña Actual</label>
              <input
                type="password"
                id="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger"
              style={{ width: "100%" }}
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

