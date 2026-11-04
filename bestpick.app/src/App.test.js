import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import dashboardAPI from './services/dashboardAPI';
import historicoAPI from './services/historicoAPI';
import produtoAPI from './services/produtoAPI';

jest.mock('./services/dashboardAPI', () => ({ obterAsync: jest.fn() }));
jest.mock('./services/historicoAPI', () => ({ listarAsync: jest.fn() }));
jest.mock('./services/produtoAPI', () => ({ buscarPorHistoricoAsync: jest.fn() }));

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  jest.clearAllMocks();
  dashboardAPI.obterAsync.mockResolvedValue({ totalBuscas: 3 });
  historicoAPI.listarAsync.mockResolvedValue([]);
  produtoAPI.buscarPorHistoricoAsync.mockResolvedValue([]);
});

test('mostra o login e permite acessar o cadastro', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'Criar conta' }));
  expect(screen.getByRole('heading', { name: 'Crie sua conta' })).toBeInTheDocument();
});

test('redireciona uma rota privada sem sessao para o login', () => {
  window.history.replaceState({}, '', '/dashboard');
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument();
  expect(dashboardAPI.obterAsync).not.toHaveBeenCalled();
});

test('mantem nomes acessiveis nos quatro links da Sidebar', async () => {
  localStorage.setItem('token', 'sessao-ficticia-exclusiva-do-teste');
  window.history.replaceState({}, '', '/dashboard');
  render(<App />);
  for (const name of ['Dashboard', 'Favoritos', 'Chat', 'Histórico']) {
    expect(await screen.findByRole('link', { name, exact: true })).toHaveAttribute('aria-label', name);
  }
  await screen.findByRole('link', { name: /Buscas realizadas 3/ });
});

test('cards do Dashboard sao links e o teclado navega ate o Historico', async () => {
  localStorage.setItem('token', 'sessao-ficticia-exclusiva-do-teste');
  window.history.replaceState({}, '', '/dashboard');
  render(<App />);
  const card = await screen.findByRole('link', { name: /Buscas realizadas 3/ });
  expect(card).toHaveAttribute('href', '/historico');
  expect(screen.getByRole('link', { name: /Favoritados 0/ })).toHaveAttribute('href', '/favoritos');
  expect(screen.getByRole('link', { name: /Adquiridos 0/ })).toHaveAttribute('href', '/favoritos');
  card.focus();
  userEvent.keyboard('{enter}');
  expect(await screen.findByRole('heading', { name: 'Histórico de buscas' })).toBeInTheDocument();
});

test('botao do Historico expande e recolhe produtos pelo teclado', async () => {
  localStorage.setItem('token', 'sessao-ficticia-exclusiva-do-teste');
  window.history.replaceState({}, '', '/historico');
  historicoAPI.listarAsync.mockResolvedValue([
    { id: 1, produtoNome: 'Produto de teste', valorCompra: 100, motivoCompra: 'Uso diario', dataBusca: '2026-11-04' },
  ]);
  render(<App />);
  const button = await screen.findByRole('button', { name: 'Ver produtos de Produto de teste' });
  expect(button).toHaveAttribute('aria-expanded', 'false');
  button.focus();
  userEvent.keyboard('{enter}');
  await waitFor(() => expect(produtoAPI.buscarPorHistoricoAsync).toHaveBeenCalledTimes(1));
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(button).toHaveAttribute('aria-controls', 'produtos-1');
  expect(await screen.findByText('Nenhum produto encontrado para esta busca.')).toBeVisible();
  userEvent.keyboard(' ');
  await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));
  expect(produtoAPI.buscarPorHistoricoAsync).toHaveBeenCalledTimes(1);
});

test('logout remove a sessao e retorna ao login', async () => {
  localStorage.setItem('token', 'sessao-ficticia-exclusiva-do-teste');
  window.history.replaceState({}, '', '/dashboard');
  render(<App />);
  await screen.findByRole('link', { name: /Buscas realizadas 3/ });
  userEvent.click(screen.getByRole('button', { name: 'Sair' }));
  expect(localStorage.getItem('token')).toBeNull();
  expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument();
});
