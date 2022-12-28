"use strict";

/*** OBJECTS AND VARIABLES */
var chkbx4calculator = document.querySelector("#chkbx4calculator"),
	inputsMoney = document.querySelectorAll(".js-input-money"),
	inputsPeople = document.querySelectorAll(".js-input-people"),
	inputShortTrip = document.querySelector(".js-input-shortTrip"),
	inputLongTrip = document.querySelector(".js-input-longTrip"),
	contentsDistance = document.querySelectorAll(".js-toggle"),
	tagTotal = document.querySelector(".js-total"),
	tagAddRow = document.querySelector(".js-add"),
	rowTemplate = document.querySelector(".js-row.is-template"),
	screen;

var mathScreen = document.querySelector('.js-math-screen'),
	keyboardDigits = document.querySelectorAll('.js-math-digit'),
	keyboardOperators = document.querySelectorAll('.js-math-operator'),
	keyboardEqual = document.querySelector('.js-math-equal'),
	keyboardDelete = document.querySelector('.js-math-delete'),
	mathResultDisplayed = false;
/*** END OBJECTS AND VARIABLES */

/*** SETUP ***/
/*** END SETUP ***/

/*** EVENTS ***/
for (var i = 0; i < keyboardDigits.length; i++) {
	keyboardDigits[i].addEventListener("click", keyboardDigitsClicked);
}
for (var i = 0; i < keyboardOperators.length; i++) {
  keyboardOperators[i].addEventListener("click", keyboardOperatorsClicked);
}

tagAddRow.addEventListener("click", addRow);

keyboardEqual.addEventListener("click", keyboardEqualClicked);
keyboardDelete.addEventListener("click", keyboardDeleteClicked);

inputShortTrip.addEventListener("click", keyboardScreenChanged);
inputLongTrip.addEventListener("click", keyboardScreenChanged);
for (var i = 0; i < inputsMoney.length; i++) {
	inputsMoney[i].addEventListener("click", keyboardScreenChanged);
}
for (var i = 0; i < inputsPeople.length; i++) {
	inputsPeople[i].addEventListener("click", keyboardScreenChanged);
}
for (var i = 0; i < contentsDistance.length; i++) {
//	contentsDistance[i].addEventListener("click", contentsDistanceToggled);
}
/*** EVENTS ***/

/*** FUNCTIONS ***/
function addRow() {
	resetActiveScreens();

	if(document.querySelectorAll(".js-row.is-empty")[0].classList.contains("is-disabled")) {
		document.querySelectorAll(".js-row.is-disabled.is-empty")[0].classList.remove("is-disabled");
	}

	/*
	var rowClone = rowTemplate.cloneNode(true);
	rowClone.classList.remove("is-template", "is-disabled");

	document.querySelector(".content").prepend(rowClone);
	*/
}
function resetActiveScreens() {
	var activeScreen = document.querySelector(".u-input.is-active");
	if(activeScreen) {
		activeScreen.classList.remove("is-active");
	}
}

function keyboardScreenChanged() {
	resetActiveScreens();

	screen = this.querySelector(".u-input-box");
	this.classList.add("is-active");
	this.classList.add("is-clicked");
}
function contentsDistanceToggled() {
//	this.classList.remove("is-active");
}

function calculateAll() {
	var change = 0, total = 0,
		money = 0, people = 0,
		taxiFare = 15,
		rows = document.querySelectorAll(".js-row"),
		row,
		tagChange;
	for (var i = 0; i < rows.length; i++) {
		row = rows[i];
		if(!row.classList.contains("is-empty")){

			money = parseInt(row.querySelector(".js-money").innerHTML);
			people = parseInt(row.querySelector(".js-people").innerHTML);
			if((money == null) || (isNaN(money))) { money = 0; }
			if((people == null) || (isNaN(people))) { people = 0; }
			change = parseFloat(money - (people * taxiFare));

			if(change < 0) { row.classList.add("is-error"); }
			else {
				row.classList.remove("is-error");

				total += (people * taxiFare);
			}

			if((change == null) || (isNaN(change))) { change = ""; }
			if((total == null) || (isNaN(total))) { total = "calculating..."; }

			row.querySelector(".js-change").innerHTML = change;
		}
	}
	tagTotal.innerHTML = total;

}
function jsToggleClass(className, tagName) {
	if(tagName.classList.contains(className)) { tagName.classList.remove(className); }
	else { tagName.classList.add(className); }
}

function keyboardDigitsClicked() {
	if(chkbx4calculator.checked) { screen = mathScreen; }
	else {
		if(screen.closest(".u-input").classList.contains("is-clicked")) {
			screen.closest(".u-input").classList.remove("is-clicked");

			if(screen.closest(".js-row")){
				screen.closest(".js-row").classList.remove("is-empty");
	//			screen.closest(".js-row").classList.add("is-active");
			}

			screen.innerHTML = "";
		}
	}
	
	var currentString = screen.innerHTML;
	var lastChar = currentString[currentString.length - 1];

	if (mathResultDisplayed === false) {
		screen.innerHTML += this.innerHTML;
	} else if (mathResultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
		mathResultDisplayed = false;
		screen.innerHTML += this.innerHTML;
	} else {
		mathResultDisplayed = false;
		screen.innerHTML = "";
		screen.innerHTML += this.innerHTML;
	}
	
	if(!chkbx4calculator.checked) {
//		screen.innerHTML = this.innerHTML;
	}

	calculateAll();
}
function keyboardOperatorsClicked() {
	if(chkbx4calculator.checked) {
		screen = mathScreen;
		
		var currentString = screen.innerHTML;
		var lastChar = currentString[currentString.length - 2],
			newChar = currentString[currentString.length - 1];

		if (newChar === "+" || newChar === "-" || newChar === "×" || newChar === "÷") {
			var newString = currentString.substring(0, currentString.length - 1) + this.innerHTML;
			screen.innerHTML = newString;
		} else if (currentString.length == 0) {
			console.log("enter a keyboardDigits first");
		} else {
			screen.innerHTML += this.innerHTML;
		}
	}
}
function keyboardEqualClicked() {
	if(chkbx4calculator.checked) {
		screen = mathScreen;
		
	var mathScreenString = screen.innerHTML;
	var keyboardDigits = mathScreenString.split(/\+|\-|\×|\÷/g);
	var keyboardOperatorss = mathScreenString.replace(/[0-9]|\./g, "").split("");

  console.log(mathScreenString);
  console.log(keyboardOperatorss);
  console.log(keyboardDigits);
  console.log("----------------------------");

  var divide = keyboardOperatorss.indexOf("÷");
  while (divide != -1) {
    keyboardDigits.splice(divide, 2, keyboardDigits[divide] / keyboardDigits[divide + 1]);
    keyboardOperatorss.splice(divide, 1);
    divide = keyboardOperatorss.indexOf("÷");
  }

  var multiply = keyboardOperatorss.indexOf("×");
  while (multiply != -1) {
    keyboardDigits.splice(multiply, 2, keyboardDigits[multiply] * keyboardDigits[multiply + 1]);
    keyboardOperatorss.splice(multiply, 1);
    multiply = keyboardOperatorss.indexOf("×");
  }

  var subtract = keyboardOperatorss.indexOf("-");
  while (subtract != -1) {
    keyboardDigits.splice(subtract, 2, keyboardDigits[subtract] - keyboardDigits[subtract + 1]);
    keyboardOperatorss.splice(subtract, 1);
    subtract = keyboardOperatorss.indexOf("-");
  }

  var add = keyboardOperatorss.indexOf("+");
  while (add != -1) {
    keyboardDigits.splice(add, 2, parseFloat(keyboardDigits[add]) + parseFloat(keyboardDigits[add + 1]));
    keyboardOperatorss.splice(add, 1);
    add = keyboardOperatorss.indexOf("+");
  }

		screen.innerHTML = keyboardDigits[0];
		mathResultDisplayed = true;
	}
}
function keyboardDeleteClicked() {
	screen.innerHTML = "";
}
/*** FUNCTIONS ***/