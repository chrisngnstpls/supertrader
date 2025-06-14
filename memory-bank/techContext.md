# Technical Context

## Tech Stack
- **Game Engine**: Phaser 3.85.2
- **Build Tool**: Webpack 5.70.0
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm
- **Development Server**: webpack-dev-server 4.7.4

## Development Setup
```bash
# Installation
npm install

# Development server (localhost:8080)
npm run start

# Production build
npm run build

# Serve production build
npm run serve
```

## Key Dependencies

### Core
- `phaser`: 3.85.2 - Game engine with physics, audio, input handling
- `webpack`: 5.70.0 - Module bundler and build system
- `webpack-cli`: 4.9.2 - Command line interface for webpack

### Build Tools
- `babel-loader`: 8.2.3 - ES6+ transpilation
- `copy-webpack-plugin`: 10.2.4 - Asset copying
- `html-webpack-plugin`: 5.5.0 - HTML generation
- `file-loader`: 6.2.0 - Asset loading
- `json-loader`: 0.5.7 - JSON file handling

### Development
- `webpack-dev-server`: 4.7.4 - Hot reload development server
- `typescript`: 4.6.2 - Type checking (configured but not actively used)
- `ts-loader`: 9.2.7 - TypeScript loader

### Production
- `serve`: 14.2.4 - Static file server for production builds

## Project Configuration

### Webpack Config
- **Entry**: `src/js/main.js`
- **Output**: `dist/` directory
- **Asset Handling**: Images, audio, JSON files
- **Development**: Hot reload, source maps
- **Production**: Minification, optimization

### Phaser Configuration
```javascript
{
  type: Phaser.AUTO,
  width: 464,
  height: 464,
  physics: { default: 'arcade', arcade: { gravity: {y:0}, fps:24 } },
  scale: { 
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 320, height: 320 },
    max: { width: 1024, height: 1024 }
  },
  render: { antialias: false, pixelArt: true }
}
```

## Asset Pipeline
- **Images**: PNG format, pixel art style
- **Audio**: WAV for effects, M4A/MP3 for music
- **Tilemaps**: Tiled JSON format
- **Spritesheets**: Custom frame configurations

## Technical Constraints
- **Target Resolution**: 464x464 (scalable)
- **Browser Support**: Modern browsers with WebGL
- **Performance**: 60fps target, mobile-friendly
- **Asset Budget**: <10MB total size
- **Memory**: Efficient sprite management

## Development Patterns
- **Module System**: ES6 imports/exports
- **Scene Architecture**: Class-based inheritance
- **Event Handling**: Custom EventsCenter singleton
- **State Management**: Scene-based with data passing

## Build Process
1. **Development**: 
   - Webpack dev server with hot reload
   - Source maps for debugging
   - Asset watching and recompilation

2. **Production**:
   - Code minification and optimization
   - Asset compression
   - Bundle analysis and tree shaking

## Deployment
- **Target**: Static hosting (GitHub Pages, Netlify, etc.)
- **Build Output**: `dist/` directory
- **Requirements**: Web server with MIME type support
- **CDN**: Assets can be served from CDN for performance

## Tool Usage Patterns
- **Audio**: Phaser's WebAudio API with fallback
- **Graphics**: Canvas rendering with WebGL acceleration
- **Input**: Mouse/touch with keyboard support
- **Storage**: LocalStorage for game state (not implemented)
