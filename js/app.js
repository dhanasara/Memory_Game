/*
 * Create a list that holds all of your cards
 */
var cardList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];
var defaultCardList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];
let firstCardClick = 0;
let secondCardClick = 1;
var flipCount = 0;
var firstCard, secondCard;
var firstCardType, secondCardType;
var seconds = 0;
var minutes = 0;
var success_element = $('.success-container');
var score_message_element = $('.score-message');
var moves = 0;
var cards_match = 8;
var cards_match_count = 0;
var stars_count = 0;
var timer_count;
var timerText = "";

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
$('.card').click(function() {
    startTimer();    
    if(flipCount === firstCardClick) {
        firstCard = $(this);
        firstCardType = $(this).find('i').attr('class');
        $(this).addClass('open show');
        flipCount += 1;
    } else if(flipCount === secondCardClick) {
        secondCard = $(this);
        secondCardType = $(this).find('i').attr('class');
        $(this).addClass('open show');
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
  
});

// Function for Cards Match
function cardMatchTrue(firstCard, secondCard) {
    firstCard.addClass('match');
    secondCard.addClass('match');
    moves += 1;
    cards_match_count += 1;
    updateMoves(moves);
}

// Function for Cards Match Fail
function cardMatchFalse(firstCard, secondCard) {
    firstCard.addClass('no-match');
    secondCard.addClass('no-match');
    moves += 1;
    updateMoves(moves);
    resetCard(firstCard, secondCard);
}

// Function for Card Flips when cards match fail
function resetCard(firstCard, secondCard) {
      setTimeout(function(){
            firstCard.removeClass('open show no-match');
            secondCard.removeClass('open show no-match');
      },1000);
};

// Function to shuffle cards randomly
function shuffleCards() {
    var shuffledCards = shuffle(cardList);
    var cardElements = document.querySelectorAll('li.card i.fa');
    console.log(cardElements);
  for (let j = 0; j < cardList.length; j++) {        
         $('#card_'+ j).removeClass(defaultCardList[j]).addClass(shuffledCards[j]);      
    }

}

// Invoke shuffle cards once the page rendered.
$(document).ready(function () {
    shuffleCards();

});

// Restart click event
$('.fa fa-repeat').click(function() {
      restartGame();
    });

// Function to Restart Game
function restartGame() {      
  // Reset the card deck.
  $('.card').removeClass('open');
  $('.card').removeClass('show');
  $('.card').removeClass('match');
  $('.card').removeClass('no-match');
  moves_taken = 0;

  /** Clear Timer */
  clearInterval(timer_count);

  timer_start = false;

  /** Reset Moves Counter */
  moves_counter = 0;
  $('.score-panel').find('.moves').text(moves_counter);

  /** Reset Star Rating */
  $('#first-star').removeClass('fa-star-o').addClass('fa-star');
  $('#second-star').removeClass('fa-star-o').addClass('fa-star');
  $('#third-star').removeClass('fa-star-o').addClass('fa-star');

  // Shuffle Cards
  shuffleCards();      
};


// Function to Start Timer
function startTimer() {
    timer_count = setInterval(function() {
        seconds += 1;    
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }   
        //console.log(timer_count);
      timerText = minutes + "m" + ":" + seconds + "s";
    $('.fa-timer').text(timerText);
    //document.getElementsByClassName("fa-timer").innerHTML = minutes + "m" + ":" + seconds + "s";  
    
    }, 1000);
}

// Function to Update the no.of card flips.
function updateMoves(moves) {
    if(moves > 0 ) {
        $('.score-panel').find('.moves').text(moves);
    }
    if (moves > 15 && moves <= 25){
         $('#starThree').removeClass('fa-star').addClass('fa-star-o');  
         stars_count = 3;     
    } else if(moves > 25 && moves <=40){
         $('#starTwo').removeClass('fa-star').addClass('fa-star-o');
         stars_count = 2;
    } else if(moves > 40){
         $('#starOne').removeClass('fa-star').addClass('fa-star-o');
         stars_count = 1;
    }
}

// Function to Game Completion
function endGame() {
    success_element.css('display','block');
    score_message_element.text("With " + flipCount + "Moves and " + stars_count + "Stars");
    
}

// Function to Restart Game after the successful completion of previous game.
$('.btn-play-again').click(function() {
  restartGame();
  moves = 0;
  $('#starOne').removeClass('fa-star-o').addClass('fa-star');  
  $('#starTwo').removeClass('fa-star-o').addClass('fa-star');  
  $('#starThree').removeClass('fa-star-o').addClass('fa-star');  
  $('.fa-timer').text("0m:0s");
  success_element.css('display', 'none');
});
