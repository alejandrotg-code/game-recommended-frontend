import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchGames, analyzeGame } from './steamService';

describe('steamService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchGames', () => {
    it('debería retornar una lista de juegos si la petición es exitosa', async () => {
      const mockGames = [
        { id: '123', name: 'Half-Life 3' },
        { id: '456', name: 'Portal 3' }
      ];

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ games: mockGames }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await searchGames('Half-Life');

      expect(result).toEqual(mockGames);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/search?term=Half-Life'),
        expect.anything()
      );
    });

    it('debería lanzar un error si la petición falla', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(searchGames('Half-Life')).rejects.toThrow(
        'Error al buscar juegos sugeridos (código 500)'
      );
    });
  });

  describe('analyzeGame', () => {
    it('debería retornar los resultados de análisis si la petición es exitosa', async () => {
      const mockResult = {
        app_id: '123',
        recommendation_level: 'Extremadamente Recomendado',
        sentiment_stats: { positives_pct: 95, negatives_pct: 5 }
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await analyzeGame('123', 30);

      expect(result).toEqual(mockResult);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/analyze/123?limit=30'),
        expect.anything()
      );
    });

    it('debería lanzar un error con el mensaje detallado si la API retorna un error estructurado', async () => {
      const errorDetail = 'El ID de juego proporcionado es inválido o no existe.';

      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ detail: errorDetail }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(analyzeGame('invalid_id')).rejects.toThrow(errorDetail);
    });

    it('debería lanzar un error genérico con el código de estado si la petición falla y no hay detalle JSON', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => { throw new Error('No JSON'); },
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(analyzeGame('123')).rejects.toThrow('Error del servidor (código 404)');
    });
  });
});
