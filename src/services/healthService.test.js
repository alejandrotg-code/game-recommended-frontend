import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkBackendHealth, checkSteamStatus } from './healthService';

describe('healthService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkBackendHealth', () => {
    it('debería retornar status "online" cuando el servidor responde con ok', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok' }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkBackendHealth();

      expect(result.status).toBe('online');
      expect(typeof result.latency).toBe('number');
      expect(result.timestamp).toBeDefined();
    });

    it('debería retornar status "offline" cuando el servidor responde con código de error', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkBackendHealth();

      expect(result.status).toBe('offline');
      expect(result.latency).toBeNull();
      expect(result.error).toContain('503');
    });

    it('debería retornar status "offline" cuando la red falla (fetch lanza excepción)', async () => {
      const fetchMock = vi.fn().mockRejectedValue(new Error('Network Error'));
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkBackendHealth();

      expect(result.status).toBe('offline');
      expect(result.latency).toBeNull();
      expect(result.error).toBe('Network Error');
    });

    it('debería llamar al endpoint raíz del backend', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });
      vi.stubGlobal('fetch', fetchMock);

      await checkBackendHealth();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('checkSteamStatus', () => {
    it('debería retornar status "online" cuando la búsqueda devuelve juegos (games array)', async () => {
      const mockGames = [{ id: '730', name: 'Counter-Strike 2' }];
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ games: mockGames }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkSteamStatus();

      expect(result.status).toBe('online');
      expect(typeof result.latency).toBe('number');
    });

    it('debería retornar status "online" cuando la respuesta es un array directo', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: '730', name: 'Counter-Strike 2' }],
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkSteamStatus();

      expect(result.status).toBe('online');
    });

    it('debería retornar status "degraded" cuando la lista de juegos está vacía', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ games: [] }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkSteamStatus();

      expect(result.status).toBe('degraded');
    });

    it('debería retornar status "offline" cuando el servidor responde con error HTTP', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkSteamStatus();

      expect(result.status).toBe('offline');
      expect(result.latency).toBeNull();
    });

    it('debería retornar status "offline" cuando la red falla', async () => {
      const fetchMock = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkSteamStatus();

      expect(result.status).toBe('offline');
      expect(result.error).toBe('Failed to fetch');
    });

    it('debería retornar status "offline" cuando el formato de respuesta es inválido', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: 'format' }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkSteamStatus();

      expect(result.status).toBe('offline');
      expect(result.error).toContain('inválido');
    });

    it('debería usar el endpoint de búsqueda con Counter-Strike como término de prueba', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ games: [{ id: '730', name: 'CS2' }] }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await checkSteamStatus();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/search?term=Counter-Strike'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });
});
