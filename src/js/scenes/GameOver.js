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
    }
    preload(){
        
    }

    create(){

        this.add.text(129,120,`${this.userName} was liquidated `, {fill:'#fff'})
        this.add.text(129,150,`${this.tradesNo} total Trades `, {fill:'#fff'})
        var inflation = this.add.text(129,180,`inflation : ${this.inflation} `, {fill:'#fff'})
        var timeAlive = this.add.text(129,210,`total seconds lived :${this.timeAlive} `, {fill:'#fff'})
        this.playAgain = this.add.rectangle(232,308,220,70,0xBEBEBE).setOrigin(0.5)
        this.playAgain.setStrokeStyle(2, 0x006722)        
        this.playAgainText = this.add.text(232,308,'START', {fill:'#0f0', fontFamily:'Courier' ,fontSize:72})
        .setOrigin(0.5)
        .setInteractive({useHandCursor : true})
        .on('pointerover', (pointer) => {

            this.playAgain.fillColor = 0x000000
        })
        .on('pointerout', (pointer)=>{

            this.playAgain.fillColor = 0xA5A5A5
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