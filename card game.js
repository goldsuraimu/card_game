const GAME_STATE = {
  FirstCardAwaites: 'firstCardAwaites',
  SecondCardAwaits: 'secondCardAwaits',
  CardMatcheFailed: 'CardMatcheFailed',
  Cardmatched: 'CardMatchedd',
  GameFinished: 'GameFinished'
}

const symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view = {
  getCardElement (index) {
    return `<div class="card back" data-index="${index}"></div>`;
  },

  getCardContext(index) {
    const number = this.transformNumber((index % 13) + 1);
    const symbol = symbols[Math.floor(index / 13)];

    return `<p>${number}</p>
      <img src="${symbol}" alt="">
        <p>${number}</p>`
  },

  transformNumber (number) {
    switch(number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },

  displayCard (indexes) {
    const rootElement = document.querySelector('#cards');
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('');
  },

  flipCards(...cards) {
    cards.map((card) => {
      if (card.classList.contains('back')) {
        card.classList.remove('back');
        card.innerHTML = this.getCardContext(card.dataset.index);
        return;
      }
      card.classList.add('back');
      card.innerHTML = null;
    })
  },

  pairCards(...cards) {
    cards.map((card) => {
      card.classList.add('paired');
    })
  },

  renderScore(score) {
    document.querySelector('.score').textContent = `Score: ${score}`;
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times`;
  },

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => {
        card.classList.remove('wrong'),{once: true}
      })
    })
  },

  showGamefinished() {
    const div = document.createElement('div');
    div.classList.add('completed');
    div.innerHTML = `  
      <p>Complete!</p>
      <p>score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes}</p>` 
    const header = document.querySelector('#header');
    header.before(div);
  }
}

const model = {
  revealedCards: [],
  isRevealedCardMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13;
  },
  score: 0,
  triedTimes: 0
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaites,

  generateCard() {
    view.displayCard(utility.getRandomNumberArray(52));
  },

  dispatchCardAction (card) {
    if(!card.classList.contains('.back')) return;
    switch(this.currentState) {
      case GAME_STATE.FirstCardAwaites:
        view.flipCards(card);
        model.revealedCards.push(card);
        this.currentState = GAME_STATE.SecondCardAwaits;
        console.log(card)
        break
      case GAME_STATE.SecondCardAwaits:
        view.flipCards(card);
        view.renderTriedTimes(++model.triedTimes);
        model.revealedCards.push(card);
        if (model.isRevealedCardMatched()) {
          view.renderScore(model.score += 10);
          this.currentState = GAME_STATE.Cardmatched;
          view.pairCards(...model.revealedCards);
          model.revealedCards = [];
          if(model.score === 260) {
            this.currentState = GAME_STATE.GameFinished;
            view.showGamefinished();
            return;
          }
          this.currentState = GAME_STATE.FirstCardAwaites;
        } else {
          this.currentState = GAME_STATE.CardMatcheFailed;
          view.appendWrongAnimation(...model.revealedCards);
          setTimeout(controller.setCards, 1000);
        }
        console.log(card)
        break  
    }
  },
  
  setCards() {
    view.flipCards(...model.revealedCards);
    model.revealedCards = [];
    controller.currentState = GAME_STATE.FirstCardAwaites;
  },
}

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys());
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]];
    }
    return number;
  }
}

controller.generateCard();


document.querySelectorAll('.card').forEach( (card) => {
  card.addEventListener('click', (event) => {
    controller.dispatchCardAction(card)
  })
})

