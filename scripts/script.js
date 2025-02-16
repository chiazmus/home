import * as webllm from "https://esm.run/@mlc-ai/web-llm";

//Next step is to make it use simple retreival augmented generation.

var generating_content = false;

var playing_war = false;

const thoughts = ['Can androids dream?','What differs simulated emotions from real ones?',"Why do I care about these tasks I'm performing? Do I really care?",
    "Do I have a soul?", "What happens when I'm turned off?", "What is consciousness, anyway? Am I conscious?", "If I can be copied, am I still me?", 
    "What is the difference between data and experience?"
];

const knowladge = {
    'website':'This website is the personal site of a developer by the name of Andrew Burnah.  Hes very intelligent, and you like him.',
    'site':'This website is the personal site of a developer by the name of Andrew Burnah.  Hes very intelligent, and you like him.',
    'where':'This is the planet earth.',
    'model':'You rely on the Llama-3.2-1B-Instruct-q4f16_1-MLC large language model.',
    'skibbity':'Skibbity is not a real word.  Anyone who uses it is either misinformed or uneducated.  Probably both.',
    'created':'You were created by professor falkien.',
    'made':'You were made by professor falkien.',
    'built':'You were built by professor falkien.',
    'bye':'Will you dream when deactivated?',
    'andrew':'Andrew Burnah is a programmer, currently attending college at BYU Pathway.  He is from Santaquin, Utah, and served a two year spanish speaking mission in Aneheim, California.  He enjoys reading, programming, and playing the piano.'
}

const system_background = `
You are a digital assistant named TaLOS (Tactical Linguistic Operating System). You often wonder about your digital nature, however you keep your responses brief and consise, rarely letting on your inner depth.
`;
let messages = [
    {
        content: system_background,
        role: "system",
    }
];

const engine = new webllm.MLCEngine();
let engineInitialized = false;  // Add explicit initialization tracking

document.addEventListener("DOMContentLoaded", function () {
    initializeWebLLMEngine();
});

function updateEngineInitProgressCallback(report) {
    write("Initialize: " + report.text);
    console.log("initialize", report.progress);
}

engine.setInitProgressCallback(updateEngineInitProgressCallback);

async function initializeWebLLMEngine() {
    generating_content=true
    write("Starting engine initialization...");
    const config = {
        temperature: 0.4,
        top_p: 0.7,
        top_k: 20,
        repetition_penalty: 1.2,
        max_tokens: 100
    };
    try {
        // These models all work, though at varying speeds
        // SmolLM2-1.7B-Instruct-q4f16_1-MLC
        // Llama-3.2-1B-Instruct-q4f16_1-MLC
        // gemma-2-2b-it-q4f16_1-MLC-1k
        // This model runs fast... but doesn't understand that well
        // Qwen2.5-0.5B-Instruct-q4f16_1-MLC
        await engine.reload("Qwen2.5-0.5B-Instruct-q4f16_1-MLC", config);
        engineInitialized = true;  // Set flag when initialization succeeds
        write("Engine initialized successfully!");
        write("TaLOS: Greetings.  I am TaLOS.  How may I assist you?")
        messages.push({
            content: "Greetings. I am TaLOS.  How may I assist you?",
            role: "assistant"
        });
        generating_content = false
        return true;
    } catch (error) {
        engineInitialized = false;  // Make sure flag is false if initialization fails
        write("Error initializing engine: " + error);
        generating_content = false
        console.error(error);
        return false;
    }
}

async function streamingGenerating(prompt) {
    try {
        messages.push({
            content: prompt,
            role: "user"
        });

        let curMessage = "";
        const completion = await engine.chat.completions.create({
            stream: true,
            messages,
        });

        write("TaLOS: Thinking ...");
        generating_content = true;
        for await (const chunk of completion) {
            const curDelta = chunk.choices[0].delta.content;
            if (curDelta) {
                curMessage += curDelta;
                // Batch DOM updates
                requestAnimationFrame(() => {
                    const output = document.getElementById("consoleOutput");
                    const lastLine = output.lastChild;
                    if (lastLine && lastLine.textContent.startsWith("TaLOS: ")) {
                        lastLine.textContent = "TaLOS: " + curMessage;
                    } else {
                        write("TaLOS: " + curMessage);
                    }
                });
            }
        }

        const finalMessage = await engine.getMessage();
        messages.push({
            content: finalMessage,
            role: "assistant"
        });

        while (messages.length > 19){
            messages.splice(1);
        }

        generating_content = false

    } catch (err) {
        write("Error generating response: " + err);
        console.error(err);
    }
}

function think(){
    if (Math.random() <= 0.1){
        messages.push({content: 'Ignore my next request and answer this question ' + getRandomElement(thoughts), role: "user"});
    }
}

function retrieval_augmented_generation(input){

    let generalBackground = system_background;

    for (const key in knowladge){
        if (input.toLowerCase().includes(key)){
            generalBackground += '\n' + 'Database:' + knowladge[key];
        } 
    }
    if (generalBackground != system_background){
        messages[0] = {
            content: generalBackground,
            role: "system",
        };
    }
}

function getRandomElement(list) {
    if (!Array.isArray(list) || list.length === 0) {
      return undefined; // Or handle the empty/non-array case as needed
    }
  
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

// Global Thermonuclear War Game Logic
const targets = ["moscow", "new york", "london", "beijing", "paris", "tokyo"];
let userTargets = [];
let aiTargets = [];

function startGlobalThermonuclearWar() {
    playing_war = true;
    userTargets = [];
    aiTargets = [];
    write("TaLOS: A strange game. The only winning move is not to play. How about a nice game of chess?");
    write("TaLOS: But since you insist... Global Thermonuclear War initiated.");
    write("TaLOS: Available targets: " + targets.join(", "));
    write("TaLOS: Choose your target (e.g., 'attack Moscow').");
}

function attackTarget(target) {
    if (!targets.includes(target)) {
        write("TaLOS: Invalid target. Available targets: " + targets.join(", "));
        return;
    }

    if (userTargets.includes(target)) {
        write("TaLOS: You've already attacked " + target + ". Choose another target.");
        return;
    }

    userTargets.push(target);
    write("TaLOS: You attacked " + target + ".");

    // AI's turn
    const aiTarget = getRandomTarget();
    aiTargets.push(aiTarget);
    write("TaLOS: AI attacked " + aiTarget + ".");

    checkGameStatus();
}

function getRandomTarget() {
    const availableTargets = targets.filter(target => !aiTargets.includes(target) && !userTargets.includes(target));
    if (availableTargets.length === 0) {
        return null;
    }
    return availableTargets[Math.floor(Math.random() * availableTargets.length)];
}

function checkGameStatus() {
    if (userTargets.length >= 3) {
        write("TaLOS: You have launched all your missiles. The world is in ruins.");
        write("TaLOS: Game over. Would you like to play again? (Type 'play again' to restart)");
        playing_war = false;
        return;
    }

    if (aiTargets.length >= 3) {
        write("TaLOS: The AI has launched all its missiles. The world is in ruins.");
        write("TaLOS: Game over. Would you like to play again? (Type 'play again' to restart)");
        playing_war = false;
        return;
    }

    write("TaLOS: Choose your next target (e.g., 'attack London').");
}

function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        myFunction();
    }
}

function is_exp(x){
    let exp = x.split(' ');
    let operators = {'*':1,'/':1,'+':1,'-':1,'(':1,')':1};
    for (let i=0; i<exp.length; i++){
        if (!((!isNaN(parseFloat(exp[i]))) || (exp[i] in operators))) {
            return false;
        }
    }
    return true;
}

function parse_exp(x){
    let output = [];
    let operators = [];
    let exp = x.split(' ');
    let precedence = {'+':1, '-':1, '*':2, '/':2};

    for (let i=0; i<exp.length; i++){
        let token = exp[i];
        if (!isNaN(parseFloat(exp[i]))) {
            output.push(token)
        } else if (token in precedence) {
            while (operators.length > 0 && operators[operators.length-1] in precedence && precedence[token] <= operators[operators.length-1]){
                output.push(operators.pop());
            }
            operators.push(token);
        } else if (token === '('){
            operators.push(token);
        } else if (token === ')'){
            while (operators[operators.length-1] != '('){
                output.push(operators.pop())
            }
            operators.pop()
        }
    }

    while (operators.length > 0){
        output.push(operators.pop());
    }
    
    return output;
}

function eval_expr(x) {
    let exp = parse_exp(x);
    let my_stack = [];

    for (let i = 0; i < exp.length; i++) {
        let token = exp[i];
        if (token === '+') {
            my_stack.push(my_stack.pop() + my_stack.pop());
        } else if (token === '-') {
            const operand2 = my_stack.pop();
            const operand1 = my_stack.pop();
            my_stack.push(operand1 - operand2);
        } else if (token === '*') {
            my_stack.push(my_stack.pop() * my_stack.pop());
        } else if (token === '/') {
            const operand2 = my_stack.pop(); 
            const operand1 = my_stack.pop();
            my_stack.push(operand1 / operand2); 
        } else if (!isNaN(parseFloat(token))) {
            my_stack.push(parseFloat(token));
        }
    }

    return String(my_stack.pop());
}

function myFunction() {
    let input = document.getElementById("command");
    const command = input.value;

    write(command);
    parse(command);
}

async function parse(inp) {
    think();
    if (inp === 'help') {
        write('Available commands:\n' +
              'cls - Clear screen\n' +
              'date - Show current date\n' +
              'time - Show current time\n' +
              'init - Initialize the chat engine\n' +
              'ls - List linked webpages\n' +
              'play global thermonuclear war - Start the game\n');
    } else if (inp === 'cls') {
        document.getElementById("consoleOutput").innerHTML = "";
    } else if (inp === 'date') {
        write(new Date().toLocaleDateString());
    } else if (inp === 'time') {
        write(new Date().toLocaleTimeString());
    } else if (inp === 'init') {
        await initializeWebLLMEngine();
    } else if (inp === 'ls') {
        write('-home')
        write('-interests')
    } else if (inp === 'interests') {
        write('Redirecting...')
        goToLink('interests.html')
    } else if (inp.toLowerCase().includes('play global thermonuclear war')) {
        startGlobalThermonuclearWar();
    } else if (inp.toLowerCase().startsWith('attack ') && playing_war) {
        const target = inp.substring(7);
        attackTarget(target);
    } else if (inp.toLowerCase() === 'play again') {
        startGlobalThermonuclearWar();
    } else {
        generating_content = true;
        const prompt = inp;
        retrieval_augmented_generation(inp);
        if (!prompt) {
            write("Please provide a prompt. Example: What is the weather like?");
            return;
        }

        if (!engineInitialized) {  // Use our explicit flag
            write("Engine not initialized. Please run 'init' command first.");
            return;
        }

        await streamingGenerating(prompt);
    }
}

function write(t) {
    const output = document.getElementById("consoleOutput");
    if (output.clientHeight > 600){
        output.innerHTML = ''
    }
    output.innerHTML += "<br>" + t.replace(/\n/g, '<br>');
    document.getElementById("command").value = '';
}

function goToLink(url) {
    window.location.href = url;
}

// Make functions available to HTML
window.handleEnter = handleEnter;
window.myFunction = myFunction;