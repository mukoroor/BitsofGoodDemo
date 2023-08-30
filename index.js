class Card {
    static count = 0;
    #wrapper
    #textContainer
    #text
    #id
    constructor(text) {
        this.#id = Card.count++;
        this.#text = text;
        this.#textContainer = document.createElement('p');
        this.#textContainer.textContent = text;
        this.#wrapper = document.createElement('section');
        this.#wrapper.classList.add('card');
        this.#wrapper.setAttribute('id', this.#id);
        this.#wrapper.append(this.#textContainer);
    }

    get text() {
        return this.#text;
    }

    get wrapper() {
        return this.#wrapper;
    }

    clearText() {
        this.#textContainer.textContent = '';
    }
}

class CardCollection {
    static count = 0;
    #cards = [];
    #container
    #id
    constructor() {
        this.#id = CardCollection.count++;
        this.#container = document.createElement('div');
        this.#container.classList.add('card-collection')
        this.#container.setAttribute('id', this.#id);
    }

    addCard(c) {
        this.#cards.push(c);
        c.wrapper.style.zIndex = -this.#cards.length;
        this.#container.append(c.wrapper);
    }

    get container() {
        return this.#container;
    }

    // showNext
}


const Col = new CardCollection();

const c1 = new Card('Oruaroghene Mukoro');
const c2 = new Card('Mukoro');
const c3 = new Card('Bees');

Col.addCard(c1);
Col.addCard(c2);
Col.addCard(c3);

document.querySelector('body').append(Col.container);