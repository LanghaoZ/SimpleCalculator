let _answerElement = Dom_getElementById("answer");
let _equalButtonElement = Dom_getElementById("eqbtn");
let _clearButtonElement = Dom_getElementById("acbtn");
let _currentAnswer = "0";
let _defaultAnswerDisplay = "0";
let _currentNumberHasDecimal = false;
let _hasErrorMessageShown = false;
let _keyInputClassName = "keyval";
let _clickedClassName = "clicked";
let _clickEvent = "click";
let _mouseDownEvent = "mousedown";
let _mouseUpEvent = "mouseup";
let _additionSymbol = "+";
let _subtractionSymbol = "-";
let _multiplicationSymbol = "x";
let _divisionSymbol = "÷";
let _equalSymbol = "=";
let _decimalPointSymbol = ".";

let init = () => {

    if (!_answerElement || !_equalButtonElement || !_clearButtonElement) {
        return;
    }

    bindEvents();
}

let bindEvents = () => {
    let keys = Dom_getElementsByClassName(document, _keyInputClassName);
    if (keys.length == 0) return;

    for (let i = 0; i < keys.length; i++) {
        if (Dom_getInnerText(keys[i]) != _equalSymbol) {
            Dom_addEventListener(keys[i], _clickEvent, keyInputHandler);
        }

        Dom_addEventListener(keys[i], _mouseDownEvent, keyMouseDownHandler);
    }

    Dom_addEventListener(_equalButtonElement, _clickEvent, equalButtonHandler);
    Dom_addEventListener(_equalButtonElement, _mouseDownEvent, keyMouseDownHandler);
    Dom_addEventListener(_clearButtonElement, _clickEvent, clearButtonHandler);
    Dom_addEventListener(_clearButtonElement, _mouseDownEvent, keyMouseDownHandler);
}

let keyInputHandler = (evt) => {
    let key = Dom_getInnerText(evt.currentTarget);
    if (!key) return;

    if (Calc_isDecimalPoint(key)) {
        processDecimalPointInput();
    } else if (Calc_isValidOperator(key)) {
        processOperatorInput(key);
    } else {
        processNumericInput(key);
    }

    updateAnswerDisplay();
}

let keyMouseDownHandler = (evt) => {
    Dom_addClass(evt.currentTarget, _clickedClassName);
    Dom_addEventListener(evt.currentTarget, _mouseUpEvent, keyMouseUpHandler);
}

let keyMouseUpHandler = (evt) => {
    Dom_removeClass(evt.currentTarget, _clickedClassName);
    Dom_removeEventListener(evt.currentTarget, keyMouseUpHandler);
}

let clearButtonHandler = (evt) => {
    clearAnswerDisplay();
    _currentNumberHasDecimal = false;
}

let equalButtonHandler = (evt) => {
    if (!isLastInputOperator() && !isLastInputDecimalPoint()) {
        let postfix = Calc_convertToPostfix(_currentAnswer);
        let answer = Calc_computePostfix(postfix);

        if (typeof(answer) == "string") {
            clearAnswerDisplay(answer);
            _hasErrorMessageShown = true;
        } else if (!answer) {
            clearAnswerDisplay(SyntaticErrorMessage);
            _hasErrorMessageShown = true;
        } else {

            let answerText = answer.toString();
            if (answerText.length > 0 && answerText[0] == _subtractionSymbol) {
                answerText = answerText.substring(1, answerText.length);
                _currentAnswer = _subtractionSymbol;
            } else {
                _currentAnswer = "";
            }

            if (answerText.length > 9 &&
                answerText.indexOf(_decimalPointSymbol) != 9) {
                    answerText = fixToNineDigits(answerText);
            }

            _currentAnswer = _currentAnswer + answerText;
            updateAnswerDisplay();
        }
    }
}

let processDecimalPointInput = () => {
    if (!_currentNumberHasDecimal && !isLastInputOperator()) {
        _currentAnswer += _decimalPointSymbol;
        _currentNumberHasDecimal = true;
    }
}

let processOperatorInput = (op) => {
    if (isLastInputOperator()) {
        setLastInput(op);
    } else if (!_hasErrorMessageShown) {
        _currentAnswer += op;
        _currentNumberHasDecimal = false;
    }
}

let processNumericInput = (num) => {
    if (isDefaultDisplay() || _hasErrorMessageShown) {
        _currentAnswer = num;
        _hasErrorMessageShown = false;
    } else if (isLastInputOperator() && getLastInput() == _divisionSymbol && num == '0') {
        return;
    } else {
        _currentAnswer += num;
    }
}

let updateAnswerDisplay = () => {
    if (!_currentAnswer) return;
    Dom_setInnerText(_answerElement, _currentAnswer);
}

let clearAnswerDisplay = (display= _defaultAnswerDisplay) => {
    _currentAnswer = display;
    _hasErrorMessageShown = false;
    updateAnswerDisplay();
}

let isLastInputOperator = () => {
    return (_currentAnswer.length > 0 && 
        !isDefaultDisplay() && 
        Calc_isValidOperator(getLastInput()))
}

let isLastInputDecimalPoint = () => {
    return (_currentAnswer.length > 0 && 
        !isDefaultDisplay() && 
        Calc_isDecimalPoint(getLastInput()))
}

let isDefaultDisplay = () => {
    return (_currentAnswer == _defaultAnswerDisplay)
}

let setLastInput = (input) => {
    _currentAnswer = _currentAnswer.substring(0, _currentAnswer.length - 1) + input;
}

let getLastInput = () => {
    return _currentAnswer.length > 0 ? _currentAnswer[_currentAnswer.length - 1] : "";
}

let fixToNineDigits = (input) => {
    let index = input.indexOf(_decimalPointSymbol);
    let value = input;

    if (index == -1 || index >= 9) {
        if (index == 9) {
            value = Math.round(parseFloat(value)).toString();
        }

        return formatIntegers(value);
    }

    return formatDecimals(value, index);
}

let formatIntegers = (input) => {
    if (input.length == 9) return input;
    let powers = input.length - 1;
    let answer = input[0] + _decimalPointSymbol + input.substring(1, 10);
    answer = parseFloat(answer).toFixed(8).toString();
    if (answer.indexOf(_decimalPointSymbol) == 2) {
        powers += 1;
        answer = answer[0] + _decimalPointSymbol + answer[1] + answer.substring(3, answer.length);
    }

    return answer + "x10^" + powers.toString();
}

let formatDecimals = (input, index) => {
    let value = parseFloat(input).toFixed(9 - index);
    if (value - "0" == 0) {
        return "0";
    }

    if (value.length != 10) {
        value = parseFloat(value).toFixed(9 - index - 1);
    }

    return value;
}

init();