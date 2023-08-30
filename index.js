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
        this.#wrapper = document.createElement('li');
        this.#wrapper.classList.add('card');
        this.#wrapper.setAttribute('id', this.#id);
        this.#wrapper.append(this.#textContainer);
        // this.#wrapper.addEventListener('click', () => console.log('b'))
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

    revealText() {
        let count = 0;
        let currInterval;
        let i = 0;
        const add = () => {
            if (!i) {
                this.#textContainer.textContent = this.#text.slice(0, count) + '_';
            } else if (count < this.#text.length) {
                count += Math.floor(Math.random() * 2 + 1)
                if (count >= this.#text.length) {
                    this.#textContainer.textContent = this.#text;
                    clearInterval(currInterval);
                } else {
                    this.#textContainer.textContent = this.#text.slice(0, count) + ' ';
                }
            }
            i = (++i % 2);
        }
        currInterval = setInterval(add, 150);
    }
}

class CardCollection {
    static count = 0;
    static maxCards = 100
    #cards = [];
    #container
    #id
    constructor() {
        let c = this;
        this.#id = CardCollection.count++;
        this.#container = document.createElement('ul');
        this.#container.classList.add('card-collection', 'hidden')
        this.#container.setAttribute('id', this.#id);
    }

    addCard(c) {
        if (this.#cards.length == CardCollection.maxCards) return;
        this.#cards.push(c);
        c.wrapper.style.zIndex = CardCollection.maxCards - this.#cards.length;
        this.#container.append(c.wrapper);
        let col = this;
        c.wrapper.addEventListener('click', col.nextCard.bind(col));
    }

    nextCard() {
        if (this.#cards.length == 1) return;
        else {
            let curr = this.#cards.shift();
            this.#cards.push(curr);
            const t = gsap.timeline()
            this.#cards[0].clearText()
            t.to(curr.wrapper, {y: "105%", duration: 0.6, onComplete: () => {
                    this.#cards[0].revealText();
                    this.#cards.forEach((e, i) => e.wrapper.style.zIndex =  CardCollection.maxCards - i);
                }
            })
            t.to(curr.wrapper, {y: 0, duration: 0.6})
        }
    }

    hover() {
        this.#cards.forEach((e, i) => {
            gsap.to(e.wrapper, {scale: 0.95, rotation: 8 * (i + 1)});
        })
    }

    leave() {
        this.#cards.forEach((e) => {
            gsap.to(e.wrapper, {scale: 1, rotation: 0});
        })
    }

    shrink() {
        console.log(this)
        this.#container.classList.toggle('transparent-text');
        let t = gsap.timeline()
        t.to(this.#container, {x: '-16vmax', width: '15vmax', color: 'none'})
        
    }

    grow() {
        let t = gsap.timeline()
        t.to(this.#container, {x: 0, width: '45vmax', onComplete: () => {
            if (this.#cards.length) {
                this.#cards[0].clearText()
                this.#container.classList.toggle('transparent-text');
                this.#cards[0].revealText();
            }
        }});
    }

    get container() {
        return this.#container;
    }

    // showNext
}

class Profile {
    static count = 0;
    #id
    #name
    #img
    #container
    #imgURL
    #cardCollection

    constructor(imgURl, name) {
        this.#id = Profile.count++;
        this.#imgURL = imgURl;
        this.#container = document.createElement('section');
        this.#container.classList.add('profile');
        this.#img = document.createElement('img');
        this.#img.src = imgURl;
        this.#cardCollection = new CardCollection();
        this.#container.append(this.#img, this.#cardCollection.container);
        let open = false
        let p = this
        this.#img.addEventListener('click', () => {
            if (!open) {
                p.#cardCollection.grow();
            } else {
                p.#cardCollection.shrink();
            }
            open = !open
        })
        this.#img.addEventListener('mouseover', p.cardCollection.hover.bind(p.cardCollection))
        this.#img.addEventListener('mouseleave', p.cardCollection.leave.bind(p.cardCollection))
    }

    get cardCollection() {
        return this.#cardCollection;
    }

    get container() {
        return this.#container;
    }
}


const profile = new Profile('profile.png', 'Oruaro');


const c1 = new Card('Hi My Name is Oruaroghene Mukoro');
const c2 = new Card('Mukoro');
const c3 = new Card('Bees');

const collection = profile.cardCollection;
collection.addCard(c1);
collection.addCard(c2);
collection.addCard(c3);
document.addEventListener('DOMContentLoaded', collection.shrink.bind(collection))

document.querySelector('body').append(profile.container);