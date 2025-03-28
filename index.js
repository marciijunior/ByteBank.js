import { Cliente } from "./cliente.js";
import { ContaCorrente } from "./contaCorrente.js";

// Criando clientes
const cliente1 = new Cliente("Ricardo", 11122233309);
const cliente2 = new Cliente("Alice", 88822233309);

// Criando contas correntes
const contaCorrenteRicardo = new ContaCorrente(1001, cliente1);
contaCorrenteRicardo.depositar(500);
contaCorrenteRicardo.sacar(100);

const conta2 = new ContaCorrente(102, cliente2);

let valor = 200;
contaCorrenteRicardo.transferir(valor, conta2);

// Exibindo os objetos no console
console.log(contaCorrenteRicardo);
console.log(conta2);
