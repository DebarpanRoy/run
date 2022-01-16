var PLAY = 1;
var END = 0;
var gameState = PLAY;

var man, manr, mancollided, manwaling;
var ground, invisibleGround, groundImage;
var backgroundImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;


function preload(){
  manr =   loadAnimation("M1.png","M2.png","M3.png");
  mancollided = loadAnimation("M2.png");
 
  
  groundImage = loadImage("ground.png");
  backgroundImage = loadImage("bag.jpg");
  
  
  
  obstacle1 = loadImage("B1.png");
  obstacle2 = loadImage("B2.png");
  obstacle3 = loadImage("B3.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth - 20, displayHeight-120);
  
  
  man = createSprite(100,300,20,50);
  
  man.addAnimation("running",manr);

  man.addAnimation("collided", mancollided);
  man.scale = 0.65;
  
  ground = createSprite(200,400,10700,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(550,200,20,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,280,5,5);
  restart.addImage(restartImg);
  
  

  gameOver.scale = 0.5;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,400,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  textSize(18);

  textFont("Bahnschrift Condensed");
  textStyle(BOLD);
  fill("white");
  score = 0;
}

function draw() {
  background(backgroundImage);
  
  textAlign(LEFT, TOP);
  text("Score: "+ score, 600,5);
  fill('black')
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    

    if(keyDown("space") && man.y >= 350) {
      man.velocityY = -14;
    }
   
    
    man.velocityY = man.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/3;
    }
  
    man.collide(invisibleGround);
    
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(man)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
  
    ground.velocityX = 0;
    man.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    
    
    man.changeAnimation("collided",mancollided);
    
    
    obstaclesGroup.setLifetimeEach(-1);
    
    
    if(mousePressedOver(restart)) {
      reset();
    }


  }
  
  drawSprites();
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(700,370,10,20);
   obstacle.scale = 0.2;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
             
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();

  
  man.changeAnimation("running",manr);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
 
  
  score = 0;
  
}
