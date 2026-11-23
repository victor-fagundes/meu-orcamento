// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Banner } from '../../src/web/banner.tsx';
import { Botao } from '../../src/web/botao.tsx';
import { Campo } from '../../src/web/campo.tsx';
import { Medidor } from '../../src/web/medidor.tsx';
import { Snackbar } from '../../src/web/snackbar.tsx';

afterEach(() => cleanup());

describe('Botao (web)', () => {
  it('chama onPress ao clicar', () => {
    const onPress = vi.fn();
    render(<Botao variante="primario" onPress={onPress}>Salvar</Botao>);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  it('desabilitado não dispara onPress', () => {
    const onPress = vi.fn();
    render(<Botao variante="primario" onPress={onPress} disabled>Salvar</Botao>);
    const botao = screen.getByRole('button', { name: 'Salvar' });
    expect(botao).toBeDisabled();
    fireEvent.click(botao);
    expect(onPress).not.toHaveBeenCalled();
  });
  it('carregando mostra texto de espera e marca aria-busy', () => {
    render(<Botao variante="primario" onPress={() => undefined} loading>Salvar</Botao>);
    const botao = screen.getByRole('button', { name: 'Carregando…' });
    expect(botao).toHaveAttribute('aria-busy', 'true');
    expect(botao).toBeDisabled();
  });
  it('ícone sem texto usa o nome acessível informado', () => {
    render(<Botao variante="texto" onPress={() => undefined} acessibilidade="Fechar">✕</Botao>);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
  });
  it('aplica a classe da variante', () => {
    render(<Botao variante="destrutivo" onPress={() => undefined}>Excluir</Botao>);
    expect(screen.getByRole('button', { name: 'Excluir' })).toHaveClass('mo-botao--destrutivo');
  });
});

describe('Campo (web)', () => {
  it('liga o rótulo ao campo pelo id', () => {
    render(<Campo id="valor" rotulo="Valor (R$)" valor="" onMudar={() => undefined} />);
    expect(screen.getByLabelText('Valor (R$)')).toHaveAttribute('id', 'valor');
  });
  it('mostra o erro e marca aria-invalid com aria-describedby', () => {
    render(<Campo id="valor" rotulo="Valor (R$)" valor="0" onMudar={() => undefined} erro="Informe um valor maior que zero." />);
    const campo = screen.getByLabelText('Valor (R$)');
    expect(campo).toHaveAttribute('aria-invalid', 'true');
    expect(campo).toHaveAttribute('aria-describedby', 'valor-erro');
    expect(screen.getByText('Informe um valor maior que zero.')).toBeInTheDocument();
  });
  it('entrega cada mudança ao chamador', () => {
    const onMudar = vi.fn();
    render(<Campo id="nome" rotulo="Nome" valor="" onMudar={onMudar} />);
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Mercado' } });
    expect(onMudar).toHaveBeenCalledWith('Mercado');
  });
});

describe('Medidor (web)', () => {
  it('expõe progressbar com valor limitado a 100 e mostra a frase de estado', () => {
    render(<Medidor rotulo="Lazer" valor={250} estado="estourou" frase="Estourou em R$ 300,00" />);
    const barra = screen.getByRole('progressbar', { name: 'Lazer' });
    expect(barra).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('Estourou em R$ 300,00')).toBeInTheDocument();
  });
  it('valor negativo ou inválido vira zero', () => {
    render(<Medidor rotulo="Teste" valor={Number.NaN} estado="sem-plano" frase="Sem valor planejado" />);
    expect(screen.getByRole('progressbar', { name: 'Teste' })).toHaveAttribute('aria-valuenow', '0');
  });
});

describe('Banner (web)', () => {
  it('erro usa role alert; atenção e informação usam status', () => {
    const { unmount } = render(<Banner tipo="erro">Não foi possível salvar.</Banner>);
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível salvar.');
    unmount();
    render(<Banner tipo="atencao">Perto do limite.</Banner>);
    expect(screen.getByRole('status')).toHaveTextContent('Perto do limite.');
  });
});

describe('Snackbar (web)', () => {
  it('mostra desfazer quando há ação e chama o callback', () => {
    const onDesfazer = vi.fn();
    render(<Snackbar mensagem="Lançamento excluído." onDesfazer={onDesfazer} />);
    fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(onDesfazer).toHaveBeenCalledTimes(1);
  });
  it('sem ação, não mostra botão', () => {
    render(<Snackbar mensagem="Categoria arquivada." />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
