
let _answerElement = Dom_getElementById("answer");
let _equalButtonElement = Dom_getElementById("eqbtn");
let _clearButtonElement = Dom_getElementById("acbtn");
let _currentAnswer = "0";
let _defaultAnswerDisplay = "0";
let _currentNumberHasDecimal = false;
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

// init();

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

    _currentAnswer += key;
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

}

let updateAnswerDisplay = () => {
    if (!_currentAnswer) return;
    Dom_setInnerText(_answerElement, _currentAnswer);
}

let clearAnswerDisplay = () => {
    _currentAnswer = _defaultAnswerDisplay;
    updateAnswerDisplay();
}

let isDefaultDisplay = () => {
    return (_currentAnswer == _defaultAnswerDisplay)
}

let calculateResults = () => {

}