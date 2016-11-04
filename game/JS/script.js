( function Hangman()
{
//OBSERVABLE PATERN
function Observable(){
	var Myself=this;
	Myself.data;
	Myself.subscribers=[];
	Myself.methods={
		subscribe:function (callback) {
			Myself.subscribers.push(callback);
		},
		 publish: function( data ) {
	    	if (typeof data !== 'undefined') {
		    	Myself.data = data;
		        for (var i = 0; i < Myself.subscribers.length; i++) {
		        	 Myself.subscribers[i](data);
		        }
	    	} else {
	    		return Myself.data
	    	}
	    }
	}
return Myself.methods
};
//DECLARATION OF VARIABLES
var button          = new Observable();
var chance          = new Observable();
var time            = new Observable();
var completed       = new Observable();
var sterren         = new Observable();
var stars_LI        = document.getElementsByClassName("star_image");
var words           = ["appel","hond","lepel","kat","auto","fiets","computer","badschuim","konijn","bus","school",
                       "webdesign","hoofdje","zwengel","chinees","golfclub","polyethyleen","meubel","zaak"];		   
var wordToGuess 	= pickRandomword();
var placeholder     = [];
var gameStatus      = document.getElementById("game_status");
var placeHolderHTML = document.getElementById("placeholder");
var chances 		= 6;
var buttonpressed 	= "";
var bttns 			= document.querySelectorAll(".buttons button");
var IMG_PATH        = "img/";
var IMG_EXT         = ".png";
var TOTAL_SECONDS   = 1;
var TOTAL_MINUTES   = 3;
var game_is_running = true;
var stars           = 0;
var nextwordbttn    = document.getElementById("nextword");
var restartgamebttnPopUp = document.getElementsByClassName("restartgame")[0];
var restartgamebttnLeft = document.getElementsByClassName("restartgame")[1];
    
var modal           = document.getElementsByClassName("modal")[0];
    
nextwordbttn.disabled=true;
restartgamebttnPopUp.disabled=true;
restartgamebttnLeft.disabled=true;
nextwordbttn.addEventListener("click",NextWord);
restartgamebttnPopUp.addEventListener("click",GameRestart);
restartgamebttnLeft.addEventListener("click",GameRestart);

Clock(TOTAL_MINUTES,TOTAL_SECONDS);
for (var i = 0; i < bttns.length; i++) 
{
	bttns[i].addEventListener("click",onBttnClick);
}
for(var i  = 0;i<wordToGuess.length; i++)
    {
        placeholder.push("_");
    }
placeHolderHTML.innerHTML=placeholder.join(" ");

chance.subscribe(changeImage);
chance.subscribe(gameOver);
button.subscribe(buttonWasPressed);
time.subscribe(CheckIfTimeIsup);
completed.subscribe(gameComplete);
sterren.subscribe(StarImages);
sterren.subscribe(EntireGameComplete);
    
/** Changes Starimges from unactive to active when word is guessed **/
function StarImages()
{
    var ster=sterren.publish();
    for (var i = 0; i < stars_LI.length; i++) {
        if(i<ster)
        {
           stars_LI[i].src=IMG_PATH+"star_active"+IMG_EXT; 
        }
    }
}
/** Gamestatus set to Complete and disable all buttons.**/
function EntireGameComplete()
{
    if (sterren.publish()>=5) 
    {
    game_status.innerHTML = "Game Complete Congrats!";
    nextwordbttn.disabled=true;
    restartgamebttnPopUp.disabled=false;
    restartgamebttnLeft.disabled=false;
    for (var i = 0; i < bttns.length; i++) 
        {
            bttns[i].disabled=true;
        }
        modal.classList.add("block");
    }
}
/** Reloads the page **/
function GameRestart()
{
window.location="index.html";
}
/** Picks a new randomword, clears gamestatus, gamerunning set to true, disable continue button **/
function NextWord()
{
    if (stars<6) {
        var wordToGuess= pickRandomword();
    chances=6;
    chance.publish(chances);
    placeholder=[];
    for (var i = 0; i < bttns.length; i++) 
            {
             bttns[i].disabled=false;
            }
    for(var i  = 0;i<wordToGuess.length; i++)
    {
        placeholder.push("_");
    }
    placeHolderHTML.innerHTML=placeholder.join(" ");
    game_is_running=true;
    nextwordbttn.disabled=true;
    game_status.innerHTML=" ";
    }
}
/**
 * Picks random word out of an array
 * @param {array} words
 * @return {string} wordToGuess
 */
function pickRandomword()
{
	ranndomNumber = Math.floor( Math.random() * words.length );
	wordToGuess = words[ranndomNumber].toUpperCase();
    if (ranndomNumber != -1) {
        words.splice(ranndomNumber, 1);
    }
	return wordToGuess;
}
/** Decreases chances with one and publish this in observable **/
function OneChanceless()
{
	chances--;
	chance.publish(chances);
}
/** Publish value of bttn is observable button **/
function onBttnClick(event)
{
    var buttonvalue=event.currentTarget.id;
    button.publish(buttonvalue);
}
/**
 * Check if string is in array
 * @param {string} string
 */
function checkIfInArray(string)
{
    if(wordToGuess.indexOf(string) !=-1)
        {
            changePlaceholderToLetter(string);
        }
    else
    {
        OneChanceless();
    }
}
/**
 * Chances undersore to letter if correct letter is pressed
 * @param {string} string
 */
function changePlaceholderToLetter(string)
{
    var WordToArray=wordToGuess.split("");
    for(var i=0; i<WordToArray.length;i++)
        {
            if(WordToArray[i]==string)
                {
                    placeholder[i]=string;
                    placeHolderHTML.innerHTML=placeholder.join(" ");
                }
        }
    completed.publish(placeholder);
}
/** changes image if letter is not in word **/
function changeImage()
{
    var chanceValue=chance.publish();
    var img=document.getElementsByTagName("img")[1];
    img.src=IMG_PATH+chanceValue+IMG_EXT;
}
/** publish value of button pressed **/
function buttonWasPressed()
{
    buttonpressed=button.publish();
    checkIfInArray(buttonpressed);
    disableBttn(buttonpressed);
}
/**
 * Disables pressed button
 * @param {string} buttontoDisable 
 */
function disableBttn(buttontoDisable)
{
    document.getElementById(buttontoDisable).disabled=true;
}
/** If chancevalue is smaller than six than gameover gamerunning set to false al buttons disabled and gamestatus is Game Over **/
function gameOver()
{
    var chanceValue=chance.publish();
    if(chanceValue<=0)
        {
          for (var i = 0; i < bttns.length; i++) 
            {
	         bttns[i].disabled=true;
            }
            game_status.innerHTML = "Game over! Klik op 'Herstart' om opnieuw te beginnen.";
            game_is_running = false;
            restartgamebttnPopUp.disabled=false;
            restartgamebttnLeft.disabled=false;
        }
        else
        {
            return;
        }
    
}
/** Game is completed game is running is set to flase gamestatus is guessed the word one star is added and published **/
function gameComplete(){
    var word = completed.publish();
    if( placeholder.indexOf("_") == -1 ){
        game_status.innerHTML = "Woord geraden, één ster toegevoegd. Klik 'Volgende woord' om verder te gaan";
        game_is_running = false;
        nextwordbttn.disabled=false;
        stars++;
        sterren.publish(stars);
    }
}
/**
 * Decreases time every second
 * @param {Number} min 
 * @param {Number} sec
 * @return {Number} totaltime(sum of seconds and minutes)
 */
function Clock (min, sec) {
    var seconds = sec;
    var minutes = min;
    var secInHTML   = document.getElementById("seconds");
    var minInHTML   = document.getElementById("minutes");
    
    var interval    = setInterval(DecreaseTime, 1000);
    
    function DecreaseTime () {
        var totalTime   = "";
        if (game_is_running){
            seconds--;
        }
        
        if (seconds < 0) {
            minutes--;
            seconds = 59;
        }
        
        if (minutes == 0 && seconds == 0) {
            minInHTML.innerHTML = "0" + 0;
            secInHTML.innerHTML = "0" + 0;
            clearInterval(interval);
        }
        
        minInHTML.innerHTML = minutes;
        secInHTML.innerHTML = seconds;
        
        if (seconds < 10) {
            secInHTML.innerHTML = "0" + seconds;
        }
        
        if (minutes < 10) {
            minInHTML.innerHTML = "0" + minutes;
        }
        
        totalTime = minutes + seconds;
        time.publish(totalTime);
    }
}
/* Checks if time is up and if true than gamerunning set false and gamestatus is time ran out */
function CheckIfTimeIsup()
{
    var totalTime=time.publish();
    if(totalTime==0)
    {
        for (var i = 0; i < bttns.length; i++) 
            {
             bttns[i].disabled=true;
            }
        game_status.innerHTML = "De tijd is op. Probeer het opnieuw";
        restartgamebttnPopUp.disabled=false;
        restartgamebttnLeft.disabled=false;
    }
}
})();
