var bird;
var obstacles = [];
var score;


function startGame() {
    bird = new component(60, 200, 40, 40, "yellow");
    score = new component(30, 30, "15px", "Consolas", "black", "text");
    canv.start();
}

var canv = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 20);
        this.frameNo = 0;
        window.addEventListener('mousedown', function (e) {
            jump(-0.2);
        })
        window.addEventListener('mouseup', function (e) {
            jump(0.1);
        })
    },
    stop: function() {
        clearInterval(this.interval);
        alert("You lost! " +  "Please refresh to start the game");
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(x, y, width, height, color, type) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    this.gravitySpd = 0;
    this.update = function() {
        ctx = canv.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpd += this.gravity
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpd;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockBottom = canv.canvas.height - this.height;
        if (this.y > rockBottom) {
            this.y = rockBottom;
            canv.stop();
            return;
        }
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
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.clicked = function() {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = true;
        if ((mybottom < canv.y) || (mytop > canv.y) || (myright < canv.x) || (myleft > canv.x)) {
            clicked = false;
        }
        return clicked;
    }
}

function updateGame() {
    var x, y;
    for (i = 0; i < obstacles.length; i+= 1) {
        if (bird.crashWith(obstacles[i])) {
            canv.stop();
            return;
        } 
    }
    canv.clear();
    bird.newPos();
    canv.frameNo += 1;
    if (canv.frameNo == 1 || everyInterval(150)) {
        x = canv.canvas.width;
        y = canv.canvas.height - 200;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 70;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        obstacles.push(new component(x, 0, 10, height, "green"));
        obstacles.push(new component(x, height + gap, 10, x-height-gap, "green"));
    }
    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }
    if (canv.x && canv.y) {
        if (jumpBtn.clicked()) {
          bird.y -= 5;
        }
    }
    score.text = "SCORE: " + Math.floor(canv.frameNo/5);
    
    score.update();
    bird.update();
    obstacles[i].update();
}

function jump(n) {
    bird.gravity = n;
}

function everyInterval(n) {
    if ((canv.frameNo / n) % 1 == 0) {return true;}
    return false;
}