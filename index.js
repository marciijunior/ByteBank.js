import readline from "readline";
import { Cliente } from "./Cliente.js";
import { Gerente } from "./Funcionario/Gerente.js";
import { Diretor } from "./Funcionario/Diretor.js";
import { SistemaAutenticacao } from "./SistemaAutenticacao.js";
import { ContaCorrente } from "./Conta/ContaCorrente.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Instanciando usuários e contas
const diretor = new Diretor("Rodrigo", 10000, 12345678900);
diretor.cadastrarSenha("123456");
const gerente = new Gerente("Ricardo", 5000, 12378945601);
gerente.cadastrarSenha("123");
const cliente = new Cliente("Lais", 78945612379, "456");

const contaCliente = new ContaCorrente(cliente, 1001);
contaCliente.depositar(1000);

const contas = [contaCliente]; // Lista de contas para gerenciamento

// Menu Principal para que o usuário escolha o tipo de login
function exibirMenu() {
    console.log("\n=== Menu Principal ===");
    console.log("1. Login como Gerente");
    console.log("2. Login como Diretor");
    console.log("3. Login como Cliente");
    console.log("4. Sair");
    rl.question("Escolha uma opção: ", tratarOpcao);
}

function tratarOpcao(opcao) {
    switch (opcao) {
        case "1":
            loginUsuario(gerente, "Gerente");
            break;
        case "2":
            loginUsuario(diretor, "Diretor");
            break;
        case "3":
            loginUsuario(cliente, "Cliente");
            break;
        case "4":
            console.log("Saindo do sistema...");
            rl.close();
            break;
        default:
            console.log("Opção inválida. Tente novamente.");
            exibirMenu();
            break;
    }
}

function loginUsuario(usuario, tipoUsuario) {
    rl.question(`Digite a senha do ${tipoUsuario}: `, (senha) => {
        const estaLogado = SistemaAutenticacao.login(usuario, senha);
        if (estaLogado) {
            console.log(`Login bem-sucedido como ${tipoUsuario}!`);
            exibirMenuOperacoes(usuario, tipoUsuario);
        } else {
            console.log("Senha incorreta.");
            exibirMenu();
        }
    });
}

// Menu de Operações Bancárias para cada tipo de usuário
// O menu de operações varia dependendo do tipo de usuário (Cliente, Gerente ou Diretor)
function exibirMenuOperacoes(usuario, tipoUsuario) {
    console.log(`\n=== Menu de Operações (${tipoUsuario}) ===`);
    console.log("1. Depositar");
    console.log("2. Sacar");
    console.log("3. Transferir");
    console.log("4. Ver Saldo");
    if (tipoUsuario === "Gerente" || tipoUsuario === "Diretor") {
        console.log("5. Excluir Conta");
        console.log("6. Voltar ao Menu Principal");
    } else {
        console.log("5. Voltar ao Menu Principal");
    }
    rl.question("Escolha uma opção: ", (opcao) => tratarOperacao(opcao, usuario, tipoUsuario));
}

// Função para tratar as operações bancárias
function tratarOperacao(opcao, usuario, tipoUsuario) {
    switch (opcao) {
        case "1":
            rl.question("Digite o valor para depósito: ", (valor) => {
                contaCliente.depositar(parseFloat(valor));
                console.log(`Depósito de R$${valor} realizado com sucesso!`);
                exibirMenuOperacoes(usuario, tipoUsuario);
            });
            break;
        case "2":
            rl.question("Digite o valor para saque: ", (valor) => {
                const sacado = contaCliente.sacar(parseFloat(valor));
                if (sacado > 0) {
                    console.log(`Saque de R$${valor} realizado com sucesso!`);
                } else {
                    console.log("Saldo insuficiente.");
                }
                exibirMenuOperacoes(usuario, tipoUsuario);
            });
            break;
        case "3":
            rl.question("Digite o valor para transferência: ", (valor) => {
                if (contas.length > 1) {
                    rl.question("Digite o número da conta de destino: ", (numeroConta) => {
                        const contaDestino = contas.find((c) => c._cliente._cpf === parseInt(numeroConta));
                        if (contaDestino) {
                            contaCliente.tranferir(parseFloat(valor), contaDestino);
                            console.log(`Transferência de R$${valor} realizada com sucesso!`);
                        } else {
                            console.log("Conta de destino não encontrada.");
                        }
                        exibirMenuOperacoes(usuario, tipoUsuario);
                    });
                } else {
                    console.log("Nenhuma conta disponível para transferência.");
                    exibirMenuOperacoes(usuario, tipoUsuario);
                }
            });
            break;
        case "4":
            console.log(`Saldo atual: R$${contaCliente._saldo.toFixed(2)}`);
            exibirMenuOperacoes(usuario, tipoUsuario);
            break;
        case "5":
            if (tipoUsuario === "Gerente" || tipoUsuario === "Diretor") {
                rl.question("Digite o CPF da conta a ser excluída: ", (cpf) => {
                    const index = contas.findIndex((c) => c._cliente._cpf === parseInt(cpf));
                    if (index !== -1) {
                        contas.splice(index, 1);
                        console.log("Conta excluída com sucesso!");
                    } else {
                        console.log("Conta não encontrada.");
                    }
                    exibirMenuOperacoes(usuario, tipoUsuario);
                });
            } else {
                exibirMenu(); // Cliente escolhendo voltar ao menu
            }
            break;
        case "6":
            if (tipoUsuario === "Gerente" || tipoUsuario === "Diretor") {
                exibirMenu();
                break;
            }
        default:
            console.log("Opção inválida. Tente novamente.");
            exibirMenuOperacoes(usuario, tipoUsuario);
            break;
    }
}

exibirMenu();
