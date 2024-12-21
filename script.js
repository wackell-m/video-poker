const cardImages = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg",
  "img6.jpg"
];

const handRanks = [
  "High Card",
  "One Pair",
  "Two Pair",
  "Three of a Kind",
  "Straight",
  "Flush",
  "Full House",
  "Four of a Kind",
  "Straight Flush",
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

function evaluateHand(cards) {
  const cardValues = cards.map((card) => cardImages.indexOf(card)).sort((a, b) => a - b);
  const uniqueValues = [...new Set(cardValues)];

  if (uniqueValues.length === 5 && cardValues[4] - cardValues[0] === 4) {
    return 4; // Straight
  }

  const counts = cardValues.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const countsArray = Object.values(counts).sort((a, b) => b - a);

  if (countsArray[0] === 4) return 7; // Four of a Kind
  if (countsArray[0] === 3 && countsArray[1] === 2) return 6; // Full House
  if (countsArray[0] === 3) return 3; // Three of a Kind
  if (countsArray[0] === 2 && countsArray[1] === 2) return 2; // Two Pair
  if (countsArray[0] === 2) return 1; // One Pair

  return 0; // High Card
}

function evaluateRound() {
  const selectedIndexes = [];
  [...cardsContainer.children].forEach((cardEl, index) => {
    if (cardEl.classList.contains("selected")) selectedIndexes.push(index);
  });

  selectedIndexes.forEach((index) => {
    userCards[index] = getRandomCard();
  });

  const userRank = evaluateHand(userCards);
  const dealerRank = evaluateHand(dealerCards);

  if (userRank > dealerRank) {
    checkmarks++;
    messageEl.textContent = `You win this round with a ${handRanks[userRank]}!`;
  } else if (userRank < dealerRank) {
    lives--;
    messageEl.textContent = `Dealer wins this round with a ${handRanks[dealerRank]}!`;
  } else {
    messageEl.textContent = "It's a tie!";
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
