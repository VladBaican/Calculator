$(document).ready(function() {
  var stack = [];
  var resultValue;

  var keysMap = {
    'ac': 'Escape',
    'c': 'Escape'
  };

  function init() {
    $('.calculatorCt').on('click', '.button', function() {
      onButtonClick($(this));
    });

    $(document).on('keydown', function(event) {
      onKeyDown(event);
    });

    $(document).on('keyup', function(event) {
      onKeyUp(event);
    });
  }

  function onKeyDown(event) {
    $('.button').each(function() {
      var button = $(this);

      if (event.key == getButtonKeyCode(button)) {
        button.addClass('active');
        button.click();
      }
    });
  }

  function onKeyUp(event) {
    $('.button').each(function() {
      var button = $(this);
      button.removeClass('active');
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
    var isDecimal = 0 === stack.length ? false : checkIfDecimal(stack[stack.length - 1]);

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
  }

  function onOperationButtonClick(button) {
    var buttonValue = button.data('value');

    switch (buttonValue) {
      case '+':
      case '-':
        onTypeIOperationButtonClick(button, buttonValue);
        break;
      case '*':
      case '/':
        onTypeIIOperationButtonClick(button, buttonValue);
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

    if (button.hasClass('decimalBtn')) {
      onDecimalButtonClick();
    }

    if (button.hasClass('procentBtn')) {
      onProcentButtonClick();
    }

    if (button.hasClass('signBtn')) {
      onSignButtonClick();
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
      case 5:
        num3 = stack.pop();
        op2 = stack.pop();
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();

        res = executeOperation(num2, op2, num3);
        resultValue = executeOperation(num1, op1, res);
        stack.push(resultValue);
        stack.push(operation);
    }
  }

  function onTypeIIOperationButtonClick(button, operation) {
    var num1, op1, num2;
    switch (stack.length) {
      case 1:
        stack.push(operation);
        break;
      case 2: case 4:
        stack.pop();
        stack.push(operation);
        break;
      case 3:
        if('*' === stack[1] || '/' === stack[1]) {
          num2 = stack.pop();
          op1 = stack.pop();
          num1 = stack.pop();
          resultValue = executeOperation(num1, op1, num2);
          stack.push(resultValue);
          stack.push(operation);
        }
        else {
          stack.push(operation);
        }
        break;
      case 5:
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();
        resultValue = executeOperation(num1, op1, num2);
        stack.push(resultValue);
        stack.push(operation);
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
      case 5:
        num3 = stack.pop();
        op2 = stack.pop();
        num2 = stack.pop();
        op1 = stack.pop();
        num1 = stack.pop();

        res = executeOperation(num2, op2, num3);
        resultValue = executeOperation(num1, op1, res);
        stack.push(resultValue);
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

  function onDecimalButtonClick() {
    switch (stack.length) {
      case 0:
      case 2:
      case 4:
        res = 0;
        stack.push(res + '.');
        resultValue = res + '.';
        break;
      case 1:
      case 3:
      case 5:
        if (!checkIfDecimal($('.resultCt').text())) {
          num = stack.pop();
          stack.push(num + '.');
          resultValue = num + '.';
        }
        break;
    }
  }

  function onProcentButtonClick() {
    switch (stack.length) {
      case 1:
      case 3:
      case 5:
        num1 = stack.pop();
        num1 /= 100;
        stack.push(num1);
        resultValue = num1;
        break;
    }
  }

  function onSignButtonClick() {
    var num1;

    switch (stack.length) {
      case 1:
      case 3:
      case 5:
        num1 = stack.pop();

        if (num1 < 0) {
          num1 = Math.abs(num1);
        }
        else {
          num1 = num1 - num1 * 2;
        }

        stack.push(num1);
        resultValue = num1;
        break;
    }
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
        return num1 * num2;
      case '/':
        return num1 / num2;
    }
  }

  function checkIfDecimal(num) {
    return -1 !== num.toString().indexOf('.');
  }

  function getButtonKeyCode(button) {
    return keysMap[button.data('value')] || button.data('value');
  }

  // Initialize
  init();
});
