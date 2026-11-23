// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Dialogo } from '../../src/web/dialogo.tsx';
import { FormularioContainer } from '../../src/web/formulario-container.tsx';

afterEach(() => cleanup());

function CenaDialogo() {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setAberto(true)}>Abrir</button>
      <Dialogo
        aberto={aberto}
        titulo="Arquivar Lazer?"
        descricao="O item sai do mês."
        textoConfirmar="Arquivar"
        tipoConfirmar="destrutivo"
        onCancelar={() => setAberto(false)}
        onConfirmar={() => setAberto(false)}
      />
    </>
  );
}

function CenaFormulario() {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setAberto(true)}>Abrir painel</button>
      <FormularioContainer
        aberto={aberto}
        titulo="Editar"
        textoSalvar="Salvar"
        onCancelar={() => setAberto(false)}
        onSalvar={() => setAberto(false)}
      >
        <input aria-label="Nome" />
      </FormularioContainer>
    </>
  );
}

describe('foco do diálogo e do painel', () => {
  it('Dialogo circula Tab e devolve o foco', () => {
    render(<CenaDialogo />);
    const abrir = screen.getByRole('button', { name: 'Abrir' });
    abrir.focus();
    fireEvent.click(abrir);
    const cancelar = screen.getByRole('button', { name: 'Cancelar' });
    const confirmar = screen.getByRole('button', { name: 'Arquivar' });
    expect(cancelar).toHaveFocus();
    confirmar.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(cancelar).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(confirmar).toHaveFocus();
    fireEvent.click(cancelar);
    expect(abrir).toHaveFocus();
  });

  it('FormularioContainer circula Tab e devolve o foco', () => {
    render(<CenaFormulario />);
    const abrir = screen.getByRole('button', { name: 'Abrir painel' });
    abrir.focus();
    fireEvent.click(abrir);
    const nome = screen.getByLabelText('Nome');
    const salvar = screen.getByRole('button', { name: 'Salvar' });
    expect(nome).toHaveFocus();
    salvar.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(nome).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(salvar).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(abrir).toHaveFocus();
  });
});
