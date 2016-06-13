console.log("connected");

/*
- The function startGame invokes method start() of myGameArea object
*/
var myGameCar; //creating square on the canvas object
var myObstacle;
var myObstacles = []; //array holds multiple obstacles
var score;
var backgroundImage;

$('canvas').on('click', function(){
  startGame();
});

function startGame(){
  myGameArea.start();
  // myGamePieceSquare = new components(30,30,"red",10,120);
  myGameCar = new components(30,30,"blue",140,450);
  myObstacle = new components(120, 10, "green",0, 30)
  score = new components("30px", "consolas","white",50,50,"text");
  backgroundImage = new components(300,480,"http://24.media.tumblr.com/tumblr_mdzd6bFPcq1qassaoo1_500.gif",0,0,"image");

};

//game area is an object
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function(){
    this.canvas.width = 300;
    this.canvas.height = 480;
    this.frameNo = 0;
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    // setInterval will call again and again until clearInterval method is used
    this.interval = setInterval(updateGameArea,20);

    window.addEventListener('keydown', function(e){
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    });

    window.addEventListener('keyup', function(e){
      myGameArea.keys = (e.type == "keydown");
    });

    },

  clear: function(){
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
  stop: function(){
    clearInterval(this.interval);
  }
};

function everyInterval(n){
  if((myGameArea.frameNo/n)%1 === 0) {return true;}
  return false;
};


function components(width, height, color, x, y, type){
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function(){
    ctx = myGameArea.context;
    if(this.type == "text"){
      ctx.font = this.height + " " + this.width;
      ctx.fillStyle = color;
      ctx.fillText(this.text,this.x,this.y);
    }else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
     }
  };

  this.newPos = function(){
    this.x += this.speedX;
    this.y += this.speedY;
  }

  this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }

}

//clearing game area will not leave trail behind
function updateGameArea(){
  var x, y;

  for (let i = 0; i < myObstacles.length; i++) {
    if(myGameCar.crashWith(myObstacles[i])){
        myGameArea.stop();
        return;
    }
  }

  myGameArea.clear();
  myGameArea.frameNo += 1;
  if(myGameArea.frameNo == 2 || everyInterval(60)){
    x = myGameArea.canvas.height - 240;
    minHeight = 50;
    maxHeight = 200;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    y = myGameArea.canvas.width - 200;
    myObstacles.push(new components(height,10, "green", 0, y));
    myObstacles.push(new components(x-height-gap,10,"green",height+gap, y));
  }

  for(let i=0; i<myObstacles.length; i++){
      myObstacles[i].y += 2;
      myObstacles[i].update();
    }

  myGameCar.speedX = 0;
  myGameCar.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[37]) {myGameCar.speedX = -5; }
  if (myGameArea.keys && myGameArea.keys[39]) {myGameCar.speedX = 5; }
  if (myGameArea.keys && myGameArea.keys[38]) {myGameCar.speedY = -5; }
  if (myGameArea.keys && myGameArea.keys[40]) {myGameCar.speedY = 5; }
  score.text="SCORE: " + myGameArea.frameNo;
  score.update();
  myGameCar.newPos();
  myGameCar.update();


}
