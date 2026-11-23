// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CabecalhoSheet } from '../../src/web/modulos/cabecalho-sheet.tsx';
import { LinhaAjuste } from '../../src/web/modulos/linha-ajuste.tsx';
import { LinhaItem } from '../../src/web/modulos/linha-item.tsx';
import { RodapeAcoes } from '../../src/web/modulos/rodape-acoes.tsx';
import { TabelaMeses } from '../../src/web/modulos/tabela-meses.tsx';

afterEach(() => cleanup());

describe('LinhaItem (web)', () => {
  it('mostra valores e frase de estado, e abre ao tocar', () => {
    const onAbrir = vi.fn();
    render(<LinhaItem nome="Mercado" realizadoCentavos={64640} planejadoCentavos={80000} onAbrir={onAbrir} />);
    expect(screen.getByText('Perto do limite · 80%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mercado/ }));
    expect(onAbrir).toHaveBeenCalledTimes(1);
  });
});

describe('LinhaAjuste (web)', () => {
  it('mostra rótulo, apoio e chama onAbrir', () => {
    const onAbrir = vi.fn();
    render(<LinhaAjuste icone="person" rotulo="Conta" apoio="victor@email.com" onAbrir={onAbrir} />);
    expect(screen.getByRole('button', { name: /Conta/ })).toHaveTextContent('victor@email.com');
    fireEvent.click(screen.getByRole('button', { name: /Conta/ }));
    expect(onAbrir).toHaveBeenCalledTimes(1);
  });
});

describe('RodapeAcoes (web)', () => {
  it('cancelar e principal disparam os callbacks certos; principal desabilitado não dispara', () => {
    const onCancelar = vi.fn();
    const onPrincipal = vi.fn();
    const { rerender } = render(<RodapeAcoes textoPrincipal="Salvar" onPrincipal={onPrincipal} onCancelar={onCancelar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onCancelar).toHaveBeenCalledTimes(1);
    expect(onPrincipal).toHaveBeenCalledTimes(1);
    rerender(<RodapeAcoes textoPrincipal="Salvar" onPrincipal={onPrincipal} onCancelar={onCancelar} principalDesabilitado />);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });
  it('principal destrutivo usa a classe de erro', () => {
    render(<RodapeAcoes textoPrincipal="Excluir" principalDestrutivo onPrincipal={() => undefined} onCancelar={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Excluir' })).toHaveClass('mo-botao--destrutivo');
  });
});

describe('CabecalhoSheet (web)', () => {
  it('é um título de nível 2 com subtítulo opcional', () => {
    render(<CabecalhoSheet titulo="Plano do item" subtitulo="Mercado · Alimentação" />);
    expect(screen.getByRole('heading', { name: 'Plano do item', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Mercado · Alimentação')).toBeInTheDocument();
  });
});

describe('TabelaMeses (web)', () => {
  it('mostra 12 meses, total sem R$ e marca o mês atual', () => {
    const vazio = Array<number>(12).fill(0);
    const fixas = [...vazio];
    fixas[10] = 359000;
    const linhas = [
      { id: 'tipo:F', nivel: 'tipo' as const, rotulo: 'Despesas fixas', valoresPorMes: fixas },
      { id: 'sobra', nivel: 'sobra' as const, rotulo: 'Sobra no ano', valoresPorMes: vazio },
      { id: 'outro', nivel: 'item' as const, rotulo: 'Despesas fixas', valoresPorMes: vazio },
    ];
    render(<TabelaMeses legenda="Realizado de 2026" linhas={linhas} mesAtivo={10} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(14);
    expect(screen.getByRole('table', { name: 'Realizado de 2026' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Categoria · item' })).toBeInTheDocument();
    const novembro = screen.getByRole('columnheader', { name: /Nov/ });
    expect(novembro).toHaveTextContent('mês atual');
    expect(novembro).toHaveClass('mo-tabela-meses__ativo');
    expect(screen.getAllByRole('row', { name: /Despesas fixas/ })[0]).toHaveTextContent('3.590');
    expect(screen.getAllByRole('row', { name: /Despesas fixas/ })[0]).not.toHaveTextContent('R$');
    expect(screen.getAllByRole('row', { name: /Despesas fixas/ })).toHaveLength(2);
  });

  it('não marca mês atual quando o ano não é o corrente', () => {
    const vazio = Array<number>(12).fill(0);
    render(
      <TabelaMeses
        legenda="Realizado de 2027"
        linhas={[{ id: 'sobra', nivel: 'sobra', rotulo: 'Sobra no ano', valoresPorMes: vazio }]}
        mesAtivo={null}
      />,
    );
    expect(screen.queryByText('mês atual')).not.toBeInTheDocument();
  });
});
