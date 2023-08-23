const express = require("express");
const { banco } = require("../bancodedados");
const validacoes = require("../controladores/validacoes");

const app = express();

const autenticacaoGerencia = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {

        return res.status(400).json(
            {
                mensagem: "Senha gerencial não informada."
            }
        );
    }
    if (senha_banco !== banco.senha) {

        return res.status(401).json(
            {
                mensagem: "Senha do gerencial inválida."
            }
        );
    }

    next();
}

const autenticacaoUsuarioBody = (req, res, next) => {
    const { numero_conta, numero_conta_origem, senha } = req.body;
    let contaValida = {};

    if (numero_conta) {

        contaValida = validacoes.validarConta(numero_conta);
        if (contaValida.status !== 200) {
            return res.status(404).json(
                {
                    "mensagem": "Conta bancária não encontrada."
                }
            );
        }

    } else if (numero_conta_origem) {

        contaValida = validacoes.validarConta(numero_conta_origem);
        if (contaValida.status !== 200) {
            return res.status(404).json(
                {
                    "mensagem": "Conta bancária de origem não encontrada."
                }
            );
        }

    } else {

        return res.status(404).json(
            {
                "mensagem": "Conta bancária de origem não informada."
            }
        );
    }

    if (!senha) {

        return res.status(400).json(
            {
                "mensagem": "Senha do usuário não informada."
            }
        );
    } else {

        const { conta } = contaValida;
        if (senha !== conta.senha) {

            return res.status(401).json(
                {
                    "mensagem": "Senha do usuário inválida!"
                }
            );
        }
    }

    next();
}

const autenticacaoUsuarioQuery = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    let contaValida = {};

    if (!numero_conta) {

        return res.status(404).json(
            {
                "mensagem": "Conta bancária não informada."
            }
        );
    } else {
        contaValida = validacoes.validarConta(numero_conta);
        if (contaValida.status !== 200) {
            return res.status(404).json(
                {
                    "mensagem": "Conta bancária não encontrada."
                }
            );
        }
    }

    if (!senha) {

        return res.status(400).json(
            {
                "mensagem": "Senha do usuário não informada."
            }
        );
    } else {

        const { conta } = contaValida;
        if (senha !== conta.senha) {

            return res.status(401).json(
                {
                    "mensagem": "Senha do usuário inválida!"
                }
            );
        }
    }


    next();
}

module.exports = {
    autenticacaoGerencia,
    autenticacaoUsuarioBody,
    autenticacaoUsuarioQuery
}