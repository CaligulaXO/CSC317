/*
Assignment 04 
Ethan M. Garcia 
Started on: 11/11/2025
Ended on: 11/13/2025
*/

/*As like from the calculator.html, I used help/was influenced by a youtuber named Bro Code, his video is: https://youtu.be/I5kj-YsmWjM?si=cTyFk11bH8HuJIcT
 I will also note where I got help in shaping this javascript*/
 
const display = document.getElementById("display");

//To let people use the keyboard for only numbers and operators, I asked for help from chatGPT, I did not copy and paste, I also did my own
//homework and learned how these lines of code worked
//
document.addEventListener('keydown', function(event){
    //we store the key value pressed
    const key = event.key;
    //if the key was a # or an operator, then we add it
    //the regex checks the above comment
    if (/[0-9-*+/.]/.test(key)){
        //calls our append to check the 3 if statements (neg or num/no backtoback ops/no double decimal)
        appendToDisplay(key);
    } 
    //something that chatgpt missed was the % functionallity, I will attach a screenshot in my report but to put it simply
    //chatgpt's code made my input invalid, I figured out that the percentage was seen as a valid symbol instead of 
    //a function, here i fixed it
    else if (key === "%"){
        percentage();
    //if we press the enter key, we call it's function    
    } else if (key === 'Enter'){
        calculate();
    //if we press the back key we call it's delete function    
    } else if(key === 'Backspace'){
        delRecent();
    } 
});

function appendToDisplay(input){
    //used for checking
    const operatorsButNeg = "%*+/";
    const operators = "%*-+/";
    //is the last char on the display
    const last = display.value.slice(-1);
    //only #'s and negative sign can be in the beginning
    if (display.value === "" && operatorsButNeg.includes(input)){
        return;
    }
    //checks the last char and newest input the same as a char found in my operator array
    if (last !== "" && operators.includes(last) && operators.includes(input)){
        return;
    }
    //uses regex to check if a decimal is alr in the number
    if (input === "." && /\.\d*$/.test(display.value)){
        return;
    }

    display.value += input;
}

function clearDisplay(){
    //empties out the display
    display.value = "";
}

function calculate(){
   
    try{
        //used to check for infinity or NaN or setting as the final value
        const tester = eval(display.value);
        //checks if we get an infinity so if we do, then boom err mess.
        if (tester === Infinity){
            display.value = 'Div by 0 is invalid';
        //checks if we do a 0/0 case which usually gives us a Not a Number
        } else if(Number.isNaN(tester)){
            display.value = "Nah, Invalid";
        }
        //passed all checks
        else { display.value = tester; }
    } catch(error){
        //in case of anything, boom, here is a catch all lol
        display.value = "Invalid Input";
    }
    
}

function delRecent(){
    //updates the current display by taking off the recently added char
    display.value = display.value.slice(0,-1);
}

/* 
function toggle(){
    //used for checking
    tester = display.value * -1;
    try{
        //checks if we tried to toggle in the mid of writing a problem
        if (Number.isNaN(tester)){
            display.value = "use for results only, please press CLR";
        }
        //if it passes we update the current result to its opposite sign
        else {display.value = tester}
    } catch(error){
        display.value = "use for results only, please press CLR";
    }

}
    got an idea to how to implement this correctly through the percentage 
*/


//Had to get help https://stackoverflow.com/questions/17097616/regex-match-a-number-at-the-end-of-a-string#:~:text=I'm%20trying%20to%20match,;%20//%20would%20match%20%2D123.
function percentage() {
    try {
        //current val
        let expresh = display.value;
        //we use this regext to find the last number, whether it is the first number entered or a number after our operator
        let match = expresh.match(/-?\d+\.?\d*$/);
        //we convert into a float div by 100 and then replace the last number into this new updated number
        if (match){
            let lastNum = match[0];
            let percentVal = parseFloat(lastNum) / 100;
            //rewrites whole expression with the updated value concatonated
            display.value = expresh.slice(0,-lastNum.length) + percentVal;
        } else {
            display.value = "No # to convert";
        }
    } catch (error){
        display.value = "No # to convert";
    }
}

//redo of the toggle function, now accomedating for toggling mid expression based on the percentage function
function toggle() {
    try {

        //current val
        let expresh = display.value
        //updated the regex from the percentage function, this regex finds a -/+ number that is at the end of the string
        let match = expresh.match(/(?<![\d.])-?\d+\.?\d*$/);
        //num we want to tog
        let lastNum = match[0];
        //index of the last number
        let starter = expresh.length - lastNum.length
        //op we want to change
        let opBefore = expresh[starter-1];
        //if the num we want to tog is the first number then this is called and tog can happen
        if (starter === 0){
            //if alr neg then we take it out to make it positive w/dropping the -, since my calc does not allow for -- 
            if (lastNum.startsWith('-')){
                display.value = lastNum.slice(1);
                //if alr pos then concatinate a - to make it neg
            } else {
                display.value = '-' + lastNum;
            }
            return;
        }

        //now cases if the num we want to tog isnt the first number
        switch (opBefore){
            //+ into a -
            case '+':
                display.value = expresh.slice(0,starter-1) + '-' +lastNum;
                return;
                //- into a +
            case '-':
                display.value = expresh.slice(0,starter-1) + '+' +lastNum;
                return;
                //these cases are similar where a neg sign van be followed by either * or / however + is an exception, it will break my code so similar to earlier
                //we just drop the - instead of changing it to a +

            case '*':
            case '/':
                if (lastNum.startsWith('-')){
                    display.value = expresh.slice(0,starter) + lastNum.slice(1);
                } else {
                    display.value = expresh.slice(0,starter) + '-' +lastNum;
                }
                return;
            }
            //this will trigger if you try to tog a symbol like 3+ <toggle> -> error OR tog it when the display is empty
    } catch (error){
        display.value = "No # to convert";
    }
}