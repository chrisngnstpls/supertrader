// Layout utility functions for responsive positioning
export class LayoutUtils {
    constructor(scene) {
        this.scene = scene;
        this.gameWidth = scene.sys.game.config.width;
        this.gameHeight = scene.sys.game.config.height;
    }

    // Calculate percentage-based positions
    getPosition(xPercent, yPercent) {
        return {
            x: (this.gameWidth * xPercent) / 100,
            y: (this.gameHeight * yPercent) / 100
        };
    }

    // Predefined layout positions for common UI elements
    getLayoutPositions() {
        return {
            // Header area (top 20% of screen)
            userInfo: this.getPosition(54, 5),      // User name
            price: this.getPosition(54, 11.5),        // Current price
            
            // Character animation area (center)
            character: this.getPosition(24, 36),    // Character sprite
            
            // Stats panel (right side, middle area)
            money: this.getPosition(56, 34),        // Money display
            assets: this.getPosition(56, 47),       // Assets display
            entryPrice: this.getPosition(56, 75),   // Entry price
            trades: this.getPosition(56, 62),       // Total trades
            tradeSide: this.getPosition(56, 89),    // Trade side info
            
            // Controls (bottom area)
            buyButton: this.getPosition(8, 85),    // Buy button
            sellButton: this.getPosition(31.5, 85)    // Sell button
        };
    }

    // Font sizes based on screen size
    getFontSizes() {
        const baseSize = Math.min(this.gameWidth, this.gameHeight) / 25;
        return {
            large: Math.floor(baseSize * 1.2),      // For price
            medium: Math.floor(baseSize),           // For money/assets
            small: Math.floor(baseSize * 0.8),      // For details
            button: Math.floor(baseSize * 1.1)      // For buttons
        };
    }

    // Color scheme
    getColors() {
        return {
            positive: '#0f0',   // Green for money, buy
            negative: '#f00',   // Red for assets, sell
            neutral: '#fff',    // White for general text
            accent: '#ff0'      // Yellow for highlights
        };
    }
}
