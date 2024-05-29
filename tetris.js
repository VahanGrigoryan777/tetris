document.addEventListener('DOMContentLoaded', function() {
   
    const gridElement = document.getElementById('grid')
    const startButton = document.getElementById('startButton')
    const audio = document.querySelector('audio')
    const arr = []
    let currentPiece
    let intervalId

    const pieces = [
        [[1], [1], [1], [1]],
        [[0, 1], [0, 1], [1, 1]],
        [[1, 0], [1, 0], [1, 1]],
        [[1, 1], [1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 1, 0], [0, 1, 1]]
    ];

  
    const pieceColors = [
        '#008080','#FF0000','#C71585','#0000CD','#9df9ef','#00FF00','rgb(127, 255, 212)','rgb(255, 20, 147)','rgb(173, 255, 47)','#FF0000'
    ]

 
    for (let i = 0; i < 20; i++) {
        arr[i] = []
        for (let j = 0; j < 10; j++) {
            arr[i][j] = 0
        }
    }

    function drawGrid() {
        let gridHtml = ''
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                const color = arr[i][j] ? arr[i][j] : 'white'
                gridHtml += `<div class="cell" style="background-color: ${color}"></div>`;
            }
        }
        gridElement.innerHTML = gridHtml
    }

    function getRandomPieceColor() {
        return pieceColors[Math.floor(Math.random() * pieceColors.length)]
    }

    function initPiece() {
        const randomPieceIndex = Math.floor(Math.random() * pieces.length)
        currentPiece = {
            x: 4,
            y: 0,
            shape: pieces[randomPieceIndex],
            color: getRandomPieceColor()
        };
    }

    function drawPiece() {
        const pieceHtml = currentPiece.shape.map((row, i) =>
            row.map((cell, j) => cell ? `<div class="tetris-piece" style="top:${(currentPiece.y + i) * 30}px; left:${(currentPiece.x + j) * 30}px; background-color: ${currentPiece.color}"></div>` : '')
        ).join('')
        gridElement.innerHTML += pieceHtml
    }

    function moveDown() {
        currentPiece.y++
        if (checkCollision()) {
            currentPiece.y--
            freezePiece()
            clearLines()

            if (checkGameOver()) {
                gameOver = true;
                audio.pause()
                clearInterval(intervalId);
                console.log("Game over!");
                const gameOverMessage = document.createElement('div');
                gameOverMessage.textContent = "Game Over!";
                gameOverMessage.style.color = "black";
                gameOverMessage.style.fontSize = "32px";
                gameOverMessage.style.fontWeight = 'bold'
                gameOverMessage.style.position = "absolute";
                gameOverMessage.style.top = "48%";
                gameOverMessage.style.left = "45%";
                document.body.appendChild(gameOverMessage);
            } else {
                initPiece();
            }
        }
    }
    
    function checkGameOver() {
        for (let cell of arr[0]) {
            if (cell) {
                return true
            }
        }
        return false
    }

    function checkCollision() {
        for (let i = 0; i < currentPiece.shape.length; i++) {
            for (let j = 0; j < currentPiece.shape[i].length; j++) {
                if (currentPiece.shape[i][j] &&
                    (currentPiece.y + i >= 20 || arr[currentPiece.y + i][currentPiece.x + j])) {
                    return true
                }
            }
        }
        return false
    }

    function freezePiece() {
        for (let i = 0; i < currentPiece.shape.length; i++) {
            for (let j = 0; j < currentPiece.shape[i].length; j++) {
                if (currentPiece.shape[i][j]) {
                    arr[currentPiece.y + i][currentPiece.x + j] = currentPiece.color
                }
            }
        }
    }

    function clearLines() {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].every(cell => cell !== 0)) {
                arr.splice(i, 1)
                arr.unshift(Array(10).fill(0))
            }
        }
    }

    function gameLoop() {
        drawGrid()
        if (!currentPiece) {
            initPiece()
            drawPiece()
        } else {
            moveDown()
            drawPiece()
        }
    }
    
    startButton.addEventListener('click', function() {
        audio.play()
        if (!intervalId){ 
            intervalId = setInterval(gameLoop, 300)
        }
    })
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowLeft':
                movePiece('left')
                break
            case 'ArrowRight':
                movePiece('right')
                break
            case 'ArrowUp':
                rotate()
                break
        }
    })
    

    function movePiece(direction) {
        if (!currentPiece) return
        switch (direction) {
            case 'left':
                if (!checkCubesCollision(-1)) {
                    currentPiece.x--
                }
                break
            case 'right':
                if (!checkCubesCollision(1)) {
                    currentPiece.x++
                }
                break
        }
    }

    function checkCubesCollision(ab) {
        for (let i = 0; i < currentPiece.shape.length; i++) {
            for (let j = 0; j < currentPiece.shape[i].length; j++) {
                if (currentPiece.shape[i][j]) {
                    const nextX = currentPiece.x + j + ab
                    if (nextX < 0 || nextX >= 10 || arr[currentPiece.y + i][nextX]) {
                        return true
                    }
                }
            }
        }
        return false
     }

     function rotate() {
        const rotatedShape = currentPiece.shape[0].map(( _, index) =>
            currentPiece.shape.map(row => row[index]).reverse()
        );

        if (!checkCollision(rotatedShape)) {
            currentPiece.shape = rotatedShape
        }
    }
})

