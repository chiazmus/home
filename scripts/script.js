const commandInput = document.getElementById("command")
let output = document.getElementById("consoleOutput");
let variables = {'a':12};
let functions = {};

function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        runTerminal();
    }
}

function runTerminal() {
    let inp = commandInput.value.trim();
    if (inp === "projects") {
        window.location.href = "projects.html";
    } else if (inp === "interests") {
        window.location.href = "interests.html";
    } else if (inp === "help") {
        output.innerHTML += "<br>help<br>Available commands: projects, interests, help";
    } else {
        let result = doCommand(inp);
        output.innerHTML += "<br>" + inp + "<br>" + result;
    }
    if (inp !== "") {
        commandInput.value = ""; // Clear the input field
    }
}

function doCommand(command) {
    // <expression> ::= <term> { '+' | '-' <expression> }
    // <term> ::= <factor> { '*' | '/' <term> }
    // <factor> ::= NUMBER | <variable> | '(' <expression> ')' | <function> | <if statement>
    // <assignment> ::= 'let' <variable> '=' <expression>
    // <function declaration> ::= 'function' <variable> '(' <variable> { <variable> ... } ')' '=' <expression>

    let factor = (input, vars) => {
        if (isNaN(input[0]) && input[0] in vars) {
            return [vars[input[0]], input.slice(1)];
        } else if (isNaN(input[0]) && (input[0] in functions)) {
            let funcName = input[0];
            let args = [];
            let nextarg = term(input.slice(1), vars);

            while (args.length < functions[funcName].args.length-1 && nextarg[0] !== null) {
                args.push(nextarg[0]);
                nextarg = term(nextarg[1], vars);
            }
            args.push(nextarg[0]);

            return [doFunc(funcName, args), nextarg[1]];
        } else if (input[0] === '(') {
            let [value, rest] = expr(input.slice(1), vars);
            if (rest[0] === ')') {
                return [value, rest.slice(1)];
            } else {
                return [null, input];
            }
        } else if (input[0] === 'if') {
            let [value, rest] = ifStatement(input, vars);
            if (value !== null) {
                return [value, rest];
            } else {
                return [null, input];
            }
        } else if (!isNaN(input[0])) {
            return [input[0], input.slice(1)];
        }

        return [0, input];
    };

    let term = (input, vars) => {
        let [value, rest] = factor(input, vars);
        if (value !== null) {
            if (rest[0] === '*' || rest[0] === '/') {
                let operator = rest[0];
                let [nextValue, nextRest] = term(rest.slice(1), vars);
                if (operator === '*') {
                    return [Number(value) * Number(nextValue), nextRest];
                } else if (operator === '/') {
                    return [Number(value) / Number(nextValue), nextRest];
                }
            }
            return [value, rest];
        }
        return [null, input];
    };

    let expr = (input, vars) => {
        let [value, rest] = term(input, vars);
        if (value !== null) {
            if (rest[0] === '+' || rest[0] === '-') {
                let operator = rest[0];
                let [nextValue, nextRest] = expr(rest.slice(1), vars);
                if (operator === '+') {
                    return [Number(value) + Number(nextValue), nextRest];
                } else if (operator === '-') {
                    return [Number(value) - Number(nextValue), nextRest];
                }
            }
            return [value, rest];
        }
        return [null, input];
    };

    let condition = (input, vars) => {
        // <condition> ::= <expression> <comparison operator> <expression>
        let expr1 = expr(input, vars);
        let operator = expr1[1][0];
        let expr2 = expr(expr1[1].slice(1), vars);

        if (expr1[0] !== null && expr2[0] !== null) {
            if (operator === '==') {
                return [expr1[0] == expr2[0] ? 1 : 0, expr2[1]];
            } else if (operator === '!=') {
                return [expr1[0] != expr2[0] ? 1 : 0, expr2[1]];
            } else if (operator === '<') {
                return [expr1[0] < expr2[0] ? 1 : 0, expr2[1]];
            } else if (operator === '>') {
                return [expr1[0] > expr2[0] ? 1 : 0, expr2[1]];
            }
        }

        return [null, input]

    };

    let doFunc = (funcName, args) => {
        if (functions[funcName]) {
            let tempVars = {};
            for (let i = 0; i < functions[funcName].args.length; i++) {
                tempVars[functions[funcName].args[i]] = args[i];
            }
            let funcBody = functions[funcName].body;
            let myExpr = expr(funcBody, tempVars);
            return myExpr[0];
        }
        return null;
    };

    let ifStatement = (input, vars) => {
        //<if> ::= if <condition> then <expression> else <expression>
        let cond = condition(input.slice(1), vars);
        if (cond[0] !== null && cond[0] == 1) {
            let thenIndex = cond[1].indexOf('then');
            if (thenIndex !== -1) {
                return expr(cond[1].slice(thenIndex + 1), vars);
            }
        } else if (cond[0] !== null && cond[0] == 0) {
            let elseIndex = cond[1].indexOf('else');
            if (elseIndex !== -1) {
                return expr(cond[1].slice(elseIndex + 1), vars);
            }
        }

        return [null, input];
    };

    let tokens = command.split(" ");

    if (tokens[0] == 'let' && isNaN(tokens[1]) && tokens[2] == '=') {
        let result = expr(tokens.slice(3), variables);
        if (result[0] !== null) {
            variables[tokens[1]] = result[0];
            return result[0];
        }
    } else if (tokens[0] === 'function' && isNaN(tokens[1])) {
        if (tokens[2] === '(') {
            let funcName = tokens[1];
            let args = [];
            let i = 3;

            while (tokens[i] !== ')') {
                if (isNaN(tokens[i])) {
                    args.push(tokens[i]);
                }
                i++;
            }

            if (tokens[i] === ')') {
                let funcBody = tokens.slice(i + 2);
                functions[funcName] = { args: args, body: funcBody };
                return `Function ${funcName}; Args: ${args.join(", ")}`;
            }
        }
    } else {
        result = expr(tokens, variables);
        if (result[0] !== null) {
            return result[0];
        }
    }

    return "invalid expression";
}