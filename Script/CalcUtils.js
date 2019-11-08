const ERRORSYNTAX = "SYNTAX ERROR";
const ERROROVERFLOW = "OVERFLOW";
let SYMBOLADDITION = "+";
let SYMBOLSUBTRACTION = "-";
let SYMBOLMULTIPLICATION = "x";
let SYMBOLDIVISION = "÷";
const SYMBOLEQUAL = "=";
const SYMBOLDECIMALPOINT = ".";

let Calc_isValidOperator = (op) => {
    return (op == SYMBOLADDITION || op == SYMBOLSUBTRACTION || op == SYMBOLDIVISION || op == SYMBOLMULTIPLICATION);
}

let Calc_isDecimalPoint = (char) => {
    return (char == SYMBOLDECIMALPOINT);
}

let Calc_computeOrder = (op) => {
    return Calc_isValidOperator(op) ? ((op == SYMBOLADDITION || op == SYMBOLSUBTRACTION) ? 1 : 2) : -1;
}

let Calc_hasHigherOrder = (op1, op2) => {
    return Calc_computeOrder(op1) >= Calc_computeOrder(op2);
}

let Calc_getNextNumber = (expr, end) => {

    let start = end;
    while (end < expr.length && !Calc_isValidOperator(expr[end])) {
        end++;
    }

    let num = parseFloat(expr.substring(start, end));
    return {
        value: num,
        index: end
    };    
}

let Calc_convertToPostfix = (expr) => {
    let n = expr.length;
    let i = 0;
    let postfix = [];
    let operatorStack = [];

    while (i < n) {

        if (Calc_isValidOperator(expr[i])) {
            if (expr[i] == SYMBOLSUBTRACTION && i == 0) {
                let obj = Calc_getNextNumber(expr, 1);
                postfix.push(-obj.value);
                i = obj.index;
                continue;
            } else if (operatorStack.length == 0 || !(Calc_hasHigherOrder(operatorStack[operatorStack.length - 1], expr[i]))) {
                operatorStack.push(expr[i]);
            } else {
                while (operatorStack.length > 0 && Calc_hasHigherOrder(operatorStack[operatorStack.length - 1], expr[i])) {
                    postfix.push(operatorStack.pop());
                }

                operatorStack.push(expr[i]);
            }

            i++;
        } else {
            let obj = Calc_getNextNumber(expr, i);
            if (obj.value == Infinity || obj.value == -Infinity) {
                return ERROROVERFLOW;
            }

            postfix.push(obj.value);
            i = obj.index;
        }
    }

    if (operatorStack.length != 0) {
        postfix = postfix.concat(operatorStack.reverse());
    }

    return postfix;
}

let Calc_computePostfix = (operands) => {

    let stack = [];
    let n = operands.length;
    let i = 0;

    while (i < n) {

        if (Calc_isValidOperator(operands[i])) {
            if (stack.length < 2) {
                return ERRORSYNTAX;
            }

            let operand1 = stack.pop();
            let operand2 = stack.pop();

            switch(operands[i]) {
                case SYMBOLADDITION:
                    stack.push(operand1 + operand2);
                    break;
                case SYMBOLSUBTRACTION:
                    stack.push(operand2 - operand1);
                    break;
                case SYMBOLMULTIPLICATION:
                    stack.push(operand1 * operand2);
                    break;
                case SYMBOLDIVISION:
                    stack.push(operand2 / operand1);
                    break;
            }
        } else {
            stack.push(operands[i]);
        }

        i++;
    }

    if (stack.length != 1) {
        return ERRORSYNTAX;
    }

    return stack[0];
}