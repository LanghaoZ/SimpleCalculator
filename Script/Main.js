let _answerElement = Dom_getElementById("answer");
let _equalButtonElement = Dom_getElementById("eqbtn");
let _clearButtonElement = Dom_getElementById("acbtn");
let _currentAnswer = "0";
let _defaultAnswerDisplay = "0";
let _currentNumberHasDecimal = false;
let _hasErrorMessageShown = false;
let _hasEvaluated = false;
let _keyInputClassName = "keyval";
let _clickedClassName = "clicked";
let _clickEvent = "click";
let _mouseDownEvent = "mousedown";
let _mouseUpEvent = "mouseup";

let _init = () => {

    if (!_answerElement || !_equalButtonElement || !_clearButtonElement) {
        return;
    }

    _bindEvents();
}

let _bindEvents = () => {
    let keys = Dom_getElementsByClassName(document, _keyInputClassName);
    if (keys.length == 0) return;

    for (let i = 0; i < keys.length; i++) {
        if (Dom_getInnerText(keys[i]) != SYMBOLEQUAL) {
            Dom_addEventListener(keys[i], _clickEvent, _keyInputHandler);
        }

        Dom_addEventListener(keys[i], _mouseDownEvent, _keyMouseDownHandler);
    }

    Dom_addEventListener(_equalButtonElement, _clickEvent, _equalButtonHandler);
    Dom_addEventListener(_equalButtonElement, _mouseDownEvent, _keyMouseDownHandler);
    Dom_addEventListener(_clearButtonElement, _clickEvent, _clearButtonHandler);
    Dom_addEventListener(_clearButtonElement, _mouseDownEvent, _keyMouseDownHandler);
}

let _keyInputHandler = (evt) => {
    let key = Dom_getInnerText(evt.currentTarget);
    if (!key) return;

    if (Calc_isDecimalPoint(key)) {
        _processDecimalPointInput();
    } else if (Calc_isValidOperator(key)) {
        _processOperatorInput(key);
    } else {
        _processNumericInput(key);
    }

    _updateAnswerDisplay();
}

let _keyMouseDownHandler = (evt) => {
    Dom_addClass(evt.currentTarget, _clickedClassName);
    Dom_addEventListener(evt.currentTarget, _mouseUpEvent, _keyMouseUpHandler);
}

let _keyMouseUpHandler = (evt) => {
    Dom_removeClass(evt.currentTarget, _clickedClassName);
    Dom_removeEventListener(evt.currentTarget, _keyMouseUpHandler);
}

let _clearButtonHandler = (evt) => {
    _clearAnswerDisplay();
    _currentNumberHasDecimal = false;
}

let _equalButtonHandler = (evt) => {
    if (!_isLastInputOperator() && !_isLastInputDecimalPoint()) {
        let postfix = Calc_convertToPostfix(_currentAnswer);
        let answer = Calc_computePostfix(postfix);

        if (typeof(answer) == "string") {
            _clearAnswerDisplay(answer);
            _hasErrorMessageShown = true;
        } else if (!answer) {
            _clearAnswerDisplay(ERRORSYNTAX);
            _hasErrorMessageShown = true;
        } else {
            let answerText = answer.toString();
            if (_isNegative(answerText)) {
                answerText = answerText.substring(1, answerText.length);
                _currentAnswer = SYMBOLSUBTRACTION;
            } else {
                _currentAnswer = "";
            }

            if (answerText.length > 9 &&
                answerText.indexOf(SYMBOLDECIMALPOINT) != 9) {
                    answerText = _fixToNineDigits(answerText);
            }

            _currentAnswer = _currentAnswer + answerText;
            _hasEvaluated = true;
            _updateAnswerDisplay();
        }
    }
}

let _processDecimalPointInput = () => {
    if (!_currentNumberHasDecimal && !_isLastInputOperator()) {
        _currentAnswer += SYMBOLDECIMALPOINT;
        _currentNumberHasDecimal = true;
    }
}

let _processOperatorInput = (op) => {
    if (_isLastInputOperator()) {
        _setLastInput(op);
    } else if (!_hasErrorMessageShown) {
        _currentAnswer += op;
        _currentNumberHasDecimal = false;
        _hasEvaluated = false;
    }
}

let _processNumericInput = (num) => {
    if (_isDefaultDisplay() || _hasErrorMessageShown || _hasEvaluated) {
        _currentAnswer = num;
        _hasErrorMessageShown = false;
        _hasEvaluated = false;
    } else if (_isLastInputOperator() && _getLastInput() == SYMBOLDIVISION && num == '0') {
        return;
    } else {
        _currentAnswer += num;
    }
}

let _updateAnswerDisplay = () => {
    if (!_currentAnswer) return;
    Dom_setInnerText(_answerElement, _currentAnswer);
}

let _clearAnswerDisplay = (display= _defaultAnswerDisplay) => {
    _currentAnswer = display;
    _hasErrorMessageShown = false;
    _hasEvaluated = false;
    _updateAnswerDisplay();
}

let _setLastInput = (input) => {
    _currentAnswer = _currentAnswer.substring(0, _currentAnswer.length - 1) + input;
}

let _getLastInput = () => {
    return _currentAnswer.length > 0 ? _currentAnswer[_currentAnswer.length - 1] : "";
}

let _isLastInputOperator = () => {
    return (_currentAnswer.length > 0 && 
        !_isDefaultDisplay() && 
        Calc_isValidOperator(_getLastInput()))
}

let _isLastInputDecimalPoint = () => {
    return (_currentAnswer.length > 0 && 
        !_isDefaultDisplay() && 
        Calc_isDecimalPoint(_getLastInput()))
}

let _isDefaultDisplay = () => {
    return (_currentAnswer == _defaultAnswerDisplay)
}

let _isNegative = (input) => {
    return (input.length > 0 && input[0] == SYMBOLSUBTRACTION);
}

let _fixToNineDigits = (input) => {
    let index = input.indexOf(SYMBOLDECIMALPOINT);
    let value = input;

    if (index == -1 || index >= 9) {
        if (index == 9) {
            value = Math.round(parseFloat(value)).toString();
        }

        return _formatIntegers(value);
    }

    return _formatDecimals(value, index);
}

let _formatIntegers = (input) => {
    if (input.length == 9) return input;
    let powers = input.length - 1;
    let answer = input[0] + SYMBOLDECIMALPOINT + input.substring(1, 10);
    answer = parseFloat(answer).toFixed(8).toString();
    if (answer.indexOf(SYMBOLDECIMALPOINT) == 2) {
        powers += 1;
        answer = answer[0] + SYMBOLDECIMALPOINT + answer[1] + answer.substring(3, answer.length);
    }

    return answer + "x10^" + powers.toString();
}

let _formatDecimals = (input, index) => {
    let value = parseFloat(input).toFixed(9 - index);
    if (value - "0" == 0) {
        return "0";
    }

    if (value.length != 10) {
        value = parseFloat(value).toFixed(9 - index - 1);
    }

    return value;
}

_init();