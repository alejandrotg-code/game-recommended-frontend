import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SentimentChart from './SentimentChart';

describe('SentimentChart Component', () => {
  const mockProps = {
    sentimentStats: {
      positives_pct: 85,
      negatives_pct: 15,
    },
    totalReviewsAnalyzed: 100,
    positiveCount: 85,
    negativeCount: 15,
    steamVotedUpPct: 90,
    recommendationLevel: 'Extremadamente Recomendado',
    verdictConfig: {
      bg: 'bg-emerald-500/8 border-emerald-500/25',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: '🏆',
      barColor: '#10b981',
    },
  };

  it('renders percentage and review statistics correctly', () => {
    render(<SentimentChart {...mockProps} />);

    // Verificar porcentaje positivo
    expect(screen.getByText('85% positivo')).toBeDefined();

    // Verificar cantidad de reseñas positivas y negativas
    expect(screen.getByText('✓ 85 positivas')).toBeDefined();
    expect(screen.getByText('15 negativas ✗')).toBeDefined();

    // Verificar texto del veredicto
    expect(screen.getByText('Extremadamente Recomendado')).toBeDefined();
  });
});
