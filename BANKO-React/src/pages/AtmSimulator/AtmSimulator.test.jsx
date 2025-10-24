import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AtmSimulator from "./AtmSimulator";
import axios from "axios";

// 🧩 Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 🧩 Mock axios
vi.mock("axios");

describe("🧩 AtmSimulator Component - versión estable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ------------------------------
  it("muestra mensaje de error si no hay usuario logeado", () => {
    render(
      <MemoryRouter>
        <AtmSimulator />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/No se encontró información del usuario logeado/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /BANKO/i })).toBeInTheDocument();
  });

  // ------------------------------
  it("navega correctamente al dashboard al hacer clic en BANKO", () => {
    render(
      <MemoryRouter>
        <AtmSimulator />
      </MemoryRouter>
    );

    const bankoButton = screen.getByRole("button", { name: /BANKO/i });
    fireEvent.click(bankoButton);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  // ------------------------------
  it("renderiza correctamente el simulador cuando hay usuario en localStorage", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Julián", email: "test@banko.com" })
    );

    axios.get.mockResolvedValueOnce({
      data: { id: 1, balance: 50000 },
    });

    render(
      <MemoryRouter>
        <AtmSimulator />
      </MemoryRouter>
    );

    // Esperar que aparezca el título principal
    expect(await screen.findByText(/Simulador de Cajero/i)).toBeInTheDocument();

    // Validar que se muestre el saldo actual
    expect(screen.getByText(/Saldo actual/i)).toBeInTheDocument();

    // Validar que aparezca el input y botones
    expect(screen.getByPlaceholderText(/Ingrese el monto/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retirar/i })).toBeInTheDocument();
  });

  // ------------------------------
  it("muestra mensaje de error si el monto es vacío o inválido", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, name: "Julián", email: "test@banko.com" })
    );

    axios.get.mockResolvedValueOnce({
      data: { id: 1, balance: 10000 },
    });

    render(
      <MemoryRouter>
        <AtmSimulator />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText(/Ingrese el monto/i);
    const btn = screen.getByRole("button", { name: /Retirar/i });

    // monto vacío
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(btn);

    await waitFor(() => {
      // Tu componente muestra: "Ingrese un monto válido."
      expect(screen.getByText(/Ingrese un monto válido/i)).toBeInTheDocument();
    });

    // monto negativo
    fireEvent.change(input, { target: { value: "-100" } });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Ingrese un monto válido/i)).toBeInTheDocument();
    });
  });
});