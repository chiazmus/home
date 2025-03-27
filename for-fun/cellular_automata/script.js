let simulationTypes = ['Game of Life', 'Brians Brain', 'Langtons Ant'];
let mySim = 0;
const simElement = document.getElementById('simulationType');
const switchSim = document.getElementById('switchSim');
const myCanvas = document.querySelector('canvas');
const ctx = myCanvas.getContext('2d');


simElement.innerHTML = simulationTypes[mySim];

switchSim.setAttribute("onclick", "changeSimulation()");

function changeSimulation(){
    if(mySim < simulationTypes.length -1){
        mySim++;
        simElement.innerHTML = simulationTypes[mySim];
        switchSim.setAttribute("onclick", "changeSimulation()");
    }else{
        mySim=0;
        simElement.innerHTML = simulationTypes[mySim];
        switchSim.setAttribute("onclick", "changeSimulation()");
    }
}

function runSimulation() {
    //Game of life
    if (simulationTypes[mySim] === 'Game of Life') {
        // Game of Life code here
        
    }

}