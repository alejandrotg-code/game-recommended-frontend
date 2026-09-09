import { Component } from 'react';

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
        <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-[#0a1628]/90 border border-rose-500/30 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_-12px_rgba(244,63,94,0.25)] text-center space-y-5 animate-fade-up">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-2xl">
            ⚠️
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              ¡Ups! Ocurrió un error inesperado
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Ha sucedido un fallo al renderizar esta sección de la aplicación. Puedes intentar recargar para restablecer la vista.
            </p>
          </div>

          {this.state.error?.message && (
            <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-xl text-left max-h-32 overflow-y-auto custom-scrollbar">
              <span className="text-[10px] font-mono text-rose-400 font-semibold block mb-1">
                Detalle técnico:
              </span>
              <p className="text-xs font-mono text-slate-300 break-words">
                {this.state.error.message}
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
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
