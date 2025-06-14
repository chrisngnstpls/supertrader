import Phaser from "phaser";

export default class GameIsOver extends Phaser.Scene
{
    constructor(){
        super('GameOver')
    }

    init(data){
        console.log(Object.values(data))
        
        this.userName = data.userDetails.userName
        this.tradesNo = (data.tradeDetails).length
        this.inflation = (data.inflation).toFixed(2)
        this.timeAlive = (data.timeAlive / 1000).toFixed(2)
        this.mentalHealth = data.mentalHealth ? data.mentalHealth.toFixed(1) : 0
        this.gameOverReason = data.mentalHealth <= 0 ? 'mental' : 'liquidated'
    }
    preload(){
        
    }

    create(){
        const overMap = this.make.tilemap({key:'gameOverMap'})
        const overTileset = overMap.addTilesetImage('outdoors','tiles3')
        const overBackground = overMap.createLayer('bg', overTileset)
        // Display different message based on game over reason
        const gameOverMessage = this.gameOverReason === 'mental' 
            ? `${this.userName} lost their marbles` 
            : `${this.userName} was liquidated`;
        
        let liqd = this.add.text(129,29, gameOverMessage, {fill:'#d200ff', fontFamily:'Jersey', fontSize:24, stroke:"#fff"})
        liqd.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 4);

        this.add.text(129,120,`${this.tradesNo} total Trades `, {fill:'#b041d0',fontFamily:'Jersey', fontSize:16})
        this.add.text(129,160,`Inflation : ${this.inflation} %`, {fill:'#b041d0',fontFamily:'Jersey', fontSize:16})
        this.add.text(129,200,`Mental health : ${this.mentalHealth} %`,{fill:'#b041d0',fontFamily:'Jersey', fontSize:16})
        this.add.text(129,240,`Total seconds lived :${this.timeAlive} `, {fill:'#b041d0',fontFamily:'Jersey', fontSize:16})
        let endButton = this.playAgain = this.add.rectangle(250,308,220,70,0xe9c675).setOrigin(0.5)
        endButton.setAlpha(0.6)
        this.playAgain.setStrokeStyle(2, 0x006722)        
        this.playAgainText = this.add.text(250,308,'MENU', {fill:'#0f0', fontFamily:'Jersey' ,fontSize:72})
        .setOrigin(0.5)
        .setInteractive({useHandCursor : true})
        .on('pointerover', (pointer) => {

            this.playAgain.fillColor = 0x000000
        })
        .on('pointerout', (pointer)=>{

            this.playAgain.fillColor = 0xe9c675
        })
        .on('pointerup', () => {
            this.scene.stop();
            this.game.sound.stopAll()
            this.data.tradeDetails = []
            console.log(this.data.tradeDetails)
            this.scene.launch('Title', {money:1000, userName:this.userName})
              
            //menuAccept.play()

        })

    }
    update(
        
    ){

    }

}
