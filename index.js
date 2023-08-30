class Card {
    static count = 0;
    static revealStack = [];
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
        currInterval = setInterval(add, 50);
        Card.revealStack.push(currInterval);
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
        this.#container.setAttribute('title', 'click cards to shuffle deck');
    }

    addCard(c) {
        if (this.#cards.length == CardCollection.maxCards) return;
        this.#cards.push(c);
        c.wrapper.setAttribute('page', this.#cards.length);
        if (this.#cards.length == 1) c.wrapper.style.zIndex =  CardCollection.maxCards + 1;
        else c.wrapper.style.zIndex =  CardCollection.maxCards - this.#cards.length;
        this.#container.append(c.wrapper);
        let col = this;
        c.wrapper.addEventListener('click', col.nextCard.bind(col));
    }

    nextCard() {
        if (this.#cards.length == 1) return;
        else {
            this.#container.classList.toggle('spread')
            let curr = this.#cards.shift();
            this.#cards.push(curr);
            const t = gsap.timeline()
            this.#cards[0].clearText()
            this.#cards[0].wrapper.classList.add('front');
            t.to(curr.wrapper, {y: "105%", duration: 0.6, onComplete: () => {
                    Card.revealStack.forEach(e => clearInterval(e))
                    this.#cards[0].revealText();
                    this.#cards.forEach((e, i) => {
                        if (i == 0) e.wrapper.style.zIndex =  CardCollection.maxCards + 1;
                        else e.wrapper.style.zIndex =  CardCollection.maxCards - i;
                    });
                    this.#container.classList.toggle('spread')
                }
            })
            t.to(curr.wrapper, {y: 0, duration: 0.6})
        }
    }

    hover() {
        this.#cards.forEach((e, i) => {
            gsap.to(e.wrapper, {scale: 0.95, rotation: 45 / this.#cards.length * (i + 1), onComplete: this.#container.classList.toggle('spread')});
        })
    }

    leave() {
        this.#cards.forEach((e, i) => {
            gsap.to(e.wrapper, {scale: 1, rotation: 0, onComplete: () => this.#container.classList.toggle('spread')});
        })
    }

    shrink() {
        this.#container.classList.toggle('transparent-text');
        Card.revealStack.forEach(e => clearInterval(e));
        let t = gsap.timeline()
        t.to(this.#container, {x: '7.5vmax', width: '15vmax'})
        return t;
    }

    grow(t) {
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
        let open = true
        let p = this
        this.#img.addEventListener('click', () => {
            if (!open) {
                let t = gsap.timeline();
                t.to(p.#img, {x: 0 , ease: Linear.easeNone})
                p.#cardCollection.grow(t)
            } else {
                p.#cardCollection.shrink().to(p.#img, {x: '23.5vmax', ease: Linear.easeNone})
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

    get img() {
        return this.#img;
    }
}


const profile = new Profile('profile.png', 'Oruaro');


const c1 = new Card('Hi My Name is Oruaroghene Mukoro, I am a third year Computer Science Major at Georgia Tech with threads in Intelligence and Information / Internetworks');
const c2 = new Card('I am most passionate about giving in respect to contributing to social good, where i come from lots of people are classified as absolutely poor');
const c3 = new Card('I am from Lagos, Nigeria and have live there for about 14years but currently live in Houston, Texas with my family');

const collection = profile.cardCollection;
collection.addCard(c1);
collection.addCard(c2);
collection.addCard(c3);
document.addEventListener('DOMContentLoaded', () => profile.img.dispatchEvent(new Event('click')))

const b = document.querySelector('body');

let input = document.createElement('input')
input.type = 'text'
let button = document.createElement('button')
button.textContent = 'Add Card'

let sec = document.createElement('section')
sec.classList.add('prompt')
sec.append(input, button)

button.onclick = () => {
    if (input.value.length == 0) return 
    let card = new Card(input.value)
    collection.addCard(card)
}
b.append(profile.container, sec);
b.setAttribute('title', 'click the blue outline')
let initAng = 0;
setInterval(() => {
    b.style.setProperty('--angle', `${initAng++}deg`);
}, 10)