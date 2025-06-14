import Phaser from 'phaser'
import PowerUps from './PowerUp'
import eventsCenter from './EventsCenter'
import BlackSwans from './BlackSwan'
import { LayoutUtils } from '../utils/LayoutUtils'
export default class SuperTraderScene extends Phaser.Scene
{
  constructor()
  {
    super('SuperTrader')
    this.count = 0
    this.trend = 'sideways'
  }
  
  resetGameState() {
    // Reset all game state variables
    this.timer = 0;
    this.allTrades = [];
    this.activeUser = {
      userName: '',
      money: 0,
      assets: 0,
      totalTrades: 0,
      powerUpsActive: 'none',
      blackSwansActive: 'none',
      timeAlive: 0,
      mentalHealth: 100
    };
    this.globalTimers = {
      timer: 0,
      powerUpTimer: 0,
      powerDownTimer: 0,
      powerUpThreshold: 0,
      powerDownThreshold: 0,
      powerUpCooldown: 0,
      powerUpCooldownThreshold: 0
    };
    this.globalSettings = {
      priceModifier: 1,
      timeModifier: 1,
      powerUpsUsed: [],
      blackSwansUsed: [],
      inflation: 0,
      inflationPercent: 1
    };
    this.trade = {
      id: 0,
      side: '',
      active: '',
      amount: 0,
      priceIn: 0.0,
      priceOut: 0.0,
      profit: 0.0,
      info: ''
    };
    this.globalPrice = 0.0;
    this.maxGlobalPrice = 0.0;
    this.minGlobalPrice = 0.0;
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
    timeAlive:0,
    mentalHealth: 100
  };
  // global Timers 
  timer = 0;

 globalTimers = {
    timer:0,
    powerUpTimer : 0,
    powerDownTimer : 0,
    powerUpThreshold : 0,
    powerDownThreshold : 0,
    powerUpCooldown : 0,
    powerUpCooldownThreshold : 0
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
    // Reset game state before starting
    this.resetGameState();
    
    //import audio effects
    this.gameOverMusic = this.sound.add('gameOverMusic')
    this.powerUpPopUpSound = this.sound.add('chaChing', 1)
    this.powerDownPopUpSound = this.sound.add('beepOnce', 1)
    // Try to add ambience audio with error handling
    try {
      this.ambience = this.sound.add('ambience', 0.5)
      this.ambience.play()
      this.ambience.loop = true
    } catch (error) {
      console.log('Ambience audio failed to load, continuing without background music')
      this.ambience = null
    }
    this.priceTick = this.sound.add('tick',1)
    this.buySound = this.sound.add('notification', 1)
    this.sellSound = this.sound.add('money',1)
    this.errorSound = this.sound.add('error',1)
    
    //create listeners for events
    
    eventsCenter.on('powerUpActivated', (incoming) => {
      //.log(`PowerUp : ${Object.keys(incoming)}`)
      this.globalSettings.priceModifier = incoming.priceModifier
      this.globalSettings.timeModifier = incoming.speedModifier
      this.activeUser.money = this.activeUser.money + ((this.activeUser.money / 100) * incoming.moneyModifier)
      this.globalSettings.powerUpsUsed.push(incoming)
      this.activeUser.powerUpsActive = this.globalSettings.powerUpsUsed[(this.globalSettings.powerUpsUsed.length)-1]
      this.globalSettings.inflation = this.globalSettings.inflation - incoming.inflationModifier
      
      // Add mental health boost (3-15%)
      const healthBoost = Math.floor(Math.random() * 13) + 3; // Random between 3-15
      this.activeUser.mentalHealth = Math.min(100, this.activeUser.mentalHealth + healthBoost);
      console.log(`Mental health boosted by ${healthBoost}%`);
      
      // Set power-up cooldown (5-10 seconds)
      const cooldownTime = Math.floor(Math.random() * (8 - 5 + 1)) + 5
      this.globalTimers.powerUpCooldownThreshold = cooldownTime
      this.globalTimers.powerUpCooldown = 0
      console.log(`Power-up cooldown set to ${cooldownTime} seconds`)
      
      // Temporary liquidity trap (not a real bull market)
      let randomPercent = Math.floor(Math.random()*(5-2)+2) // Reduced from 10-1 to 5-2 for smaller traps
      this.priceMaker(this.maxGlobalPrice,randomPercent,'bull')
      //console.log('liquidity trap percent : ', randomPercent)
      this.updateMoney(this.activeUser.money)
      this.updateAssets(this.activeUser.assets)
      this.updatePrice(this.globalPrice);
      this.updateMentalHealth(); // Update the health bar
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
      let randomPercent = Math.floor(Math.random()*(15-10)+10) // Increased from 10-1 to 15-10 for more punishing
      this.priceMaker(this.minGlobalPrice,randomPercent,'bear')
      //console.log('bear market percent : ', randomPercent)
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
    this.activeUser.mentalHealth = 100; // Reset mental health to 100% for new game
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

    // Initialize layout utility
    this.layout = new LayoutUtils(this);
    const positions = this.layout.getLayoutPositions();
    const fontSizes = this.layout.getFontSizes();
    const colors = this.layout.getColors();

    // Create text graphics with responsive positioning
    this.userText = this.add.text(positions.userInfo.x, positions.userInfo.y-2, `User : ${this.user.userName}`, { 
      fontFamily:'Jersey',
      fontSize: 22,
      fill: colors.positive,  
    });
    
    this.priceText = this.add.text(positions.price.x, positions.price.y, '', {
      fill: colors.positive, 
      fontSize: 20,
      fontFamily: 'Jersey'
    });
    
    this.userMoneyText = this.add.text(positions.money.x, positions.money.y, '', { 
      fill: colors.positive, 
      fontSize: 18,
      fontFamily: 'Jersey'
    });
    
    this.assetsText = this.add.text(positions.assets.x, positions.assets.y, '', {
      fill: colors.negative, 
      fontSize: 18,
      fontFamily: 'Jersey'
    });
    
    this.tradeText = this.add.text(positions.trades.x, positions.trades.y, '', { 
      fill: colors.positive, 
      fontSize: 18,
      fontFamily: 'Jersey' 
    });
    
    this.entryPriceText = this.add.text(positions.entryPrice.x, positions.entryPrice.y, '', {
      fill: colors.positive, 
      fontSize: 18,
      fontFamily: 'Jersey'
    });
    
    this.tradeSideText = this.add.text(positions.tradeSide.x, positions.tradeSide.y, '', {
      fill: colors.negative, 
      fontSize: 18,
      fontFamily: 'Jersey'
    });
    
    // Create mental health bar under buy/sell buttons
    const healthBarY = 420;
    const healthBarX = 12;
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    
    // Background bar (gray)
    this.healthBarBg = this.add.graphics();
    this.healthBarBg.fillStyle(0x333333);
    this.healthBarBg.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // Health bar (colored)
    this.healthBar = this.add.graphics();
    
    // Health percentage text
    this.healthBarText = this.add.text(
      healthBarX + healthBarWidth / 2, 
      healthBarY + healthBarHeight / 2, 
      '100%', 
      {
        fill: '#000000',
        fontSize: fontSizes.small+5,
        align: 'center',
        fontFamily: 'Jersey'
      }
    ).setOrigin(0.5, 0.5);
    
    

    // this.events.on('longed', this.downAnimationPlay, this);
    // this.events.on('shorted', this.upAnimationPlay, this);
    // this.events.on('sidelined', this.sideAnimationPlay, this);
    this.events.on('longed', () => {
      this.downAnimationPlay()
      this.priceMaker(this.globalPrice, 8, 'bear') // Increased from 5 to 8 for more punishing
      //console.log('firing event bear season from event listener')
    }, this)

    this.events.on('shorted', ()=> {
      this.upAnimationPlay()
      this.priceMaker(this.globalPrice, 3, 'bull') // Reduced from 5 to 3 for smaller liquidity traps
      //console.log('firing event liquidity trap from event listener')
    }, this)

    this.events.on('sidelined', ()=>{
      this.sideAnimationPlay()
      //this.priceMaker(this.globalPrice, 5, 'crab')
    },this)
    
    // create buy button and logic with responsive positioning
    this.buyButton = this.add.text(positions.buyButton.x+2, positions.buyButton.y-5, 'BUY', { 
      fill: colors.positive, 
      fontSize: fontSizes.button+10,
      fontFamily: 'Micro' 
    })
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
    
    //create sell button and logic with responsive positioning
    this.sellButton = this.add.text(positions.sellButton.x+2, positions.sellButton.y-5, 'SELL', { 
      fill: colors.negative, 
      fontSize: fontSizes.button +10,
      fontFamily: 'Micro'
    })
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
    
  
  //run once to generate init texts with responsive character positioning
    this.add.sprite(positions.character.x, positions.character.y,'sideOnly').play('sideAnimation')
    this.updateTradeText();
    this.updateMoney(this.user.initMoney);
    this.updatePrice(this.initPrice);
    this.updateAssets(this.user.initAssets);
    this.updateTradeSideText();
    this.updateEntryPriceText();
    this.updateMentalHealth();
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
    this.globalTimers.powerUpCooldown += delta;
    
    // Power-up event with cooldown check
    if (this.globalTimers.powerUpTimer >= (this.globalTimers.powerUpThreshold * 1000) && 
        this.globalTimers.powerUpCooldown >= (this.globalTimers.powerUpCooldownThreshold * 1000)){
          
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
      // Update mental health based on inflation
      this.activeUser.mentalHealth = this.calculateMentalHealth(this.activeUser.mentalHealth, this.globalSettings.inflation)
      this.updateMoney()
      this.updateMentalHealth()
      this.updatePrice(this.globalPrice);
      this.globalTimers.timer -= moddedTimer

    };
  }
  
  globalTimersSet (whatTimer){
    if (whatTimer == 'powerUp'){
      const powerUpRandomTimer = Math.floor(Math.random() * 60 - 10 + 1) + 10
      this.globalTimers.powerUpThreshold = powerUpRandomTimer
    } else if (whatTimer == 'powerDown'){
      const powerDownRandomTimer = Math.floor(Math.random() * 30 - 5 + 1) + 5 // Reduced from 60-10 to 30-5 for more frequent black swans
      this.globalTimers.powerDownThreshold = powerDownRandomTimer
    } else if (whatTimer == 'all'){     
      const powerUpRandomTimer = Math.floor(Math.random() * 60 - 10 + 1) + 10
      const powerDownRandomTimer = Math.floor(Math.random() * 30 - 5 + 1) + 5 // More frequent black swans
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
    this.userMoneyText.setText(`Money : $ ${this.activeUser.money.toFixed(2)}`)
  }
  updateAssets(){
    this.assetsText.setText(`Assets : ${this.activeUser.assets.toFixed(2)}`)
  }
  updatePrice(priceNew){
    this.priceText.setText(`Price : $ ${priceNew}`)
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
    const positions = this.layout.getLayoutPositions();
    this.add.sprite(positions.character.x, positions.character.y, 'downOnly').play('downAnimation')
  }
  upAnimationPlay(){
    const positions = this.layout.getLayoutPositions();
    this.add.sprite(positions.character.x, positions.character.y, 'upOnly').play('upAnimation')
  }
  sideAnimationPlay(){
    const positions = this.layout.getLayoutPositions();
    this.add.sprite(positions.character.x, positions.character.y, 'sideOnly').play('sideAnimation')
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
  
  calculateMentalHealth(currentHealth, infl){
    let _localHealth = Number(currentHealth)
    let _localInflation = Number(infl)
    // Mental health deteriorates at 0.25x the rate of inflation (4 times slower)
    let _localPercentage = (_localHealth / 100) * (_localInflation * 0.25)
    let _finalHealth = _localHealth - _localPercentage
    // Ensure mental health doesn't go below 0
    return Math.max(0, Number(_finalHealth))
  }
  
  updateHealthBar(){
    const positions = this.layout.getLayoutPositions();
    const healthBarY = 420;
    const healthBarX = 12;
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    
    // Calculate health percentage and bar width
    const healthPercent = Math.max(0, Math.min(100, this.activeUser.mentalHealth)) / 100;
    const barWidth = healthBarWidth * healthPercent;
    
    // Determine bar color based on health level
    let barColor = 0x00FF00; // Green (100-60%)
    if (this.activeUser.mentalHealth < 60) {
      barColor = 0xFFFF00; // Yellow (59-26%)
    }
    if (this.activeUser.mentalHealth < 25) {
      barColor = 0xFF0000; // Red (25% and below)
    }
    
    // Clear and redraw the health bar
    this.healthBar.clear();
    this.healthBar.fillStyle(barColor);
    this.healthBar.fillRect(healthBarX, healthBarY, barWidth, healthBarHeight);
    
    // Update percentage text with appropriate color for contrast
    const textColor = (this.activeUser.mentalHealth < 60) ? '#000000' : '#FFFFFF';
    this.healthBarText.setFill(textColor);
    this.healthBarText.setText(`${Math.round(this.activeUser.mentalHealth)}%`);
  }
  updateMentalHealth(){
    this.updateHealthBar();
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
    let _mentalHealth = Number(this.activeUser.mentalHealth)
    
    // Game over if mental health reaches 0 OR both money and assets are depleted
    if (_mentalHealth <= 0 || ((_localMoney < 0.01) && (_localAssets < 0.01))){
      this.scene.stop()
      console.log('game over - mental health:', _mentalHealth, 'money:', _localMoney, 'assets:', _localAssets)
      if (this.ambience) {
        this.ambience.stop()
      }
      this.gameOverMusic.play()
      let dataObject = {
        userDetails: this.activeUser, 
        tradeDetails: this.allTrades, 
        timeAlive: this.activeUser.timeAlive,
        inflation: this.globalSettings.inflation,
        mentalHealth: this.activeUser.mentalHealth
      }
      this.allTrades = []
      this.scene.launch('GameOver', dataObject)
    } else if ((_localMoney >= 0.1) || (_localAssets >= 0.1)){
      // console.log('game on')
    }
  }
}
