export class Board {
  #positions;

  constructor() {
    this.#positions = new Map();
  }

  registerPiece(pieceId, initialPosition) {
    this.#positions.set(pieceId, initialPosition);
  }

  // Atualiza a posição de uma peça com base no comando recebido
  movePiece(command) {
    // Aqui podem ser inseridas validações, colisões, regras de percurso, etc.

    this.#positions.set(command.pieceId, command.to);
    console.log(
      `Board: Peça ${command.pieceId} do time ${command.team} movida de ${JSON.stringify(command.from)} para ${JSON.stringify(command.to)}`
    );
  }

  // Retorna o estado atual do tabuleiro (as posições das peças)
  getPositions() {
    return this.#positions;
  }
}
