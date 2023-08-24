# API - Cubos Bank

## Sobre

Este projeto foi criado para conclusão do módulo 02 do curso intensivo de Back-end da [Cubos Academy](https://cubos.academy/).

-   Criar contas bancárias
-   Listar contas bancárias
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depositar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar o saldo da conta bancária
-   Emitir o extrato bancário de uma conta bancária

## Rodar a aplicação localmente

Para rodar esta aplicação localmente você precisa:

- Instalar dependências

```bash
  npm install
```
- Executar o projeto

```bash
  npm run dev
```
- Testar a aplicação

Com o servidor em execução, basta acessar o localhost:8000 em seu navegador ou frameworks como o [Insomnia](https://insomnia.rest/).

Rotas de teste estão disponíveis no arquivo `Cubos_Bank_Insomnia` junto ao projeto.

## Endpoints

### Listar contas bancárias

#### `GET` `/contas?senha_banco=Cubos123Bank`

Esse endpoint lista todas as contas bancárias existentes.

-   **Requisição** - query params 

    -   senha_banco

<center><img   src=".\prints Insomnia\listar contas.png"/></center>

### Criar conta bancária

#### `POST` `/contas`

Esse endpoint cria uma conta bancária, onde será gerado um número único para identificação da conta.


-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades:

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

<center><img src=".\prints Insomnia\abrir conta bancária.png"/></center>

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint atualiza apenas os dados do usuário de uma conta bancária.


-   **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

<center><img   src=".\prints Insomnia\alterar dados conta bancária.png"/></center>

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint exclui uma conta bancária existente.

-   **Requisição** - route params

    -   Numero da conta bancária 

<center><img   src=".\prints Insomnia\excluir conta bancária.png"/></center>

### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint soma o valor do depósito ao saldo de uma conta válida e registrar essa transação.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades:

    -   numero_conta
    -   valor

<center><img   src=".\prints Insomnia\efetuar depósito.png"/></center>

### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint realiza o saque de um valor em uma determinada conta bancária e registra essa transação.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades:

    -   numero_conta
    -   valor
    -   senha

<center><img   src=".\prints Insomnia\efetuar saque.png"/></center>

### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registrando essa transação.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades:

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

<center><img   src=".\prints Insomnia\efetuar transferências.png"/></center>

### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint retorna o saldo de uma conta bancária.

-   **Requisição** - query params

    -   numero_conta
    -   senha

<center><img   src=".\prints Insomnia\consultar saldo.png"/></center>

### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint lista as transações realizadas de uma conta específica.

-   **Requisição** - query params

    -   numero_conta
    -   senha

<center><img   src=".\prints Insomnia\consultar extrato.png"/></center>

###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`
