export class Dice {
  #subscribers = [];
  caaa = 0;

  constructor() {
    this._value = 0;
  }

  get value() {
    return this._value;
  }

  roll() {
    this.caaa++;

    if (this.caaa == 3) {
      this._value = 5;
    } else if (this.caaa == 4) {
      this._value = 6;
    } else if (this.caaa == 5) {
      this._value = 3;
    } else {
     this._value = Math.floor(Math.random() * 6) + 1;
    }

    this.notify();
  }

  subscribe(observer) {
    if (!this.#subscribers.includes(observer)) {
      this.#subscribers.push(observer);
    }
  }


  notify() {
    this.#subscribers.forEach((observer) => {
      if (typeof observer.diceUpdate === "function") {
        observer.diceUpdate(this._value);
      }
    });
  }
}
