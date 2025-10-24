import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Transaction from "./Transaction";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { transferMoney } from "../../services/transactionService";

// 🧠 Mock de react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

// 🧠 Mock del servicio transferMoney
vi.mock("../../services/transactionService", () => ({
  transferMoney: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("💸 Transaction Component", () => {
  it("🧭 redirige si no hay usuario en localStorage", () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("✅ muestra los datos del usuario logueado", () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const user = { username: "Julian", accountNumber: "123-456" };
    localStorage.setItem("user", JSON.stringify(user));

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    expect(screen.getByText(/Perfil \(Julian\)/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("123-456")).toBeInTheDocument();
  });

  it("✍️ permite escribir en los campos de destino y monto", () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const user = { username: "TestUser", accountNumber: "999-888" };
    localStorage.setItem("user", JSON.stringify(user));

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    const destInput = screen.getByPlaceholderText(/001-456-789-0/i);
    const amountInput = screen.getByPlaceholderText(/500.00/i);

    fireEvent.change(destInput, { target: { value: "123-000" } });
    fireEvent.change(amountInput, { target: { value: "300" } });

    expect(destInput.value).toBe("123-000");
    expect(amountInput.value).toBe("300");
  });

  it("🚀 realiza una transferencia exitosa y muestra mensaje de éxito", async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const user = { username: "Julian", accountNumber: "111-222" };
    localStorage.setItem("user", JSON.stringify(user));

    transferMoney.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/001-456-789-0/i), {
      target: { value: "222-333" },
    });
    fireEvent.change(screen.getByPlaceholderText(/500.00/i), {
      target: { value: "100" },
    });

    const submitBtn = screen.getByRole("button", { name: /transferir/i });
    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled(); // ✅ Se deshabilita mientras carga

    await waitFor(() => {
      expect(transferMoney).toHaveBeenCalledWith({
        sourceAccountNumber: "111-222",
        destinationAccountNumber: "222-333",
        amount: "100",
      });
    });

    expect(await screen.findByText(/transferencia realizada con éxito/i)).toBeInTheDocument();
  });

  it("❌ muestra mensaje de error si la transferencia falla", async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const user = { username: "Julian", accountNumber: "444-555" };
    localStorage.setItem("user", JSON.stringify(user));

    transferMoney.mockRejectedValueOnce(new Error("Saldo insuficiente"));

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/001-456-789-0/i), {
      target: { value: "111-999" },
    });
    fireEvent.change(screen.getByPlaceholderText(/500.00/i), {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /transferir/i }));

    await waitFor(() =>
      expect(screen.getByText(/error al realizar la transferencia/i)).toBeInTheDocument()
    );
  });

  it("🔁 limpia los campos después de una transferencia exitosa", async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const user = { username: "Julian", accountNumber: "123-456" };
    localStorage.setItem("user", JSON.stringify(user));

    transferMoney.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    const destInput = screen.getByPlaceholderText(/001-456-789-0/i);
    const amountInput = screen.getByPlaceholderText(/500.00/i);

    fireEvent.change(destInput, { target: { value: "999-000" } });
    fireEvent.change(amountInput, { target: { value: "200" } });

    fireEvent.click(screen.getByRole("button", { name: /transferir/i }));

    await waitFor(() => {
      expect(destInput.value).toBe("");
      expect(amountInput.value).toBe("");
    });
  });

  it("🌀 muestra texto 'Procesando...' mientras carga", async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const user = { username: "Julian", accountNumber: "123-456" };
    localStorage.setItem("user", JSON.stringify(user));

    let resolveTransfer;
    transferMoney.mockImplementation(
      () => new Promise((resolve) => (resolveTransfer = resolve))
    );

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/001-456-789-0/i), {
      target: { value: "000-111" },
    });
    fireEvent.change(screen.getByPlaceholderText(/500.00/i), {
      target: { value: "50" },
    });

    const button = screen.getByRole("button", { name: /transferir/i });
    fireEvent.click(button);

    // Mientras se resuelve, debe mostrar “Procesando...”
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /procesando/i })).toBeInTheDocument()
    );

    resolveTransfer({ success: true });
  });
});
