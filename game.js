const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let money = 0;
let currentOrder = null;
let gameStarted = false;

// Player
let player = { x:0, y:0, angle:0 };

// Customer
let customer = { x:5, y:5, active:false };

// Controls
let keys = {};

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

document.addEventListener("mousemove", e => {
  if (document.pointerLockElement === canvas) {
    player.angle += e.movementX * 0.002;
  }
});

canvas.onclick = () => canvas.requestPointerLock();

// Start game
function startGame(){
  document.getElementById("menu").style.display = "none";
  document.getElementById("ui").style.display = "block";
  gameStarted = true;
}

// Spawn customers
setInterval(() => {
  if (!customer.active && gameStarted) {
    customer.active = true;
    customer.x = Math.random()*10-5;
    customer.y = Math.random()*10-5;

    currentOrder = ["Burger","Pizza","Fries"][Math.floor(Math.random()*3)];
    document.getElementById("order").innerText = currentOrder;
  }
}, 5000);

// Serve food
function serve(){
  if(customer.active){
    let dx = player.x - customer.x;
    let dy = player.y - customer.y;
    let dist = Math.sqrt(dx*dx+dy*dy);

    if(dist < 2){
      money += 10;
      document.getElementById("money").innerText = money;

      customer.active = false;
      currentOrder = null;
      document.getElementById("order").innerText = "None";
    }
  }
}

// Movement
function update(){
  if(!gameStarted) return;

  let speed = 0.1;

  if(keys["w"]){
    player.x += Math.cos(player.angle)*speed;
    player.y += Math.sin(player.angle)*speed;
  }
  if(keys["s"]){
    player.x -= Math.cos(player.angle)*speed;
    player.y -= Math.sin(player.angle)*speed;
  }
  if(keys["a"]){
    player.x += Math.cos(player.angle - Math.PI/2)*speed;
    player.y += Math.sin(player.angle - Math.PI/2)*speed;
  }
  if(keys["d"]){
    player.x += Math.cos(player.angle + Math.PI/2)*speed;
    player.y += Math.sin(player.angle + Math.PI/2)*speed;
  }
}

// Draw fake 3D
function draw(){
  ctx.fillStyle = "#222";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#333";
  ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

  if(customer.active){
    let dx = customer.x - player.x;
    let dy = customer.y - player.y;
    let dist = Math.sqrt(dx*dx+dy*dy);

    let size = 200 / dist;
    let angleTo = Math.atan2(dy, dx) - player.angle;

    let screenX = canvas.width/2 + Math.tan(angleTo)*300;

    ctx.fillStyle = "red";
    ctx.fillRect(screenX - size/2, canvas.height/2 - size, size, size);
  }

  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width/2-2, canvas.height/2-2, 4, 4);
}

// Loop
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
