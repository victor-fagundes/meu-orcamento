// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EstadoErro } from '../../src/web/estado-erro.tsx';
import { Icone } from '../../src/web/icone.tsx';
import { Skeleton } from '../../src/web/skeleton.tsx';

afterEach(() => cleanup());

describe('Icone (web)', () => {
  it('sem rótulo é decorativo (aria-hidden)', () => {
    const { container } = render(<Icone nome="settings" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('com rótulo é uma imagem nomeada', () => {
    render(<Icone nome="delete" rotulo="Excluir" />);
    expect(screen.getByRole('img', { name: 'Excluir' })).toBeInTheDocument();
  });
  it('usa o tamanho pedido', () => {
    const { container } = render(<Icone nome="person" tamanho={20} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '20');
  });
});

describe('Skeleton (web)', () => {
  it('é escondido de leitores de tela e aplica a altura', () => {
    const { container } = render(<Skeleton altura={48} largura={200} />);
    const bloco = container.firstElementChild;
    expect(bloco).toHaveAttribute('aria-hidden', 'true');
    expect(bloco).toHaveStyle({ height: '48px', width: '200px' });
  });
});

describe('EstadoErro (web)', () => {
  it('mostra o erro em alerta e o botão de tentar de novo', () => {
    const onTentar = vi.fn();
    render(<EstadoErro mensagem="Não foi possível carregar o resumo." onTentarNovamente={onTentar} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar o resumo.');
    fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(onTentar).toHaveBeenCalledTimes(1);
  });
});
