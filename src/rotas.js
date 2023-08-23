const express = require('express');
const rotas = express();

const contas = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');
const autenticacoes = require("./intermediarios/autenticacoes");

rotas.get('/contas', autenticacoes.autenticacaoGerencia, contas.listarContas);
rotas.get('/contas/saldo', autenticacoes.autenticacaoUsuarioQuery, contas.informarSaldo);
rotas.get('/contas/extrato', autenticacoes.autenticacaoUsuarioQuery, contas.informarExtrato);
rotas.post('/contas', contas.abrirConta);
rotas.delete('/contas/:numeroConta', contas.excluirConta);
rotas.put('/contas/:numeroConta/usuario', contas.atualizarUsuarioConta);

rotas.post('/transacoes/depositar', transacoes.efetuarDeposito);
rotas.post('/transacoes/sacar', autenticacoes.autenticacaoUsuarioBody, transacoes.efetuarSaque);
rotas.post('/transacoes/transferir', autenticacoes.autenticacaoUsuarioBody, transacoes.efetuarTransferencia);


module.exports = rotas;
