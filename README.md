
# Simple Calculator
## Overview
This is a naive implementation of a calculator. The basic design is to record down user input, which would be translated to postfix notation for evaluation once the user hits the `=` button. It supports the following operations:
* Add Two Numbers (e.g. 1+1)
* Subtract Two Numbers (e.g. 2-1)
* Multiply Two Numbers (e.g. 1x2)
* Divide Two Numbers (e.g. 4÷2)
* Clear the Current Screen (The `AC` Button)

There are some points of notice:
1. The number of digits in the evaluated result will be at most 9. If the result has more than 9 digits, the 9th digit will be rounded.
2. If the user inputs an operator while having the previous input being an operator, the old operator will be replaced by the newly input operator.
3. If the result is beyond the range of the Number type in JavaScript, an **Overflow** error message will be displayed.

## Project Layout
This project contains a total of 6 files:
* **CalcUtils.js**: This JavaScript file contains all constant variables and methods used in the evaluation and computation of the user input expression. All methods start with `Calc_` followed by the self-descriptive name of the method (e.g. `Calc_convertToPostfix`, which converts the user input to postfix notation).
* **DomUtils.js**: This JavaScript contains a list of wrapper methods to perform operation on the DOM tree. All methods start with `Dom_` followed by the self-descriptive name of the method (e.g. `Dom_addClass` which takes two parameters: a classname and an element, and adds the class to the element).
* **Main.js**: This JavaScript file contains the actual implementation of the calculator. It references both `CalcUtils.js` and `DomUtils.js` files. All global variables and methods declared in `Main.js` begins with the underscore line `_` (e.g. `_currentAnswer` which keeps track of the current content displayed on the calculator's screen).
* **SimpleCalc.html**: This HTML file contains the layout of the calculator.
* **SimpleCalc.css**: This CSS file contains the styling of the calculator.
* **README.md**: This file, which contains the documentation of the project.

