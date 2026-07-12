class Game2048 {
    constructor() {
        this.gridSize = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore2048')) || 0;
        this.gameOver = false;
        this.won = false;
        this.keepPlaying = false;
        this.tileId = 0;
        
        this.gridContainer = document.getElementById('grid-container');
        this.tileContainer = document.getElementById('tile-container');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.gameOverScreen = document.getElementById('game-over');
        this.winScreen = document.getElementById('win-screen');
        this.finalScoreElement = document.getElementById('final-score');
        
        this.capybaraEmojis = {
            2: '🐹',
            4: '🐭',
            8: '🐰',
            16: '🦔',
            32: '🦊',
            64: '🐻',
            128: '🐼',
            256: '🦉',
            512: '🦁',
            1024: '🐯',
            2048: '🦄',
            super: '🌟'
        };
        
        this.init();
    }
    
    init() {
        this.createGrid();
        this.setupEventListeners();
        this.updateBestScore();
        this.newGame();
    }
    
    createGrid() {
        this.gridContainer.innerHTML = '';
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            this.gridContainer.appendChild(cell);
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Touch events for mobile
        let touchStartX, touchStartY;
        const gameContainer = document.querySelector('.game-container');
        
        gameContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        gameContainer.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        this.move('right');
                    } else {
                        this.move('left');
                    }
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        this.move('down');
                    } else {
                        this.move('up');
                    }
                }
            }
            
            touchStartX = null;
            touchStartY = null;
        });
        
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('retry-btn').addEventListener('click', () => this.newGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueGame());
        document.getElementById('new-game-win-btn').addEventListener('click', () => this.newGame());
    }
    
    newGame() {
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(null));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.keepPlaying = false;
        this.tileContainer.innerHTML = '';
        this.updateScore();
        this.hideGameOver();
        this.hideWin();
        
        this.addRandomTile();
        this.addRandomTile();
    }
    
    continueGame() {
        this.keepPlaying = true;
        this.hideWin();
    }
    
    addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) return;
        
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        
        this.grid[row][col] = {
            value,
            id: this.tileId++,
            row,
            col,
            isNew: true
        };
        
        this.renderTile(this.grid[row][col]);
    }
    
    renderTile(tile) {
        const tileElement = document.createElement('div');
        tileElement.className = `tile tile-${tile.value > 2048 ? 'super' : tile.value}`;
        if (tile.isNew) {
            tileElement.classList.add('tile-new');
            tile.isNew = false;
        }
        if (tile.isMerged) {
            tileElement.classList.add('tile-merged');
            tile.isMerged = false;
        }
        
        tileElement.id = `tile-${tile.id}`;
        
        const cellSize = this.gridContainer.offsetWidth / this.gridSize;
        const gap = 10;
        const tileSize = (this.gridContainer.offsetWidth - gap * (this.gridSize - 1)) / this.gridSize;
        
        tileElement.style.width = `${tileSize}px`;
        tileElement.style.height = `${tileSize}px`;
        tileElement.style.left = `${tile.col * (tileSize + gap)}px`;
        tileElement.style.top = `${tile.row * (tileSize + gap)}px`;
        
        const emoji = this.capybaraEmojis[tile.value] || this.capybaraEmojis.super;
        
        tileElement.innerHTML = `
            <div class="tile-inner">
                <span class="tile-emoji">${emoji}</span>
                <span class="tile-number">${tile.value}</span>
            </div>
        `;
        
        this.tileContainer.appendChild(tileElement);
    }
    
    updateTilePosition(tile) {
        const tileElement = document.getElementById(`tile-${tile.id}`);
        if (!tileElement) return;
        
        const gap = 10;
        const tileSize = (this.gridContainer.offsetWidth - gap * (this.gridSize - 1)) / this.gridSize;
        
        tileElement.style.left = `${tile.col * (tileSize + gap)}px`;
        tileElement.style.top = `${tile.row * (tileSize + gap)}px`;
    }
    
    removeTile(tileId) {
        const tileElement = document.getElementById(`tile-${tileId}`);
        if (tileElement) {
            tileElement.remove();
        }
    }
    
    handleKeyDown(e) {
        if (this.gameOver) return;
        
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        };
        
        const direction = keyMap[e.key];
        if (direction) {
            e.preventDefault();
            this.move(direction);
        }
    }
    
    move(direction) {
        if (this.gameOver) return;
        
        let moved = false;
        const mergedPositions = new Set();
        
        const vectors = {
            up: { row: -1, col: 0 },
            down: { row: 1, col: 0 },
            left: { row: 0, col: -1 },
            right: { row: 0, col: 1 }
        };
        
        const vector = vectors[direction];
        
        // Build traversal order
        const traversals = this.buildTraversals(vector);
        
        // Reset merge flags
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col]) {
                    this.grid[row][col].mergedFrom = null;
                }
            }
        }
        
        traversals.rows.forEach(row => {
            traversals.cols.forEach(col => {
                const tile = this.grid[row][col];
                if (tile) {
                    const positions = this.findFarthestPosition(row, col, vector);
                    const next = this.grid[positions.next.row]?.[positions.next.col];
                    
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        // Merge
                        const merged = {
                            value: tile.value * 2,
                            id: this.tileId++,
                            row: positions.next.row,
                            col: positions.next.col,
                            mergedFrom: [tile, next],
                            isMerged: true
                        };
                        
                        this.grid[row][col] = null;
                        this.grid[positions.next.row][positions.next.col] = merged;
                        
                        // Update UI
                        tile.row = positions.next.row;
                        tile.col = positions.next.col;
                        this.updateTilePosition(tile);
                        
                        setTimeout(() => {
                            this.removeTile(tile.id);
                            this.removeTile(next.id);
                            this.renderTile(merged);
                        }, 150);
                        
                        this.score += merged.value;
                        moved = true;
                        
                        if (merged.value === 2048 && !this.won && !this.keepPlaying) {
                            this.won = true;
                            setTimeout(() => this.showWin(), 300);
                        }
                    } else {
                        // Move to farthest position
                        if (positions.farthest.row !== row || positions.farthest.col !== col) {
                            this.grid[row][col] = null;
                            this.grid[positions.farthest.row][positions.farthest.col] = tile;
                            tile.row = positions.farthest.row;
                            tile.col = positions.farthest.col;
                            this.updateTilePosition(tile);
                            moved = true;
                        }
                    }
                }
            });
        });
        
        if (moved) {
            setTimeout(() => {
                this.addRandomTile();
                this.updateScore();
                
                if (!this.movesAvailable()) {
                    this.gameOver = true;
                    setTimeout(() => this.showGameOver(), 300);
                }
            }, 150);
        }
    }
    
    buildTraversals(vector) {
        const traversals = { rows: [], cols: [] };
        
        for (let i = 0; i < this.gridSize; i++) {
            traversals.rows.push(i);
            traversals.cols.push(i);
        }
        
        if (vector.row === 1) traversals.rows.reverse();
        if (vector.col === 1) traversals.cols.reverse();
        
        return traversals;
    }
    
    findFarthestPosition(row, col, vector) {
        let previous;
        
        do {
            previous = { row, col };
            row += vector.row;
            col += vector.col;
        } while (this.withinBounds(row, col) && !this.grid[row][col]);
        
        return {
            farthest: previous,
            next: { row, col }
        };
    }
    
    withinBounds(row, col) {
        return row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize;
    }
    
    movesAvailable() {
        // Check for empty cells
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col]) return true;
            }
        }
        
        // Check for possible merges
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const tile = this.grid[row][col];
                if (tile) {
                    const directions = [
                        { row: 0, col: 1 },
                        { row: 1, col: 0 }
                    ];
                    
                    for (const dir of directions) {
                        const newRow = row + dir.row;
                        const newCol = col + dir.col;
                        
                        if (this.withinBounds(newRow, newCol)) {
                            const other = this.grid[newRow][newCol];
                            if (other && other.value === tile.value) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        
        return false;
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore2048', this.bestScore);
            this.updateBestScore();
        }
    }
    
    updateBestScore() {
        this.bestScoreElement.textContent = this.bestScore;
    }
    
    showGameOver() {
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.classList.add('active');
    }
    
    hideGameOver() {
        this.gameOverScreen.classList.remove('active');
    }
    
    showWin() {
        this.winScreen.classList.add('active');
    }
    
    hideWin() {
        this.winScreen.classList.remove('active');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
