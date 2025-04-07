export class BoardView {
  #board = null;

  constructor(board) {
    this.#board = board;
    // Aqui você pode obter referências aos elementos DOM do tabuleiro
    // e preparar a renderização.
  }

  // Atualiza a visualização do tabuleiro com base no estado atual das peças
  update(pieceId, destinationLocation) {
    let piece = document.querySelector(`#${pieceId}`);
    piece.remove();
    piece.style.top = "-10px";
    piece.style.left = "-2px";

    document
      .querySelector(`[data-square="${destinationLocation}"]`)
      .appendChild(piece);

    const positions = this.#board.getPositions();
    console.log("BoardView: Estado do tabuleiro atualizado:", positions);
    // Aqui, o DOM pode ser atualizado para reposicionar os pins conforme as posições.
  }

  highlightPins(availablePieces, callback) {

      availablePieces.forEach((pieceId) => {
        const pinElement = document.querySelector(`#${pieceId}`);
        if (pinElement) {
          pinElement.classList.add("board__pin--highlight");

          // Define e armazena a referência da função
          const onClick = () => {
            callback(pieceId);
            this.clearHighlights();
          };

          pinElement.addEventListener("click", onClick);
          pinElement._onClick = onClick;
        }
      });

  }

  clearHighlights() {
    const allHighlightPins = document.querySelectorAll(
      ".board__pin--highlight"
    );
    allHighlightPins.forEach((pin) => {
      pin.classList.remove("board__pin--highlight");
      if (pin._onClick) {
        pin.removeEventListener("click", pin._onClick);
        delete pin._onClick;
      }
    });
  }
}
