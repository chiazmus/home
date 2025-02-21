const canvas = document.getElementById('universeBox');
const ctx = canvas.getContext('2d');
const G = 0.01;
let ticks = 0;
var myPixels = [];
var toDelete = [];
var toMake = [];
let animationId = null;


function drawCircle(x,y,r,color){
    ctx.beginPath(); // Start a new path
    ctx.arc(x, y, r, 0, 2 * Math.PI); // Create the arc (circle)
    ctx.fillStyle = color;
    ctx.fill(); 
}

class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dx = 0; // Initialize dx and dy to 0 for gravity to work
        this.dy = 0;
        this.mass = Math.random()*8;
        this.size = (this.mass/Math.PI) ** 0.5;
        this.velocityX = (Math.random())-0.5; // For limiting horizontal speed if needed
        this.velocityY = (Math.random())-0.5; // For limiting vertical speed if needed
        this.maxSpeed = 5; // Adjust this to limit the maximum speed
        this.myId = Math.random();
    }

    draw() {
        drawCircle(this.x,this.y,this.size,this.color);
        let tx = this.x + (Math.sin((ticks/20) + (this.myId*100)) * this.size * 0.4);
        let ty = this.y + (Math.cos((ticks/20) + (this.myId*100)) * this.size * 0.5);
        let tsize = Math.floor(this.size * 0.7);
        drawCircle(tx,ty,tsize,this.color);
        tx = this.x + (Math.cos((ticks/28) + (this.myId*100)) * this.size * 0.4);
        ty = this.y + (Math.sin((ticks/28) + (this.myId*100)) * this.size * 0.5);
        tsize = Math.floor(this.size * 0.8);
        drawCircle(tx,ty,tsize,this.color);
        tx = this.x + (Math.sin((ticks/23) + (this.myId*98)) * this.size * 0.5);
        ty = this.y + (Math.sin((ticks/21) + (this.myId*63)) * this.size * 0.6);
        tsize = Math.floor(this.size * 0.9);
        drawCircle(tx,ty,tsize,this.color);
        tx = this.x + (Math.cos((ticks/23) + (this.myId*63)) * this.size * 0.6);
        ty = this.y + (Math.cos((ticks/21) + (this.myId*89)) * this.size * 0.5);
        tsize = Math.floor(this.size * 0.7);
        drawCircle(tx,ty,tsize,this.color);
    }

    update() {

        //Make sure it doesn't do anything if its about to be deleted.
        if (toDelete.includes(this)) return;

        myPixels.forEach(otherPixel => {
            if (otherPixel !== this) { // Don't gravitate towards itself
                this.gravitate(otherPixel);
            }
        });

        this.x += this.velocityX;
        this.y += this.velocityY;

        // Limiting Speed (Optional - if you want to limit total speed):
        const speed = Math.sqrt(this.velocityX**2 + this.velocityY**2);
        if (speed > this.maxSpeed) {
            const ratio = this.maxSpeed / speed;
            this.velocityX *= ratio;
            this.velocityY *= ratio;
        }

        this.x = (this.x % canvas.width + canvas.width) % canvas.width;
        this.y = (this.y % canvas.height + canvas.height) % canvas.height;

    }

    gravitate(itm) {
        const dx = itm.x - this.x;
        const dy = itm.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > (this.size+itm.size)) { // Avoid division by zero
            const force = (G * this.mass * itm.mass) / (distance * distance);
            const forceX = force * dx / distance;
            const forceY = force * dy / distance;

            this.velocityX += forceX / this.mass;
            this.velocityY += forceY / this.mass;
        } else {
            this.collide(itm)
        }
    }

    collide(itm) {
        //We're just going to combine the two for simplicities sake, and form a new pixel, removing the two old ones.
        let new_velocity_x = ((itm.velocityX * itm.mass) + (this.velocityX * this.mass)) / (itm.mass + this.mass);
        let new_velocity_y = ((itm.velocityY * itm.mass) + (this.velocityY * this.mass)) / (itm.mass + this.mass);
        if (itm.mass > this.mass) {
            this.x = itm.x;
            this.y = itm.y;
        }
        this.velocityX = new_velocity_x;
        this.velocityY = new_velocity_y;
        this.mass += itm.mass;
        this.size = (this.mass/Math.PI) ** 0.5;
        //remove the secondary pixel
        if (!toDelete.includes(this)) toDelete.push(itm);
    }

    deleteSelf(){
        myPixels = myPixels.filter(item => item !== this);
    }
}

function makeStars(stars){
    for (let i=0; i<stars; i++){
        let tx = Math.random() * canvas.width;
        let ty = Math.random() * canvas.height;
        let red = String(Math.floor(Math.random() * 99));
        let green = String(Math.floor(Math.random() * 99));
        let blue = String(Math.floor(Math.random() * 99));
        tx = Math.floor(tx);
        ty = Math.floor(ty);
        myPixels.push(new Pixel(tx,ty,'#'+red+green+blue));
    }
}

function drawStars(){
    for (let i=0; i<myPixels.length; i++){
        myPixels[i].draw();
    }
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Scale factor for width
    const scaleY = canvas.height / rect.height; // Scale factor for height
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);

    let red = String(Math.floor(Math.random() * 99));
    let green = String(Math.floor(Math.random() * 99));
    let blue = String(Math.floor(Math.random() * 99));
    const newColor = '#' + red + green + blue;

    let mynew = new Pixel(Math.floor(mouseX), Math.floor(mouseY), newColor);
    mynew.velocityX = (Math.random()*2)-1;
    mynew.velocityY = (Math.random()*2)-1; 
    myPixels.push(mynew);
});

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function genUniverse(){
    // Example: Draw a red pixel at (10, 10)
    myPixels = [];
    clearCanvas();
    makeStars(80);
    drawStars();
    // Cancel the previous animation loop before starting a new one
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    animationId = requestAnimationFrame(updateUniverse);
}

function updateUniverse(){
    ticks++;
    clearCanvas();
    myPixels.forEach(i => i.update());
    toDelete.forEach(i => i.deleteSelf());
    toDelete = [];
    drawStars();
    animationId = requestAnimationFrame(updateUniverse);
}