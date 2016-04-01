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

//Variable declaration for easy display of output
var outputField = document.getElementById("messageField");

//Call to restart program
document.getElementById("restartButton").onclick = restart();

//Object for Lookup Table
var lookupTable = {
	DotDash: "a",
	DashDotDotDot: "b",
	
}

//Variable to set program state, initially false
var receivingMessage = false;
//Variable to store the last state of the transmission
var lastResponse;
//Variable that counts the amount of same responses in a row
var count = 0;
//Variable to store the character as it's determined
var currentCharacter = "";

//Function to determine if the series of input corresponds to a dot or dash
function parseDotDash() {
	if(count <= 2) {
		currentCharacter += "Dot";
	}else {
		currentCharacter += "Dash";
	}
}

//Function to determine what kind of break the input corresponds to
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
function parseChar() {
	outputField.innerHTML += lookupTable['currentCharacter'];
	currentCharacter = "";
}

//Function to reset program to waiting state
function restart() {
	count = 0;
	lastResponse = null;
	currentCharacter = "";
	receivingMessage = false;
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
	
	//Compares the red and blue values of a pixel and sees which is higher
	for(var i = 0; i < data.length; i += 4) {
		if(data[i] > data[i+2]) {
			red++;
		}else {
			blue++;
		}	
	}
	
	if(red > blue) {
		//Steps if input is red
		
		//Special first condition for when transmission starts
		if(receivingMessage === false) {
			receivingMessage = true;
			count++;
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
			}else {
				parseDotDash();
				count = 1;
			}
		}
		
		lastResponse = false;
		return false;
	}
}
