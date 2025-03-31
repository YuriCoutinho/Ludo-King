import { Dice } from './Dice/Dice.js';
import { DiceView } from './Dice/DiceView.js';

export class Game {
  static #instance = null;

  #dice = null;
  #diceView = null;

  constructor() {
    if (Game.#instance) {
      throw new Error('Não é permitido criar mais de uma instância do jogo');
    }

    this.#dice = new Dice();
    this.#diceView = new DiceView(this.#dice);

    Game.#instance = this;
  }

  static get instance() {
    if (!this.#instance) {
      this.#instance = new Game();
    }
    return this.#instance;
  }

  init() {
    console.log('Jogo iniciado');
    // Outras configurações...
  }
}
