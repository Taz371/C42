class Game {
  constructor() 
  {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
  }
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // TA
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    powerCoinsGroup = new Group();
    fuelGroup = new Group();

    this.addSprites(powerCoinsGroup,25,powerCoinImage,0.09);
    this.addSprites(fuelGroup,10,fuelImage, 0.02);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale)
  {
    for(var i = 0; i < numberOfSprites; i++)
    {
      var x,y;
      x = random(width/2 + 150, width/2 - 150);
      y = random(-height * 4.5, height - 400);
      var sprite = createSprite(x,y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);
  }

  //SA
  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();

     if (allPlayers !== undefined)
    {
      image(track, 0, -height * 5, width, height * 6);

      var index = 0;
      for (var plr in allPlayers)
      {
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index].position.x = x;
        cars[index].position.y = y;

        index = index + 1;

        if (index === player.index)
        {
          fill("red");
          stroke(2);
          ellipse(x, y, 60);

          this.handlePowerCoins(index);
          this.handleFuel(index);

          camera.position.x = width/2;
          camera.position.y = cars[index-1].position.y;
        }
      }

      if (keyIsDown(UP_ARROW))
      {
        player.positionY += 10;
        player.update();
      }
 
      this.handlePlayerControls();
      drawSprites();
    }
  }

  handleFuel(index) 
  {
    // Adding fuel
    cars[index - 1].overlap(fuelGroup, function(collector, collected) {
      player.fuel = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handlePowerCoins(index) 
  {
    cars[index - 1].overlap(powerCoinsGroup, function(collector, collected) {
      player.score += 21;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref('/').set({
        playerCount:0,
        gameState:0,
        carsAtEnd:0,
        players:{}
      });
      window.location.reload();
     //set the intial value for players and gamecount.
    });
  }
  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX > width/3 - 50) {
      player.positionX += 2;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX < width/2 + 300) {
      player.positionX -= 2;
      player.update();
    }
  
   //fill keydown for left and right
  }

}

