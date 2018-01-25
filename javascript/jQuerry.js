
var stack = [];

function isNumeric(num){
  return !isNaN(num)
}

function operation(num1, op, num2) {
  num1 = +num1;
  num2 = +num2;
  if( op == "+" )
    return num1+num2;
  if( op == "-" )
    return num1-num2;
  if( op == "*" )
    return num1*num2;
  if( op == "/" )
    return num1/num2;
}


$(document).ready(function() {

  var keys = $(document).find('.button');
  var result = $(document).find('.result-ct');
  var button;
  var buttonValue;
  var resultValue;
  var clearButton = keys[0];

  var nrOfButtons = keys.length;
  for(let i = 0; i < nrOfButtons; i++) {
    button = keys[i];
    $(button).on('click',function() {
      buttonValue = $(this).text();

      if (buttonValue != "AC") {
        $(clearButton).text("C")
      }

      if (buttonValue == "C") {
        stack = [];
        $(clearButton).text("AC")
        resultValue = 0;
      }

      if(buttonValue == "+") {
        switch(stack.length){
          case 1:
            stack.push("+");
            break;
          case 2:
            stack.pop();
            stack.push("+");
            break;
          case 3:
            let num2 = stack.pop();
            let op = stack.pop();
            let num1 = stack.pop();
            stack.push(operation(num1, op, num2));
            stack.push("+");
            resultValue = operation(num1, op, num2);
            break;
        }
      }

      if(buttonValue == "-") {
        switch(stack.length){
          case 1:
            stack.push("-");
            break;
          case 2:
            stack.pop();
            stack.push("-");
            break;
          case 3:
            let num2 = stack.pop();
            let op = stack.pop();
            let num1 = stack.pop();
            stack.push(operation(num1, op, num2));
            stack.push("-");
            resultValue = operation(num1, op, num2);
            break;
        }
      }

      if(buttonValue == "=") {
        switch(stack.length){
          case 2:
            let ope = stack.pop();
            let num = stack.pop();
            stack.push(operation(num, ope, num));
            resultValue = operation(num, ope, num);
            break;
          case 3:
            let num2 = stack.pop();
            let op = stack.pop();
            let num1 = stack.pop();
            stack.push(operation(num1, op, num2));
            resultValue = operation(num1, op, num2);
            break;
        }
      }

      if(isNumeric(buttonValue)){
        switch(stack.length){
          case 0: case 2:
            stack.push(buttonValue);
            resultValue  = buttonValue;
            break;
          case 1: case 3:
            resultValue = stack.pop();
            resultValue = +resultValue*10 + +buttonValue;
            stack.push(resultValue);
            break;
        }
      }

      $(result).text(resultValue);
    })
  }
})
