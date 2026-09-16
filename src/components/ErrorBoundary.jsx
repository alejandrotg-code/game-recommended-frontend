import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary atrapó un error no controlado:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-surface border border-negative/30 rounded-2xl sm:rounded-3xl shadow-2xl text-center space-y-5 animate-fade-up">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-negative/10 border border-negative/20 flex items-center justify-center">
            <AlertTriangle className="size-7 text-negative" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">
              ¡Ups! Ocurrió un error inesperado
            </h2>
            <p className="text-xs sm:text-sm text-ink-faint max-w-md mx-auto leading-relaxed">
              Ha sucedido un fallo al renderizar esta sección de la aplicación. Puedes intentar recargar para restablecer la vista.
            </p>
          </div>

          {this.state.error?.message && (
            <div className="bg-bg border border-line p-3.5 rounded-xl text-left max-h-32 overflow-y-auto custom-scrollbar">
              <span className="text-[10px] font-mono text-negative font-semibold block mb-1">
                Detalle técnico:
              </span>
              <p className="text-xs font-mono text-ink-soft break-words">
                {this.state.error.message}
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-accent hover:bg-accent-2 text-white text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Reintentar / Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}