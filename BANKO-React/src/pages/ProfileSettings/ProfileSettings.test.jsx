import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
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
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    expect(navigate).toHaveBeenCalledWith("/login");
  });
  it("💾 muestra mensaje de éxito al guardar correctamente", async () => {
    localStorage.setItem("userId", "1");
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValueOnce({
      data: { id: "1", dni: "100", username: "julian", email: "correo@test.com" },
    });

    axios.put.mockResolvedValueOnce({
      data: { message: "Perfil actualizado correctamente." },
    });

    render(
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    );

    const saveButton = await screen.findByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    expect(
      await screen.findByText(/perfil actualizado correctamente/i)
    ).toBeInTheDocument();
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


