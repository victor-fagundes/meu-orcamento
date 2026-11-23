// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CampoMoeda } from '../../src/web/campo-moeda.tsx';
import { Checkbox } from '../../src/web/checkbox.tsx';
import { Chips } from '../../src/web/chips.tsx';
import { Dialogo } from '../../src/web/dialogo.tsx';
import { Fab } from '../../src/web/fab.tsx';

afterEach(() => cleanup());

describe('CampoMoeda (web)', () => {
  it('emite centavos inteiros a partir do texto digitado', () => {
    const onMudar = vi.fn();
    render(<CampoMoeda id="valor" rotulo="Valor (R$)" valor={null} onMudar={onMudar} />);
    fireEvent.change(screen.getByLabelText('Valor (R$)'), { target: { value: '186,40' } });
    expect(onMudar).toHaveBeenLastCalledWith(18640);
  });
  it('emite null para campo vazio e para texto inválido', () => {
    const onMudar = vi.fn();
    render(<CampoMoeda id="valor" rotulo="Valor (R$)" valor={null} onMudar={onMudar} />);
    const campo = screen.getByLabelText('Valor (R$)');
    fireEvent.change(campo, { target: { value: '12' } });
    expect(onMudar).toHaveBeenLastCalledWith(1200);
    fireEvent.change(campo, { target: { value: '' } });
    expect(onMudar).toHaveBeenLastCalledWith(null);
    fireEvent.change(campo, { target: { value: 'abc' } });
    expect(onMudar).toHaveBeenLastCalledWith(null);
  });
  it('mostra o valor inicial em centavos formatado sem R$', () => {
    render(<CampoMoeda id="valor" rotulo="Valor (R$)" valor={18640} onMudar={() => undefined} />);
    expect(screen.getByLabelText('Valor (R$)')).toHaveValue('186,40');
  });
});

describe('Chips (web)', () => {
  const opcoes = [
    { valor: 'F', rotulo: 'Fixas' },
    { valor: 'V', rotulo: 'Variáveis' },
  ] as const;
  it('marca o selecionado com aria-pressed e entrega a escolha', () => {
    const onSelecionar = vi.fn();
    render(<Chips rotuloGrupo="Tipo" opcoes={opcoes} selecionado="F" onSelecionar={onSelecionar} />);
    expect(screen.getByRole('button', { name: 'Fixas' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Variáveis' }));
    expect(onSelecionar).toHaveBeenCalledWith('V');
  });
  it('é um grupo nomeado', () => {
    render(<Chips rotuloGrupo="Tipo" opcoes={opcoes} selecionado="F" onSelecionar={() => undefined} />);
    expect(screen.getByRole('group', { name: 'Tipo' })).toBeInTheDocument();
  });
});

describe('Checkbox (web)', () => {
  it('alterna o estado marcado', () => {
    const onMudar = vi.fn();
    render(<Checkbox id="prox" rotulo="Aplicar também aos próximos meses" marcado={false} onMudar={onMudar} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Aplicar também aos próximos meses' }));
    expect(onMudar).toHaveBeenCalledWith(true);
  });
});

describe('Dialogo (web)', () => {
  it('não renderiza quando fechado', () => {
    render(<Dialogo aberto={false} titulo="Arquivar Lazer?" descricao="d" textoConfirmar="Arquivar" tipoConfirmar="destrutivo" onCancelar={() => undefined} onConfirmar={() => undefined} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('renderiza como diálogo modal nomeado quando aberto', () => {
    render(<Dialogo aberto titulo="Arquivar Lazer?" descricao="Os lançamentos continuam." textoConfirmar="Arquivar" tipoConfirmar="destrutivo" onCancelar={() => undefined} onConfirmar={() => undefined} />);
    expect(screen.getByRole('dialog', { name: 'Arquivar Lazer?' })).toHaveAttribute('aria-modal', 'true');
  });
  it('Esc chama onCancelar', () => {
    const onCancelar = vi.fn();
    render(<Dialogo aberto titulo="t" descricao="d" textoConfirmar="Ok" tipoConfirmar="primario" onCancelar={onCancelar} onConfirmar={() => undefined} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
  it('confirmar chama onConfirmar e a ação destrutiva usa a classe de erro', () => {
    const onConfirmar = vi.fn();
    render(<Dialogo aberto titulo="t" descricao="d" textoConfirmar="Excluir" tipoConfirmar="destrutivo" onCancelar={() => undefined} onConfirmar={onConfirmar} />);
    const excluir = screen.getByRole('button', { name: 'Excluir' });
    expect(excluir).toHaveClass('mo-botao--destrutivo');
    fireEvent.click(excluir);
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });
});

describe('Fab (web)', () => {
  it('não renderiza nada no web (FAB é só do celular)', () => {
    const { container } = render(<Fab rotulo="+ Novo item" onPress={() => undefined} />);
    expect(container.innerHTML).toBe('');
  });
});
