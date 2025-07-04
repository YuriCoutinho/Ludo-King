import { Dice } from "./Dice/Dice.js";
import { DiceView } from "./Dice/DiceView.js";
import { Team } from "./Team/Team.js";
import { Board } from "./Board/Board.js";
import { BoardView } from "./Board/BoardView.js";

export class Game {
  static #instance = null;

  #dice = null;
  #diceView = null;

  #board = null;
  #boardView = null;

  #teams;
  #shift = null;

  constructor() {
    if (Game.#instance) {
      throw new Error("Não é permitido criar mais de uma instância do jogo");
    }
    Game.#instance = this;

    this.#dice = new Dice();
    this.#diceView = new DiceView(this.#dice);

    this.#board = new Board();
    this.#boardView = new BoardView(this.#board);

    // Cria os times e injeta a referência do Board em cada um - TODO: Revisar essa implementação
    this.#teams = [
      new Team("blue", this.#board),
      new Team("red", this.#board),
      new Team("green", this.#board),
      new Team("yellow", this.#board),
    ];

    // Define o time azul como primeiro turno
    this.#shift = "blue";

    this.#registerObservers();
  }

  static get instance() {
    if (!this.#instance) {
      this.#instance = new Game();
    }
    return this.#instance;
  }

  #registerObservers() {
    [this.#diceView, ...this.#teams].forEach((observable) =>
      observable.subscribe(this)
    );
  }

  // diceUpdate(diceValue) {
  //   const team = this.#teams.find((team) => team.getColor() === this.#shift);
  //   if (team) {
  //     team.makePlay(diceValue);
  //   }
  // }

  diceAnimationFinished(diceValue) {
    console.log(diceValue)
    const team = this.#teams.find((team) => team.getColor() === this.#shift);
    if (team) {
      team.makePlay(diceValue);
    }
  }

  // Método chamado pelos Times quando emitem um comando
  teamUpdate(command) {
    console.log(`Game: Time ${this.#shift} executou comando: ${command.type}`);

    if (command.type === "MOVE_PIECE") {
      // Atualiza a posição da peça no Board
      this.#board.movePiece(command);

      this.#boardView.update(command.pieceId, command.to);
    }

    if (command.type === "NO_MOVE") {
      console.log(`Game: Nenhuma jogada possível para o time ${this.#shift}.`);
    }

    if (command.type === "REQUEST_USER_SELECTION") {
      // Aciona a BoardView para destacar os pins disponíveis e aguardar a seleção do usuário.
      this.#boardView.highlightPins(
        command.availablePieces,
        (selectedPieceId) => {
          // Quando o usuário clica em um pin, processa o movimento usando o time correspondente.
          const team = this.#teams.find((t) => t.getColor() === command.team);
          if (team) {
            team.processMove(selectedPieceId, command.diceValue);
          }
          // Remove os destaques
          this.#boardView.clearHighlights();
        }
      );
    }

    // Atualiza o turno se o comando indicar que a jogada foi finalizada
    if (command.shouldChangeTurn) {
      this.#shiftUpdate();
    } else if (this.#shift !== "blue") {
      // Joga o dado para a IA
      setTimeout(() => {
        this.#dice.roll();
      }, 3000);
    }
  }

  #shiftUpdate() {
    const shiftOrder = ["blue", "red", "green", "yellow"];
    let currentShiftIndex = shiftOrder.indexOf(this.#shift);
    currentShiftIndex = (currentShiftIndex + 1) % shiftOrder.length;
    this.#shift = shiftOrder[currentShiftIndex];

    if (this.#shift === "blue") {
      this.#diceView.enableButton();
    } else {
      // Joga o dado para IA
      setTimeout(() => {
        this.#dice.roll();
      }, 3000);

      this.#diceView.disableButton();
    }

    console.log(`Game: Turno atualizado. Novo turno: ${this.#shift}`);
  }

  init() {
    console.log("Game: Jogo iniciado");
  }
}
