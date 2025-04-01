export class Dice {
  #subscribers = [];

  constructor() {
    this._value = 1;
  }

  get value() {
    return this._value;
  }

  roll() {
    this._value = Math.floor(Math.random() * 6) + 1;
    this.notify();
  }

  subscribe(observer) {
    if (!this.#subscribers.includes(observer)) {
      this.#subscribers.push(observer);
    }
  }

  unsubscribe(observer) {
    const index = this.#subscribers.indexOf(observer);
    if (index !== -1) {
      this.#subscribers.splice(index, 1);
    }
  }

  notify() {
    this.#subscribers.forEach(observer => {
      if (typeof observer.update === 'function') {
        observer.update(this._value);
      }
    });
  }
}
