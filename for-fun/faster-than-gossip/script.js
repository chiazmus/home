//© 2025 Andrew Burnah
//Art made by Meta AI
//Text for procedural stories partially generated by Chat GPT
//Music by William Burnah and Andrew Burnah
//Code and Game Design by Andrew Burnah
//Devolopment tools: Visual Studio Code, Chat GPT, Google Gemini, Deep Seek, Google Search

//Possible elements to add to the game:
//Space Pirates (take fuel or credits)
//Environmental Hazards like Black Holes or Nebuli (which take extra fuel)
//Hostile planets which might take fuel or credits (but maybe have better stories)
//Upgrades, such as:
//Better Sensors -lets you see distant stars
//Weapons Systems -lets you attack pirates (or steal fuel from rival ships)
//A second ship?

const canvas = document.getElementById('universeBox');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match its display size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio); 
}

// Initialize canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


ctx.imageSmoothingEnabled = false;

const storyValues = {'Boring':1,'Interesting':2,'Captivating':3, 'None':0};
const systemVal = document.getElementById('storyValue');
const systemStore = document.getElementById('storeAvailable');
const systemName = document.getElementById('systemName');
const systemFuel = document.getElementById('fuel');
const systemCredits = document.getElementById('credits');
const buyFuel = document.getElementById('buyFuel');
const systemStories = document.getElementById('stories');
const sensorName = document.getElementById('sensorName');
const sensorStory = document.getElementById('sensorStory');
const sensorUtility = document.getElementById('sensorUtility');
const headline1 = document.getElementById('head1');
const headline2 = document.getElementById('head2');
const para1 = document.getElementById('article1');
const para2 = document.getElementById('article2');
const playButton = document.getElementById('playSong');
const examineSound = new Audio('sounds/examine.mp3');
const warpSound = new Audio('sounds/warp.mp3')
const song = new Audio('sounds/galactic-journalism.mp3'); //By William Burnah and Andrew Burnah
const hardMode = false;
song.loop = true;
song.volume = 0.5;


let lastExamined = null;

let fuel = 5;
let credits = 10;
let storyPoints = 0;

let currentLocation = 0;

starPrefix = ['Alpha', 'Zeta', 'Gamma', 'Epsilon', 'Orion', 'Cerce', 'Delta', 'Beta', 'Geidi', 'Telseron', 'Mobius', 'Arcadia', 'Sirius', 'Antares', 'Vega', 'Taurus'];
starSuffix = ['Prime', 'Outpost', 'Major', 'Minor', 'Nebula', 'Station', 'IV', 'III', 'II', 'Ring', 'Matrix', 'Cluster', 'Vortex'];

let ticks = 0;
let myStars = [];
let ship = new Image();
ship.src = 'images/tiny-ship.png';
let enemyship = new Image();
enemyship.src = 'images/enemy-ship.png';

let enemyx = 0;
let enemyy = 0;
let enemystar = null;
let enemystarnum = 0;
let enemycredits = 10;
let enemyfuel = 5;
let enemystories = 0;

let shipx = 0;
let shipy = 0;
let mouseX = 0;
let mouseY = 0;

let piratex = 0;
let piratey = 0;
let piratestar = null;
let pirateWeaponScore = 1; //Combat works by a simple score comparison (he who has the higher score takes resources from the other!)

let myWeaponScore = 0;
let enemyWeaponScore = 0;

ctx.font = '8px monospace'

// Function to calculate Morton 2D code
function morton2D(x, y) {
    let z = 0;
    for (let i = 0; i < 16; i++) { 
        z |= (x & 1) << (2 * i);
        z |= (y & 1) << (2 * i + 1);
        x >>= 1;
        y >>= 1;
    }
    return z;
}

function playSong(){
    if (song.paused) {
        song.play();
        playButton.textContent = 'Pause Music';
    } else {
        song.pause();
        playButton.textContent = 'Play Music';
    }
}

function playMP3(sound) {
    try {
      sound.play();
    } catch (error) {
      console.error("Error playing MP3:", error);
    }
  }

function generateSciFiHeadline() {
    const subjects = [
        "Galactic Federation", "Quantum Pirates", "AI Overlords", "Ancient Alien Artifacts",
        "Warp Drive Engineers", "Interstellar Nomads", "Cybernetic Rebels", "Dark Matter Cultists",
        "Sentient Starships", "Rogue Planet Miners", "Temporal Anomalies", "Bio-Engineered Swarms",
        "Planetary Defense Grids", "Xenobiological Researchers", "Dimensional Travelers", "The Galactic Senate",
        "The Void Kraken", "The Crystal Cities", "The Shadow Syndicate", "Astral Cartographers",
        "The Harmonic Convergence", "The Silicon Sentinels", "The Nebula Navigators", "The Gene-Splicers",
        "The Chronal Watchers", "Astral Architects", "Mindflayers", "The Cosmic Librarians"
    ];
    
    const actions = [
        "Uncover Secrets of", "Declare War on", "Discover Lost Colony of", "Invent New Technology to Defeat",
        "Form Alliance with", "Escape from", "Colonize", "Unleash Chaos on",
        "Negotiate Peace with", "Intercept Communications from", "Hijack Cargo of", "Awaken Ancient Power Within",
        "Predict the Destruction of", "Reverse the Effects of", "Imprison the Leader of", "Transmit a Warning to",
        "Refute the Claims of", "Investigate the Disappearance of", "Restore Balance to", "Activate the Defense Systems of",
        "Purge the Corruption in", "Manipulate the Stock Market of", "Hack the Neural Networks of", "Terraform the Surface of",
        "Construct a Fortress in", "Decipher the Language of", "Harness the Energy of", "Redirect the Asteroid Field Towards"
    ];
    
    const objects = [
        "the Andromeda Galaxy", "the Black Hole Nexus", "the Quantum Singularity", "the Forgotten Moons",
        "the Cosmic Leviathan", "the Dyson Sphere", "the Time-Warped Nebula", "the Infinite Void",
        "the Galactic Core", "the Parallel Universe", "the Living Planet", "the Rogue Asteroid",
        "the Interdimensional Rift", "the Sentient Nebula", "the Crystalline Matrix", "the Shadow Realm",
        "the Pulsar Grid", "the Bio-Dome Complex", "the Temporal Flux", "the Dark Energy Cloud",
        "the Resonance Cascade", "the Orbital Ring", "the Quantum Entanglement Network", "the Astral Plane",
        "the Memory Banks of the Ancients", "the Galactic Data Stream", "The Grand Celestial Archives", "The Transdimensional Highway"
    ];
    
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomObject = objects[Math.floor(Math.random() * objects.length)];
    
    return `${randomSubject} ${randomAction} ${randomObject}!`;
  }

  function generateSciFiNewsParagraph(headline) {
    const locations = [
        "the Andromeda Galaxy", "the Outer Rim", "a distant star system", "a rogue planet",
        "a derelict space station", "the Quantum Expanse", "the Celestial Wasteland",
        "the Core Worlds", "the Binary Star System of Terra II", "the Nebula of Whispers",
        "the Asteroid Belt of Epsilon Beta", "the Living Moon of Geidi Prime", "the Orbital Cities of Caladan",
        "the Subterranean Colonies of Zanthus", "the Temporal Anomaly Zone", "the Shifting Sands of Arrakis",
        "the Interdimensional Crossroads", "the Floating Islands of Arelion", "the Sunken Cities of Atlantia",
        "the Ghost Nebula", "the Edge of the Known Universe", "the Hidden Planet of Arturia",
        "the Galactic Senate Chambers", "the Black Hole Singularity", "the Crystal Caves of Kronos IV",
        "the Warp Gate Nexus", "the Bio-Dome Research Facility", "the Shadow Syndicate Headquarters",
        "the Ancient Alien Ruins", "the Hyperlane Network"
    ];
    
    const events = [
        "a shocking discovery", "an unprecedented alliance", "a catastrophic event",
        "a groundbreaking invention", "a mysterious signal", "a devastating war",
        "a sudden uprising", "the awakening of an ancient entity", "a mass evacuation",
        "a technological singularity", "a diplomatic breakdown", "the arrival of an unknown fleet",
        "a viral outbreak", "a dimensional breach", "the collapse of a star",
        "a genetic mutation", "a psychic awakening", "a data corruption crisis",
        "the discovery of a new energy source", "the hijacking of a colony ship", "a planetary rebellion",
        "the activation of a defense system", "the theft of a powerful artifact", "a political assassination",
        "the discovery of a hidden message", "the disruption of the warp drive network", "a time paradox",
        "the emergence of a new species", "the discovery of a lost technology", "the failure of the planetary shielding"
    ];
    
    const consequences = [
        "threatening the stability of the galaxy", "changing the course of history",
        "raising questions about the nature of existence", "sparking interstellar conflict",
        "offering hope to oppressed civilizations", "unleashing chaos across star systems",
        "revealing ancient secrets", "leading to the formation of a new galactic order",
        "forcing species to adapt or perish", "creating a new era of technological advancement",
        "triggering a wave of refugees", "causing widespread panic and fear",
        "opening up new possibilities for exploration", "redefining the boundaries of known space",
        "leading to the extinction of a species", "creating a power vacuum",
        "revealing the true nature of the AI overlords", "forcing a reassessment of galactic law",
        "leading to the discovery of a parallel universe", "creating a permanent rift in spacetime",
        "causing a shift in the balance of power", "leading to the unification of disparate factions",
        "creating a new form of sentience", "resulting in the loss of vital resources",
        "forcing the abandonment of colonized worlds", "leading to the rise of a new empire",
        "creating a new form of energy", "resulting in the rewriting of galactic history",
        "leading to the creation of a new religion", "causing the collapse of the galactic economy"
    ];
    
    const intros = [
        "In a stunning turn of events,", "In a remarkable development,", "Subsequent to an unforeseen incident,",
        "With a sudden reversal,", "In an unexpected twist of fate,", "Following a series of unusual occurrences,",
        "Amidst growing tensions,", "As a result of recent investigations,", "Breaking reports indicate that,",
        "Sources confirm that,", "After a period of quiet observation,", "In the wake of a surprising announcement,",
        "According to leaked documents,", "During a routine survey mission, it was discovered that ", "In a dramatic escalation,",
        "Following a critical failure,", "As intelligence gathers,", "During a scheduled conference it was revealed that",
        "In the midst of a scientific breakthrough,", "After a period of intense negotiations,",
        "With the discovery of new evidence,", "Following the interception of a coded message,",
        "In the face of overwhelming odds,", "As the situation deteriorates,", "After a period of relative peace,",
        "Following a period of intense research,", "In the aftermath of a devastating attack,",
        "As recent events escalate,", "Following the detection of an anomaly,"
    ];
    
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomConsequence = consequences[Math.floor(Math.random() * consequences.length)];
    const randomIntro = intros[Math.floor(Math.random() * intros.length)];
    
    return `${randomIntro} ${headline.toLowerCase()} Sources report that ${randomEvent} in ${randomLocation} is ${randomConsequence}. Stay tuned for updates as this story develops.`;
  }

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgb(125,225,255)';
    ctx.lineWidth = 2;
    ctx.stroke();
}


function clearScreen() {
    const myrect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, myrect.width, myrect.height);
}


class Star {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = 'yellow';
        this.mortonValue = morton2D(this.x, this.y);
        this.storyVal = Math.round((Math.random()*2)+1);
        this.store = false;
        this.name = starPrefix[Math.floor(Math.random() * starPrefix.length)];
        this.name = this.name + ' ' + starSuffix[Math.floor(Math.random() * starSuffix.length)] + '-' + Math.floor(this.mortonValue);
        if (this.storyVal == 1) this.storyVal = 'Interesting';
        else if (this.storyVal == 2) this.storyVal = 'Boring';
        else if (this.storyVal == 3) this.storyVal = 'Captivating';
    }


    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 6, 6); 
    }

    displayAtr(){   
        let isNeighbor = false;

        if (currentLocation > 0 && myStars[currentLocation-1] === this) isNeighbor = true;
        else if (currentLocation < myStars.length-1 && myStars[currentLocation+1] === this) isNeighbor = true;
        else if (currentLocation > 1 && myStars[currentLocation-2] === this) isNeighbor = true;
        else if (currentLocation < myStars.length-2 && myStars[currentLocation+2] === this) isNeighbor = true;
        if (isNeighbor) {
            sensorName.textContent = 'Name: ' + this.name;
            sensorStory.textContent = 'Story: ' + this.storyVal;
            if (this.store) sensorUtility.textContent = 'Utilities: Store'; else sensorUtility.textContent = 'Utilities: None';
        }
    }


    makeConnect(itm) {
        drawLine(this.x+3, this.y+3, itm.x+3, itm.y+3);
    }
}

function enemyMove(){
    //Take the story of every star you are on, then move to a random star (preferably without a story).  If there is a store, buy as much fuel as possible after researching.
    if (enemystar.storyVal != 'None'){
        enemycredits += 5;
        enemystories += storyValues[enemystar.storyVal];
        enemystar.storyVal = 'None';
        enemystar.color = 'red';
    } else if (enemystar.store && enemycredits >= 5){
        enemycredits -= 5;
        enemyfuel += 2;
    } else if (fuel > 0) {

        let connections = [];

        if (enemystarnum > 1) connections.push(myStars[enemystarnum-1]);
        if (enemystarnum < myStars.length-1) connections.push(myStars[enemystarnum+1]);
        if (enemystarnum > 2) connections.push(myStars[enemystarnum-2]);
        if (enemystarnum < myStars.length-2) connections.push(myStars[enemystarnum+2]);

        connections.sort((a, b) => storyValues[a.storyVal] - storyValues[b.storyVal]);
        if (storyValues[connections[0].storyVal] == storyValues[connections[connections.length-1].storyVal] && hardMode) {
            enemystar = connections[Math.floor(Math.random() * connections.length)];
        } else {
            enemystar = connections[connections.length-1];
        }

        enemyx = enemystar.x;
        enemyy = enemystar.y;

        for (i = 0; i < myStars.length; i++) {
            if (myStars[i].x == enemyx && myStars[i].y == enemyy) {
                enemystarnum = i;
                break;
            }
        }        
    }
    drawScreen();
}

function research(){
    let shipstar = null;

    for (i = 0; i < myStars.length; i++) {
        if (myStars[i].x == shipx && myStars[i].y == shipy) {
            shipstar = myStars[i];
        }
    }

    if (shipstar != null) {
        if (shipstar.storyVal != 'None') {
            storyPoints += storyValues[shipstar.storyVal];
            shipstar.storyVal = 'None';
            shipstar.color = 'red';
            credits += 5;
            playMP3(examineSound);
            updateMenu();
            enemyMove();
        }
    }    
}

function fuelBuy(){
    if (credits >= 5 && systemStore.textContent == 'Store Available'){
        fuel += 2;
        credits -= 5;
        playMP3(examineSound);
        updateMenu();
        enemyMove();
    }
}

function updateMenu(){
    let shipstar = null;

    for (i = 0; i < myStars.length; i++) {
        if (myStars[i].x == shipx && myStars[i].y == shipy) {
            shipstar = myStars[i];
        }
    }

    if (shipstar != null){
        systemVal.textContent = 'Story: ' + shipstar.storyVal;
        systemName.textContent = shipstar.name;     
        systemFuel.textContent = 'Fuel: ' + String(fuel);   
        systemCredits.textContent = 'Credits: ' + String(credits);
        systemStories.textContent = 'Stories: ' + String(storyPoints);
        headline1.textContent = generateSciFiHeadline();
        headline2.textContent = generateSciFiHeadline();
        para1.textContent = generateSciFiNewsParagraph(headline1.textContent);
        para2.textContent = generateSciFiNewsParagraph(headline2.textContent);
        if (fuel == 0) systemFuel.style.color = 'var(--error-1)'; else systemFuel.style.color = 'var(--accent-1)';
        if (credits == 0) systemCredits.style.color = 'var(--error-1)'; else systemCredits.style.color = 'var(--accent-1)';
        if (shipstar.store) {
            systemStore.textContent = 'Store Available';
            systemStore.style.color = 'var(--accent-2)';
            buyFuel.textContent = 'Buy Fuel: 5'
        } else {
            systemStore.textContent = 'Store Unavailable';
            systemStore.style.color = 'var(--error-1)';
            buyFuel.textContent = 'No Fuel Available'
        }
    }
}


function update() {
    let currentstar = null;
    let currentnum = null;
    let shipstar = null;
    let closest = 10000;
    let movenum = null;

    for (i = 0; i < myStars.length; i++) {
        let tx = Math.round(myStars[i].x);
        let ty = Math.round(myStars[i].y);
        let mx = Math.round(mouseX);
        let my = Math.round(mouseY);
        let dist = Math.abs(mx - tx) + Math.abs(my - ty);
        if (dist <= 30) {
            if (dist < closest) {
                closest = dist;
                currentstar = myStars[i];
                movenum = i;
            }
        }

        if (myStars[i].x == shipx && myStars[i].y == shipy) {
            currentLocation = i;
            shipstar = myStars[i];
            currentnum = i;
        }
    }

    if (shipstar != currentstar && currentstar != null && shipstar != null) {
        let connections = [];
        if (currentnum > 0) connections.push(myStars[currentnum - 1]);
        if (currentnum < myStars.length - 1) connections.push(myStars[currentnum + 1]);
        if (currentnum < myStars.length - 2) connections.push(myStars[currentnum + 2]);
        if (currentnum > 1) connections.push(myStars[currentnum - 2]);

        for (i = 0; i < connections.length; i++) {
            if (connections[i] == currentstar && fuel > 0) {
                shipx = currentstar.x;
                shipy = currentstar.y;
                currentLocation = movenum;
                fuel -= 1;
                playMP3(warpSound);
                updateMenu();
                enemyMove();
                return true;
            }
        }
    }
}


function drawScreen() {
    clearScreen();

    myStars.forEach(star => star.draw());
    let selectedNum = null;
    let closest = 10000;

    for (i = 0; i < myStars.length; i++) {
        let tx = Math.round(myStars[i].x);
        let ty = Math.round(myStars[i].y);
        let mx = Math.round(mouseX);
        let my = Math.round(mouseY);
        let dist = Math.abs(mx - tx) + Math.abs(my - ty);
        if (dist <= 30) {
            if (dist < closest) {
                closest = dist;
                selectedNum = i;
            }
        }
    }

    if (closest < 10000) {
        if (selectedNum > 0) myStars[selectedNum].makeConnect(myStars[selectedNum - 1]);
        if (selectedNum < myStars.length - 1) myStars[selectedNum].makeConnect(myStars[selectedNum + 1]);
        if (selectedNum < myStars.length - 2) myStars[selectedNum].makeConnect(myStars[selectedNum + 2]);
        if (selectedNum > 1) myStars[selectedNum].makeConnect(myStars[selectedNum - 2]);
        myStars[selectedNum].displayAtr();
    }

    ctx.drawImage(ship, shipx - 16, shipy - 16);
    ctx.drawImage(enemyship, enemyx - 16, enemyy - 16);
}

function endgame() {
    canvas.style.backgroundImage = 'none';
    clearScreen();


    let winnerMessage = "";
    if (storyPoints > enemystories) {
        winnerMessage = "You Win! Your stories made the headlines on the galactic news!";
    } else if (storyPoints < enemystories) {
        winnerMessage = "You Lose! Your stories only made the last page of the galactic paper.";
    } else {
        winnerMessage = "It's a Tie! Neither you nor your rival made the front page.";
    }


    let temprect = canvas.getBoundingClientRect()
    ctx.fillStyle = 'white';
    ctx.font = '25px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(winnerMessage, temprect.width / 2, canvas.height / 2 - 30);

    ctx.font = '20px "Orbitron", monospace';
    ctx.fillText(`Your Story Points: ${storyPoints}`, temprect.width / 2, canvas.height / 2);
    ctx.fillText(`Enemy Story Points: ${enemystories}`, temprect.width / 2, canvas.height / 2 + 30);


    ctx.font = '16px "Orbitron", monospace';
    ctx.fillText(`Press the 'Restart Game' button to restart.`, temprect.width / 2, canvas.height / 2 + 60);


    canvas.removeEventListener('mousemove', mouseMoveHandler);
    canvas.removeEventListener('click', clickHandler);

}


function restartGame(){

    canvas.style.backgroundImage = "url('images/pixel-space.png')";
    ctx.font = '16px "Orbitron", monospace';
    fuel = 5;
    credits = 10;
    storyPoints = 0;

    currentLocation = 0;

    ticks = 0;
    myStars = [];

    enemyx = 0;
    enemyy = 0;
    enemystar = null;
    enemystarnum = 0;
    enemycredits = 10;
    enemyfuel = 5;
    enemystories = 0;

    shipx = 0;
    shipy = 0;


    let myrect = canvas.getBoundingClientRect();
    for (i = 0; i < 16; i++) {
        myStars.push(new Star(Math.random() * myrect.width, Math.random() * myrect.height, '#666'));
        myStars[myStars.length - 1].draw();
    }

    myStars.sort((a, b) => a.mortonValue - b.mortonValue);

    myStars[Math.floor(Math.random()*myStars.length)].store = true;
    myStars[Math.floor(Math.random()*myStars.length)].store = true;
    shipx = myStars[0].x;
    shipy = myStars[0].y;
    ctx.drawImage(ship, shipx - 16, shipy - 16);
    enemystar = myStars[myStars.length-1];
    enemystarnum = myStars.length-1;
    enemyx = enemystar.x;
    enemyy = enemystar.y;
    ctx.drawImage(enemyship, enemyx - 16, enemyy - 16);
    updateMenu();
    drawScreen();

    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('click', clickHandler);

}

function tutorial() {
    // Clear the canvas and set up the tutorial screen
    clearScreen();
    canvas.style.backgroundImage = 'none';
    ctx.fillStyle = 'white';
    ctx.font = '28px monospace';
    ctx.textAlign = 'center';

    // Get the canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Display the tutorial text
    ctx.fillText("-- Faster Than Gossip --", centerX, centerY - 120);
    ctx.font = '22px monospace';
    ctx.fillText("You are a galactic journalist racing against your rival, Researchbot 2000,", centerX, centerY - 95);
    ctx.fillText("to uncover the most enthralling stories in the galaxy, and make the front page", centerX, centerY - 70);
    ctx.fillText("of the Galactic News.  Your goal is to collect story points by researching", centerX, centerY - 40);
    ctx.fillText("interesting stories at different star systems before Researchbot 2000 does.", centerX, centerY - 15);

    ctx.fillText("How to Play:", centerX, centerY + 20);
    ctx.fillText("- Click on nearby stars to move your ship. Each move costs 1 fuel.", centerX, centerY + 50);
    ctx.fillText("- Research stories at stars to earn story points and credits.", centerX, centerY + 80);
    ctx.fillText("- Use credits to buy fuel at stores (See the menu).", centerX, centerY + 110);
    ctx.fillText("- Publish your stories when you're ready to end the game.", centerX, centerY + 140);

    ctx.fillText("May the best journalist win!", centerX, centerY + 180);

    // Add a button to close the tutorial and start the game
    const buttonX = centerX - 75;
    const buttonY = centerY + 220;
    ctx.fillStyle = '#4df0ff';
    ctx.fillRect(buttonX, buttonY, 150, 40);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillText("Start Game", centerX, buttonY + 25);
    ctx.font = '16px "Orbitron", monospace';

    // Add an event listener to the canvas to detect clicks on the "Start Game" button
    canvas.addEventListener('click', function startGame(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width / window.devicePixelRatio;
        const scaleY = canvas.height / rect.height / window.devicePixelRatio;
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        // Check if the click is within the "Start Game" button area
        if (clickX >= buttonX && clickX <= buttonX + 100 && clickY >= buttonY && clickY <= buttonY + 40) {
            // Remove the event listener to prevent multiple triggers
            canvas.removeEventListener('click', startGame);
            // Restart the game
            restartGame();
        }
    });
}

 function mouseMoveHandler(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width / window.devicePixelRatio;
    const scaleY = canvas.height / rect.height / window.devicePixelRatio;
    mouseX = (event.clientX - rect.left) * scaleX;
    mouseY = (event.clientY - rect.top) * scaleY;
    drawScreen();
}

 function clickHandler(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width / window.devicePixelRatio;
    const scaleY = canvas.height / rect.height / window.devicePixelRatio;
    mouseX = (event.clientX - rect.left) * scaleX;
    mouseY = (event.clientY - rect.top) * scaleY;
    update();
    drawScreen();
}

tutorial();