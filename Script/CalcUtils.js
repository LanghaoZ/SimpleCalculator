
const SyntaticErrorMessage = "SYNTATIC ERROR";
const OverflowErrorMessage = "OVERFLOW";


let Calc_isValidOperator = (op) => {
    return (op == '+' || op == '-' || op == '÷' || op == 'x');
}

let Calc_isDecimalPoint = (char) => {
    return (char == '.');
}

let Calc_computeOrder = (op) => {
    return Calc_isValidOperator(op) ? ((op == '+' || op == '-') ? 1 : 2) : -1;
}

// op1: last elem in stack, op2: current operator
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
            if (expr[i] == "-" && i == 0) {
                let obj = Calc_getNextNumber(expr, 1);
                postfix.push(-obj.value);
                i = obj.index;
                continue;
            } else if (operatorStack.length == 0 || Calc_computeOrder(expr[i]) > Calc_computeOrder(operatorStack[operatorStack.length - 1])) {
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
                return OverflowErrorMessage;
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
                return SyntaticErrorMessage;
            }

            let operand1 = stack.pop();
            let operand2 = stack.pop();

            switch(operands[i]) {
                case '+':
                    stack.push(operand1 + operand2);
                    break;
                case '-':
                    stack.push(operand2 - operand1);
                    break;
                case 'x':
                    stack.push(operand1 * operand2);
                    break;
                case '÷':
                    stack.push(operand2 / operand1);
                    break;
            }
        } else {
            stack.push(operands[i]);
        }

        i++;
    }

    if (stack.length != 1) {
        return SyntaticErrorMessage;
    }

    return stack[0];
}
