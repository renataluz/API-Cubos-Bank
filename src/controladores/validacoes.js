const { contas } = require("../bancodedados");

//verifica se é uma conta existente
const validarConta = (numero_conta) => {

    let conta = contas.find((conta) => {
        return (conta.numero_conta === Number(numero_conta));
    });

    if (conta) {

        return {
            "status": 200,
            conta
        };

    } else {
        return {
            "status": 404,
            "mensagem": "Conta bancária não encontrada."
        };
    }
}

//verifica se o cpf e o email do usuário são únicos
const validarCpfEmail = (cpfOuEmail) => {
    const { contas } = require("../bancodedados");
    const cpfUnico = contas.find(conta => { return conta.cpf === cpfOuEmail });
    const emailUnico = contas.find(conta => { return conta.email === cpfOuEmail });

    if (cpfUnico) {

        return {
            "status": 400,
            "mensagem": "Já existe uma conta bancária com o cpf informado."
        };
    }

    if (emailUnico) {

        return {
            "status": 400,
            "mensagem": "Já existe uma conta bancária com o e-mail informado."
        };
    }

    return {
        "status": 200,
        "mensagem": ""
    };
}

//verifica se os parâmetros estão preenchidos
const validarParametros = (parametros) => {

    const arrayParametros = Object.keys(parametros);
    const arrayParametrosInvalidos = [];

    for (const parametro of arrayParametros) {
        if (!parametros[parametro]) {

            arrayParametrosInvalidos.push(parametro.split("_").join(" "));

        } else if (!parametros[parametro].toString().trim()) {

            arrayParametrosInvalidos.push(parametro.split("_").join(" "));

        }
    }

    if (arrayParametrosInvalidos.length === 0) {

        return {
            "status": 200,
            "mensagem": ""
        }

    } else {
        let virgulaOue = arrayParametrosInvalidos.length;
        let mensagemParametrosInvalidos = arrayParametrosInvalidos;

        if (virgulaOue > 2) {
            const ultimoParametro = arrayParametrosInvalidos.pop();
            mensagemParametrosInvalidos = arrayParametrosInvalidos.join(", ");
            mensagemParametrosInvalidos += (` e ${ultimoParametro}`);
        } else {
            mensagemParametrosInvalidos = arrayParametrosInvalidos.join(" e ");
        }

        return {
            "status": 400,
            "mensagem": `Informar ${mensagemParametrosInvalidos} é obrigatório.`
        };
    }

}

module.exports = {
    validarConta,
    validarCpfEmail,
    validarParametros
}