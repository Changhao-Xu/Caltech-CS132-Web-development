/**
 * NAME: Changhao Xu
 * DATE: May 12, 2023
 * CS 132 Spring 2023
 * 
 * This is the set.js file for HW2, a Set game website.
 * The goal of the Set game is to find as many "Sets" of 3 cards such that for each attribute,
 * all cards share the attribute or no cards share the attribute.
 */

/** For utils.js reference only
 * id = document.getElementById, qs = document.querySelector, qsa = document.querySelectorAll, gen = document.createElement
 */

(function() {
    "use strict";
    const STYLE = ["solid", "outline", "striped"];
    const COLOR = ["green", "purple", "red"];
    const SHAPE = ["diamond", "oval", "squiggle"];
    const COUNT = [1, 2, 3];

    let timerId = null;            // timer variable id that keeps track of game length in seconds
    let secondsRemaining = 0;      // represents the time in seconds left in the current game
    
    /**
     * This is a function that initializes the event listeners for the start, main and refresh buttons.
     * No parameters, and no returns.
     */
    function init() {
      // this code is ran after page is loaded!
      const startBtn = id("start-btn");
      const mainBtn = id("back-btn");
      const refreshBtn = id("refresh-btn");

      startBtn.addEventListener("click", startGame);
      mainBtn.addEventListener("click", backToMain);
      refreshBtn.addEventListener("click", refreshBoard);
      // this is the optional challenge, check whether a valid set exists on the board
      refreshBtn.addEventListener("click", checkPenalty);
    }

    /**
     * This is the helper function to start the game, it will reset set count, start timer,
     * toggle view, generate/refresh board, and enable refresh-btn
     * No parameters, and no returns.
     */
    function startGame() {
      id("set-count").textContent = "0"; // current set count should be 0 when starting a new game
      startTimer();
      toggleView();
      refreshBoard();
      id("refresh-btn").disabled = false; // Refresh Board button should be re-enabled
    }

    /**
     * This is the helper function to go back to main page, it will toggle view and reset timer.
     * No parameters, and no returns.
     */
    function backToMain() {
      resetTimer();
      toggleView();
    }

    /**
     * This is the function to refresh board. It is also used when starting a new game.
     * No parameters, and no returns.
     */
    function refreshBoard() {
      // Learned checking if contains child https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes
      while (id("board").hasChildNodes()) {
        board.removeChild(board.firstChild);
      }
      // generate number of cards depending on isEasy
      const isEasy = qs("input[name='diff']:checked").value === "easy";
      let genNum = 12;
      if (isEasy) {
        genNum = 9;
      }
      for (let i = 0; i < genNum; i++) {
        id("board").appendChild(generateUniqueCard(isEasy));
      }
    }

    /**
     * This is the function to disable board when the secondsRemaining === 0,
     * it will unselect all cards, and remove click event for all cards,
     * it will also disable refresh-btn and restart timer.
     * No parameters, and no returns.
     */
    function disableBoard() {
      let allCards = qsa(".card");
      for (let i = 0; i < allCards.length; i++) {
        allCards[i].classList.remove("selected"); // Any cards currently selected should appear unselected.
        allCards[i].removeEventListener("click", cardSelected); // remove click, since a new game will redo addEventListener
      }
      id("refresh-btn").disabled = true;
      resetTimer();
    }
    
    /**
     * This is a function that toggles the visibility of the #menu-view and #game-view elements.
     * No parameters, and no returns.
     */
    function toggleView() { // (e) is optional event object, see Lec07/08 P39
      const menuView = id("menu-view");
      const gameView = id("game-view");
      menuView.classList.toggle("hidden"); // Removes a class that is in the list, adds a class that is not in the list.
      gameView.classList.toggle("hidden");
    }
    
    /**
     * format the time from seconds to "MM:SS"
     * @param {number} secondsRemaining - total number of seconds.
     * @returns {string} - formatted time string in the format "MM:SS"
     */
    function formatTimer(secondsRemaining) {
      let minutes = Math.floor(secondsRemaining / 60);
      let seconds = secondsRemaining % 60;
      // Learned padStart in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
      return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    /**
     * Starts the timer for a new game.
     * No parameters, and no returns. 
     */
    function startTimer() {
      secondsRemaining = parseInt(qs("#menu-view select").value);
      id("time").textContent = formatTimer(secondsRemaining);
      timerId = setInterval(advanceTimer, 1000);
    }

    /**
     * Updates the game timer (timerId and #time shown on page) by 1 second.
     * No parameters, and no returns.
     */
    function advanceTimer() {
      if (secondsRemaining === 0) {
        disableBoard();
      } else {
        secondsRemaining--;
        id("time").textContent = formatTimer(secondsRemaining);
      }
    }

    /**
     * reset Timer
     * No parameters, and no returns.
     */
    function resetTimer() {
      if (timerId) {
        clearInterval(timerId);
      }
      timerId = null; // important to clear timerId, otherwise will never cl
    }

    /**
     * Helper function for generateRandomAttributes
     * This function generates a random value from an array
     * @param {array} array - input array containing all attributes
     * @returns {string} - return a string element for randomly generated attribute value
     */
    function getRandomValue(array) {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    }

    /**
     * Returns a randomly-generated array of string attributes in the form [STYLE, SHAPE, COLOR, COUNT] 
     * @param {boolean} isEasy - if true, style attribute is "solid"
     * @returns {array} randomAttribute - array of randomly generated attribute value
     */
    function generateRandomAttributes(isEasy) {
      const allAttribute = [STYLE, SHAPE, COLOR, COUNT];
      let randomAttribute = [];
      for (let i = 0; i < allAttribute.length; i++) {
        randomAttribute.push(getRandomValue(allAttribute[i]));
      }
      if (isEasy) {
        randomAttribute[0] = "solid";
      }

      return randomAttribute;
    }

    /**
     * 
     * @params {boolean, Set} isEasy, boardId - inputs isEasy and boardId
     * @returns {string} newCardId - a unique id that doesn't exist in current board
     */
    // function generateUniqueId(isEasy, boardId) { // TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO: simplify generateUniqueCard

    // }

    /**
     * Returns a div element with COUNT number of img elements appended as children,
     * such that it is unique from any other card attribute set on the board.
     * @param {boolean} isEasy - if true, style attribute is "solid"
     * @returns 
     */
    /**
     * For my reference: create a div element in the form of:
     * <div id="solid-squiggle-red-1" class="card">
     * <img src="imgs/solid-squiggle-red.png" alt="solid-squiggle-red-1">
     * </div>
     */
    function generateUniqueCard(isEasy) {
      let board = qsa("#board > div"); // select all div elements in board
      // Learned Set in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
      // Set stores unique values of any type
      let boardId = new Set();
      for (let i = 0; i < board.length; i++) { // store all ids in the board into a Set named boardId
        boardId.add(board[i].id);
      }

      let newCard = gen("div");
      newCard.classList.add("card"); // class .card added to newCard (div) in order to style the cards
      newCard.addEventListener("click", cardSelected); // a click event listener that calls func cardSelected
      let newCardId = null;
      let newCardAttributes = null;
      let isUniqueId = false;
      while (!isUniqueId) {
        newCardAttributes = generateRandomAttributes(isEasy);
        newCardId = newCardAttributes.join("-"); // STYLE-SHAPE-COLOR-COUNT
        if (!boardId.has(newCardId)) {
          isUniqueId = true;
        }
      }
      newCard.id = newCardId; // TODO: change this into a function

      for (let i = 0; i < newCardAttributes[3]; i++) { // COUNT = [3]
        let newCardImg = gen("img");
        // format imgs/solid-squiggle-red.png, STYLE-SHAPE-COLOR
        newCardImg.src = "imgs/" + newCardAttributes.slice(0, 3).join("-") + ".png";
        newCardImg.alt = newCardId;
        newCard.appendChild(newCardImg);
      }

      return newCard;
    }
    
    /**
     * This is the helper function for isASet, it checks if all attributes are same or different
     * @param {array} array - check if the array is ALL same or different
     * @returns {boolean} - true if ALL same or different
     */
    function allSameOrDifferent(array) {
      let resultAllSame = true;
      let resultAllDifferent = true;
      for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {  // for loop to compare each element of an array
          if (array[i] === array[j]) { 
            resultAllDifferent = false;
          } else {
            resultAllSame = false;
          }
        }
      }
      return (resultAllSame || resultAllDifferent);
    }

    /**
     * Returns a boolean value based on whether a given list of 3 cards comprises a Set.
     * @param {DOMList} selected - DOM list of 3 card div elements from func generateUniqueCard(isEasy) that are selected
     * @returns {boolean} - true if all the given cards are a Set, otherwise returns false
     */
    function isASet(selected) {
      let selectedAttributes = [];
      for (let i = 0; i < selected.length; i++) { // get attributes for each selected card
        selectedAttributes.push(selected[i].id.split("-"));
      }
      for (let k = 0; k < selectedAttributes[0].length; k++) { // for loop to compare each attribute (column)
        let eachAttribute = [];
        for (let i = 0; i < selectedAttributes.length; i++) {
          eachAttribute.push(selectedAttributes[i][k]);
        }
        if (!allSameOrDifferent(eachAttribute)) { // if one result is not allSameOrDifferent, then return false
          return false;
        }
      }
      return true;
    }

    /**
     * Used when a card is selected, checking how many cards are currently selected.
     * If 3 cards are selected, uses isASet to handle "correct" and "incorrect" cases.
     * No parameters, and no returns.
     */
    function cardSelected() {
      this.classList.toggle("selected"); // set clicked to selected

      // check if all three sets are selected
      let allSelected = qsa(".selected"); // or, use .selected also works
      if (allSelected.length < 3) {
        return;
      }

      // when all of them are selected, check if result is true or false
      let isIndeedASet = isASet(allSelected);

      // before if cases, toggle .selected appearance
      for (let i = 0; i < allSelected.length; i++) {
        allSelected[i].classList.remove("selected");
      }

      // start displaying message for 2 cases
      if (isIndeedASet) {
        id("set-count").textContent = parseInt(id("set-count").textContent) + 1; // Number of sets found should be incremented
        for (let i = 0; i < allSelected.length; i++) {
          allSelected[i].classList.add("hide-imgs"); // add the class .hide-imgs to the .card itself
          let correctMsg = gen("p");
          correctMsg.textContent = "SET!";
          allSelected[i].appendChild(correctMsg); // create <p> element containing the text message "SET!" 
          setTimeout(() => {
            const isEasy = qs("input[name='diff']:checked").value === "easy";
            let newCard = generateUniqueCard(isEasy);
            id("board").replaceChild(newCard, allSelected[i]);
          }, 1000);
        }
      } else {                                                               // Not a set
        for (let i = 0; i < allSelected.length; i++) {
          allSelected[i].classList.add("hide-imgs"); // add the class .hide-imgs to the .card itself
          let errorMsg = gen("p");
          errorMsg.textContent = "Not a Set :(";
          allSelected[i].appendChild(errorMsg); // create <p> element containing the text message "Not a Set :(" 
          setTimeout(() => {
            // in this case, do NOT need to replace selected set; instead remove errorMsg, re-display same cards
            allSelected[i].removeChild(errorMsg);
            allSelected[i].classList.remove("hide-imgs");
          }, 1000);
        }
        errorDeduction();
      }
    }

    /**
     * Helper function to deduct 15 seconds when result is incorrect
     * No parameters, and no returns.
     */
    function errorDeduction() {
      secondsRemaining = Math.max(0, secondsRemaining - 15); // make sure timer never go below 0 seconds
      if (secondsRemaining === 0) {
        disableBoard();
      }
      id("time").textContent = formatTimer(secondsRemaining);
    }

/* ---------------------------------- THIS IS THE OPTIONAL CHALLENGE ------------------------------------------------- */

    /**
     * Helper function to check for a unique set of cards on the board
     * No parameters
     * @returns {boolean} - true if any three cards isASet
     */
    /**
     * For my reference of pseudocode:
     * for every card A on the board:
     *    for every other card B on the board:
     *      for every other card C on the board:
     *          if isASet(A, B, C) return true
     * return false
     */
    function checkValidSets() {
      let allCards = qsa(".card");
      for (let i = 0; i < allCards.length; i++) {
        for (let j = i + 1; j < allCards.length; j++) {
          for (let k = j + 1; k < allCards.length; k++) {
            if (isASet([allCards[i], allCards[j], allCards[k]])) {
              return true;
            }
          }
        }
      }
      return false;
    }

    /**
     * If the button is clicked when a valid Set exists on the board,
     * 15 seconds penalty should be applied to the timer
     * No parameters, and no returns.
     */
    function checkPenalty() {
      let needPenalty = checkValidSets();
      if (needPenalty) {
        errorDeduction();
        let penaltyMsg = gen("p");
        penaltyMsg.textContent = "(15 second penalty) there were Sets left on the board!";
        id("message-area").appendChild(penaltyMsg);
        id("message-area").classList.remove("hidden");
        setTimeout(() => {
          id("message-area").removeChild(penaltyMsg);
          id("message-area").classList.add("hidden");
        }, 3000);
      }
    }

    init();
  })();