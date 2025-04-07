export class Team {
  #teamColor = null;
  #board = null; // Board injetado para consulta/atualização de posições
  #subscribers = [];
  #pieceIds = [];

  constructor(teamColor, board) {
    this.#teamColor = teamColor;
    this.#board = board;

    // Cada time tem 4 peças; iniciam todas na posição 0 (em casa)
    this.#pieceIds = [
      `${teamColor}-1`,
      `${teamColor}-2`,
      `${teamColor}-3`,
      `${teamColor}-4`,
    ];

    // Registra cada peça no Board com posição inicial 0 (casa)
    this.#pieceIds.forEach((pieceId) => {
      this.#board.registerPiece(pieceId, 0);
    });
  }

  getColor() {
    return this.#teamColor;
  }

  // Retorna true se todas as peças estiverem na casa (posição 0)
  areAllPiecesHome() {
    const positions = this.#board.getPositions();
    return this.#pieceIds.every((pieceId) => positions.get(pieceId) === 0);
  }

  hasOnlyOnePieceOutHome() {
    const positions = this.#board.getPositions();
    return this.#pieceIds.filter((pieceId) => positions.get(pieceId) !== 0).length === 1;
  }

  // Retorna a posição de saída (constante) para cada time
  startingPosition() {
    const startingPositions = {
      blue: 1,
      red: 14,
      green: 27,
      yellow: 40,
    };
    return startingPositions[this.#teamColor];
  }

  // Retorna a posição do último quadrado comum para cada time
  endPosition() {
    const endPositions = {
      blue: 51,
      red: 12,
      green: 25,
      yellow: 38,
    };
    return endPositions[this.#teamColor];
  }

  // ------------------- Métodos de cálculo de nova posição -------------------

  calculateNewPosition(currentPosition, diceValue) {
    if (this.isInFinalPath(currentPosition)) {
      return this.calculateFinalPathMovement(currentPosition, diceValue);
    } else {
      return this.calculateMainTrackMovement(currentPosition, diceValue);
    }
  }

  // Verifica se a peça está no caminho final
  isInFinalPath(position) {
    return position >= this.getFinalPathStart();
  }

  // Retorna o ponto de entrada do caminho final para cada time
  getFinalPathStart() {
    const finalPathStarts = {
      blue: 100,
      red: 200,
      green: 300,
      yellow: 400,
    };
    return finalPathStarts[this.getColor()];
  }

  // Calcula a distância restante para atingir a posição final da pista principal
  getDistanceToEnd(currentPosition) {
    const totalMainSquares = 52;
    const endPos = this.endPosition();
    if (endPos >= currentPosition) {
      return endPos - currentPosition;
    } else {
      return totalMainSquares - currentPosition + endPos;
    }
  }

  // Calcula o movimento na pista principal (fora do caminho final)
  calculateMainTrackMovement(currentPosition, diceValue) {
    const totalMainSquares = 52;
    const endPos = this.endPosition();
    const distanceToEnd = this.getDistanceToEnd(currentPosition);

    if (diceValue < distanceToEnd) {
      let newPos = currentPosition + diceValue;
      if (newPos > totalMainSquares) {
        newPos -= totalMainSquares;
      }
      return newPos;
    } else if (diceValue === distanceToEnd) {
      return endPos;
    } else {
      const extraSteps = diceValue - distanceToEnd;
      const newFinalPos = this.enterFinalPath(extraSteps);
      return newFinalPos === null ? currentPosition : newFinalPos;
    }
  }

  // Calcula o movimento quando a peça já está no caminho final
  calculateFinalPathMovement(currentFinalPosition, diceValue) {
    const finalPathStart = this.getFinalPathStart();
    const finalPathEnd = finalPathStart + 5;
    const newPos = currentFinalPosition + diceValue;
    return newPos > finalPathEnd ? currentFinalPosition : newPos;
  }

  // Calcula a nova posição ao entrar no caminho final
  enterFinalPath(extraSteps) {
    if (extraSteps > 6) {
      // Movimento inválido se ultrapassar o caminho final
      return null;
    }
    const finalPathStart = this.getFinalPathStart();
    return finalPathStart + extraSteps - 1;
  }

  // ------------------- Fim dos métodos de cálculo -------------------

  // Processa o movimento automático: calcula a nova posição e notifica o comando MOVE_PIECE.
  processMove(pieceToMove, diceValue) {
    const positions = this.#board.getPositions();
    const currentPosition = positions.get(pieceToMove);
    let newPosition = null;
    if (currentPosition === 0) {
      newPosition = this.startingPosition();
    } else {
      newPosition = this.calculateNewPosition(currentPosition, diceValue);
    }
    const command = {
      type: "MOVE_PIECE",
      team: this.#teamColor,
      pieceId: pieceToMove,
      from: currentPosition,
      to: newPosition,
      // Se o dado for 6, o turno pode se repetir; caso contrário, o turno muda.
      shouldChangeTurn: diceValue !== 6,
      info: `Peça ${pieceToMove} movida de ${currentPosition} para ${newPosition}`,
    };
    this.notify(command);
  }

  // Para equipes controladas pelo usuário, retorna os IDs disponíveis conforme o valor do dado.
  // Se o dado for 6, o usuário pode escolher entre todas as peças;
  // caso contrário, somente as que já saíram (posição diferente de 0).
  getAvailablePiecesForUser(diceValue) {
    const positions = this.#board.getPositions();
    if (diceValue === 6) {
      return this.#pieceIds;
    } else {
      return this.#pieceIds.filter((pieceId) => positions.get(pieceId) !== 0);
    }
  }

  // Para equipes controladas pela IA, escolhe automaticamente a peça.
  chooseAIPiece(diceValue) {
    const positions = this.#board.getPositions();
    let pieceToMove = null;

    if (diceValue === 6) {
      // Se o dado for 6, prioriza remover uma peça da casa (posição 0) na ordem dos IDs.
      pieceToMove = this.#pieceIds.find((pieceId) => positions.get(pieceId) === 0);
      if (!pieceToMove) {
        pieceToMove =
          this.#pieceIds.find((pieceId) => positions.get(pieceId) !== 0) ||
          this.#pieceIds[0];
      }
    } else {
      pieceToMove = this.#pieceIds.find(
        (pieceId) => positions.get(pieceId) !== 0
      );
    }
    return pieceToMove;
  }

  // Lida com a jogada para equipes controladas pelo usuário.
  // Se não houver peças disponíveis, notifica NO_MOVE; caso contrário, emite REQUEST_USER_SELECTION.
  handleUserMove(diceValue) {
    const availablePieces = this.getAvailablePiecesForUser(diceValue);

    if (availablePieces.length === 0) {
      this.notify({
        type: "NO_MOVE",
        team: this.#teamColor,
        info: `Nenhuma peça disponível para mover com dado ${diceValue}`,
        shouldChangeTurn: true,
      });
    } else {
      this.notify({
        type: "REQUEST_USER_SELECTION",
        team: this.#teamColor,
        availablePieces: availablePieces,
        diceValue: diceValue,
        info: "Selecione a peça que deseja mover.",
        shouldChangeTurn: false,
      });
    }
  }

  // Método principal que decide a jogada com base no valor do dado
  makePlay(diceValue) {
    if (this.isUserControlled()) {
      if (diceValue === 6 && this.areAllPiecesHome()) {
        // Se todas as peças estão em casa e o dado é 6, move automaticamente a peça de índice 0.
        this.processMove(this.#pieceIds[0], diceValue);
      } else if (diceValue !== 6 && this.hasOnlyOnePieceOutHome()) {
        // Se houver apenas uma peça fora da casa, busca essa peça.
        const positions = this.#board.getPositions();
        const onlyPieceOut = this.#pieceIds.find(
          (pieceId) => positions.get(pieceId) !== 0
        );
        this.processMove(onlyPieceOut, diceValue);
      } else {
        // Caso contrário, solicita que o usuário escolha qual peça mover.
        this.handleUserMove(diceValue);
      }
    } else {
      // Para times controlados pela IA
      const pieceToMove = this.chooseAIPiece(diceValue);
      if (!pieceToMove) {
        this.notify({
          type: "NO_MOVE",
          team: this.#teamColor,
          info: `Nenhuma peça disponível para mover com dado ${diceValue}`,
          shouldChangeTurn: true,
        });
      } else {
        this.processMove(pieceToMove, diceValue);
      }
    }
  }

  isUserControlled() {
    return this.#teamColor === "blue";
  }

  subscribe(observer) {
    if (!this.#subscribers.includes(observer)) {
      this.#subscribers.push(observer);
    }
  }

  notify(command) {
    this.#subscribers.forEach((observer) => {
      if (typeof observer.teamUpdate === "function") {
        observer.teamUpdate(command);
      }
    });
  }
}
