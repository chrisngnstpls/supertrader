import Phaser from "phaser";

export default class Preloader extends Phaser.Scene
{
    constructor(){
        super('preloader')
    }

    preload(){
        //preload images 
        this.load.image('powerup1', './assets/images/powerUps/powerup1.png')
        this.load.image('powerup2', './assets/images/powerUps/powerup2.png')
        this.load.image('powerup3', './assets/images/powerUps/insiderTrading.png')
        this.load.image('powerup4', './assets/images/powerUps/fomo.png')
        this.load.image('powerup5', './assets/images/powerUps/algoTrading.png')
        this.load.image('powerup6', './assets/images/powerUps/airdrop.png')

        this.load.image('blackSwan1', './assets/images/blackSwans/blackSwan1.png')
        this.load.image('blackSwan2', './assets/images/blackSwans/blackSwan2.png')
        this.load.image('blackSwan3', './assets/images/blackSwans/audit.png')
        this.load.image('blackSwan4', './assets/images/blackSwans/badNews.png')
        this.load.image('blackSwan5', './assets/images/blackSwans/bearMarket.png')
        this.load.image('blackSwan6', './assets/images/blackSwans/ceoSuicide.png')
        this.load.image('blackSwan7', './assets/images/blackSwans/faded.png')
        this.load.image('blackSwan8', './assets/images/blackSwans/naturalDisaster.png')
        this.load.image('blackSwan9', './assets/images/blackSwans/war.png')

        this.load.image('wolf', './assets/images/titlescreen/wolf_1.png')
        this.load.image('gekko', './assets/images/titlescreen/gekko_1.png')
        this.load.image('bgCity', './assets/images/titlescreen/city_1.png')
        this.load.image('blackSwanWindow', './assets/images/blackSwanWindow.png')
        this.load.image('powerupWindow', './assets/images/powerupWindow.png')
        

        //preload tiles, tilemaps, spritesheets
        this.load.image('tiles', './assets/images/outdoors.png')
        this.load.tilemapTiledJSON('desktop', './assets/tiles/firstTileMap.json')
        
        this.load.image('tiles2', './assets/tiles/tileset_sf.png')
        this.load.tilemapTiledJSON('superTraderDesktop', './assets/tiles/superTraderNew.json')
        
        this.load.image('titleBg', './assets/images/titleBg.png');
        this.load.spritesheet('downOnly', './assets/animation/down/downonly2.png',{
            frameWidth: 208,
            frameHeight: 320,
            endFrame:37
        });
        this.load.spritesheet('upOnly', './assets/animation/up/uponly2.png',{
            frameWidth: 208,
            frameHeight: 320,
            endFrame:37
        });
        this.load.spritesheet('sideOnly', './assets/animation/side/sideonly.png',{
            frameWidth: 208,
            frameHeight: 320,
            endFrame:37
        });
        
        //load audio files
        this.load.audio('ambience',['./assets/audio/effects/ambience.m4a'])
        this.load.audio('beepOnce',['./assets/audio/effects/beepOnce.wav'])
        this.load.audio('accept',['./assets/audio/effects/menuAccept.wav'])
        this.load.audio('tick',['./assets/audio/effects/priceTick.wav'])
        this.load.audio('selectOk',['./assets/audio/effects/selectBeep.wav'])
        this.load.audio('textInput',['./assets/audio/effects/textTick.wav'])
        this.load.audio('secondBeep',['./assets/audio/effects/toneBeep.wav'])
        this.load.audio('boop',['./assets/audio/effects/boop.wav'])
        this.load.audio('chaChing',['./assets/audio/effects/chaChing.wav'])
        this.load.audio('money',['./assets/audio/effects/money.wav'])
        this.load.audio('notification',['./assets/audio/effects/notification.wav'])
        this.load.audio('error', ['./assets/audio/effects/error.wav'])
        this.load.audio('gameOverMusic', ['./assets/audio/soundtrack/motro_interlude.mp3'])
        this.load.audio('introMusic', ['./assets/audio/soundtrack/motrofoko_2.mp3'])
    }

    create(){
        this.scene.start('Title', {money:1000, userName:''})
    }
}