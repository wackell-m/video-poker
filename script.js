const cardImages = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg",
  "img6.jpg"
];

let lives = 5;
let checkmarks = 0;
let userCards = [];
let dealerCards = [];

const livesEl = document.getElementById("lives");
const checkmarksEl = document.getElementById("checkmarks");
const cardsContainer = document.getElementById("cards-container");
const dealerCardsContainer = document.getElementById("dealer-cards-container");
const messageEl = document.getElementById("message");
const drawButton = document.getElementById("draw-button");

function drawCards() {
  userCards = Array.from({ length: 5 }, () => getRandomCard());
  dealerCards = Array.from({ length: 5 }, () => getRandomCard());
  renderCards();
  messageEl.textContent = "Select cards to replace, then click Draw!";
}

function getRandomCard() {
  return cardImages[Math.floor(Math.random() * cardImages.length)];
}

function renderCards() {
  cardsContainer.innerHTML = "";
  dealerCardsContainer.innerHTML = "";

  userCards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.style.backgroundImage = `url(${card})`;
    cardEl.addEventListener("click", () => toggleCard(index));
    cardsContainer.appendChild(cardEl);
  });

  dealerCards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.style.backgroundImage = `url(${card})`;
    dealerCardsContainer.appendChild(cardEl);
  });
}

function toggleCard(index) {
  const cardEl = cardsContainer.children[index];
  cardEl.classList.toggle("selected");
}

function evaluateRound() {
  const selectedIndexes = [];
  [...cardsContainer.children].forEach((cardEl, index) => {
    if (cardEl.classList.contains("selected")) selectedIndexes.push(index);
  });

  selectedIndexes.forEach((index) => {
    userCards[index] = getRandomCard();
  });

  const userRank = calculateRank(userCards);
  const dealerRank = calculateRank(dealerCards);

  if (userRank > dealerRank) {
    checkmarks++;
    messageEl.textContent = "You win this round!";
  } else {
    lives--;
    messageEl.textContent = "Dealer wins this round!";
  }

  updateStatus();

  if (lives === 0) {
    messageEl.textContent = "Game Over! Refresh to play again.";
    drawButton.disabled = true;
  } else if (checkmarks === 3) {
    messageEl.textContent = "You win the game! Refresh to play again.";
    drawButton.disabled = true;
  } else {
    drawCards();
  }
}

function calculateRank(cards) {
  const cardValues = cards.map((card) => cardImages.indexOf(card));
  return Math.max(...cardValues);
}

function updateStatus() {
  livesEl.textContent = lives;
  checkmarksEl.textContent = checkmarks;
}

drawButton.addEventListener("click", () => {
  if (userCards.length === 0) {
    drawCards();
  } else {
    evaluateRound();
  }
});

drawCards();
