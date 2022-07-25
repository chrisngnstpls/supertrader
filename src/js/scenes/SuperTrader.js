import Phaser from 'phaser'
import PowerUps from './PowerUp'
import eventsCenter from './EventsCenter'
import BlackSwans from './BlackSwan'
export default class SuperTraderScene extends Phaser.Scene
{
	constructor()
	{
		super('SuperTrader')
    this.count = 0
    this.trend = 'sideways'
	}
  init(data){
    this.user = {
      userName : data.userName,
      // initMoney : data.money,
      initMoney : 1000,
      initAssets : 0,
      totalTrades : 0,

    }
    this.timer = 0
    this.initInflation = (Math.random() * (5 - 0.5)+0.5).toFixed(2)
    this.initInflationRatio = (Math.random() * (10 - 1)+1).toFixed(2)
    this.initPrice = (Math.random() * (1000 - 0.1)+0.1).toFixed(2)
    this.tradeModel = {
      id:0,
      side:'',
      active:false,
      info:''
    }
  }
  
  allTrades = [];
  
  activeUser = {
    userName : '',
    money : 0,
    assets : 0,
    totalTrades : 0,
    powerUpsActive : 'none',
    blackSwansActive:'none',
    timeAlive:0
  };
  // global Timers 
  timer = 0;

 globalTimers = {
    timer:0,
    powerUpTimer : 0,
    powerDownTimer : 0,
    powerUpThreshold : 0,
    powerDownThreshold : 0,
  }

  
  globalSettings = {
    priceModifier : 1,
    timeModifier : 1,
    powerUpsUsed : [],
    blackSwansUsed:[],
    inflation : 0,
    inflationPercent: 1  
  }
  
  trade = {
    id:0,
    side:'',
    active:'',
    amount:0,
    priceIn:0.0,
    priceOut:0.0,
    profit:0.0,
    info:''
  };
  
  globalPrice = 0.0;
  maxGlobalPrice = 0.0;
  minGlobalPrice = 0.0;
	

  priceRandomMaker(price, ratio){
    let keepPrice = Number(price)
    let percentage = keepPrice*(ratio/100)
    let maxPrice = keepPrice + Number(percentage)
    let minPrice = keepPrice - percentage
    this.maxGlobalPrice = maxPrice
    this.minGlobalPrice = minPrice

  }
  
  priceMaker(_price, ratio,season){
    const percentage = _price *(ratio / 100)
    if (season == 'bull'){
      
      this.minGlobalPrice = this.maxGlobalPrice
      this.maxGlobalPrice = this.maxGlobalPrice + percentage
      // console.log('initiate bull season : ', this.maxGlobalPrice, this.minGlobalPrice)
    } else if ( season == 'bear'){
      this.maxGlobalPrice = this.minGlobalPrice
      this.minGlobalPrice = this.minGlobalPrice - percentage
      //console.log('initiate bear season : ', this.maxGlobalPrice, this.minGlobalPrice)
    } else if ( season == 'crab'){
      //console.log('price in pricemaker:', _price)
      this.minGlobalPrice = this.globalPrice - percentage 
      this.maxGlobalPrice = this.maxGlobalPrice + percentage
      //console.log('initiate crab season : ', this.maxGlobalPrice, this.minGlobalPrice)
    } else {
      console.log('went wrong with seasons')
    }
    this.globalPrice =(Math.random()*(this.maxGlobalPrice - this.minGlobalPrice)) + this.minGlobalPrice
    this.globalPrice = this.globalPrice.toFixed(2)

  }

  preload(){
    // already in preloader.ts

  }
  
  create() {
    //import audio effects
    this.gameOverMusic = this.sound.add('gameOverMusic')
    this.powerUpPopUpSound = this.sound.add('chaChing', 1)
    this.powerDownPopUpSound = this.sound.add('beepOnce', 1)
    this.ambience = this.sound.add('ambience', 0.5)
    this.priceTick = this.sound.add('tick',1)
    this.buySound = this.sound.add('notification', 1)
    this.sellSound = this.sound.add('money',1)
    this.errorSound = this.sound.add('error',1)
    this.ambience.play()
    this.ambience.loop = true
    
    //create listeners for events
    
    eventsCenter.on('powerUpActivated', (incoming) => {
      //.log(`PowerUp : ${Object.keys(incoming)}`)
      this.globalSettings.priceModifier = incoming.priceModifier
      this.globalSettings.timeModifier = incoming.speedModifier
      this.activeUser.money = this.activeUser.money + ((this.activeUser.money / 100) * incoming.moneyModifier)
      this.globalSettings.powerUpsUsed.push(incoming)
      this.activeUser.powerUpsActive = this.globalSettings.powerUpsUsed[(this.globalSettings.powerUpsUsed.length)-1]
      this.globalSettings.inflation = this.globalSettings.inflation - incoming.inflationModifier
      let randomPercent = Math.floor(Math.random()*(10-1)+1)
      this.priceMaker(this.maxGlobalPrice,randomPercent,'bull')
      //console.log('bull random percent : ', randomPercent)
      this.updateMoney(this.activeUser.money)
      this.updateAssets(this.activeUser.assets)
      this.updatePrice(this.globalPrice);
      this.scene.resume();
      //console.log('user active powerups : ', this.activeUser.powerUpsActive)
    }, this)
    
    eventsCenter.on('blackSwanActivated', (incoming) => {
      //console.log(`PowerUp : ${Object.keys(incoming)}`)
      //console.log(`blackSwanEvent: ${incoming.priceModifier}, ${incoming.speedModifier}`)
      this.globalSettings.priceModifier = incoming.priceModifier
      this.globalSettings.timeModifier = incoming.speedModifier
      this.globalSettings.blackSwansUsed.push(incoming)
      this.activeUser.blackSwansActive = this.globalSettings.blackSwansUsed[(this.globalSettings.blackSwansUsed.length)-1]
      this.activeUser.money = this.activeUser.money - ((this.activeUser.money / 100) * incoming.moneyModifier)
      console.log(incoming.inflationModifier)
      this.globalSettings.inflation = this.globalSettings.inflation + incoming.inflationModifier
      let randomPercent = Math.floor(Math.random()*(10-1)+1)
      this.priceMaker(this.minGlobalPrice,randomPercent,'bear')
      //console.log('bull random percent : ', randomPercent)
      this.updateMoney(this.activeUser.money)
      this.updateAssets(this.activeUser.assets)
      this.updatePrice(this.globalPrice);
      this.scene.resume();
      //console.log('user active blackSwans : ', this.activeUser.blackSwansActive)
    }, this)
    // animation configurators
    //
    var animConfigDown = {
      key:'downAnimation',
      frames: this.anims.generateFrameNumbers('downOnly', {start:0, end:36, first:36}),
      frameRate:24,
      repeat : -1
      
    }
    var animConfigUp = {
      key:'upAnimation',
      frames: this.anims.generateFrameNumbers('upOnly', {start:0, end:36, first:36}),
      frameRate:24,
      repeat : -1,
    }
    var animConfigSide = {
      key:'sideAnimation',
      frames: this.anims.generateFrameNumbers('sideOnly', {start:0, end:36, first:36}),
      frameRate:24,
      repeat : -1,
    }
    // initialize global Timers
    this.globalTimersSet('all')

    this.activeUser.userName = this.user.userName;
    this.globalPrice = this.initPrice;
    // this.maxGlobalPrice = this.price*2
    // this.minGlobalPrice = this.price/2
    this.priceRandomMaker(this.initPrice, 1.5)
    
    console.log(`starting with price : ${this.globalPrice}`);
    this.activeUser.money = this.user.initMoney;
    this.activeUser.totalTrades = this.user.totalTrades;
    this.activeUser.assets = this.user.initAssets;
    this.globalSettings.inflation = Number(this.initInflation);
    this.globalSettings.inflationPercent = Number(this.initInflationRatio);
    console.log('inside create, setting inflation', this.initInflation, this.initInflationRatio)
    //console.log(this.activeUser)
    
    // create scene animations
    this.anims.create(animConfigDown);
    this.anims.create(animConfigSide);
    this.anims.create(animConfigUp);
    //Load images maps and tiles

    const map = this.make.tilemap({key:'superTraderDesktop'})
    const tileset = map.addTilesetImage('tileset_sf','tiles2')
    const background = map.createLayer('backNew', tileset)
    const foreground = map.createLayer('frontNew', tileset)





    
    // Create text graphics top notch yes fuck unity
    this.userText = this.add.text(250, 15, `User : ${this.user.userName}`,{ fill: '#0f0' });
    this.userMoneyText = this.add.text(260, 150, '',{ fill: '#0f0' });
    this.tradeText = this.add.text(260, 280, '',{ fill: '#0f0' });
    this.priceText = this.add.text(250, 60, '', {fill : '#0f0', fontSize:20});
    this.assetsText = this.add.text(260, 220, '', {fill:'#f00'});
    this.entryPriceText = this.add.text(260, 240, '', {fill:'#f00'});
    this.tradeSideText = this.add.text(260, 410, '', {fill:'#f00', fontSize:12});
    this.entryPriceText = this.add.text(260, 340, '', {fill:'#0f0', fontSize:15});
    
    

    // this.events.on('longed', this.downAnimationPlay, this);
    // this.events.on('shorted', this.upAnimationPlay, this);
    // this.events.on('sidelined', this.sideAnimationPlay, this);
    this.events.on('longed', () => {
      this.downAnimationPlay()
      this.priceMaker(this.globalPrice, 5, 'bear')
      //console.log('firing event bear season from event listener')
    }, this)

    this.events.on('shorted', ()=> {
      this.upAnimationPlay()
      this.priceMaker(this.globalPrice, 5, 'bull')
      //console.log('firing event bull season from event listener')
    }, this)

    this.events.on('sidelined', ()=>{
      this.sideAnimationPlay()
      //this.priceMaker(this.globalPrice, 5, 'crab')
    },this)
    
    // create buy button and logic
    this.buyButton = this.add.text(55, 395, 'BUY', { fill: '#0f0', fontSize:20 })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        
        const bata = {
          id:this.trade.id + 1,
          _side:'long',
          info : 'user bought',
          price : this.globalPrice,
          amount : this.activeUser.money/this.globalPrice
        };
        //console.log('this data: ',bata);
        //this.priceRandomMaker(this.minGlobalPrice,20);
        //this.priceMaker(this.globalPrice, 20, 'bear')
        // this.createWindow(BlackSwans)
        // eventsCenter.emit('blackSwanIncoming', this.activeUser)
        this.updateTrades(bata);
    });
    
    //crete sell button and logic
    this.sellButton = this.add.text(145, 395, 'SELL', { fill: '#f00', fontSize:20 })
    .setInteractive({ useHandCursor : true })
    .on('pointerup', () => {
      
      const _bata = {
        id : this.trade.id + 1,
        info : 'user sold',
        _side : 'short',
        price : this.globalPrice,
        amount : this.activeUser.assets
      };
      //this.priceMaker(this.globalPrice, 20, 'bull')
      //console.log('sideeee : ', _bata._side);
      //console.log('inside button', _bata);
      //this.priceRandomMaker(this.maxGlobalPrice, 20);
      // this.createWindow(PowerUps)
      // eventsCenter.emit('userData', this.activeUser)

      this.updateTrades(_bata);
    });
    
  
  //run once to generate init texts
    this.add.sprite(113,165,'sideOnly').play('sideAnimation')
    this.updateTradeText();
    this.updateMoney(this.user.initMoney);
    this.updatePrice(this.initPrice);
    this.updateAssets(this.user.initAssets);
    this.updateTradeSideText();
    this.updateEntryPriceText();
    // eventsCenter.emit('userData', this.activeUser)
    // eventsCenter.emit('blackSwanIncoming', this.activeUser)
    
  }
  
  
  update(time, delta){
    //maybe logic
    
    this.isGameOver(this.activeUser.money, this.activeUser.assets)
    this.activeUser.timeAlive = time
    if ((this.minGlobalPrice || this.globalPrice) <= 0.001) {
      this.priceMaker(this.globalPrice, 20, 'bull')
    }
    
    this.globalTimers.timer += delta;
    this.globalTimers.powerUpTimer += delta;
    this.globalTimers.powerDownTimer += delta;
    
    if (this.globalTimers.powerUpTimer >= (this.globalTimers.powerUpThreshold * 1000)){
          
          this.createWindow(PowerUps)
          eventsCenter.emit('userData', this.activeUser)
          // console.log('adfsasdasd', this.activeUser)
          this.globalTimers.powerUpTimer = 0
          this.globalTimersSet('powerUp')
          this.powerUpPopUpSound.play()
    }
    
    if (this.globalTimers.powerDownTimer >= (this.globalTimers.powerDownThreshold * 1000)){
      this.createWindow(BlackSwans)
      eventsCenter.emit('blackSwanIncoming', this.activeUser)
      this.globalTimers.powerDownTimer = 0
      this.globalTimersSet('powerDown')
      this.powerDownPopUpSound.play()
}
    
    const moddedTimer = (1000 * this.globalSettings.timeModifier)
    while(this.globalTimers.timer > moddedTimer){
      
      //this.globalPrice = ((Math.random() * (this.maxGlobalPrice - this.minGlobalPrice)) + this.minGlobalPrice).toFixed(2);
      this.globalPrice =(Math.random()*(this.maxGlobalPrice - this.minGlobalPrice)) + this.minGlobalPrice
      this.globalPrice = this.globalPrice.toFixed(2)
      let localRatio = (this.globalSettings.inflation / 100 ) * this.globalSettings.inflationPercent
      this.globalSettings.inflation = Math.abs(this.globalSettings.inflation + localRatio)
      console.log('inflation:',this.globalSettings.inflation)
      this.activeUser.money = this.calculateMoney(this.activeUser.money, this.globalSettings.inflation)
      this.updateMoney()
      this.updatePrice(this.globalPrice);
      this.globalTimers.timer -= moddedTimer

    };
  }
  
  globalTimersSet (whatTimer){
    if (whatTimer == 'powerUp'){
      const powerUpRandomTimer = Math.floor(Math.random() * 60 - 10 + 1) + 10
      this.globalTimers.powerUpThreshold = powerUpRandomTimer
    } else if (whatTimer == 'powerDown'){
      const powerDownRandomTimer = Math.floor(Math.random() * 60 - 10 + 1) + 10
      this.globalTimers.powerDownThreshold = powerDownRandomTimer
    } else if (whatTimer == 'all'){     
      const powerUpRandomTimer = Math.floor(Math.random() * 60 - 10 + 1) + 10
      const powerDownRandomTimer = Math.floor(Math.random() * 60 - 10 + 1) + 10
      this.globalTimers.powerUpThreshold = powerUpRandomTimer
      this.globalTimers.powerDownThreshold = powerDownRandomTimer

    } else {
      console.log('err')
    }
    if(this.globalTimers.powerUpThreshold == this.globalTimers.powerDownThreshold){
      this.globalTimers.powerUpThreshold + 1
      console.log(`timers were equal, resetting @ : ${this.globalTimers.powerUpThreshold}, ${this.globalTimers.powerDownThreshold}`)
    }
    console.log(`timers set @ : ${this.globalTimers.powerUpThreshold}, ${this.globalTimers.powerDownThreshold}`)
  }
  updateTrades(data){

    let currActive =this.trade.active
    //console.log('inside func : ', data);
    
    if(!currActive) { 

      if ((data._side == 'long') && (this.activeUser.money > 0) ){
      
        this.trade.id = data.id
        this.trade.side = data._side
        this.trade.info = data.info
        this.trade.active = true
        this.trade.priceIn = data.price
        this.trade.amount = this.activeUser.money / data.price
        this.activeUser.assets = this.trade.amount
        this.activeUser.money = 0
        this.events.emit('longed')
        this.buySound.play()
        this.updateMoney(this.activeUser.money)
        this.updateAssets(this.activeUser.assets)
        console.log('user initiated long trade : ', this.activeUser)
      
      } else if ( (data._side = 'short') && (this.activeUser.assets > 0)){
        //console.log('in else if : ', data)
        this.sellSound.play()
        this.trade.id = data.id
        this.trade.side = data._side
        this.trade.info = data.info
        this.trade.active = true
        this.trade.priceIn = data.price
        this.activeUser.money = this.activeUser.money + (this.activeUser.assets * data.price)
        this.activeUser.assets = 0
        this.events.emit('shorted')
        this.updateMoney(this.activeUser.money)
        this.updateAssets(this.activeUser.assets)
        console.log('user initiated short trade : ', this.activeUser)
      
      } else {
        
        console.log('User has no money or no assets!')
        this.errorSound.play()
        
      
      }
      

    } else if (currActive){
      if ((this.trade.side == 'long') && (data._side == 'short')){
        //close the long and sideline
        this.sellSound.play()
        this.trade.side = 'sideline'
        this.trade.info = data.info
        this.trade.active = false
        this.trade.priceOut = data.price
        
        this.activeUser.money = this.activeUser.assets * data.price // or this.globalPrice ??
        this.activeUser.assets = 0
        this.allTrades.push(this.trade)
        this.activeUser.totalTrades = this.allTrades.length
        this.events.emit('sidelined')
        console.log('user sells', this.activeUser)
        

      } else if((this.trade.side == 'short') && (data._side == 'long')){
        //close short and sideline
        this.buySound.play()
        
        this.trade.side = 'sideline'
        this.trade.info = data.info
        this.trade.active = false
        this.trade.priceOut = data.price
        this.activeUser.assets = this.activeUser.money / data.price
        this.activeUser.money = this.trade.amount / data.price
        this.allTrades.push(this.trade)
        this.events.emit('sidelined')
        

      } else {
        console.log('can not close trade')
        console.log('data :', data)
        console.log('this.trade : ', this.trade)
        console.log('this.active user : ', this.activeUser)
      }
    }
    // console.log(this.trade)
    this.updateTradeText()
    this.updateAssets()
    this.updateMoney()
    this.updateTradeSideText()
    this.updateEntryPriceText()
  }

  updateTradeText() {
    this.tradeText.setText(`Total Trades :  ${this.allTrades.length}`);
  }
  updateMoney(){
    this.userMoneyText.setText(`Money : ${this.activeUser.money.toFixed(2)}`)
  }
  updateAssets(){
    this.assetsText.setText(`Assets : ${this.activeUser.assets.toFixed(2)}`)
  }
  updatePrice(priceNew){
    this.priceText.setText(`Price : ${priceNew}`)
    this.priceTick.play()
  }
  updateTradeSideText(){
    this.tradeSideText.setText(`Trade Side: ${this.trade.side}`)
  }
  updateEntryPriceText(){
    if((this.trade.priceIn > 0) && (this.trade.active != false)){ 
      this.entryPriceText.setText(`Entry Price : ${this.trade.priceIn}`)
  
    } else if (this.trade.active == false) {
      this.entryPriceText.setText(`Entry Price : N/A`)
    } else {
      this.entryPriceText.setText('Entry Price : N/A')
    }
  }
  downAnimationPlay(){
    this.add.sprite(113,165, 'downOnly').play('downAnimation')
  }
  upAnimationPlay(){
    this.add.sprite(113,165, 'upOnly').play('upAnimation')
  }
  sideAnimationPlay(){
    this.add.sprite(113,165, 'sideOnly').play('sideAnimation')
  }
  blackSwanEngage(){
    this.createWindow(BlackSwans)
  }
  calculateMoney(income, infl){
    let _localMoney = Number(income)
    let _localInflation = Number(infl)
    let _localPercentage = (_localMoney / 100) * _localInflation
    let _finalMoney = _localMoney - _localPercentage
    return Number(_finalMoney)
  }
  createWindow(func){
    var x = Phaser.Math.Between(400,600)
    var y = Phaser.Math.Between(64,128)
    
    var handle = 'window' + this.count++
    var win = this.add.zone(x,y,func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0)
    var demo = new func(handle,win)
    this.input.setDraggable(win)

    win.on('drag', function(pointer, dragX, dragY){
      this.x = dragX
      this.y = dragY
      demo.refresh()
    });

    this.scene.add(handle,demo,true)
    this.scene.pause()
    

  }
  isGameOver(moneyData, assetData){
    let _localMoney = Number(moneyData)
    let _localAssets = Number(assetData)
    if ((_localMoney < 0.01) && (_localAssets < 0.01)){
      this.scene.stop()
      console.log('game over')
      this.ambience.stop()
      this.gameOverMusic.play()
      this.scene.launch('GameOver', {
        userDetails:this.activeUser, 
        tradeDetails:this.allTrades, 
        timeAlive:this.activeUser.timeAlive,
        inflation:this.globalSettings.inflation
      })
    } else if ((_localMoney >= 0.1) || (_localAssets >= 0.1)){
      // console.log('game on')
    }
  }
}
