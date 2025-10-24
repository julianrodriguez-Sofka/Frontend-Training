import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { getUserById } from "../../services/userService";

vi.mock("../../services/userService");

describe("🧩 Dashboard Component - pruebas completas", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  // 1️⃣ Caso de carga inicial
  it("muestra el mensaje de carga al iniciar", async () => {
    getUserById.mockResolvedValueOnce({ username: "Juan" });
    localStorage.setItem("userId", "1");

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando tu panel/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(getUserById).toHaveBeenCalledWith("1")
    );
  });

  // 2️⃣ Caso de error - sin userId en localStorage
  it("muestra error si no hay userId en localStorage", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/No se encontró el usuario/i)).toBeInTheDocument()
    );
    expect(screen.getByRole("link", { name: /Ir al inicio de sesión/i })).toBeInTheDocument();
  });

  // 3️⃣ Caso de error - fallo en la API
  it("muestra mensaje de error si la API falla", async () => {
    localStorage.setItem("userId", "1");
    getUserById.mockRejectedValueOnce(new Error("Error del servidor"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/No se pudieron cargar los datos del usuario/i)).toBeInTheDocument()
    );
  });

  // 4️⃣ Caso de éxito - renderizado correcto del dashboard
  it("renderiza correctamente los datos del usuario y el saldo", async () => {
    localStorage.setItem("userId", "1");
    getUserById.mockResolvedValueOnce({
      username: "Carlos",
      bankAccounts: [{ accountNumber: "987654", balance: 1500.5 }],
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Panel de Control/i)).toBeInTheDocument();
    expect(screen.getByText(/Carlos/)).toBeInTheDocument();
    expect(screen.getByText(/Saldo Disponible/i)).toBeInTheDocument();
    expect(screen.getByText(/\$ 1500.50/i)).toBeInTheDocument();
    expect(screen.getByText(/Cuenta Nº: 987654/i)).toBeInTheDocument();
  });

  // 5️⃣ Caso de éxito - botón "Cerrar Sesión" limpia el localStorage
  it("limpia localStorage al hacer clic en Cerrar Sesión", async () => {
    localStorage.setItem("userId", "1");
    getUserById.mockResolvedValueOnce({
      username: "Pepe",
      bankAccounts: [{ accountNumber: "123", balance: 200 }],
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const logoutLink = await screen.findByText(/Cerrar Sesión/i);
    expect(logoutLink).toBeInTheDocument();

    fireEvent.click(logoutLink);
    expect(localStorage.getItem("userId")).toBeNull();
  });
});
