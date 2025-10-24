import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { vi } from "vitest";
import React from "react";

// Mock del hook personalizado useLogin
vi.mock("../../hooks/useLogin", () => ({
  useLogin: vi.fn(),
}));

import { useLogin } from "../../hooks/useLogin";

describe("🔐 Login Component", () => {
  const mockHandleLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useLogin.mockReturnValue({
      handleLogin: mockHandleLogin,
      loading: false,
      error: null,
      success: false,
    });
  });

  test("🧭 renderiza correctamente los elementos principales", () => {
    render(<Login />);

    expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test("✍️ permite escribir en los campos de texto", () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(emailInput, { target: { value: "usuario@correo.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("usuario@correo.com");
    expect(passwordInput.value).toBe("123456");
  });

 

  test("🚀 llama handleLogin con los datos del formulario", async () => {
    mockHandleLogin.mockResolvedValue(true);
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "test@correo.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith({
        email: "test@correo.com",
        password: "123456",
      });
    });
  });

  test("✅ muestra mensaje de éxito cuando success es true", () => {
    useLogin.mockReturnValue({
      handleLogin: mockHandleLogin,
      loading: false,
      error: null,
      success: true,
    });

    render(<Login />);
    expect(screen.getByText(/inicio de sesión exitoso/i)).toBeInTheDocument();
  });

  test("❌ muestra mensaje de error cuando error está presente", () => {
    useLogin.mockReturnValue({
      handleLogin: mockHandleLogin,
      loading: false,
      error: "Credenciales inválidas",
      success: false,
    });

    render(<Login />);
    expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
  });
});
