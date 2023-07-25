// Mã JavaScript cho trò chơi 2048

// Đặt kích thước bảng trò chơi
const boardSize = 4;

// Khởi tạo bảng trò chơi rỗng
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

// Đối tượng Image để quản lý hình ảnh trong ô
const images = {};

// Tính điểm
let score = 0;

// Hình ảnh tùy chỉnh cho mỗi ô
let customImage = "default";

// Danh sách tên hình ảnh
const imagesList = [
    "default",
    "DBO"
    // Thêm các tên hình ảnh tùy chỉnh khác vào đây
];

// Danh sách tham chiếu hình ảnh tương ứng
const imageRefs = {
    // Thêm các tham chiếu hình ảnh tùy chỉnh khác vào đây
    "default": "",
    "DBO": "img"
};

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
            let cellImage = images[cellValue];

            const cell = document.createElement("div");
            cell.className = "cell";
            if (cellValue !== 0) {
                cell.innerHTML = `<div class="cell-content">${cellImage ? cellImage : cellValue}</div>`;
            }
            gameBoard.appendChild(cell);
        }
    }
}

// ...

// Hàm để khởi tạo trò chơi
function startGame() {
    // Reset điểm và bảng trò chơi
    score = 0;
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    addRandomNumber();
    addRandomNumber();
    renderBoard();
}
// ...

// Xử lý sự kiện thay đổi hình ảnh tùy chỉnh
const imageSelector = document.getElementById("customImage");
imageSelector.addEventListener("change", function () {
    customImage = imageSelector.value;
    renderBoard();
});

// Xử lý sự kiện chọn hình ảnh tùy chỉnh từ file
const customImageFile = document.getElementById("customImageFile");
customImageFile.addEventListener("change", function () {
    const file = customImageFile.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
            images[customImage] = image;
            renderBoard();
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

// Gọi hàm khởi tạo trò chơi khi trang được tải
window.onload = function () {
    // Tạo đối tượng Image cho từng giá trị số trên bảng
    for (let i = 2; i <= 2048; i *= 2) {
        images[i] = `<img src="img/img${i}.jpg" alt="${i}">`;
    }

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

    startGame();
};


