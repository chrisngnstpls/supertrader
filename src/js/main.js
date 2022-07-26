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
	scale:{
		zoom:2
	},

}

// export default new Phaser.Game(config)
let referrer = document.referrer
window.location=referrer

window.addEventListener('load', () => {
	new Phaser.Game(config)
})
