/**
 * 五子棋游戏类
 * 使用ES6模块化语法
 */

// 游戏配置常量
const BOARD_SIZE = 15; // 棋盘大小：15x15
const CELL_SIZE = 40; // 每个格子的大小（像素）
const PIECE_RADIUS = 16; // 棋子半径（像素）
const PADDING = 20; // 棋盘边距（像素）

// 玩家类型枚举
const PLAYER = {
    BLACK: 1, // 黑方
    WHITE: 2  // 白方
};

/**
 * 五子棋游戏核心类
 */
class GomokuGame {
    /**
     * 构造函数：初始化游戏
     * @param {HTMLCanvasElement} canvas - 画布元素
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentPlayer = PLAYER.BLACK; // 当前玩家，黑方先手
        this.board = []; // 棋盘二维数组
        this.gameOver = false; // 游戏是否结束
        this.winner = null; // 获胜者

        // 设置Canvas的实际绘制尺寸
        this.initCanvasSize();
        // 初始化棋盘
        this.initBoard();
        // 绘制棋盘
        this.drawBoard();
        // 绑定事件监听器
        this.bindEvents();
    }

    /**
     * 初始化Canvas尺寸
     * 设置Canvas的实际绘制尺寸与显示尺寸一致，避免坐标转换问题
     */
    initCanvasSize() {
        // 获取Canvas的显示尺寸
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // 设置Canvas的实际绘制尺寸（考虑设备像素比）
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // 缩放绘图上下文以匹配设备像素比
        this.ctx.scale(dpr, dpr);

        // 保存显示尺寸，用于坐标转换
        this.displayWidth = rect.width;
        this.displayHeight = rect.height;
    }

    /**
     * 初始化棋盘数组
     * 创建15x15的二维数组，初始值为0（空位）
     */
    initBoard() {
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    }

    /**
     * 绘制棋盘背景和网格线
     */
    drawBoard() {
        const { ctx, displayWidth, displayHeight } = this;

        // 计算动态的单元格大小和边距
        const minSize = Math.min(displayWidth, displayHeight);
        const padding = minSize * 0.05; // 边距为画布的5%
        const cellSize = (minSize - padding * 2) / (BOARD_SIZE - 1);
        const pieceRadius = cellSize * 0.4; // 棋子半径为单元格的40%

        // 保存这些值供其他方法使用
        this.padding = padding;
        this.cellSize = cellSize;
        this.pieceRadius = pieceRadius;

        // 清空画布
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        // 绘制棋盘背景色（木纹色）
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        // 绘制网格线
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        // 绘制横线
        for (let i = 0; i < BOARD_SIZE; i++) {
            const y = padding + i * cellSize;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + (BOARD_SIZE - 1) * cellSize, y);
            ctx.stroke();
        }

        // 绘制竖线
        for (let i = 0; i < BOARD_SIZE; i++) {
            const x = padding + i * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + (BOARD_SIZE - 1) * cellSize);
            ctx.stroke();
        }

        // 绘制天元和星位（装饰点）
        this.drawStarPoints();
    }

    /**
     * 绘制棋盘上的星位点（天元和四个角的标记点）
     */
    drawStarPoints() {
        const { ctx, padding, cellSize } = this;
        const positions = [
            [7, 7],   // 天元（中心点）
            [3, 3],   // 左上星位
            [3, 11],  // 右上星位
            [11, 3],  // 左下星位
            [11, 11]  // 右下星位
        ];

        ctx.fillStyle = '#000';
        positions.forEach(([row, col]) => {
            const x = padding + col * cellSize;
            const y = padding + row * cellSize;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    /**
     * 绘制单个棋子
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @param {number} player - 玩家类型（1:黑方, 2:白方）
     */
    drawPiece(row, col, player) {
        const { ctx, padding, cellSize, pieceRadius } = this;
        const x = padding + col * cellSize;
        const y = padding + row * cellSize;

        // 创建径向渐变效果，使棋子更立体
        const gradient = ctx.createRadialGradient(
            x - 5, y - 5, 2,
            x, y, pieceRadius
        );

        if (player === PLAYER.BLACK) {
            // 黑色棋子渐变
            gradient.addColorStop(0, '#666');
            gradient.addColorStop(1, '#000');
        } else {
            // 白色棋子渐变
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
        }

        // 绘制棋子
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, pieceRadius, 0, 2 * Math.PI);
        ctx.fill();

        // 绘制棋子边框
        ctx.strokeStyle = player === PLAYER.BLACK ? '#000' : '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * 重绘所有棋子
     * 遍历棋盘数组，重新绘制所有已下的棋子
     */
    redrawAllPieces() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (this.board[row][col] !== 0) {
                    this.drawPiece(row, col, this.board[row][col]);
                }
            }
        }
    }

    /**
     * 处理点击事件
     * @param {MouseEvent|Touch} event - 鼠标点击事件或触摸事件
     */
    handleClick(event) {
        // 如果游戏已结束，不允许继续落子
        if (this.gameOver) return;

        // 获取点击位置相对于canvas的坐标
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 将像素坐标转换为棋盘坐标，使用动态计算的padding和cellSize
        const col = Math.round((x - this.padding) / this.cellSize);
        const row = Math.round((y - this.padding) / this.cellSize);

        // 检查坐标是否在棋盘范围内
        if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
            return;
        }

        // 检查该位置是否已有棋子
        if (this.board[row][col] !== 0) {
            return;
        }

        // 落子
        this.makeMove(row, col);
    }

    /**
     * 执行落子操作
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     */
    makeMove(row, col) {
        // 在棋盘数组中记录落子
        this.board[row][col] = this.currentPlayer;

        // 绘制棋子
        this.drawPiece(row, col, this.currentPlayer);

        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.showWinner();
            return;
        }

        // 检查是否平局（棋盘已满）
        if (this.isBoardFull()) {
            this.gameOver = true;
            this.showDraw();
            return;
        }

        // 切换玩家
        this.switchPlayer();
    }

    /**
     * 检查是否获胜
     * @param {number} row - 最后落子的行索引
     * @param {number} col - 最后落子的列索引
     * @returns {boolean} 是否获胜
     */
    checkWin(row, col) {
        const player = this.board[row][col];

        // 定义四个方向：横、竖、主对角线、副对角线
        const directions = [
            [[0, -1], [0, 1]],   // 横向（左右）
            [[-1, 0], [1, 0]],   // 纵向（上下）
            [[-1, -1], [1, 1]],  // 主对角线（左上右下）
            [[-1, 1], [1, -1]]   // 副对角线（右上左下）
        ];

        // 检查每个方向
        for (const direction of directions) {
            let count = 1; // 当前位置算一个

            // 检查两个方向
            for (const [dx, dy] of direction) {
                let newRow = row + dx;
                let newCol = col + dy;

                // 沿着这个方向继续计数
                while (
                    newRow >= 0 && newRow < BOARD_SIZE &&
                    newCol >= 0 && newCol < BOARD_SIZE &&
                    this.board[newRow][newCol] === player
                ) {
                    count++;
                    newRow += dx;
                    newCol += dy;
                }
            }

            // 如果某个方向上连续5个或以上，则获胜
            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    /**
     * 检查棋盘是否已满
     * @returns {boolean} 棋盘是否已满
     */
    isBoardFull() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 切换当前玩家
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === PLAYER.BLACK ? PLAYER.WHITE : PLAYER.BLACK;
        this.updateCurrentPlayerDisplay();
    }

    /**
     * 更新当前玩家显示
     */
    updateCurrentPlayerDisplay() {
        const playerDisplay = document.getElementById('currentPlayer');
        if (!playerDisplay) {
            console.error('找不到currentPlayer元素');
            return;
        }
        playerDisplay.textContent = this.currentPlayer === PLAYER.BLACK ? '黑方' : '白方';
        playerDisplay.style.color = this.currentPlayer === PLAYER.BLACK ? '#000' : '#666';
    }

    /**
     * 显示获胜信息
     */
    showWinner() {
        const statusElement = document.getElementById('gameStatus');
        if (!statusElement) {
            console.error('找不到gameStatus元素');
            return;
        }
        const winnerName = this.winner === PLAYER.BLACK ? '黑方' : '白方';
        statusElement.textContent = `🎉 ${winnerName}获胜！`;
        statusElement.className = 'game-status winner';
    }

    /**
     * 显示平局信息
     */
    showDraw() {
        const statusElement = document.getElementById('gameStatus');
        if (!statusElement) {
            console.error('找不到gameStatus元素');
            return;
        }
        statusElement.textContent = '平局！棋盘已满。';
        statusElement.className = 'game-status';
    }

    /**
     * 重置游戏
     */
    reset() {
        // 重置游戏状态
        this.currentPlayer = PLAYER.BLACK;
        this.gameOver = false;
        this.winner = null;

        // 重新初始化Canvas尺寸（处理窗口大小变化）
        this.initCanvasSize();

        // 重新初始化棋盘
        this.initBoard();

        // 重新绘制棋盘
        this.drawBoard();

        // 更新玩家显示
        this.updateCurrentPlayerDisplay();

        // 清空状态显示
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = '';
            statusElement.className = 'game-status';
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 绑定画布点击事件
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // 绑定触摸事件（移动端支持）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 防止触发默认的滚动行为
            const touch = e.touches[0];
            // 将触摸事件转换为点击事件格式
            this.handleClick({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        });

        // 绑定重新开始按钮事件
        const restartBtn = document.getElementById('restartBtn');
        if (!restartBtn) {
            console.error('找不到restartBtn元素');
            return;
        }
        restartBtn.addEventListener('click', () => this.reset());

        // 绑定窗口大小变化事件（响应式支持）
        window.addEventListener('resize', () => {
            // 使用防抖，避免频繁重绘
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.initCanvasSize();
                this.drawBoard();
                this.redrawAllPieces();
            }, 250);
        });
    }
}

/**
 * 初始化游戏
 * 页面加载完成后自动执行
 */
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('找不到gameCanvas元素');
        return;
    }
    const game = new GomokuGame(canvas);
}

// 页面加载完成后初始化游戏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
