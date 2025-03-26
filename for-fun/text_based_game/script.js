//Command Grammar
// 1. Command: <verb> <noun>
// 2. Verb: [go, look, take, use]

const outputBox = document.getElementById("textbox");

const scaryImage = '-- THE WUMPUS ATE YOU! --\n-----++++++++++-++..----+-#############+++++-. \n---+-++++++++ .. ......   --############+++++-.\n-++++++++-  .-.  . -.       .############++++--\n--++++++---.-  .  .  ... .    -##########++++--\n----+-+-.. .. -+++-+--.  .    ...++#####+++++-.\n----++...   .#--######++.+-    .----+#++++++-.-\n-----.    ..##+#########..+-    -.-+++--++-- ..\n-----... ...## ########## ++.    .---++++--- ..\n-----.--... #############-#+.   .  ---++++.----\n--.-....... #############.+.+  --  . .-++---..-\n-------.    .##########+-#. -+  .  .--.----..--\n--------.    #..##-.++  .+. -+..      .---.----\n--------. . -#+-- +###++--..-.+-     .-....----\n-------..-   ########  -+++-  #       .....----\n------.-. .-     ######+++-   +        .-.-..--\n..----.--...   .#-#####++-.  .+      .-----.---\n--..---.....    ##-++++--#+.--      .----++-+--\n------.. ..        +###----.++      ---+++++-+.\n-----------.#+      #######+ .  . .----+++. -.-\n-----------+++  .    .-...   .   ...-+-  --+###\n--------.-+#- -.      --..-     .----..###--###\n----------##- -+ ..-. .+#- .+.. .-----#####--##\n---------##---.++----.-##+ . ----+-.-#####+#-##\n---------##.#+----+-----#####-.+.-. .+#####+#+#\n--------.+###--.-+#+------##+--+..   -########+';

const mapBox = document.getElementById('displayMap');

class Room {
    constructor(name, description) {
      this.name = name;
      this.description = description;
      this.exits = [];
      this.directions = [];
      this.lockedExits = [];
      this.lockedMessage = [];
      this.items = [];
    }
  
    addExit(direction, room) {
      this.exits[direction] = room;
      this.directions.push(direction);
    }
  
    addItem(item) {
      this.items.push(item);
    }

    getExit(direction) {
      return this.exits[direction];
    }

    getItems() {
      return this.items;
    }

    getDescription(){
        let description = `${this.name}\n${this.description}`;
        for(let i=0; i<this.items.length;i++){
            description += `\n\nYou see a ${this.items[i].name} in the room.`;
        }
        description += `\n\nExits:`;
        let tempdir = '';
        for(let i=0; i<this.directions.length;i++){
            tempdir += `, ${this.directions[i]}`;
        }
        description += tempdir.slice(1);
        return description;
    }

}

class Item {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

// Qwen2.5-0.5B-Instruct-q4f16_1-MLC

//World
//The cave goes into a dwarven mine... but they dug too deep, opening up an ancient crypt and releasing an undead creature that descimated the miners.
//The player might stumble on to the creature if they don't heed the warning signs (wumpus is the fill-in name I'm using until I figure out what type of creature it is)
//In the forest, players stumble on to a hunters lodge... but the hunter seems to have disappeared, leaving cryptic notes
//That a creature has been terrorizing the druids temple, and he is hunting it.  He warns anybody who found the note to 
//Stay away from the temple, and not to go out in the forest at night

let startingRoom = new Room('FOREST', `You find yourself in a forest. Birds chirp happily in the trees above you, and a cobblestone path leads north and south. A subtle, unsettling feeling lingers in the air, a sense of something amiss.`);
let caveEntrance = new Room('CAVE', `You stand at the entrance to a huge cave. A cobblestone path leads from the cave to the north, back into the forest. A set of stone stairs, carved into the cavern wall, lead down into the cave's depths. A cold, damp breeze blows softly from the cavern, carrying a faint, metallic scent. You notice scratch marks on the cave walls, some disturbingly fresh.`);
let mineEntrance = new Room('MINE ENTRANCE', `You stand before a large structure that seems to have been carved directly out of the cave wall to your south, resembling a dwarven castle. An iron portcullis lies open, revealing a dark and quiet interior. Unlit torches are attached to sconces on the walls. A stairway behind you, carved into the cavern, makes its way up to the surface. Scattered around the entrance are broken tools and fragments of what appear to be bone.`);
let huntersLodge = new Room('HUNTER\'S LODGE', `You stumble upon a small, well-built lodge nestled amongst the trees. The door hangs slightly ajar. Inside, the furniture is overturned, and a scattering of papers litters the floor. A single, flickering lantern casts long, dancing shadows.`);
let atrium = new Room('ATRIUM', 'You are in a large atrium with the Portcullis to the north.  An armor rack, and a weapons rack sits abandoned on the south wall, next to a large derelict fireplace. There are doorways to the east and to the west.')
let livingQuarters = new Room('LIVING QUARTERS', 'You are in what seems to be a cramped living quarters.  A strange set of cubbies in the wall hold what appear to be sleeping pallets, and a large, wooden table sits in the center of the room. There is a door to the south and the west.');
let shrine = new Room('SHRINE', 'You are in a small, ornate shrine. The walls are adorned with intricate gold inlay carvings of bearded gods and scenes from ancient tales. A single, gold chandelier hangs above the altar, upon which lay a large pile of gold coins and gemstones.');
let forge = new Room('FORGE', 'You are in a room with several anvils, tools on the wall, and a forge on the east side of the room. A large, blacksmith hammer sits on the anvil in front of the forge. There is a door to the south, east, and west.');
let throneRoom = new Room('THRONE ROOM', 'You are in an expansive room with vaulted ceilings and a  stone throne at one end.  The most peculiar part of this room is that the southern wall seems to be missing.  A gaping hole sits where it should be, revealing a large, dark cavern, and a vast chasm.  Bridging the chasm is some sort of makeshift wooden bridge disappearing into the darkness in the south.');
let unfinishedRoom = new Room('UNFINISHED ROOM', 'You are in a room with rough walls.  Several tools lie abandoned on the floor.  It appears this room is still under construction, although what it\'s purpose is remains unknown.')

startingRoom.addExit('south', caveEntrance);
startingRoom.addExit('north', huntersLodge);
huntersLodge.addExit('south', startingRoom);
huntersLodge.addItem(new Item('key', 'A strange ornate key of Dwarvish design.  You wonder what that\'s doing here in the woods.'))
huntersLodge.addItem(new Item('note', 'The note says, "Out hunting a monster.  I\'ll be back soon.  Don\'t go into the forest at night."'))
caveEntrance.addExit('north', startingRoom);
caveEntrance.addExit('down', mineEntrance);
mineEntrance.addExit('up', caveEntrance);
mineEntrance.addExit('south', atrium);
atrium.addExit('north', mineEntrance);
atrium.addExit('east',livingQuarters);
atrium.addItem(new Item('sword','A rusty sword of dwarvish make'));
livingQuarters.addExit('west',atrium);
livingQuarters.addExit('south', shrine);
shrine.addExit('north',livingQuarters);
shrine.addItem(new Item('pendant','A pendant with the inscription "To treasure love, and love all treasure, will fill a Dwarvish life with pleasure."'));
atrium.addExit('west', forge);
forge.addExit('east',atrium);
forge.addExit('south', throneRoom);
forge.lockedExits.push('south');
forge.lockedMessage['south'] = 'The door is locked!';
forge.addExit('west', unfinishedRoom);
throneRoom.addExit('north', forge);
unfinishedRoom.addExit('east', forge);

const itemAttackPower = {'sword':1, 'pendant':0, 'key':0, 'note':0}

let playerHealth = 3;
let playerAttackPower = 0;
let playerLocation = startingRoom;
let playerInventory = [];
let specialEvents = {'hasDwarvenKey':false};
let gameOver = false;

let wumpusHealth = 2;
let wumpusAttackPower = 2;
let wumpusLocation = unfinishedRoom;

const verbCommands = {'look':look, 'examine':look, 'inspect':look, 'help':help, 'go':move, 'move':move, 'take':take, 'grab':take, 'aquire':take, 'drop':drop, 'inventory':inventory}

function doSpecialEvent() {
    if (playerHas('key') && playerLocation.name == 'FORGE') {
        if (forge.lockedExits.includes('south')) {
            forge.lockedExits.splice(forge.lockedExits.indexOf('south'), 1);
            write('You unlock the door to the south with the strange dwarven key.');
        }
    }
}

function fight(hp1, hp2, dmg1, dmg2) {
    if (dmg1 > dmg2) {
        hp2 -= dmg1-dmg2;
    } else if (dmg1 < dmg2) {
        hp1 -= dmg2-dmg1;
    }
    return [hp1, hp2];
}

function wumpusEncounter(){
    playerAttackPower = 0;
    for (let i = 0; i < playerInventory.length; i++) {
        playerAttackPower += itemAttackPower[playerInventory[i].name];
    }

    let fightResult = fight(playerHealth, wumpusHealth, playerAttackPower, wumpusAttackPower);
    
    playerHealth = fightResult[0];
    wumpusHealth = fightResult[1];
    if (wumpusHealth <= 0) {
        write('You kill the wumpus!')
    } else if (playerHealth <= 0) {
        write('The wumpus eats you!')
    } else {
        moveWumpus()
        moveWumpus()
        moveWumpus()
        write('You seem to scare the wumpus away!')
    }
}

function playerHas(obj) {
    for (let i=0; i < playerInventory.length; i++) {
        if (playerInventory[i].name == obj) return true;
    }
    return false;
}

function displayMap(name,exits){
    let layer0 = '';
    let layer1 = name;
    let layer2 = '';
    for (let i=0; i < exits.length; i++) {
        if (exits[i] == 'north' || exits[i] == 'up') {
            layer0 += exits[i] + '<br>||<br>';
        } else if (exits[i] == 'south' || exits[i] == 'down') {
            layer2 += '<br>||<br>' + exits[i];
        } else if (exits[i] == 'east' || exits[i] == 'right') {
            layer1 += ' == ' + exits[i];
        } else if (exits[i] == 'west' || exits[i] == 'left') {
            layer1 = exits[i] + ' == ' + layer1;
        }

    }
    let myString = layer0 + layer1 + layer2;
    mapBox.innerHTML = myString;
}

function randomChar() {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:/?!@#$%^&*()-=_+[]";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

function constructRandomString(len) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:/?!@#$%^&*()-=_+[]";
    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function coolText(text, epochs) {
    let subGroups = Math.max(1, Math.floor(text.length / epochs)); // Ensure at least 1 character changes per epoch
    let epochResults = [];
    let incorrectText = [...Array(text.length).keys()]; // Array of indices
    for (let i = 0; i < text.length; i++) {
        if (text[i] == '\\' && text[i+1] == 'n') {
            incorrectText.splice(incorrectText.indexOf(i));
            incorrectText.splice(incorrectText.indexOf(i+1));
        }
    }
    for (let i = 0; i < epochs; i++) {
        for (let j = 0; j < subGroups && incorrectText.length > 0; j++) {
            incorrectText.splice(Math.floor(Math.random() * incorrectText.length), 1);
        }

        let myString = '';

        for (let j = 0; j < text.length; j++) {
            myString += incorrectText.includes(j) ? randomChar() : text[j];
        }

        epochResults.push(myString);
    }

    return epochResults;
}

function writingComponent(outpBox, txt) {
    outpBox.innerHTML = txt;
}

function write(text) {
    let cooltxt = coolText(text, 20);
    let outputBox = document.getElementById('textbox'); // Ensure outputBox exists

    cooltxt.forEach((txt, i) => {
        setTimeout(() => writingComponent(outputBox, txt), i * 100);
    });
    text = text.replace(/\n/g, '<br>') + '<br>';
    setTimeout(() => writingComponent(outputBox, text), cooltxt.length * 100);
}


function clear() {
    outputBox.innerHTML = "";
}

function help(n){
    write('Commands: help, go [direction], look around, look [item], inventory, drop [item], take [item]')
}

function move(direction){
    if(playerLocation.getExit(direction)){

        if (playerLocation.lockedExits.includes(direction)){
            write(playerLocation.lockedMessage[direction]);
            return;
        }

        playerLocation = playerLocation.getExit(direction);

        if (Math.random() <= 0.3) {
            moveWumpus();
        }

        displayRoom();

        if (playerLocation == wumpusLocation) {
            clear();
            write(scaryImage);
            gameOver = true;
            return;
        }


    }else{
        write("You can't go that way.");
    }
}

function displayRoom(){
    clear();
    let my_des = playerLocation.getDescription();
    let nearbyRoom = null;
    for (i = 0; i < playerLocation.directions.length; i++) {
        nearbyRoom = playerLocation.exits[playerLocation.directions[i]]
        if (wumpusLocation == nearbyRoom) {
            my_des += `\nYou smell the stench of rotting flesh.`;
        }
    }
    write(my_des);
    displayMap(playerLocation.name, playerLocation.directions);
}

function roomHas(obj){
    for (i = 0; i < playerLocation.items.length; i++) {
        if (playerLocation.items[i].name == obj) return i;
    }
    return -1;

}

function look(obj){
    if (obj == 'around' || obj == 'surroundings') {
        displayRoom();
    } else if (roomHas(obj) != -1) {
        write(playerLocation.items[roomHas(obj)].description);
    } else {
        write('You don\'t see anything like that here.');
    }
}

function drop(obj) {
    for (i=0; i < playerInventory.length; i++) {
        if (playerInventory[i].name == obj) {
            playerLocation.addItem(playerInventory[i]);
            playerInventory.splice(i, 1);
            write(`You drop the ${obj}.`)
            return true;
        }
    }
    write('You have no such item in your inventory.')
}

function inventory(obj) {
    let myInventory = 'Your inventory contains: ';
    for (i=0; i < playerInventory.length; i++) {
        myInventory += playerInventory[i].name;
        if (i != playerInventory.length - 1) {
            myInventory += ', ';
        }
    }
    write(myInventory);
}

function take(obj) {
    if (roomHas(obj) != -1) {
        if (playerInventory.length >= 3) {
            write('You can\'t carry any more items!');
            return false;
        }
        let myIndex = roomHas(obj);
        playerInventory.push(playerLocation.items[myIndex]);
        playerLocation.items.splice(myIndex, 1);
        if (obj == 'key') specialEvents.hasDwarvenKey = true;
        write('You take the ' + obj + '.');
    } else {
        write('You don\'t see anything like that here.');
    }    
}

function moveWumpus(){

    previousLocation = wumpusLocation;
    wumpusLocation = wumpusLocation.exits[wumpusLocation.directions[Math.floor(Math.random() * wumpusLocation.directions.length)]];
    console.log(`The wumpus moves to ${wumpusLocation.name}`);
    if (wumpusLocation == playerLocation) {
        wumpusLocation = previousLocation;
    }

}

function handleCommand(userInput) {
    doSpecialEvent();
    if(userInput == 'quit'){
        return false;
    }else{
        let commandParts = userInput.split(' ');
        if (commandParts[0] in verbCommands) verbCommands[commandParts[0]](commandParts[1]);
        else write('I don\'t know how to "' + commandParts[0] + '"');
    }
}

function handleKeyDown(event){
    if (event.key === "Enter"){
        const userInput = document.getElementById("userInput").value;
        handleCommand(userInput);
        document.getElementById("userInput").value = "";
    }
}

