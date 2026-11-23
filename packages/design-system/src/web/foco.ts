'use client'

const SELETOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function focaveis(painel: HTMLElement): HTMLElement[] {
  return Array.from(painel.querySelectorAll<HTMLElement>(SELETOR)).filter((elemento) => {
    if (elemento.hasAttribute('disabled')) return false;
    return elemento.tabIndex >= 0;
  });
}

/** Guarda o foco, circula Tab dentro do painel e devolve o foco ao fechar. */
export function prenderFoco(painel: HTMLElement, aoFechar: () => void): () => void {
  const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const primeiroInicial = focaveis(painel)[0];
  if (primeiroInicial) primeiroInicial.focus();
  else painel.focus();

  const aoTecla = (evento: KeyboardEvent) => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      aoFechar();
      return;
    }
    if (evento.key !== 'Tab') return;
    const itens = focaveis(painel);
    const primeiro = itens[0];
    const ultimo = itens[itens.length - 1];
    if (!primeiro || !ultimo) {
      evento.preventDefault();
      return;
    }
    const ativo = document.activeElement;
    if (evento.shiftKey) {
      if (ativo === primeiro || !painel.contains(ativo)) {
        evento.preventDefault();
        ultimo.focus();
      }
      return;
    }
    if (ativo === ultimo || !painel.contains(ativo)) {
      evento.preventDefault();
      primeiro.focus();
    }
  };

  window.addEventListener('keydown', aoTecla);
  return () => {
    window.removeEventListener('keydown', aoTecla);
    if (anterior && document.contains(anterior)) anterior.focus();
  };
}
