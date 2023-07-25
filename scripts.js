// Mã JavaScript cho trò chơi 2048

// Đặt kích thước bảng trò chơi
const boardSize = 4;

// Khởi tạo bảng trò chơi rỗng
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

// Tính điểm
let score = 0;

// Hàm để thêm số 2 hoặc 4 vào vị trí ngẫu nhiên trên bảng
function addRandomNumber() {
    const emptyCells = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Hàm để hiển thị bảng trò chơi lên giao diện
function renderBoard() {
    const gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = "";

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cellValue = board[row][col];
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.innerText = cellValue !== 0 ? cellValue : "";
            gameBoard.appendChild(cell);
        }
    }
}

// Hàm để khởi tạo trò chơi
function startGame() {
    // Reset điểm và bảng trò chơi
    score = 0;
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    addRandomNumber();
    addRandomNumber();
    renderBoard();
}

// Kiểm tra xem ô có thể di chuyển hay không
function canMove(row, col, moveRow, moveCol) {
    // Kiểm tra xem ô đích có giống giá trị ô hiện tại hay không
    if (board[row + moveRow][col + moveCol] === 0 || board[row + moveRow][col + moveCol] === board[row][col]) {
        return true;
    }
    return false;
}

// Hàm di chuyển các ô
function moveTiles(moveRow, moveCol) {
    let moved = false;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] !== 0) {
                let newRow = row + moveRow;
                let newCol = col + moveCol;

                while (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    if (board[newRow][newCol] === 0) {
                        // Di chuyển ô tới vị trí mới nếu ô đích trống
                        board[newRow][newCol] = board[row][col];
                        board[row][col] = 0;
                        row = newRow;
                        col = newCol;
                        moved = true;
                    } else if (board[newRow][newCol] === board[row][col]) {
                        // Gộp số nếu giá trị ô đích giống với ô hiện tại
                        board[newRow][newCol] *= 2;
                        score += board[newRow][newCol];
                        board[row][col] = 0;
                        moved = true;
                        break;
                    } else {
                        break;
                    }

                    newRow += moveRow;
                    newCol += moveCol;
                }
            }
        }
    }

    return moved;
}

// Kiểm tra trạng thái chiến thắng hoặc thua
function checkWinOrLose() {
    // Kiểm tra điều kiện thắng hoặc thua
    // Nếu người chơi thắng hoặc thua, hiển thị thông báo phù hợp

    // Kiểm tra chiến thắng
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 2048) {
                alert("You win!");
                startGame();
                return;
            }
        }
    }

    // Kiểm tra thua
    let hasEmptyCell = false;
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) {
                hasEmptyCell = true;
                break;
            }
        }
    }

    if (!hasEmptyCell) {
        // Kiểm tra xem có thể di chuyển các ô hay không
        let canMoveTiles = false;
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                for (const direction of directions) {
                    const moveRow = direction[0];
                    const moveCol = direction[1];
                    if (canMove(row, col, moveRow, moveCol)) {
                        canMoveTiles = true;
                        break;
                    }
                }
            }
        }

        if (!canMoveTiles) {
            alert("Game over! Your score: " + score);
            startGame();
            return;
        }
    }
}

// Gọi hàm khởi tạo trò chơi khi trang được tải
window.onload = function () {
    // Hàm xử lý sự kiện cảm ứng
    let touchStartX, touchStartY;
    document.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener("touchend", function (event) {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Di chuyển ngang
            if (dx > 0) {
                // Vuốt sang phải
                moveTiles(0, 1);
            } else {
                // Vuốt sang trái
                moveTiles(0, -1);
            }
        } else {
            // Di chuyển dọc
            if (dy > 0) {
                // Vuốt xuống dưới
                moveTiles(1, 0);
            } else {
                // Vuốt lên trên
                moveTiles(-1, 0);
            }
        }

        // Kiểm tra chiến thắng hoặc thua
        checkWinOrLose();
    });

    // Xử lý sự kiện khi người dùng nhấn phím
    document.addEventListener("keydown", function (event) {
        // Lấy mã phím vừa nhấn
        const key = event.key;

        // Xác định hướng di chuyển dựa trên phím nhấn
        let moveRow = 0;
        let moveCol = 0;
        if (key === "ArrowUp") {
            moveRow = -1;
        } else if (key === "ArrowDown") {
            moveRow = 1;
        } else if (key === "ArrowLeft") {
            moveCol = -1;
        } else if (key === "ArrowRight") {
            moveCol = 1;
        } else {
            return;
        }

        // Di chuyển các ô và gộp số
        const moved = moveTiles(moveRow, moveCol);

        // Nếu có di chuyển, thêm số mới và cập nhật giao diện
        if (moved) {
            addRandomNumber();
            renderBoard();
            document.getElementById("score").innerText = `Score: ${score}`;
        }

        // Kiểm tra chiến thắng hoặc thua
        checkWinOrLose();
    });

    // Gọi hàm khởi tạo trò chơi
    startGame();
};
