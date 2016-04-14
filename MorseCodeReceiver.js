//ENG1003 Assignment 1, Morse Code Receiver App, Team 048
//Dustin Haines
//David Kusuma
//Jacinda Pagels
//Win Seah

/*
 * Morse Code receiver app information:
 *
 * Function: messageFinished(): stops the capturing process
 *
 *     You can call this function to let the app know that the 
 *     end-of-transmission signal has been received.
 *
 * -------------------------------------------------------
 *
 * ID: messageField: id of the message text area
 *
 *     This will be a textarea element where you can display
 *     the recieved message for the user.
 * 
 * -------------------------------------------------------
 *
 * ID: restartButton: id of the Restart button
 *
 *     This is a button element.  When clicked this should 
 *     cause your app to reset its state and begin recieving
 *     a new message.
 *
 */


// ADD YOUR ADDITIONAL FUNCTIONS AND GLOBAL VARIABLES HERE

/*For reference in this code, a red screen in the transmission corresponds to 
  a true statement, while a blue screen corresponds to a false statement*/

//Variable declaration for output area to easily reference the output
var outputField = document.getElementById("messageField");

//Restart() function is called when the element with ID restartButton is clicked
document.getElementById("restartButton").onclick = restart;

//Object for Lookup Table, stores all appropriate values
var lookupTable = {
	DotDash: "a",
	DashDotDotDot: "b",
	DashDotDashDot: "c",
	DashDotDot: "d",
	Dot: "e",
	DotDotDashDot: "f",
	DashDashDot: "g",
	DotDotDotDot: "h",
	DotDot: "i",
	DotDashDashDash: "j",
	DashDotDash: "k",
	DotDashDotDot: "l",
	DashDash: "m",
	DashDot: "n",
	DashDashDash: "o",
	DotDashDashDot: "p",
	DashDashDotDash: "q",
	DotDashDot: "r",
	DotDotDot: "s",
	Dash: "t",
	DotDotDash: "u",
	DotDotDotDash: "v",
	DotDashDash: "w",
	DashDotDotDash: "x",
	DashDotDashDash: "y",
	DashDashDotDot: "z",
	DashDashDashDashDash: "0",
	DotDashDashDashDash: "1",
	DotDotDashDashDash: "2",
	DotDotDotDashDash: "3",
	DotDotDotDotDash: "4",
	DotDotDotDotDot: "5",
	DashDotDotDotDot: "6",
	DashDashDotDotDot: "7",
	DashDashDashDotDot: "8",
	DashDashDashDashDot: "9",
	DashDotDashDashDot: "(",
	DashDotDashDashDotDash: ")",
	DotDashDotDotDashDot: "\"",
	DotDotDotDotDotDotDotDotDashDotDotDash: "$",
	DotDashDashDashDashDot: "'",
	DashDotDotDashDot: "/",
	DotDashDotDashDot: "+",
	DashDashDashDotDotDot: ":",
	DotDashDotDashDotDash: ".",
	DashDashDotDotDashDash: ",",
	DotDotDashDashDotDot: "?",
	DashDotDotDotDotDash: "-",
	DotDashDashDotDashDot: "@",
	DashDotDotDotDash: "=",
	DotDotDashDashDotDash: "_",
	DashDotDashDotDashDash: "!",
	DotDotDotDashDotDotDash: "$",
	DotDashDotDash: "\n",
}

//Variable to set program state, stops it from starting on page load, initially false
var receivingMessage = false;
//Variable to store the last state of the transmission, AKA the last response
var lastResponse;
//Variable that counts the amount of identical responses in a row
var count = 0;
//Variable to store the character as it's determined, contains a mix of Dots and Dashes
var currentCharacter = "";

//Function to determine if the series of input corresponds to a dot or dash
//Checks count to see if it was a Dot or Dash
function parseDotDash() {
	if(count <= 2) {
		currentCharacter += "Dot";
	}else {
		currentCharacter += "Dash";
	}
}

//Function to determine what kind of break the input corresponds to
//Looks at count to see if it was an intercharacter space, character space or word space
function parseOff() {
	if(count <= 2) {
		return null;
	}else if(count > 2 && count <= 6) {
		parseChar();
	}else {
		parseChar();
		outputField.innerHTML += " ";
	}
}

//Function to take the current character and print out the corresponding character to output
//References the lookup table to determine the character
function parseChar() {
	if(currentCharacter === "DotDotDotDashDotDash") {
		receivingMessage = false;
		messageFinished();
	}else {
		outputField.innerHTML += lookupTable[currentCharacter];
		currentCharacter = "";
	}
}
	
//Function to reset program to waiting state, ready for next transmission
function restart() {
	count = 0;
	lastResponse = null;
	currentCharacter = "";
	receivingMessage = false;
	outputField.innerHTML = "";
}

/*
 * This function is called once per unit of time with camera image data.
 * 
 * Input : Image Data. An array of integers representing a sequence of pixels.
 *         Each pixel is representing by four consecutive integer values for 
 *         the 'red', 'green', 'blue' and 'alpha' values.  See the assignment
 *         instructions for more details.
 * Output: You should return a boolean denoting whether or not the image is 
 *         an 'on' (red) signal.
 */
 
function decodeCameraImage(data)
{
    //Counters for the amount of red and blue pixels
	var red = 0, blue = 0;
	//Compares the red and blue values of a pixel and sees which is higher, incrementing the appropriate counter
	for(var i = 0; i < data.length; i += 4) {
		if(data[i] > data[i+2]) {
			red++;
		}else {
			blue++;
		}	
	}
	
	if(red > blue) {
		//Steps if input is red
		//Special first condition for when transmission starts to start constant capture
		if(receivingMessage === false) {
			receivingMessage = true;
			count = 1;
		}else {
			//Conditions for while receiving input
			if(lastResponse === true) {
				count++;
			}else {
				parseOff();
				count = 1;
			}
		}
		lastResponse = true;
		return true;
	}else {
		//Steps if input is blue
		if(receivingMessage === true) {
			if(lastResponse === false) {
				count++;
				if(count > 10) {
					parseOff();
				}
			}else {
				parseDotDash();
				count = 1;
			}
		}
		lastResponse = false;
		return false;
	}
}
