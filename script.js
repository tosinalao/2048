document.addEventListener('DOMContentLoaded', () => {
  const boardSize = 4;
  const board = new Array(boardSize).fill(null).map(() => new Array(boardSize).fill(0));
  let score = 0;
  let gameOver = false;

  // Initialize the game board
  function initGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        gameBoard.appendChild(tile);
      }
    }

    score = 0;
    updateScore();
    updateBoard();
    generateRandomTile();
    generateRandomTile();
    gameOver = false;
  }

  // Update the visual representation of the board
  function updateBoard() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
      const row = Math.floor(index / boardSize);
      const col = index % boardSize;
      const value = board[row][col];

      tile.textContent = value !== 0 ? value : '';
      tile.style.backgroundColor = getTileColor(value);
    });

    if (gameOver) {
      displayGameOver();
    }
  }

  // Display game-over message
  function displayGameOver() {
    const gameBoard = document.getElementById('game-board');
    const gameOverMessage = document.createElement('div');
    gameOverMessage.className = 'game-over-message';
    gameOverMessage.textContent = `Game Over! Final Score: ${score}`;

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Restart';
    resetButton.addEventListener('click', () => {
      window.location.href = 'start.html';
    });

    gameOverMessage.appendChild(resetButton);
    gameBoard.appendChild(gameOverMessage);
  }

  // Update the score display
  function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Score: ${score}`;
  }

  // Get the color for a tile based on its value
  function getTileColor(value) {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };

    return colors[value] || '#ccc0b3';
  }

  // Generate a random tile with a value of 2 or 4
  function generateRandomTile() {
    const emptyTiles = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push({ row: i, col: j });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      const newValue = Math.random() < 0.9 ? 2 : 4;
      board[randomTile.row][randomTile.col] = newValue;
      updateBoard();
      checkGameOver();
    }
  }

  // Check if the game is over
  function checkGameOver() {
    // Check for game-over condition (no empty tiles and no possible moves)
    if (board.flat().every((value) => value !== 0) && !checkPossibleMoves()) {
      gameOver = true;
      updateBoard();
    }
  }

  // Check if there are possible moves
  function checkPossibleMoves() {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === 0) {
          return true; // There is an empty tile, so there is a possible move
        }
        if (j < boardSize - 1 && board[i][j] === board[i][j + 1]) {
          return true; // There are adjacent tiles with the same value, so there is a possible move
        }
        if (i < boardSize - 1 && board[i][j] === board[i + 1][j]) {
          return true; // There are adjacent tiles with the same value, so there is a possible move
        }
      }
    }
    return false; // No empty tiles and no adjacent tiles with the same value
  }

  // Handle key presses for movement
  function handleKeyPress(event) {
    if (gameOver) {
      return;
    }

    let moved = false;

    switch (event.key) {
      case 'ArrowUp':
        moved = moveUp();
        break;
      case 'ArrowDown':
        moved = moveDown();
        break;
      case 'ArrowLeft':
        moved = moveLeft();
        break;
      case 'ArrowRight':
        moved = moveRight();
        break;
    }

    if (moved) {
      generateRandomTile();
    }
  }

  // Move tiles upwards
  function moveUp() {
    let moved = false;

    for (let col = 0; col < boardSize; col++) {
      for (let row = 1; row < boardSize; row++) {
        if (board[row][col] !== 0) {
          let newRow = row;
          while (newRow > 0 && (board[newRow - 1][col] === 0 || board[newRow - 1][col] === board[row][col])) {
            newRow--;
          }

          if (newRow !== row) {
            board[newRow][col] += board[row][col];
            score += board[newRow][col];
            board[row][col] = 0;
            moved = true;
          }
        }
      }
    }

    updateScore();
    return moved;
  }

  // Move tiles downwards
  function moveDown() {
    let moved = false;

    for (let col = 0; col < boardSize; col++) {
      for (let row = boardSize - 2; row >= 0; row--) {
        if (board[row][col] !== 0) {
          let newRow = row;
          while (newRow < boardSize - 1 && (board[newRow + 1][col] === 0 || board[newRow + 1][col] === board[row][col])) {
            newRow++;
          }

          if (newRow !== row) {
            board[newRow][col] += board[row][col];
            score += board[newRow][col];
            board[row][col] = 0;
            moved = true;
          }
        }
      }
    }

    updateScore();
    return moved;
  }

  // Move tiles to the left
  function moveLeft() {
    let moved = false;

    for (let row = 0; row < boardSize; row++) {
      for (let col = 1; col < boardSize; col++) {
        if (board[row][col] !== 0) {
          let newCol = col;
          while (newCol > 0 && (board[row][newCol - 1] === 0 || board[row][newCol - 1] === board[row][col])) {
            newCol--;
          }

          if (newCol !== col) {
            board[row][newCol] += board[row][col];
            score += board[row][newCol];
            board[row][col] = 0;
            moved = true;
          }
        }
      }
    }

    updateScore();
    return moved;
  }

  // Move tiles to the right
  function moveRight() {
    let moved = false;

    for (let row = 0; row < boardSize; row++) {
      for (let col = boardSize - 2; col >= 0; col--) {
        if (board[row][col] !== 0) {
          let newCol = col;
          while (newCol < boardSize - 1 && (board[row][newCol + 1] === 0 || board[row][newCol + 1] === board[row][col])) {
            newCol++;
          }

          if (newCol !== col) {
            board[row][newCol] += board[row][col];
            score += board[row][newCol];
            board[row][col] = 0;
            moved = true;
          }
        }
      }
    }

    updateScore();
    return moved;
  }

  // Initialize the game
  initGameBoard();
  window.addEventListener('keydown', handleKeyPress);
});
