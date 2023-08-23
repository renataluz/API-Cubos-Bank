let { contas, depositos, saques, idConta, transferencias } = require("../bancodedados");
let { consultarSaldo } = require("./transacoes");
const { validarCpfEmail, validarParametros, validarConta } = require("../controladores/validacoes");

const listarContas = (req, res) => {

    if (contas.length === 0) {

        return res.status(200).json(
            {
                "mensagem": "Nenhuma conta bancária foi encontrada"
            });

    } else {

        let jsonRetorno = [];
        let resultado = {};

        contas.forEach((conta) => {
            resultado = {
                "numero": (conta.numero_conta).toString(),
                "saldo": conta.saldo,
                "usuario": {
                    "nome": conta.nome,
                    "cpf": conta.cpf,
                    "data_nascimento": conta.data_nascimento,
                    "telefone": conta.telefone,
                    "email": conta.email,
                    "senha": conta.senha
                }
            };

            jsonRetorno.push(resultado);

        });

        return res.status(200).json(
            jsonRetorno
        );
    }
};

const abrirConta = (req, res) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const parametros = { nome, cpf, data_nascimento, telefone, email, senha };
    const parametrosValidos = validarParametros(parametros);

    if (parametrosValidos.status === 200) {

        const cpfValido = validarCpfEmail(cpf);
        const emailValido = validarCpfEmail(email);

        if (cpfValido.status === 400) {

            return res.status(cpfValido.status).json(
                {
                    "mensagem": cpfValido.mensagem
                });
        }

        if (emailValido.status === 400) {

            return res.status(emailValido.status).json(
                {
                    "mensagem": emailValido.mensagem
                });
        }

        contas.push({
            numero_conta: idConta++,
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
            saldo: "0"
        });

        return res.status(204).json();

    } else {

        return res.status(parametrosValidos.status).json(
            {
                "mensagem": parametrosValidos.mensagem
            });
    }
}

const atualizarUsuarioConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const parametros = { nome, cpf, data_nascimento, telefone, email, senha };

    const contaValida = validarConta(numeroConta);

    if (contaValida.status === 200) {
        let conta = contaValida.conta;
        const cpfValido = validarCpfEmail(cpf);
        const emailValido = validarCpfEmail(email);

        if (cpfValido.status === 400) {

            return res.status(cpfValido.status).json(
                {
                    "mensagem": cpfValido.mensagem
                });
        }

        if (emailValido.status === 400) {

            return res.status(emailValido.status).json(
                {
                    "mensagem": emailValido.mensagem
                });
        }

        const parametrosValidos = validarParametros(parametros);

        if (parametrosValidos.status === 200) {

            conta.nome = nome;
            conta.cpf = cpf;
            conta.data_nascimento = data_nascimento;
            conta.telefone = telefone;
            conta.email = email;
            conta.senha = senha;

            return res.status(204).json();

        } else {

            return res.status(parametrosValidos.status).json(
                {
                    "mensagem": parametrosValidos.mensagem
                });

        }
    } else {

        return res.status(contaValida.status).json(
            {
                "mensagem": contaValida.mensagem
            });
    }
}

const excluirConta = (req, res) => {

    const { numeroConta } = req.params;
    const conta = validarConta(numeroConta);

    if (conta.status === 200) {

        const { saldo } = consultarSaldo(Number(numeroConta));

        if (saldo === 0) {

            contas.splice(Number(numeroConta) - 1, 1);

            return res.status(204).json();

        } else {

            return res.status(400).json(
                {
                    "mensagem": "A conta bancária só poderá ser removida se o saldo for igual a zero."
                });
        }

    } else {

        return res.status(conta.status).json(
            {
                "mensagem": conta.mensagem
            });
    }
}

const informarSaldo = (req, res) => {
    const { numero_conta } = req.query;

    const contaValida = validarConta(numero_conta);

    return res.status(contaValida.status).json(

        consultarSaldo(numero_conta)
    );
}

const informarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    const parametros = { numero_conta, senha };
    const parametrosValidos = validarParametros(parametros);

    if (parametrosValidos.status === 200) {

        const contaValida = validarConta(numero_conta);

        if (contaValida.status === 200) {

            const transferenciasEnviadas = transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);
            const transferenciasRecebidas = transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

            let extrato = {
                depositos: depositos.filter(deposito => {
                    return deposito.numero_conta === numero_conta
                }),
                saques: saques.filter(saque => {
                    return saque.numero_conta === numero_conta
                }),
                transferenciasEnviadas,
                transferenciasRecebidas
            }

            return res.status(200).json(extrato);

        } else {

            return res.status(contaValida.status).json(
                {
                    "mensagem": contaValida.mensagem
                });

        }
    } else {

        return res.status(parametrosValidos.status).json(
            {
                "mensagem": parametrosValidos.mensagem
            });

    }
}

module.exports = {
    listarContas,
    abrirConta,
    atualizarUsuarioConta,
    excluirConta,
    informarSaldo,
    informarExtrato
}

