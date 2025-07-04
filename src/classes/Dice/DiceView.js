export class DiceView {
  #subscribers = [];
  #diceDotElements = null;
  #diceButtonElement = null;
  #diceModel = null;

  constructor(diceModel) {
    this.#diceModel = diceModel;
    this.#diceModel.subscribe(this);
    this.#diceDotElements = document.querySelectorAll(".dice__dot");
    this.#diceButtonElement = document.querySelector(".dice__button");

    this.#diceButtonElement.addEventListener("click", () => {
      this.#diceModel.roll();
    });
  }

  enableButton() {
    this.#diceButtonElement.removeAttribute("disabled");
  }

  disableButton() {
    this.#diceButtonElement.setAttribute("disabled", "");
  }

  diceUpdate(newDiceValue) {
    this.#handleDiceAnimation(newDiceValue);
  }

  #handleDiceAnimation(diceValue) {
    const faces = [1, 2, 3, 4, 5, 6];
    const totalSteps = faces.length + 1;
    let step = 0;

    const animationInterval = setInterval(() => {
      this.#hideAllDots();

      let currentFace;
      if (step < faces.length) {
        currentFace = faces[step % faces.length];
      } else {
        currentFace = diceValue;
      }

      this.#showDiceFace(currentFace);
      step++;
      if (step >= totalSteps) {
        clearInterval(animationInterval);
      }
    }, 200);

    setTimeout(() => {
      this.notify(diceValue);
    }, 1200);
  }

  #showDiceFace(faceValue) {
    switch (faceValue) {
      case 1:
        this.#diceDotElements[4].classList.remove("dice__dot--hidden");
        break;
      case 2:
        this.#diceDotElements[0].classList.remove("dice__dot--hidden");
        this.#diceDotElements[8].classList.remove("dice__dot--hidden");
        break;
      case 3:
        this.#diceDotElements[0].classList.remove("dice__dot--hidden");
        this.#diceDotElements[4].classList.remove("dice__dot--hidden");
        this.#diceDotElements[8].classList.remove("dice__dot--hidden");
        break;
      case 4:
        this.#diceDotElements[0].classList.remove("dice__dot--hidden");
        this.#diceDotElements[2].classList.remove("dice__dot--hidden");
        this.#diceDotElements[6].classList.remove("dice__dot--hidden");
        this.#diceDotElements[8].classList.remove("dice__dot--hidden");
        break;
      case 5:
        this.#diceDotElements[0].classList.remove("dice__dot--hidden");
        this.#diceDotElements[2].classList.remove("dice__dot--hidden");
        this.#diceDotElements[4].classList.remove("dice__dot--hidden");
        this.#diceDotElements[6].classList.remove("dice__dot--hidden");
        this.#diceDotElements[8].classList.remove("dice__dot--hidden");
        break;
      case 6:
        this.#diceDotElements[0].classList.remove("dice__dot--hidden");
        this.#diceDotElements[2].classList.remove("dice__dot--hidden");
        this.#diceDotElements[3].classList.remove("dice__dot--hidden");
        this.#diceDotElements[5].classList.remove("dice__dot--hidden");
        this.#diceDotElements[6].classList.remove("dice__dot--hidden");
        this.#diceDotElements[8].classList.remove("dice__dot--hidden");
        break;
      default:
        break;
    }
  }

  #hideAllDots() {
    this.#diceDotElements.forEach((dot) => {
      if (!dot.classList.contains("dice__dot--hidden")) {
        dot.classList.add("dice__dot--hidden");
      }
    });
  }

  subscribe(observer) {
    if (!this.#subscribers.includes(observer)) {
      this.#subscribers.push(observer);
    }
  }

  notify(diceValue) {
    this.#subscribers.forEach((observer) => {
      if (typeof observer.diceAnimationFinished === "function") {
        observer.diceAnimationFinished(diceValue);
      }
    });
  }
}
