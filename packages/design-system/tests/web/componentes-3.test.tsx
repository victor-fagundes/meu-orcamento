// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormularioContainer } from '../../src/web/formulario-container.tsx';
import { NavegacaoPrincipal } from '../../src/web/navegacao-principal.tsx';
import { Select } from '../../src/web/select.tsx';
import { ThemeProvider, useTema } from '../../src/web/tema.tsx';

afterEach(() => cleanup());

const grupos = [
  { rotulo: 'Receitas', opcoes: [{ valor: 'salario', rotulo: 'Salário' }] },
  { rotulo: 'Despesas fixas', opcoes: [{ valor: 'aluguel', rotulo: 'Aluguel' }] },
];

describe('Select (web)', () => {
  it('agrupa opções em optgroup com o rótulo do tipo', () => {
    render(<Select id="item" rotulo="Item" valor={null} grupos={grupos} onMudar={() => undefined} />);
    const select = screen.getByLabelText('Item');
    const grupo = select.querySelector('optgroup[label="Despesas fixas"]');
    expect(grupo).not.toBeNull();
    expect(grupo?.querySelector('option')?.textContent).toBe('Aluguel');
  });
  it('entrega a escolha e marca erro com aria-invalid', () => {
    const onMudar = vi.fn();
    render(<Select id="item" rotulo="Item" valor="aluguel" grupos={grupos} onMudar={onMudar} erro="Escolha um item." />);
    const select = screen.getByLabelText('Item');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(select, { target: { value: 'salario' } });
    expect(onMudar).toHaveBeenCalledWith('salario');
  });
});

describe('FormularioContainer (web)', () => {
  it('não renderiza fechado', () => {
    render(<FormularioContainer aberto={false} titulo="Novo item" textoSalvar="Salvar" onCancelar={() => undefined} onSalvar={() => undefined}>x</FormularioContainer>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('é um painel modal nomeado, com Esc para fechar', () => {
    const onCancelar = vi.fn();
    render(<FormularioContainer aberto titulo="Novo item" textoSalvar="Salvar" onCancelar={onCancelar} onSalvar={() => undefined}><p>campos</p></FormularioContainer>);
    expect(screen.getByRole('dialog', { name: 'Novo item' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
  it('salvar desabilitado não dispara onSalvar', () => {
    const onSalvar = vi.fn();
    render(<FormularioContainer aberto titulo="Novo item" textoSalvar="Salvar" salvarDesabilitado onCancelar={() => undefined} onSalvar={onSalvar}>x</FormularioContainer>);
    const salvar = screen.getByRole('button', { name: 'Salvar' });
    expect(salvar).toBeDisabled();
    fireEvent.click(salvar);
    expect(onSalvar).not.toHaveBeenCalled();
  });
});

describe('NavegacaoPrincipal (web)', () => {
  const abas = [
    { id: 'resumo', rotulo: 'Resumo', icone: 'dashboard' },
    { id: 'ajustes', rotulo: 'Ajustes', icone: 'settings' },
  ] as const;
  it('marca a aba ativa com aria-current e navega', () => {
    const onNavegar = vi.fn();
    render(<NavegacaoPrincipal abas={abas} ativa="ajustes" onNavegar={onNavegar} />);
    expect(screen.getByRole('button', { name: 'Ajustes' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'Resumo' }));
    expect(onNavegar).toHaveBeenCalledWith('resumo');
  });
});

describe('ThemeProvider (web)', () => {
  function Mostra() {
    const { tema, modo, definirModo } = useTema();
    return (
      <div>
        <span data-testid="tema">{tema}</span>
        <span data-testid="modo">{modo}</span>
        <button type="button" onClick={() => definirModo('dark')}>escuro</button>
      </div>
    );
  }
  it('aplica data-theme no elemento raiz e troca de modo', () => {
    render(<ThemeProvider modoInicial="light"><Mostra /></ThemeProvider>);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    fireEvent.click(screen.getByRole('button', { name: 'escuro' }));
    expect(screen.getByTestId('tema')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
  it('useTema fora do provider lança erro', () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Mostra />)).toThrow('useTema precisa estar dentro de ThemeProvider');
    erro.mockRestore();
  });
});
