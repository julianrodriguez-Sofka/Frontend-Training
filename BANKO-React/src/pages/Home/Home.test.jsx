import { render, screen, act } from "@testing-library/react";
import Home from "./Home";
import { vi } from "vitest";

describe("🏠 Home Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("⏳ muestra pantalla de carga al inicio", () => {
    render(<Home />);
    expect(screen.getByText(/cargando, ten paciencia/i)).toBeInTheDocument();
  });

  test("✅ oculta la pantalla de carga y muestra el contenido principal", async () => {
    render(<Home />);

    // Avanzamos timers dentro de act para que React procese el setTimeout
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/tu banca digital de confianza/i)
    ).toBeInTheDocument();
  });

  test("🧭 renderiza correctamente la barra de navegación", async () => {
    render(<Home />);

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    // nav debería existir como landmark
    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/abrir cuenta/i)).toBeInTheDocument();
  });

  test("🎯 renderiza los botones principales del hero", async () => {
    render(<Home />);

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    // Son enlaces (<a>), por eso role = "link"
    expect(
      screen.getByRole("link", { name: /crear cuenta gratis/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /acceso cliente/i })
    ).toBeInTheDocument();
  });

  test("💡 muestra las secciones de características principales", async () => {
    render(<Home />);

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    // Usamos role "heading" para apuntar a los <h3> de cada feature (evita el texto duplicado en párrafos)
    expect(
      screen.getByRole("heading", { name: /Seguridad de Nivel Superior/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Transacciones Instantáneas/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Control Total Móvil/i })
    ).toBeInTheDocument();
  });
});





