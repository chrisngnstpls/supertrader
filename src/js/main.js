import Phaser from 'phaser'

import SuperTraderScene from './scenes/SuperTrader'
import Preloader from './scenes/Preloader'
import Title from './scenes/Title'
import PowerUps from './scenes/PowerUp'
import GameIsOver from './scenes/GameOver'


const config = {
	type: Phaser.AUTO,
	width: 464,
	height: 464,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y:0 },
			fps:24
		}
	},
	scene: [Preloader,Title,SuperTraderScene,PowerUps,GameIsOver],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: 'game-container',
		width: 464,
		height: 464,
		min: {
			width: 320,
			height: 320
		},
		max: {
			width: 1024,
			height: 1024
		}
	},
	render: {
		antialias: false,
		pixelArt: true
	},

}

// export default new Phaser.Game(config)
// let referrer = document.referrer
// window.location=referrer

window.addEventListener('load', () => {
	new Phaser.Game(config)
})
