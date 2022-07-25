import Phaser from "phaser";

export default class Title extends Phaser.Scene{
    constructor(){
        
        super('Title')
    
    }
    init(data){
        this.userName = data.userName
        this.money = data.money
    }
    preload(){
    
    }
    create(){
        let bgCity = this.add.sprite(0,0,'bgCity').setOrigin(0)
        let wolfOfWallStreet = this.add.sprite(232,0,'wolf').setOrigin(0)
        let gordonGekko = this.add.sprite(0,232,'gekko').setOrigin(0)
        
        let bgTrack = this.sound.add('introMusic', 0.5)
        let textTickSound = this.sound.add('textInput',1)
        let menuAccept = this.sound.add('selectOk',1)
        let inputChars = 0
        bgTrack.play();
        bgTrack.loop = true
        bgTrack.play()
        gordonGekko.setScale(0.5)
        wolfOfWallStreet.setScale(0.5)
        bgCity.setScale(0.5)
        this.tweens.add({
            targets:gordonGekko,
            x:232,
            duration:100000,
            ease:'Back',
            easeParams:[2],
            delay:1000,
            repeat:-1
        })
        this.tweens.add({
            targets:wolfOfWallStreet,
            x:0,
            duration:100000,
            ease:'Back',
            easeParams:[2],
            delay:3000,
            repeat:-1
        })
        this.tweens.add({
            targets:bgCity,
            y:232,
            duration:100000,
            ease:'Back',
            easeParams:[2],
            delay:2000,
            repeat:-1
        })
        this.backRect = this.add.rectangle(232,232,230,500,0xA5A5A5).setOrigin(0.5)
        this.backRect.alpha = 0.6
        this.backRect.setStrokeStyle(2,0x006722)
        this.add.text(200, 390,'Name : ',{ font: '32px Courier', fill: '#0f0' }).setOrigin(0.5)
        this.startBox = this.add.rectangle(232,308,220,70,0xBEBEBE).setOrigin(0.5)
        this.startBox.setStrokeStyle(2, 0x006722)
        this.textBox = this.add.rectangle(300, 392,90,20).setOrigin(0.5)
        this.textBox.setStrokeStyle(1, 0x006722)
        this.startBox.alpha=0.5
        var textEntry =  this.add.text(300, 392,'',{ fontFamily: 'Courier', fill: '#00ff08',fontSize:24 }).setOrigin(0.5)
        textEntry.alpha = 0.5
        this.startText = this.add.text(232,308,'START', {fill:'#0f0', fontFamily:'Courier' ,fontSize:72})
        .setOrigin(0.5)
        .setInteractive({useHandCursor : true})
        .on('pointerover', (pointer) => {
            this.startBox.fillColor = 0x000000
            console.log('over')
        })
        .on('pointerout', (pointer)=>{
            this.startBox.fillColor = 0xA5A5A5
        })
        .on('pointerup', () => {
            if (textEntry._text ==''){
                this.scene.launch('SuperTrader', {money:this.money, userName:'SuperTrader'})
                bgTrack.stop()
                this.scene.stop();
            } else {
                this.scene.launch('SuperTrader', {money:this.money, userName:textEntry._text})
                bgTrack.stop()
                this.scene.stop();
            }
            menuAccept.play()

        })
        this.input.keyboard.on('keydown', function (event) {
            // console.log(textEntry._text)
            if (textEntry.text.length < 3){
                if (event.keyCode === 8 && textEntry.text.length > 0)
                {
                    textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
                    textTickSound.play()
                }
                else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
                {
                    textEntry.text += event.key;
                    textTickSound.play()
                }
            } else if(textEntry.text.length >= 3){
                if (event.keyCode === 8 && textEntry.text.length > 0)
                {
                    textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
                    textTickSound.play()
                }
            }
        });
    }
}

