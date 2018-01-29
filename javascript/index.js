
var stack = [];

function countNrDecimals(num) {
  let flag = false;
  let nrDec = 0;

  try{
    for(var i of num) {
      if(flag) {
        nrDec++;
      }
      if(i == ".") {
        flag = true;
      }
    }
  }
  catch(TypeError) {}

  if(!flag){
    return -1;
  }
  return nrDec;
}

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
  if( op == "x" )
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

  //variables for operations
  var num1,op1,num2,op2,num3,res;

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
          case 4:
            stack.pop();
            stack.push("+");
            break;
          case 3:
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();
            stack.push(operation(num1, op1, num2));
            stack.push("+");
            resultValue = operation(num1, op1, num2);
            break;
          case 5:
            num3 = stack.pop();
            op2 = stack.pop();
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();

            res = operation(num2, op2, num3);
            resultValue = operation(num1, op1, res);
            stack.push(resultValue);
            stack.push("+");
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
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();
            stack.push(operation(num1, op1, num2));
            stack.push("-");
            resultValue = operation(num1, op1, num2);
            break;
          case 5:
            num3 = stack.pop();
            op2 = stack.pop();
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();

            res = operation(num2, op2, num3);
            resultValue = operation(num1, op1, res);
            stack.push(resultValue);
            stack.push("-");
        }
      }

      if(buttonValue == "x") {
        switch(stack.length){
          case 1:
            stack.push("x");
            break;
          case 2:
          case 4:
            stack.pop();
            stack.push("*");
            break;
          case 3:
            if(stack[1]=="x" || stack[1]=="/") {
              num2 = stack.pop();
              op1 = stack.pop();
              num1 = stack.pop();
              stack.push(operation(num1, op1, num2));
              stack.push("x");
              resultValue = operation(num1, op1, num2);
            }
            else
            {
              stack.push("x");
            }
            break;
          case 5:
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();
            stack.push(operation(num1, op1, num2));
            stack.push("x");
            resultValue = operation(num1, op1, num2);
        }
      }

      if(buttonValue == "/") {
        switch(stack.length){
          case 1:
            stack.push("/");
            break;
          case 2:
          case 4:
            stack.pop();
            stack.push("/");
            break;
          case 3:
            if(stack[1]=="x" || stack[1]=="/") {
              num2 = stack.pop();
              op1 = stack.pop();
              num1 = stack.pop();
              stack.push(operation(num1, op1, num2));
              stack.push("/");
              resultValue = operation(num1, op1, num2);
            }
            else
            {
              stack.push("/");
            }
            break;
          case 5:
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();
            stack.push(operation(num1, op1, num2));
            stack.push("/");
            resultValue = operation(num1, op1, num2);
        }
      }


      if(buttonValue == "=") {
        switch(stack.length){
          case 2:
            op1 = stack.pop();
            num1 = stack.pop();
            stack.push(operation(num1, op1, num1));
            resultValue = operation(num1, op1, num1);
            break;
          case 3:
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();
            stack.push(operation(num1, op1, num2));
            resultValue = operation(num1, op1, num2);
            break;
          case 5:
            num3 = stack.pop();
            op2 = stack.pop();
            num2 = stack.pop();
            op1 = stack.pop();
            num1 = stack.pop();

            let res = operation(num2, op2, num3);
            resultValue = operation(num1, op1, res);
            stack.push(resultValue);
        }

      }

      if(isNumeric(buttonValue)){
        let nrDec = countNrDecimals(stack[stack.length-1]);

        if(nrDec == -1) {
          switch(stack.length){
            case 0:
            case 2:
            case 4:
              stack.push(buttonValue);
              resultValue  = buttonValue;
              break;
            case 1:
            case 3:
            case 5:
              resultValue = stack.pop();
              resultValue = +resultValue*10 + +buttonValue;
              stack.push(resultValue);
              break;
          }
        }
        else {
          num1 = stack.pop();
          resultValue = "" + num1 + buttonValue;
          stack.push(resultValue);
        }
      }

      if(buttonValue == "."){
        switch(stack.length){
          case 0:
          case 2:
          case 4:
            res = 0;
            stack.push(res+".");
            resultValue = res+".";
            break;
          case 1:
          case 3:
          case 5:
            if (countNrDecimals($(result).text()) == -1) {
              num = stack.pop($(result).text());
              stack.push(num+".");
              resultValue = num + ".";
            }
            break;
        }
      }

      if(buttonValue == "%"){
        switch(stack.length){
          case 1:
          case 3:
          case 5:
            num1 = stack.pop()
            num1 /= 100;
            stack.push(num1);
            resultValue = num1;
            break;
        }
      }

      if(buttonValue == "+/-"){
        switch(stack.length){
          case 1:
          case 3:
          case 5:
            num1 = stack.pop()

            if(num1<0) {
              num1 = Math.abs(num1);
            }
            else {
              num1 = num1 - num1*2
            }

            stack.push(num1);
            resultValue = num1;
            break;
        }
      }
      $(result).text(resultValue);
    })
  }
});

document.addEventListener('keydown', function(event) {
  if (event.code.indexOf("Digit") != -1) {
    var keys = $(document).find('.button');
    var nrOfButtons = keys.length;
    for(let i = 0; i < nrOfButtons; i++) {
      if ( $(keys[i]).text() == event.code.charAt(5) ) {
        $(keys[i]).click();
      }
    }

  }
});
