import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test rendering crash');
};

describe('ErrorBoundary Component', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component')).toBeDefined();
  });

  it('renders fallback UI when a child component throws an error', () => {
    // Evitar que React imprima el error esperado en la consola durante los tests
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Ocurrió un error inesperado/i)).toBeDefined();
    expect(screen.getByText(/Test rendering crash/i)).toBeDefined();
    expect(screen.getByText(/Reintentar \/ Recargar/i)).toBeDefined();

    spy.mockRestore();
  });
});
