// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Avatar } from '../../src/web/avatar.tsx';
import { BotaoIcone } from '../../src/web/botao-icone.tsx';
import { CampoBusca } from '../../src/web/campo-busca.tsx';
import { CampoData } from '../../src/web/campo-data.tsx';
import { MenuAcoes } from '../../src/web/menu-acoes.tsx';
import { ShellApp } from '../../src/web/shell-app.tsx';
import { Switch } from '../../src/web/switch.tsx';
import { Tabela } from '../../src/web/tabela.tsx';

afterEach(() => cleanup());

const colunas = [
  { id: 'nome', rotulo: 'Nome', tipo: 'texto' as const },
  { id: 'valor', rotulo: 'Valor', tipo: 'numero' as const },
];

describe('Switch', () => {
  it('expõe aria-checked e alterna', () => {
    const onMudar = vi.fn();
    render(<Switch id="alertas" rotulo="Alertas" marcado={false} onMudar={onMudar} />);
    const controle = screen.getByRole('switch', { name: 'Alertas' });
    expect(controle).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(controle);
    expect(onMudar).toHaveBeenCalledWith(true);
  });

  it('desabilitado não alterna', () => {
    const onMudar = vi.fn();
    render(<Switch id="alertas" rotulo="Alertas" marcado={false} onMudar={onMudar} desabilitado />);
    fireEvent.click(screen.getByRole('switch', { name: 'Alertas' }));
    expect(onMudar).not.toHaveBeenCalled();
  });
});

describe('MenuAcoes', () => {
  it('abre, fecha com Esc e só confirma a ação destrutiva', () => {
    const excluir = vi.fn();
    const editar = vi.fn();
    render(
      <MenuAcoes
        rotulo="Ações"
        acoes={[
          { id: 'editar', rotulo: 'Editar', onEscolher: editar },
          { id: 'excluir', rotulo: 'Excluir', destrutivo: true, onEscolher: excluir },
        ]}
      />,
    );
    expect(screen.queryByRole('menuitem', { name: 'Excluir' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Ações' }));
    const item = screen.getByRole('menuitem', { name: 'Excluir' });
    expect(item.closest('.mo-menu-acoes__lista')).not.toBeNull();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'Ações' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Ações' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));
    expect(editar).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Ações' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Excluir' }));
    expect(excluir).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(excluir).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Ações' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Excluir' }));
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(excluir).toHaveBeenCalledTimes(1);
  });
});

describe('CampoData', () => {
  it('liga o erro ao campo', () => {
    render(<CampoData id="vencimento" rotulo="Vencimento" valor="" onMudar={() => undefined} erro="Data inválida" />);
    const campo = screen.getByLabelText('Vencimento');
    expect(campo).toHaveAttribute('type', 'date');
    expect(campo).toHaveAttribute('lang', 'pt-BR');
    expect(campo).toHaveAttribute('aria-invalid', 'true');
    expect(campo).toHaveAttribute('aria-describedby', 'vencimento-erro');
    expect(document.getElementById('vencimento-erro')).toHaveTextContent('Data inválida');
  });
});

describe('Tabela', () => {
  it('exige caption e marca a linha selecionada', () => {
    render(
      <Tabela
        caption="Gastos"
        colunas={colunas}
        linhas={[{ id: '1', celulas: { nome: 'Café', valor: 'R$ 10,00' } }]}
        selecionadaId="1"
        onSelecionar={() => undefined}
      />,
    );
    expect(screen.getByRole('table', { name: 'Gastos' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Valor' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('row', { selected: true })).toBeInTheDocument();
    expect(screen.getByText('R$ 10,00')).toHaveClass('mo-tabela__numero');
  });
});

describe('CampoBusca', () => {
  it('é busca, limpa e aponta o resultado', () => {
    const onMudar = vi.fn();
    render(<CampoBusca id="q" rotulo="Busca" valor="café" onMudar={onMudar} controlesId="lista" />);
    const campo = screen.getByLabelText('Busca');
    expect(campo).toHaveAttribute('type', 'search');
    expect(campo).toHaveAttribute('aria-controls', 'lista');
    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(onMudar).toHaveBeenCalledWith('');
  });
});

describe('BotaoIcone', () => {
  it('só tem o nome acessível', () => {
    const onPress = vi.fn();
    render(<BotaoIcone nome="edit" rotulo="Editar" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('Avatar', () => {
  it('esconde o círculo quando o nome está ao lado', () => {
    const { container } = render(<Avatar iniciais="MO" nome="Maria" comNome />);
    expect(container.querySelector('.mo-avatar__iniciais')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
});

describe('ShellApp', () => {
  it('mostra a aba recebida como ativa', () => {
    render(
      <ShellApp
        abas={[{ id: 'ajustes', rotulo: 'Ajustes', icone: 'settings' }]}
        ativa="ajustes"
        onNavegar={() => undefined}
        cabecalho={<h1>Cabeçalho</h1>}
      >
        conteúdo
      </ShellApp>,
    );
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajustes' })).toHaveAttribute('aria-current', 'page');
  });
});
