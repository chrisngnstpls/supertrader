import Phaser from 'phaser'
import eventsCenter from './EventsCenter';
export default class PowerUps extends Phaser.Scene
{
	constructor(handle, parent)
	{
		super(handle);
    this.parent = parent;

	}

  init(data){
    this.initUser = data
    console.log('data : ', data)
  }
  preload(){
    // already in preloader.js

  }
  powerUpConstruct(image,text,priceModifier,speedModifier,moneyMod, inflationMod, info){
    this.image = image
    this.text = text
    this.priceModifier = priceModifier
    this.speedModifier = speedModifier 
    this.moneyModifier = moneyMod
    this.inflationModifier = inflationMod
    this.info = info
  }

  
  create() {
    const selectOkSound = this.sound.add('selectOk', 1)
    let currUser = {}
    let objHandler = {}
    eventsCenter.on('userData', (incoming) => {
      console.log("incoming:", incoming)
      currUser = incoming
    }, this)

    let toolTip =  this.add.rectangle( 0, 0, 75, 25, 0xff0000).setOrigin(0.5);
    let toolTipText = this.add.text( 0, 0, '', { fontFamily: 'Jersey', color: '#fff' }).setOrigin(0.5);
    toolTip.alpha = 0;
    this.input.setPollOnMove();
    this.input.on('gameobjectover', function (pointer, gameObject) {

      if(gameObject.type == 'Image'){
        this.tweens.add({
          targets: [toolTip, toolTipText],
          alpha: {from:0, to:1},
          repeat: 0,
          duration: 500
        });
      }

    }, this);
    this.input.on('gameobjectout', function (pointer, gameObject) {
      toolTip.alpha = 0;
      toolTipText.alpha = 0;
    });
 
    const powerUpText = this.add.text(50,25,'SELECT',{fontFamily:'Jersey', fontSize:18}).setOrigin(0)
    const powerUpWindow = this.add.image(0,0,'powerupWindow').setOrigin(0)
    const allPowerUps = this.createPowerUps()
    
    const powerUp1 = this.add.image(25,50,'powerup1').setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      selectOkSound.play()
      eventsCenter.emit('powerUpActivated', allPowerUps[0])
      this.time.delayedCall(500, () => {
        this.scene.remove()
        // this.cameras.main.fadeOut(500,0,0,0)
      })
    })
    .on('pointermove', (pointer)=>{
      toolTip.x = pointer.x;
      toolTip.y = pointer.y;
      toolTipText.x = pointer.x
      toolTipText.y = pointer.y
      toolTipText.setText(allPowerUps[0].text)
    })
    
    
    const powerUp2 = this.add.image(45,50,'powerup2').setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      selectOkSound.play()
      eventsCenter.emit('powerUpActivated', allPowerUps[1])
      this.time.delayedCall(500, () => {
        this.scene.remove()
      })
    })
    .on('pointermove', (pointer)=>{
      toolTip.x = pointer.x;
      toolTip.y = pointer.y;
      toolTipText.x = pointer.x 
      toolTipText.y = pointer.y
      toolTipText.setText(allPowerUps[1].text)
    })
    
    
    const powerUp3 = this.add.image(65,50,'powerup3').setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      selectOkSound.play()
      eventsCenter.emit('powerUpActivated', allPowerUps[2])
      this.time.delayedCall(500, () => {
        this.scene.remove()
      })
    })
    .on('pointermove', (pointer)=>{
      toolTip.x = pointer.x;
      toolTip.y = pointer.y;
      toolTipText.x = pointer.x
      toolTipText.y = pointer.y
      toolTipText.setText(allPowerUps[2].text)
    })
    
    
    const powerUp4 = this.add.image(85,50,'powerup4').setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      selectOkSound.play()
      eventsCenter.emit('powerUpActivated', allPowerUps[3])
      this.time.delayedCall(500, () => {
        this.scene.remove()
        // this.cameras.main.fadeOut(500,0,0,0)
      })
    })
    .on('pointermove', (pointer)=>{
      toolTip.x = pointer.x;
      toolTip.y = pointer.y;
      toolTipText.x = pointer.x
      toolTipText.y = pointer.y
      toolTipText.setText(allPowerUps[3].text)
    })
    
    
    const powerUp5 = this.add.image(105,50,'powerup5').setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      selectOkSound.play()
      eventsCenter.emit('powerUpActivated', allPowerUps[4])
      this.time.delayedCall(500, () => {
        this.scene.remove()
        // this.cameras.main.fadeOut(500,0,0,0)
      })
    })
    .on('pointermove', (pointer)=>{
      toolTip.x = pointer.x;
      toolTip.y = pointer.y;
      toolTipText.x = pointer.x
      toolTipText.y = pointer.y
      toolTipText.setText(allPowerUps[4].text)
    })
    
    
    const powerUp6 = this.add.image(45,75,'powerup6').setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => {
      selectOkSound.play()
      eventsCenter.emit('powerUpActivated', allPowerUps[5])
      this.time.delayedCall(500, () => {
        this.scene.remove()
        // this.cameras.main.fadeOut(500,0,0,0)
      })
    })
    .on('pointermove', (pointer)=>{
      toolTip.x = pointer.x;
      toolTip.y = pointer.y;
      toolTipText.x = pointer.x
      toolTipText.y = pointer.y
      toolTipText.setText(allPowerUps[5].text)
    })
    
    
    
    const windowContainer = this.add.container(50,50,[powerUpWindow, powerUpText,powerUp1, powerUp2, powerUp3,powerUp4,powerUp5,powerUp6,toolTip,toolTipText])
    windowContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 150, 150), Phaser.Geom.Rectangle.Contains);
    this.input.setDraggable(windowContainer);

    windowContainer.on('drag', function (pointer, dragX, dragY) {

      this.x = dragX;
      this.y = dragY;

    });


    //this.userText = this.add.text(250, 15, `User : ${this.user.userName}`,{ fill: '#0f0' });

  }
  createPowerUps(){
    let allPowerUps = []
    let powerUpsList = ['powerup1', 'powerup2','powerup3','powerup4','powerup5','powerup6']
    let powerUpsText = ['Long Gold', 'Cocaine','Insider Trading', 'FOMO','Algo Trading','Airdrop']
    let priceModifiers = [2, 3, 2, 5, 3, 5]
    let speedModifiers = [1.2, 1.5, 1.5, 1.05, 2, 1.3]
    let moneyModifiers = [3.3 ,1.5, 1.4, 1.1, 2, 1.2]
    let inflationModifiers = [1, 1.5, 2, 1.67, 3, 2.1]
    let info = ['When in doubt...','Call the connect','So I have a friend...','Make it all back','Beep Bop','Magic Internet Money', 'Raining money bruh']

    for (let i in powerUpsList) {
      let localPowerUp = new this.powerUpConstruct
      (
        powerUpsList[i], 
        powerUpsText[i], 
        priceModifiers[i],
        speedModifiers[i],
        moneyModifiers[i], 
        inflationModifiers[i], 
        info[i]
      )
      allPowerUps.push(localPowerUp)
    }
    return allPowerUps
  }

  update(){}


}
