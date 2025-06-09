# Deployment Guide for Coolify

This Phaser app is now configured for deployment on Coolify using Nixpacks.

## Configuration Files

- `nixpacks.toml`: Defines the build and start commands for Nixpacks
- `package.json`: Updated with production serve script and correct entry point

## Deployment Process

1. **Push to Git Repository**: Ensure all changes are committed and pushed to your Git repository.

2. **Coolify Configuration**:
   - Create a new application in Coolify
   - Connect your Git repository
   - Coolify will automatically detect the `nixpacks.toml` file

3. **Build Process**:
   - Nixpacks will run `npm install` to install dependencies
   - Then run `npm run build` to create the production build in the `dist` directory
   - Finally start the server with `npm run serve`

4. **Port Configuration**:
   - The `serve` command runs on port 3000 by default
   - Make sure Coolify is configured to expose port 3000

## Local Testing

To test the production build locally:

```bash
# Build the application
npm run build

# Serve the built files
npm run serve
```

Then visit http://localhost:3000 to test your game.

## Files Structure After Build

```
dist/
├── index.html                 # Main HTML file
├── main.[hash].js            # Your game code
├── phaser.[hash].js          # Phaser library
└── assets/                   # Game assets
    ├── animation/
    ├── audio/
    ├── images/
    └── tiles/
```

## Troubleshooting

- If deployment fails, check the Coolify logs for build errors
- Ensure all dependencies are properly listed in `package.json`
- Verify that the `dist` directory is created during the build process
