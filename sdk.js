
let initialNumbers = 20;



let cells = document.getElementById("sdkTable").getElementsByTagName("td");

function clearBoard(){
	for(let i = 0 ; i < 81; i++){
		cells[i].textContent = "";
		cells[i].style.backgroundColor = "white";
		cells[i].dataset.fixed = "";
	}
}

function initializeBoard(n){
	if(n >= 9*9){
		throw("Invalid quantity of initial numbers");
	}
	clearBoard();
	for(let i = 0 ; i < n; i++){
		
		let randomPositiontion = Math.floor((Math.random() * 9 * 9));
		while(!isPositionEmpty(randomPositiontion)){
			randomPositiontion = Math.floor((Math.random() * 9 * 9));
		}
		
		let randomNum = Math.floor((Math.random() * 9)) + 1;
		cells[randomPositiontion].textContent = randomNum;
		while(!isBoardValid()){
			randomNum = Math.floor((Math.random() * 9)) + 1;
			cells[randomPositiontion].textContent = randomNum;
		}
		
		cells[randomPositiontion].style.backgroundColor = "#e5e5e5";
		cells[randomPositiontion].dataset.fixed = "fixed";
	}
}

function isPositionEmpty(n){
	return cells[n].innerText.length < 1;
}

function isBoardValid(){
	
	for(let i = 0 ; i < 9; i++){

		if(!isRowValid(i)
		 || !isColumnValid(i)
		 || !isSquareValid(i)){
			return false;
		}
		
	}
	return true;
}

function isRowValid(n){
	let validNumbers = [];
	for(let i = 0 ; i < 9; i++){
		let value = cells[i + (9 * n)].innerText;
		let num = Number(value);
		if(value.length > 0 && validNumbers[num]){
			return false;
		}
		validNumbers[num] = true;
	}
	return true;
}

function isColumnValid(n){
	let validNumbers = [];
	for(let i = 0 ; i < 9; i++){
		let value = cells[n + (9 * i)].innerText;
		let num = Number(value);
		if(value.length > 0 && validNumbers[num]){
			return false;
		}
		validNumbers[num] = true;
	}
	return true;
}


function isSquareValid(n){
	let validNumbers = [];
	for(let i = 0 ; i < 9; i++){
		let skipsq = Math.floor(n/3);
		let skipi = Math.floor(i/3);
		let pos = ( 9 * skipi) +(i%3) + (3 * (n % 3)) + (skipsq * 9 * 3) ;
		let value = cells[pos].innerText;
		let num = Number(value);
		if(value.length > 0 && validNumbers[num]){
			return false;
		}
		validNumbers[num] = true;
	}
	return true;
}

let speed = 200;
let stop = false;
let savedI = 0;
let savedX = 1;
let savedDirection = "forward"
function solve(i = 0, x = 1, direction = "forward"){
	
	if(stop){
		savedI = i;
		savedX = x;
		savedDirection = direction;
		console.log("STOP");
		return;
	}
	
	if( i == -1){
		console.log("NO SOLUTION");
		return;
	}
	
	if(i < 81){
		if(cells[i].dataset.fixed != "fixed"){
			if(direction == "backward"){
				x = Number(cells[i].innerText) + 1;
			}
			cells[i].style.backgroundColor = "green";
			if(x <= 9){
				cells[i].textContent = x;
				if(isBoardValid()){
					setTimeout( function(){
						cells[i].style.backgroundColor = "white";
						solve(i+1,1);
					},speed);
				}else{
					setTimeout(function(){
						cells[i].style.backgroundColor = "white";
						solve(i,x+1);
					},speed);
				}
			}else{
				cells[i].textContent = "";
				cells[i].style.backgroundColor = "white";
				setTimeout(solve(i-1,0,"backward"),speed);
			}
		}else{
			// skip fixed values
			if(direction == "forward"){
				solve(i+1,x);
			}else{
				solve(i-1,x, "backward");
			}
		}
	}else{
		let endTime = performance.now();
		console.log("Time to solve " + (endTime - startTime) + " milliseconds.")
		console.log("DONE");
		solveButton.click();
	}
}

let resetButton = document.getElementById("btnReset");
let solveButton = document.getElementById("btnSolve");
let speedSlider = document.getElementById("speedSlider");


function toggleControls(){
	resetButton.disabled = !resetButton.disabled;
	solveButton.disabled = !solveButton.disabled;
	speedSlider.disabled = !speedSlider.disabled;
}

speedSlider.oninput = function() {
  speed = 1000 - this.value;
};

resetButton.onclick = function(){ 
	toggleControls();

	stop = true;
	
	setTimeout( function(){
		savedI = 0;
		savedX = 1;
		savedDirection = "forward"
		initializeBoard(initialNumbers);
		toggleControls();
		solveButton.classList.remove("paused");
	}.bind(this),speed * 2);
	
};

let startTime = 0;


solveButton.onclick = function(){ 

	if(!this.classList.contains("paused")){
		stop = false;
		startTime = performance.now();
		solve(savedI, savedX, savedDirection);

	}else{
		stop = true;
	}
	this.classList.toggle("paused");
};



console.log("sdk loaded");

initializeBoard(initialNumbers);