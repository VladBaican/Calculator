/**
 * Calculator.
 *
 * @class
 *
 * @param {DOMElement} container
 * @param {object}     options
 */
function Calculator(container, options) {
  var self = this;

  /**
   * @prop {DOMElement}
   */
  this.container = container;

  /**
   * @prop {object}
   */
  this.options = options || {};

  /**
   * @prop {array}
   */
   this.stack = [];

   /**
    * @prop {string}
    */
   this.resultValue;

   /**
    * @prop {object}
    */
   this.keysMap = {
     'ac': 'Escape',
     'c': 'Escape',
     'Enter': '='
   };

  /**
   * Initialize.
   *
   * @return {Calculator}
   */
  this.init = function() {
    return this;
  };

  /**
   * Create the dependencies.
   *
   */
  this.create = function() {
    return this.registerEventListeners();
  };

  /**
   * Register the event listeners.
   *
   * @return {Calculator}
   */
  this.registerEventListeners = function() {
    this.container.on('click', '.button', function() {
      self.onButtonClick($(this));
    });

    $(document).on('keydown', function(event) {
      self.onKeyDown(event);
    });

    $(document).on('keyup', function(event) {
      self.onKeyUp(event);
    });

    return this;
  };

  /**
   * Button click event handler.
   *
   * @param {DOMElement} button
   */
  this.onButtonClick = function(button) {
    if (!button.hasClass('clearBtn')) {
      this.updateClearButtonState();
    }

    if (button.hasClass('numberBtn')) {
      this.onNumericButtonClick(button);
    }

    if (button.hasClass('operationBtn')) {
      this.onOperationButtonClick(button);
    }

    if (button.hasClass('functionBtn')) {
      this.onFunctionButtonClick(button);
    }

    $('.resultCt').text(this.resultValue);
  };

  /**
   * Update clear button state.
   */
  this.updateClearButtonState = function() {
    $('.clearBtn')
      .text('C')
      .data('value', 'c');

    return this;
  };

  /**
   * Numeric button click event handle.
   *
   * @param {DOMElement} button
   */
  this.onNumericButtonClick = function(button) {
    var stack = this.stack;
    var buttonValue = +(button.data('value'));
    var isDecimal = 0 === stack.length ? false : this.checkIfDecimal(stack[stack.length - 1]);
    var num1;
    var resultValue;

    if (!isDecimal) {
      switch (stack.length) {
        case 0:
        case 2:
        case 4:
          stack.push(buttonValue);
          resultValue = buttonValue;
          break;
        case 1:
        case 3:
        case 5:
          resultValue = +(stack.pop());
          resultValue = resultValue * 10 + buttonValue;
          stack.push(resultValue);
          break;
      }
    } else {
      num1 = stack.pop();
      resultValue = '' + num1 + buttonValue;
      stack.push(resultValue);
    }

    this.resultValue = resultValue;
  };

  /**
   * Operation button click event handler.
   *
   * @param {DOMElement} button
   */
  this.onOperationButtonClick = function(button) {
    var buttonValue = button.data('value');

    switch (buttonValue) {
      case '+':
      case '-':
        this.onTypeIOperationButtonClick(button, buttonValue);
        break;
      case '*':
      case '/':
        this.onTypeIIOperationButtonClick(button, buttonValue);
        break;
      case '=':
        this.onEqualButtonClick();
        break;
    }
  };

  /**
   * + and - buttons click event handler.
   *
   * @param {DOMElement} button
   * @param {string} operation
   */
  this.onTypeIOperationButtonClick = function(button, operation) {
    var stack = this.stack;
    var resultValue;
    var num1, op1, num2;

    switch (stack.length) {
      case 1:
        stack.push(operation);
        break;
      case 2:
        stack.pop();
        stack.push(operation);
        break;
      case 3:
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();
        resultValue = this.executeOperation(num1, op1, num2);
        stack.push(resultValue);
        stack.push(operation);
        break;
      case 5:
        num3 = stack.pop();
        op2 = stack.pop();
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();

        res = this.executeOperation(num2, op2, num3);
        resultValue = this.executeOperation(num1, op1, res);
        stack.push(resultValue);
        stack.push(operation);
    }

    this.resultValue = resultValue;
  };

  /**
   * * and / buttons click event handler.
   *
   * @param {DOMElement} button
   * @param {string} operation
   */
  this.onTypeIIOperationButtonClick = function(button, operation) {
    var stack = this.stack;
    var resultValue;
    var num1, op1, num2;

    switch (stack.length) {
      case 1:
        stack.push(operation);
        break;
      case 2:
      case 4:
        stack.pop();
        stack.push(operation);
        break;
      case 3:
        if('*' === stack[1] || '/' === stack[1]) {
          num2 = stack.pop();
          op1 = stack.pop();
          num1 = stack.pop();
          resultValue = this.executeOperation(num1, op1, num2);
          stack.push(resultValue);
          stack.push(operation);
        } else {
          stack.push(operation);
        }
        break;
      case 5:
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();
        resultValue = this.executeOperation(num1, op1, num2);
        stack.push(resultValue);
        stack.push(operation);
    }

    this.resultValue = resultValue;
  };

  /**
   * Equal button click event handler.
   */
  this.onEqualButtonClick = function() {
    var stack = this.stack;
    var resultValue;
    var num1, op1, num2, op2, num3;

    switch (stack.length) {
      case 2:
        op1 = stack.pop();
        num1 = stack.pop();
        resultValue = this.executeOperation(num1, op1, num1);
        stack.push(resultValue);
        break;
      case 3:
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();
        resultValue = this.executeOperation(num1, op1, num2);
        stack.push(resultValue);
        break;
      case 5:
        num3 = stack.pop();
        op2 = stack.pop();
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();

        res = this.executeOperation(num2, op2, num3);
        resultValue = this.executeOperation(num1, op1, res);
        stack.push(resultValue);
    }

    this.resultValue = resultValue;
  };

  /**
   * Function button click event handler.
   *
   * @param {DOMElement} button
   */
  this.onFunctionButtonClick = function(button) {
    if (button.hasClass('clearBtn')) {
      this.onClearButtonClick(button);
    }

    if (button.hasClass('decimalBtn')) {
      this.onDecimalButtonClick();
    }

    if (button.hasClass('procentBtn')) {
      this.onProcentButtonClick();
    }

    if (button.hasClass('signBtn')) {
      this.onSignButtonClick();
    }
  };

  /**
   * Clear button click event handler.
   *
   * @param {DOMElement} button
   */
  this.onClearButtonClick = function(button) {
    if ('c' !== button.data('value')) {
      return;
    }

    this.stack = [];
    button.text('AC');
    button.data('value', 'ac');
    this.resultValue = 0;
  };

  /**
   * Decimal button click event handler.
   */
  this.onDecimalButtonClick = function() {
    var stack = this.stack;
    var res, num;
    
    switch (stack.length) {
      case 0:
      case 2:
      case 4:
        res = 0;
        stack.push(res + '.');
        this.resultValue = res + '.';
        break;
      case 1:
      case 3:
      case 5:
        if (!this.checkIfDecimal($('.resultCt').text())) {
          num = stack.pop();
          stack.push(num + '.');
          this.resultValue = num + '.';
        }
        break;
    }
  };

  /**
   * Procent button click event handler.
   */
  this.onProcentButtonClick = function() {
    var stack = this.stack;
    var num1;

    switch (stack.length) {
      case 1:
      case 3:
      case 5:
        num1 = stack.pop();
        num1 /= 100;
        stack.push(num1);
        this.resultValue = num1;
        break;
    }
  };

  /**
   * Sign button click event handler.
   */
  this.onSignButtonClick = function() {
    var stack = this.stack;
    var num1;

    switch (stack.length) {
      case 1:
      case 3:
      case 5:
        num1 = stack.pop();

        num1 < 0 ? num1 = Math.abs(num1) : num1 = num1 - num1 * 2;

        stack.push(num1);
        this.resultValue = num1;
        break;
    }
  };

  /**
   * Keydown event handler.
   *
   * @param {object} event
   */
  this.onKeyDown = function(event) {
    $('.button').each(function() {
      var button = $(this);
      if (event.key == self.getButtonKeyCode(button)) {
        button.addClass('active');
        button.click();
      }
    });
  };

  /**
   * Keyup event handler.
   *
   * @param {object} event
   */
  this.onKeyUp = function(event) {
    $('.button').each(function() {
      var button = $(this);
      button.removeClass('active');
    });
  };

  /**
   * Execute an operation beetween two numbers.
   *
   * @param {DOMElement} button
   * @param {number} num1 The first number.
   * @param {string} op The operation to be executed.
   * @param {number} num2 The second number.
   *
   */
  this.executeOperation = function(num1, op, num2) {
    num1 = +num1;
    num2 = +num2;

    switch (op) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return num1 / num2;
    }
  };

  /**
   * Check if number(num) is decimal.
   *
   * @param {number} num
   * @return {boolean}
   */
  this.checkIfDecimal = function(num) {
    return -1 !== num.toString().indexOf('.');
  };

  /**
   * Get the key from the button.
   *
   * @param {DOMElement} button
   * @return {string}
   */
  this.getButtonKeyCode = function(button) {
    return this.keysMap[button.data('value')] || button.data('value');
  };

  // Initialize
  this.init();
}
