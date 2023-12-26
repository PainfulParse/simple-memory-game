document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const cardImages = ['card-one.png', 'card-two.png', 'card-three.png', 'card-four.png'];
    let cards = [...cardImages, ...cardImages]; // Duplicate for pairs
    const cardBackImage = 'images/card-back.png'; // Path to card back image
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let attemptsLeft = 4; // Total number of attempts allowed
    let matchesFound = 0; // To track the number of matches found

    // DOM elements for attempts and game result
    const attemptsLeftElement = document.getElementById('attemptsLeft');
    const gameResultElement = document.getElementById('gameResult');
    const newGameButton = document.createElement('button');
    newGameButton.id = 'newGameButton';
    newGameButton.innerText = 'New Game';
    newGameButton.style.display = 'none'; // Hide the button initially
    newGameButton.addEventListener('click', startNewGame);
    document.body.insertBefore(newGameButton, gameBoard.nextSibling); // Place new game button in the DOM

    attemptsLeftElement.innerText = `Attempts Left: ${attemptsLeft}`;
    gameResultElement.style.display = 'none'; // Hide the game result initially

    initializeGame();

    function initializeGame() {
        // Shuffle cards
        cards.sort(() => 0.5 - Math.random());

        // Clear previous game board
        gameBoard.innerHTML = '';

        // Create cards and append to game board
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = card;

            const img = document.createElement('img');
            img.src = cardBackImage; // Set the card back as default image
            img.alt = 'Card back';
            img.classList.add('card-back');

            cardElement.appendChild(img);
            gameBoard.appendChild(cardElement);

            cardElement.addEventListener('click', flipCard);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        const img = this.querySelector('img');
        if (img.classList.contains('card-back')) {
            img.src = `images/${this.dataset.name}`; // Flip to card front
            img.classList.remove('card-back');
        }

        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Second card flipped
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchesFound++;
        resetBoard();
        if (matchesFound === cardImages.length) {
            endGame(true);
        }
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.querySelector('img').src = cardBackImage;
            secondCard.querySelector('img').src = cardBackImage;
            firstCard.querySelector('img').classList.add('card-back');
            secondCard.querySelector('img').classList.add('card-back');

            attemptsLeft--;
            attemptsLeftElement.innerText = `Attempts Left: ${attemptsLeft}`;
            resetBoard();
            if (attemptsLeft === 0) {
                endGame(false);
            }
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function endGame(isWinner) {
        gameResultElement.innerText = isWinner ? "Winner Is You!" : "Game Over Man";
        gameResultElement.style.display = 'block';
        newGameButton.style.display = 'block';
        lockBoard = true;
    }

    function startNewGame() {
        // Reload the page to reset the game
        window.location.reload();
    }
});
