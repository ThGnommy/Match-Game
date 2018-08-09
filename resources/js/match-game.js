var MatchGame = {};

/* Starts a new game */
document.getElementById("NewGame").onclick = function() {
  var $game = $('#game');
  var values = MatchGame.generateCardValues();
  MatchGame.renderCards(values, $game);
  document.getElementById("win").innerHTML="";
  document.getElementById("timerBox").style.display = "none";
  MatchGame.timer.reset();
  MatchGame.timer.addEventListener('secondsUpdated', function (e) {
      $('#time').html(MatchGame.timer.getTimeValues().toString());
  });
  MatchGame.timer.stop()
};


$(document).ready(function() {

  var $game = $('#game');

  MatchGame.timer = new Timer();

/*
  Render cards from card values generated by generateCardValues function
  and append the rendered HTML in div with id 'game'.
*/
  MatchGame.renderCards(MatchGame.generateCardValues(), $game);
});


MatchGame.flippedCards;
var clickSound = new Audio("resources/audio/select.ogg");
var matchSound = new Audio("resources/audio/match.ogg");
var errorSound = new Audio("resources/audio/error.ogg");
var winSound = new Audio("resources/audio/win.ogg");

MatchGame.generateCardValues = function () {


  var allCards = [];

  MatchGame.flippedCards = 8;
  for (var cardIndex = 1; cardIndex < 9; cardIndex++) {
      allCards.push(cardIndex);
      allCards.push(cardIndex);
  };

  var cardValues = [];
  var arrayLength = allCards.length;
  var allCardsIndex = 0;

  while (allCardsIndex < arrayLength) {

    var value = Math.floor(Math.random() * (allCards.length));
    cardValues[allCardsIndex] = allCards[value];

    allCards.splice(value, 1);
    allCardsIndex++;
  }

  return(cardValues);
}

MatchGame.renderCards = function(cardValues, $game) {

  $game.data('flippedCards', []);

  var cardColors = [
      'hsl(25, 85%, 65%)',
      'hsl(55, 85%, 65%)',
      'hsl(90, 85%, 65%)',
      'hsl(160, 85%, 65%)',
      'hsl(220, 85%, 65%)',
      'hsl(265, 85%, 65%)',
      'hsl(310, 85%, 65%)',
      'hsl(360, 85%, 65%)'];

  $game.empty();

  for (var randomCardsIndex = 0; randomCardsIndex < cardValues.length; randomCardsIndex++) {
      var value = cardValues[randomCardsIndex];
      var color = cardColors[value - 1];
      var isFlipped = false;
      var data = {
          value: value,
          color: color,
          isFlipped: isFlipped,
      };

    var $randomCard = $('<div class="card col-xs-3"></div>');
    $randomCard.data(data);
    $game.append($randomCard);
  }

MatchGame.timerStart = 16;

  $('.card').click(function() {
    MatchGame.flipCard($(this), $('#game'));
    MatchGame.timerStart--;
    clickSound.play();

    if(MatchGame.timerStart === 15)
    {
      MatchGame.timer.start();
      MatchGame.timer.addEventListener('secondsUpdated', function (e) {
          $('#time').html(MatchGame.timer.getTimeValues().toString());
      });
    }
  })
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
*/

MatchGame.flipCard = function($card, $game) {

    if ($card.data('isFlipped')) {
      return;
    }


    $card.css('background-color', $card.data('color'))
         .text($card.data('value'))
         .data('isFlipped', true);

    var flippedCards = $game.data('flippedCards');
    flippedCards.push($card);

    if (flippedCards.length === 2) {
      if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
        var matchedCardsCss = {
          backgroundColor: 'rgb(153, 153, 153)',
          color: 'rgb(204, 204, 204)'
        };
        flippedCards[0].css(matchedCardsCss);
        flippedCards[1].css(matchedCardsCss);
        setTimeout(matchAudio, 150);
        MatchGame.flippedCards--;

      } else {

        var defultCss = {
          backgroundColor: 'rgb(32, 64, 86)',
        }

        window.setTimeout(function() {
          flippedCards[0].css(defultCss)
          .text('')
          .data('isFlipped', false);
          flippedCards[1].css(defultCss)
          .text('')
          .data('isFlipped', false);
		       errorSound.play();
        }, 500);
      }
      $game.data('flippedCards', []);
    }

    if (MatchGame.flippedCards === 0)
	{
    MatchGame.timer.stop();
    MatchGame.timer.addEventListener('secondsUpdated', function (e) {
        $('#time').html(MatchGame.timer.getTimeValues().toString());
    });
		setTimeout(winAudio, 500);
    document.getElementById("timerBox").style.display = "block";
  }

  function matchAudio()
  {
    matchSound.play();
  }

	function winAudio()
	{
		document.getElementById("win").innerHTML="YOU WIN!";
		winSound.play();
	}
};
