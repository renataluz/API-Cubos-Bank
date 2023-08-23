const { format } = require("date-fns");
let { depositos, saques, transferencias } = require("../bancodedados");
const { validarParametros, validarConta } = require("../controladores/validacoes");

const consultarSaldo = (numeroConta) => {

    const { conta } = validarConta(numeroConta);
    const saldo = Number(conta.saldo);

    return { saldo };
}

const efetuarDeposito = (req, res) => {
    const { numero_conta, valor } = req.body;
    const parametros = { "numero_conta": numero_conta, "valor": valor };

    const parametrosValidos = validarParametros(parametros);

    if (parametrosValidos.status === 200) {

        let contaValida = validarConta(numero_conta);

        if (contaValida.status === 200) {
            let { conta } = contaValida;

            if (valor > 0) {

                let { saldo } = consultarSaldo(numero_conta);

                saldo += Number(valor);

                depositos.push(
                    {
                        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        numero_conta,
                        valor
                    }
                );

                conta.saldo = saldo.toString();

                return res.status(204).json();

            } else {
                return res.status(400).json(
                    {
                        "mensagem": "Valor do depósito inválido."
                    });
            }
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

const efetuarSaque = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const parametros = { numero_conta, valor, senha };
    const parametrosValidos = validarParametros(parametros);

    if (parametrosValidos.status === 200) {

        const contaValida = validarConta(numero_conta);

        if (contaValida.status === 200) {
            const { conta } = contaValida;

            if (Number(valor) > 0) {

                let saldo = Number(consultarSaldo(numero_conta).saldo);

                if (saldo >= Number(valor)) {

                    saldo -= valor;

                    saques.push(
                        {
                            data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            numero_conta,
                            valor
                        }
                    );

                    conta.saldo = saldo.toString();

                    return res.status(204).json();

                } else {

                    return res.status(400).json(
                        {
                            "mensagem": "Saldo insuficiente."
                        });
                }
            } else {

                return res.status(400).json(
                    {
                        "mensagem": "Valor do saque inválido."
                    });
            }

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

const efetuarTransferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    const parametros = { numero_conta_origem, numero_conta_destino, valor, senha };
    const parametrosValidos = validarParametros(parametros);

    if (parametrosValidos.status === 200) {
        const contaOrigem = validarConta(numero_conta_origem);
        const contaDestino = validarConta(numero_conta_destino);

        if (contaOrigem.status === 200 && contaDestino.status === 200) {

            let contaOrigemValida = contaOrigem.conta;
            let contaDestinoValida = contaDestino.conta;
            if (contaOrigemValida !== contaDestinoValida) {
                if (Number(valor) > 0) {

                    let saldoOrigem = consultarSaldo(numero_conta_origem).saldo;
                    let saldoDestino = consultarSaldo(numero_conta_destino).saldo;

                    if (saldoOrigem >= Number(valor)) {
                        saldoOrigem -= valor;
                        saldoDestino += valor;

                        transferencias.push(
                            {
                                data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                numero_conta_origem,
                                numero_conta_destino,
                                valor
                            }
                        );

                        contaOrigemValida.saldo = saldoOrigem.toString();
                        contaDestinoValida.saldo = saldoDestino.toString();

                        return res.status(204).json();

                    } else {

                        return res.status(400).json(
                            {
                                "mensagem": "Saldo insuficiente."
                            });
                    }
                } else {

                    return res.status(400).json(
                        {
                            "mensagem": "Valor de transferência inválido."
                        });
                }
            } else {
                return res.status(contaOrigem.status).json(
                    {
                        "mensagem": "Operação inválida. Número da conta bancária de origem e de destino são iguais."
                    });
            }

        } else {

            if (!contaOrigem || contaOrigem.status === 404) {

                return res.status(contaOrigem.status).json(
                    {
                        "mensagem": "Conta bancária de origem não encontrada."
                    });
            }

            if (!contaDestino || contaDestino.status === 404) {

                return res.status(contaDestino.status).json(
                    {
                        "mensagem": "Conta bancária de destino não encontrada."
                    });
            }
        }
    } else {

        return res.status(parametrosValidos.status).json(
            {
                "mensagem": parametrosValidos.mensagem
            });
    }
}

module.exports = {
    consultarSaldo,
    efetuarDeposito,
    efetuarSaque,
    efetuarTransferencia
}