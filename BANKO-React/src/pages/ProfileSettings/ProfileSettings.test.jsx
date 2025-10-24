import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileSettings from "./ProfileSettings";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";

// 🧠 Mock de axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

// 🧭 Mock de react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("👤 ProfileSettings Component", () => {
  it("🧭 redirige al login si no hay userId en localStorage", () => {
    localStorage.getItem = vi.fn().mockReturnValueOnce(null);
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    expect(navigate).toHaveBeenCalledWith("/login");
  });

  it("✅ carga los datos del usuario correctamente", async () => {
    localStorage.setItem("userId", "1");
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValueOnce({
      data: { id: "1", dni: "987654", username: "Julian", email: "test@correo.com" },
    });

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    // Espera a que se carguen los datos
    expect(await screen.findByDisplayValue("Julian")).toBeInTheDocument();
    expect(screen.getByDisplayValue("987654")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@correo.com")).toBeInTheDocument();
  });

  it("❌ muestra error si falla la carga del usuario", async () => {
    localStorage.setItem("userId", "1");
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockRejectedValueOnce(new Error("Error de servidor"));

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    expect(await screen.findByText(/error al cargar los datos/i)).toBeInTheDocument();
  });

  it("✏️ permite editar los campos del formulario", async () => {
    localStorage.setItem("userId", "1");
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValueOnce({
      data: { id: "1", dni: "123", username: "user1", email: "old@correo.com" },
    });

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    const usernameInput = await screen.findByDisplayValue("user1");
    fireEvent.change(usernameInput, { target: { value: "NuevoNombre" } });

    expect(usernameInput.value).toBe("NuevoNombre");
  });

  it("💾 muestra mensaje de éxito al guardar correctamente", async () => {
    localStorage.setItem("userId", "1");
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValueOnce({
      data: { id: "1", dni: "100", username: "julian", email: "correo@test.com" },
    });

    axios.put.mockResolvedValueOnce({ data: { message: "Perfil actualizado correctamente." } });

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    const saveButton = await screen.findByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    expect(await screen.findByText(/perfil actualizado correctamente/i)).toBeInTheDocument();
  });

  it("⚠️ muestra error al fallar la actualización", async () => {
    localStorage.setItem("userId", "1");
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValueOnce({
      data: { id: "1", dni: "100", username: "julian", email: "correo@test.com" },
    });

    axios.put.mockRejectedValueOnce({
      response: { data: { message: "Error en actualización" } },
    });

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    const saveButton = await screen.findByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    expect(await screen.findByText(/error en actualización/i)).toBeInTheDocument();
  });
});

