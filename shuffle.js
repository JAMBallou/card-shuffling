/** 
 * Function to find the Shannon entropy of a given deck of cards.
 * @param deck Each value of the array corresponds to a given card in the deck.
 * @returns The entropy is returned and rounded to the hundredths place.
 */
function findEntropy() {
  // get the values of the current cards on display and turn that data into an array of numbers
  let deck = cardInput.value ?
    cardInput.value.split(",").map(Number) 
    : [];
  document.querySelectorAll("#cardsContainer img").forEach(val => {
    deck.push(Number(getCardNumber(val.currentSrc)));
  });

  // calculate differences
  const deltas = deck.map((card, index) => {
    const nextIndex = (index + 1) % deck.length;
    const diff = deck[nextIndex] - card;
    return diff < 0 ? diff + deck.length : diff;
  });

  // count occurrences of each difference
  const bucket = deltas.reduce((counts, delta) => {
    counts[delta] = (counts[delta] || 0) + 1;
    return counts;
  }, {});

  // calculate probabilities and entropy
  const entropy = Object.values(bucket).reduce((sum, count) => {
    const probability = count / deck.length;
    return sum - (probability > 0 ? probability * Math.log2(probability) : 0);
  }, 0).toFixed(2);

  return entropy;
}

/**
 * Shuffles the deck depending on the mode selected by the radio buttons 
 * and updates the displayed deck accordingly.
 */
function shuffle() {
  // initialize HTML elements
  const cardInput = document.getElementById("cardInput");
  const shuffleType = document.querySelector('input[name="shuffleType"]:checked');

  // get the values of the current cards on display and turn that data into an array of numbers
  let deck = cardInput.value ?
    cardInput.value.split(",").map(Number) 
    : [];
  document.querySelectorAll("#cardsContainer img").forEach(val => {
    deck.push(Number(getCardNumber(val.currentSrc)));
  });

  // shuffle the deck depending on the setting from shuffleType radio button
  if (shuffleType) {
    switch (shuffleType.value) {
      case "manual":
        break;
      case "rand": // implementation of the Fisher-Yates randomization algorithm
        for (let i = deck.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        break;
      case "riffle":
        const firstHalf = deck.slice(0, deck.length / 2);
        const secondHalf = deck.slice(deck.length / 2, deck.length);
        for (let i = 0; i < firstHalf.length; i++) {
          deck[i * 2] = firstHalf[i];
        }
        for (let i = 0; i < secondHalf.length; i++) {
          deck[(i * 2) + 1] = secondHalf[i];
        }
        break;
    }
  }

  entropyVal.textContent = findEntropy();
  toggleDeck(deck);
  return deck;
}

function reset() {
  const deck = [...Array(52).keys()].map(x => x + 1);

  toggleDeck(deck);
  entropyVal.textContent = findEntropy();
  return deck;
}

/**
 * Visualize the input deck as cards.
 * @param deck Each value of the array corresponds to a given card in the deck.
 */
function toggleDeck(deck) {
  const cardsContainer = document.getElementById("cardsContainer");

  // remove current cards
  while(cardsContainer.firstChild){
    cardsContainer.removeChild(cardsContainer.firstChild);
  } 

  // add new cards, from deck parameter
  for (let i = 0; i < deck.length; i++) {
    const img = new Image(72, 96);
    img.src = "images/cards/" + deck[i] + ".png";

    img.onclick = function highlight() { 
      const highlightedCard = document.querySelector(".highlighted");
    
      if (highlightedCard) {
        const src1 = highlightedCard.src;
        const src2 = img.src;
        img.src = src1;
        highlightedCard.src = src2;
    
        img.classList.add("highlighted");
        img.style.animation = "fade-in 0.5s";
    
        // unhighlight
        document.querySelectorAll(".highlighted").forEach((ele) => ele.style.animation = "fade-out 0.5s");
        document.querySelectorAll(".highlighted").forEach((ele) => ele.classList.remove("highlighted"));
      } else {
        // if no cards are highlighted, highlight the clicked card
        img.classList.add("highlighted");
        img.style.animation = "fade-in 0.5s";
      }
      entropyVal.textContent = findEntropy()
    };
    cardsContainer.append(img);
  }
}

/**
 * Finds the number of a card based on its image path.
 * @param path Complete file path of the image. (e.g. "Users/JAMBallou/Documents/images/cards/1.png")
 * @returns Number of the card from the image. (e.g. 1)
 */
function getCardNumber(path) {
  const parts = path.split("/");
  const fileName = parts[parts.length - 1];

  const match = fileName.match(/^\d+/);
  return match ? match[0] : undefined;
}