/*
 * Create a list that holds all of your cards
 */
let cardList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];

/** Global variables **/
let flipCount = 0;
let seconds = 0;
let minutes = 0;
let moves = 0;
let cards_match = 8;
let cards_match_count = 0;
let stars_count = 0;
let start_timer = false;
var firstCard, secondCard;
var firstCardType, secondCardType, card;
var timer_count;
var timerText = "";
const firstCardClick = 0;
const secondCardClick = 1;
const success_element = $('.success-container');
const score_message_element = $('.score-message');
const duration_element = $('.duration');
const cardDeckElement = document.querySelector('.deck');


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Function for the Card click event
function startGame() {
  cardDeckElement.addEventListener('click', function(e){
  card = e.target;
  // invoke the time counter once the user started to play the game. 
  if (start_timer === false) {
      startTimer(); 
      start_timer = true;
  }  

  // Prevent the second click of the opened card.
  if($(card).hasClass('open')) {
    e.preventDefault();
  } 
  else {
    if(flipCount === firstCardClick) {
      firstCard = $(card);
      firstCardType = $(card).find('i').attr('class');
      $(card).addClass('open show');          
      flipCount += 1;
    } else if(flipCount === secondCardClick) {
        secondCard = $(card);
        secondCardType = $(card).find('i').attr('class');
        $(card).addClass('open show');
        flipCount = 0;
        if(firstCardType === secondCardType) {
           cardMatchTrue(firstCard, secondCard);
            if(cards_match_count === cards_match) {
              setTimeout(function(){
                endGame();
              },1000);              
            } 
      } else {
          cardMatchFalse(firstCard, secondCard);
      }
    }
  }    
 });
}

/** Function for Cards Match **/
function cardMatchTrue(firstCard, secondCard) {
    firstCard.addClass('match');
    secondCard.addClass('match');
    moves += 1;
    cards_match_count += 1;
    updateMoves(moves);
}

/** Function for Cards Match Fail **/
function cardMatchFalse(firstCard, secondCard) {
    firstCard.addClass('no-match');
    secondCard.addClass('no-match');
    moves += 1;
    updateMoves(moves);
    resetCard(firstCard, secondCard);
}

/** Function for Card Flips when cards match fail **/
function resetCard(firstCard, secondCard) {
      setTimeout(function(){
            firstCard.removeClass('open show no-match');
            secondCard.removeClass('open show no-match');
      },1000);
};

/** Function to shuffle cards randomly **/
function shuffleCards() {
  createCardDeck();
  let shuffledCards = shuffle(cardList);
  let cardElements = document.querySelectorAll('li.card i.fa');
  for (let j = 0; j < cardList.length; j++) {
    cardElements[j].classList.add(shuffledCards[j]);
  }
}

/** Function to Create list of cards in the card deck **/
function createCardDeck() {
  for(let i = 0; i < cardList.length; i++) {
    listElement = document.createElement('li');
    listElement.className = 'card';
    cardDeckElement.appendChild(listElement);

    cardElement = document.createElement('i');
    cardElement.className = 'fa';
    listElement.appendChild(cardElement);
  }  
}

/** Function to empty the card deck **/
function resetCardDeck () {
  while(cardDeckElement.hasChildNodes()) {
    cardDeckElement.removeChild(cardDeckElement.lastChild);
  }
}

// Invoke shuffle cards and the game start events once the page got rendered.
$(document).ready(function () {
    shuffleCards();
    startGame();

});

// Restart click event
$('.fa-repeat').click(function() {
      restartGame();
  });

/** Function to Restart Game **/
function restartGame() {   
  /** Clear Timer */
  clearInterval(timer_count);
  seconds = 0;
  minutes = 0;

  start_timer = false;
  $('.fa-timer').text("0m:0s");

  // Reset the card deck.
  resetCardDeck();

  /** Reset Cards Match Count **/
  cards_match_count = 0

  /** Reset previous open card flipCount **/
  flipCount = 0;

  /** Reset Moves Counter */
  moves = 0;
  $('.score-panel').find('.moves').text(moves);

  /** Reset Star Rating */
  $('#starOne').removeClass('fa-star-o').addClass('fa-star');  
  $('#starTwo').removeClass('fa-star-o').addClass('fa-star');  
  $('#starThree').removeClass('fa-star-o').addClass('fa-star');
  
  // Shuffle Cards
  shuffleCards();
  // Initiate the start game event  
  startGame();    
}


// Function to Start Timer
function startTimer() {
    timer_count = setInterval(function() {
        seconds += 1;    
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }   
      timerText = minutes + "m" + ":" + seconds + "s";
    $('.fa-timer').text(timerText);
    }, 1000);
}

// Function to Update the no.of card flips and the Performance rating.
function updateMoves(moves) {
    if(moves > 0 ) {
        $('.score-panel').find('.moves').text(moves);
    }
    // update stars as 3, when the moves less than or equal to 15
    if (moves <= 15){
       stars_count = 3;     
    } else if(moves > 15 && moves <=25){ // update stars as 2, when the moves less than or equal to 25
       $('#starThree').removeClass('fa-star').addClass('fa-star-o');         
       stars_count = 2;
    } else if(moves > 25){ // update stars as 1, when the moves greater than 25
         $('#starTwo').removeClass('fa-star').addClass('fa-star-o');
         stars_count = 1;
    }
}

// Function to Game Completion
function endGame() {
    success_element.css('display','block');
    score_message_element.text("With " + moves + " Moves and " + stars_count + " Stars");
    duration_element.text("Time Taken: " +  timerText);
}

// Function to Restart Game after the successful completion of previous game.
$('.btn-play-again').click(function() {
  clearInterval(timer_count);
  restartGame();
  moves = 0;  
  success_element.css('display', 'none');
});
