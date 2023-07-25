// Mã JavaScript cho trò chơi 2048

// ...

// Hàm xử lý sự kiện cảm ứng
let touchStartX, touchStartY;
document.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener("touchmove", function (event) {
    event.preventDefault();
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
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
});

// Hàm để hiển thị bảng trò chơi lên giao diện
function renderBoard() {
    const gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = "";

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cellValue = board[row][col];
            let cellImage = images[cellValue];

            const cell = document.createElement("div");
            cell.className = "cell";
            cell.innerHTML = `<div class="cell-content">${cellImage ? cellImage : cellValue}</div>`;
            gameBoard.appendChild(cell);
        }
    }
}

// ...
