import { Cliente } from "./cliente.js"; // Certifique-se de que o nome está correto

export class ContaCorrente {
    static numeroDeContas = 0;
    agencia;
    _cliente;
    _saldo = 0;

    set cliente(novoValor) {
        if (novoValor instanceof Cliente) { // Cliente com letra maiúscula
            this._cliente = novoValor;
        }
    }

    get cliente() {
        return this._cliente;
    }

    get saldo() {
        return this._saldo;
    }

    constructor(agencia, cliente) {
        this.agencia = agencia;
        this.cliente = cliente;
        ContaCorrente.numeroDeContas += 1;
    }

    sacar(valor) {
        if (valor > 0 && this._saldo >= valor) {
            this._saldo -= valor;
            return valor;
        }
        return 0;
    }

    depositar(valor) {
        if (valor > 0) {
            this._saldo += valor;
        }
    }

    transferir(valor, contaDestino) {
        const valorSacado = this.sacar(valor);
        if (valorSacado > 0) { // Evita depositar "undefined" caso o saque falhe
            contaDestino.depositar(valorSacado);
        }
    }
}
