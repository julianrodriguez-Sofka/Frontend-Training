import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";

// 🧠 Mock de useRegister
vi.mock("../../hooks/useRegister", () => ({
  useRegister: vi.fn(),
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
});

describe("📝 Register Component", () => {
  it("🧭 renderiza los elementos principales correctamente", () => {
    useRegister.mockReturnValue({
      handleRegister: vi.fn(),
      loading: false,
      error: null,
      success: false,
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText(/crea tu cuenta bancaria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("✍️ permite escribir en los campos del formulario", () => {
    useRegister.mockReturnValue({
      handleRegister: vi.fn(),
      loading: false,
      error: null,
      success: false,
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const dniInput = screen.getByLabelText(/dni/i);
    const usernameInput = screen.getByLabelText(/nombre de usuario/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(dniInput, { target: { value: "12345678X" } });
    fireEvent.change(usernameInput, { target: { value: "Julian" } });
    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(dniInput.value).toBe("12345678X");
    expect(usernameInput.value).toBe("Julian");
    expect(emailInput.value).toBe("test@correo.com");
    expect(passwordInput.value).toBe("password123");
  });
  it("🚀 llama handleRegister con los datos del formulario", async () => {
    const mockRegister = vi.fn().mockResolvedValueOnce(true);
    useRegister.mockReturnValue({
      handleRegister: mockRegister,
      loading: false,
      error: null,
      success: false,
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/dni/i), { target: { value: "11111111A" } });
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: "julian" } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "correo@test.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "secure123" } });

    const submitButton = screen.getByRole("button", { name: /registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        dni: "11111111A",
        username: "julian",
        email: "correo@test.com",
        password: "secure123",
      });
    });
  });

  it("✅ muestra mensaje de éxito cuando success es true", () => {
    useRegister.mockReturnValue({
      handleRegister: vi.fn(),
      loading: false,
      error: null,
      success: true,
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument();
  });

  it("❌ muestra mensaje de error cuando hay error", () => {
    useRegister.mockReturnValue({
      handleRegister: vi.fn(),
      loading: false,
      error: "Correo ya en uso",
      success: false,
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText(/correo ya en uso/i)).toBeInTheDocument();
  });

});