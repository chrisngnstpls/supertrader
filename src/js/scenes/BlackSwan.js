import Phaser from 'phaser'
import eventsCenter from './EventsCenter';
export default class BlackSwansie extends Phaser.Scene
{
    constructor(handle, parent)
	{
		super(handle);
        this.parent = parent;
	}
  init(data){
    //console.log(data)
  }
  preload(){
    // already in preloader.js

  }
  allSwans = []
  
  blackSwan(image,text,priceModifier,speedModifier,moneyMod, inflationMod, info){
      this.image = image
      this.text = text
      this.priceModifier = priceModifier
      this.speedModifier = speedModifier
      this.moneyModifier = moneyMod
      this.inflationModifier = inflationMod
      this.info = info
  }

  create() {
    let objHandler = {}
    let selectOkSound = this.sound.add('selectOk', 1)
    const blackSwanWindow = this.add.image(0,0,'blackSwanWindow').setOrigin(0)
    const randomSwan = this.createBlackSwans()
    const blackSwan = this.add.image(65,60,`${randomSwan.image}`).setOrigin(0)
    .setInteractive({useHandCursor : true})
    .on('pointerup', () => {
        selectOkSound.play()
        eventsCenter.emit('blackSwanActivated', randomSwan)
        this.time.delayedCall(500, ()=>{
            this.scene.remove()
        })
    })
    const blackSwanText = this.add.text(25, 30, `${randomSwan.text}`,{fill: '#f00', fontSize:16, align:'center', fontFamily:'Jersey'}).setOrigin(0.5);
    const windowContainer = this.add.container(50,50,[blackSwanWindow, blackSwan,blackSwanText])
    blackSwanText.setX(75)
    blackSwanText.setY(37)
    windowContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 150, 150), Phaser.Geom.Rectangle.Contains)
    this.input.setDraggable(windowContainer);

    windowContainer.on('drag', function (pointer, dragX, dragY) {

      this.x = dragX;
      this.y = dragY;

    });


  }
  createBlackSwans(){
    let blackSwanList = ['blackSwan1', 'blackSwan2','blackSwan3', 'blackSwan4','blackSwan5', 'blackSwan6','blackSwan7', 'blackSwan8','blackSwan9']
    let blackSwanText = ['Terrorist\nAttack', 'Rona \noutbreak','Audit','Bad\nNews', 'Bear\nMarket', 'CEO\nSucide','Trade\nFade','Natural \nDisaster','War']
    let priceModifier = [2, 1.5,3,4,2,4,6,1.5,2]
    let speedModifier = [0.5, 0.5,0.3,0.6,0.3,0.5,0.2,0.5,0.2]
    let moneyModifiers = [2, 1.4, 2.5, 1.7, 50, 2, 3, 1, 23]
    let inflationModifiers = [0.5, 0.63, 0.9, 0.55, 1.1, 1.6, 2, 1, 0.2]
    let info = ['Terror ensues', 'The china Flu', 'Get your books ready', 'Sell the news', 'Down only', 'He will be missed', 'New blood fades you', 'Quakes and volcanoes', 'Wen button?']
    
    for (let i in blackSwanList){
        let localSwan = new this.blackSwan(blackSwanList[i], blackSwanText[i],priceModifier[i],speedModifier[i],moneyModifiers[i], inflationModifiers[i], info[i])
        //console.log(localSwan)
        this.allSwans.push(localSwan)
    }
    const randomSwan = this.allSwans[Math.floor(Math.random()*this.allSwans.length)];
    return randomSwan
  }
  update(){}


}
