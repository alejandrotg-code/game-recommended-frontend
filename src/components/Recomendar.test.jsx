import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Recomendar from './Recomendar';
import * as steamService from '../services/steamService';

vi.mock('../services/steamService', () => ({
  getRagRecommendations: vi.fn(),
}));

describe('Recomendar Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('permite cambiar la cantidad de juegos (4, 10, 20) y solicitar recomendaciones', async () => {
    const mockGames = Array.from({ length: 10 }, (_, i) => ({
      app_id: i + 1,
      name: `Juego de prueba ${i + 1}`,
      price: '9.99 €',
      genres: 'Acción, RPG',
      reason_ai: `Razón para el juego ${i + 1}`
    }));

    steamService.getRagRecommendations.mockResolvedValue({
      query_es: 'Un juego de acción',
      summary: 'Aquí tienes 10 juegos de acción',
      games: mockGames
    });

    render(<Recomendar />);

    // Verificar que existen los botones de selección 4, 10, 20
    const btn10 = screen.getByRole('button', { name: /10 juegos/i });
    const btn20 = screen.getByRole('button', { name: /20 juegos/i });
    expect(btn10).toBeDefined();
    expect(btn20).toBeDefined();

    // Seleccionar 10 juegos
    fireEvent.click(btn10);

    const input = screen.getByPlaceholderText(/Busco un juego para desconectar/i);
    fireEvent.change(input, { target: { value: 'Un juego de acción e historia' } });

    const submitBtn = screen.getByRole('button', { name: /Recomiéndame \(10\)/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(steamService.getRagRecommendations).toHaveBeenCalledWith(
        'Un juego de acción e historia',
        10,
        expect.anything()
      );
    });

    // Paginación: debe haber 3 páginas (10 items / 4 por página = 3 páginas)
    await waitFor(() => {
      expect(screen.getByText(/10 Títulos/i)).toBeDefined();
      expect(screen.getByText((content, element) => element?.textContent === 'Mostrando 1 - 4 de 10 recomendaciones')).toBeDefined();
    });
  });

  it('navega entre páginas correctamente al tener 10 o 20 resultados', async () => {
    const mockGames = Array.from({ length: 10 }, (_, i) => ({
      app_id: i + 1,
      name: `Juego de prueba ${i + 1}`,
      price: '9.99 €',
      reason_ai: `Razón para el juego ${i + 1}`
    }));

    steamService.getRagRecommendations.mockResolvedValue({
      query_es: 'RPG',
      summary: 'Resultados RPG',
      games: mockGames
    });

    render(<Recomendar />);

    const input = screen.getByPlaceholderText(/Busco un juego para desconectar/i);
    fireEvent.change(input, { target: { value: 'Un juego RPG largo' } });

    const submitBtn = screen.getByRole('button', { name: /Recomiéndame/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Juego de prueba 1/i)).toBeDefined();
      expect(screen.getByText(/Juego de prueba 4/i)).toBeDefined();
    });

    // Ir a la página 2
    const nextBtn = screen.getByRole('button', { name: /Siguiente/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText((content, element) => element?.textContent === 'Mostrando 5 - 8 de 10 recomendaciones')).toBeDefined();
      expect(screen.getByText(/Juego de prueba 5/i)).toBeDefined();
    });
  });
});
