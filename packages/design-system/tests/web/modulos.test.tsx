// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BlocoSaldo } from '../../src/web/modulos/bloco-saldo.tsx';
import { CabecalhoTela } from '../../src/web/modulos/cabecalho-tela.tsx';
import { CartaoVazio } from '../../src/web/modulos/cartao-vazio.tsx';
import { GradeTotais } from '../../src/web/modulos/grade-totais.tsx';
import { GrupoComMedidor } from '../../src/web/modulos/grupo-com-medidor.tsx';
import { LinhaLancamento } from '../../src/web/modulos/linha-lancamento.tsx';

afterEach(() => cleanup());

describe('BlocoSaldo (web)', () => {
  it('mostra o valor e alterna a ocultação pelo botão', () => {
    const onAlternar = vi.fn();
    const { rerender } = render(<BlocoSaldo rotulo="Disponível neste mês" valorCentavos={69820} percentualUsado={87} fraseApoio="Usou 87% do planejado · Faltam 13 dias" ocultado={false} onAlternarOcultar={onAlternar} />);
    expect(screen.getByText('R$ 698,20')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar valores' }));
    expect(onAlternar).toHaveBeenCalledTimes(1);
    rerender(<BlocoSaldo rotulo="Disponível neste mês" valorCentavos={69820} percentualUsado={87} fraseApoio="Usou 87% do planejado · Faltam 13 dias" ocultado onAlternarOcultar={onAlternar} />);
    expect(screen.getByText('R$ •••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostrar valores' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('GradeTotais (web)', () => {
  it('renderiza um total por item com plano', () => {
    render(<GradeTotais itens={[{ rotulo: 'Receitas', realizadoCentavos: 820000, planejadoCentavos: 820000 }, { rotulo: 'Fixas', realizadoCentavos: 359000, planejadoCentavos: 361000 }]} />);
    expect(screen.getByText('R$ 8.200')).toBeInTheDocument();
    expect(screen.getByText('de R$ 3.610 planejados')).toBeInTheDocument();
  });
});

describe('GrupoComMedidor (web)', () => {
  it('expõe aria-expanded e mostra itens só quando aberto', () => {
    const onAlternar = vi.fn();
    const { rerender } = render(<GrupoComMedidor rotulo="Moradia" realizadoCentavos={210000} planejadoCentavos={210000} aberto={false} onAlternar={onAlternar}><p>Aluguel</p></GrupoComMedidor>);
    const cabecalho = screen.getByRole('button', { name: /Moradia/ });
    expect(cabecalho).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Aluguel')).toBeNull();
    expect(screen.getByText('No limite do planejado')).toBeInTheDocument();
    fireEvent.click(cabecalho);
    expect(onAlternar).toHaveBeenCalledTimes(1);
    rerender(<GrupoComMedidor rotulo="Moradia" realizadoCentavos={210000} planejadoCentavos={210000} aberto onAlternar={onAlternar}><p>Aluguel</p></GrupoComMedidor>);
    expect(screen.getByText('Aluguel')).toBeInTheDocument();
  });
});

describe('LinhaLancamento (web)', () => {
  it('mostra data, item, meio e badge de fatura, e abre ao tocar', () => {
    const onAbrir = vi.fn();
    render(<LinhaLancamento descricao="Supermercado" valorCentavos={18640} dataIso="2026-11-12" item="Mercado" meio="Débito" badgeFatura="Fatura 12/2026" onAbrir={onAbrir} />);
    expect(screen.getByText('12/11/2026 · Mercado · Débito')).toBeInTheDocument();
    expect(screen.getByText('Fatura 12/2026')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Supermercado/ }));
    expect(onAbrir).toHaveBeenCalledTimes(1);
  });
});

describe('CabecalhoTela e CartaoVazio (web)', () => {
  it('navega entre meses e volta', () => {
    const onAnterior = vi.fn();
    const onVoltar = vi.fn();
    render(<CabecalhoTela titulo="Resumo" navegacaoMes={{ rotulo: 'novembro de 2026', onAnterior, onProximo: () => undefined }} onVoltar={onVoltar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mês anterior' }));
    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(onAnterior).toHaveBeenCalledTimes(1);
    expect(onVoltar).toHaveBeenCalledTimes(1);
  });
  it('cartão vazio mostra ação só quando informada', () => {
    const { rerender } = render(<CartaoVazio titulo="Nenhum lançamento neste mês" frase="Registre cada gasto." />);
    expect(screen.queryByRole('button')).toBeNull();
    rerender(<CartaoVazio titulo="Nenhum lançamento neste mês" frase="Registre cada gasto." acao={{ rotulo: 'Registrar lançamento', onPress: () => undefined }} />);
    expect(screen.getByRole('button', { name: 'Registrar lançamento' })).toBeInTheDocument();
  });
});
