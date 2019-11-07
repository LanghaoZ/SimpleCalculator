
const SyntaticErrorMessage = "SYNTATIC ERROR";
const OverflowErrorMessage = "OVERFLOW";


let isValidOperator = (op) => {
    return (op == '+' || op == '-' || op == '/' || op == '*');
}

let computeOrder = (op) => {
    return isValidOperator(op) ? ((op == '+' || op == '-') ? 1 : 2) : -1;
}

// op1: last elem in stack, op2: current operator
let hasHigherOrder = (op1, op2) => {
    return computeOrder(op1) >= computeOrder(op2);
}

let nextNumber = (expr, end) => {

    let start = end;
    while (end < expr.length && !isValidOperator(expr[end])) {
        end++;
    }

    let num = parseFloat(expr.substring(start, end));
    return {
        value: num,
        index: end
    };    
}

let convertToPostfix = (expr) => {
    let n = expr.length;
    let i = 0;
    let postfix = [];
    let operatorStack = [];

    while (i < n) {

        if (isValidOperator(expr[i])) {
            if (operatorStack.length == 0 || computeOrder(expr[i]) > computeOrder(operatorStack[operatorStack.length - 1])) {
                operatorStack.push(expr[i]);
            } else {
                while (operatorStack.length > 0 && hasHigherOrder(operatorStack[operatorStack.length - 1], expr[i])) {
                    postfix.push(operatorStack.pop());
                }

                operatorStack.push(expr[i]);
            }

            i++;
        } else {
            let obj = nextNumber(expr, i);
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

let computePostfix = (operands) => {

    let stack = [];
    let n = operands.length;
    let i = 0;

    while (i < n) {

        if (isValidOperator(operands[i])) {
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
                case '*':
                    stack.push(operand1 * operand2);
                    break;
                case '/':
                    stack.push(operand2 / operand1);
                    break;
            }
        } else {
            stack.push(operands[i]);
        }

        i++;
    }

    if (stack.length != 1) {
        console.log("Bad 3");
        return;
    }

    return stack[0];
}

