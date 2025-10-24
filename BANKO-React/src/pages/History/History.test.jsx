import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import History from "./History";
import { vi } from "vitest";

// 🧩 Mocks
vi.mock("../../services/historyService", () => ({
  getTransactionHistory: vi.fn(),
}));

const mockedNavigate = vi.fn();

// Simulamos el hook useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("📜 History Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  test("🔹 redirige al inicio si no hay usuario logeado", () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    // Debe intentar navegar a "/"
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });

  test("✅ muestra mensaje si no hay transacciones", async () => {
    localStorage.setItem("user", JSON.stringify({ username: "Julian", accountNumber: "12345" }));

    const { getTransactionHistory } = await import("../../services/historyService");
    getTransactionHistory.mockResolvedValueOnce([]); // sin transacciones

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/No hay transacciones registradas/i)).toBeInTheDocument()
    );
  });

  test("💰 muestra tabla de transacciones cuando hay datos", async () => {
    localStorage.setItem("user", JSON.stringify({ username: "Julian", accountNumber: "12345" }));

    const { getTransactionHistory } = await import("../../services/historyService");
    getTransactionHistory.mockResolvedValueOnce([
      {
        id: 1,
        transactionDate: "2025-10-23T12:00:00Z",
        description: "Transferencia",
        amount: 100,
        sourceAccountNumber: "12345",
        targetAccountNumber: "67890",
      },
    ]);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Transferencia/i)).toBeInTheDocument();
      expect(screen.getByText("- $100.00")).toBeInTheDocument(); // salida
      expect(screen.getByText("67890")).toBeInTheDocument();
    });
  });

  test("🟢 muestra monto positivo si es ingreso", async () => {
    localStorage.setItem("user", JSON.stringify({ username: "Julian", accountNumber: "12345" }));

    const { getTransactionHistory } = await import("../../services/historyService");
    getTransactionHistory.mockResolvedValueOnce([
      {
        id: 2,
        transactionDate: "2025-10-23T12:00:00Z",
        description: "Depósito",
        amount: 250,
        sourceAccountNumber: "67890",
        targetAccountNumber: "12345",
      },
    ]);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("+ $250.00")).toBeInTheDocument(); // ingreso
      expect(screen.getByText(/Depósito/i)).toBeInTheDocument();
    });
  });

  test("❌ maneja error en getTransactionHistory sin romper", async () => {
    localStorage.setItem("user", JSON.stringify({ username: "Julian", accountNumber: "12345" }));

    const { getTransactionHistory } = await import("../../services/historyService");
    getTransactionHistory.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    // No debe romper el componente (renderiza sin errores)
    await waitFor(() => {
      expect(screen.getByText(/Historial de Transacciones/i)).toBeInTheDocument();
    });
  });
});
