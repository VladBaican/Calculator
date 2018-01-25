$(document).ready(function() {
  var stack = [];
  var resultValue;

  function init() {
    $('.calculatorCt').on('click', '.button', function() {
      onButtonClick($(this));
    });
  }

  function onButtonClick(button) {
    if (!button.hasClass('clearBtn')) {
      updateClearButtonState();
    }

    if (button.hasClass('numberBtn')) {
      onNumericButtonClick(button);
    }

    if (button.hasClass('operationBtn')) {
      onOperationButtonClick(button);
    }

    if (button.hasClass('functionBtn')) {
      onFunctionButtonClick(button);
    }

    $('.resultCt').text(resultValue);
  }

  function onNumericButtonClick(button) {
    var buttonValue = +(button.data('value'));

    switch (stack.length) {
      case 0:
      case 2:
        stack.push(buttonValue);
        resultValue = buttonValue;
        break;
      case 1:
      case 3:
        resultValue = +(stack.pop());
        resultValue = resultValue * 10 + buttonValue;
        stack.push(resultValue);
        break;
    }
  }

  function onOperationButtonClick(button) {
    var buttonValue = button.data('value');

    switch (buttonValue) {
      case '+':
      case '-':
        onTypeIOperationButtonClick(button, buttonValue);
        break;
      case '=':
        onEqualButtonClick();
        break;
    }
  }

  function onFunctionButtonClick(button) {
    if (button.hasClass('clearBtn')) {
      onClearButtonClick(button);
    }
  }

  function onTypeIOperationButtonClick(button, operation) {
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
        resultValue = executeOperation(num1, op1, num2);
        stack.push(resultValue);
        stack.push(operation);
        break;
    }
  }

  function onEqualButtonClick() {
    var num1, op1, num2;

    switch (stack.length) {
      case 2:
        op1 = stack.pop();
        num1 = stack.pop();
        resultValue = executeOperation(num1, op1, num1);
        stack.push(resultValue);
        break;
      case 3:
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();
        resultValue = executeOperation(num1, op1, num2);
        stack.push(resultValue);
        break;
    }
  }

  function onClearButtonClick(button) {
    if ('c' !== button.data('value')) {
      return;
    }

    stack = [];
    button.text('AC');
    button.data('value', 'ac');
    resultValue = 0;
  }

  function updateClearButtonState() {
    $('.clearBtn')
      .text('C')
      .data('value', 'c');
  }

  function executeOperation(num1, op, num2) {
    num1 = +num1;
    num2 = +num2;

    switch (op) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num * num2;
      case '/':
        return num1 / num2;
    }
  }

  // Initialize
  init();
});
