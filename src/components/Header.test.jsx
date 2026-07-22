import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders the brand title and navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Verificar que el título principal de la marca esté presente
    expect(screen.getByText(/Game Recommended/i)).toBeDefined();

    // Verificar que los enlaces de navegación principales estén presentes (responsive desktop + mobile)
    expect(screen.getAllByText(/Analizar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Recomendar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cómo funciona/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Changelog/i).length).toBeGreaterThan(0);
  });
});
