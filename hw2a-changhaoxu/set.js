/**
 * NAME: Changhao Xu
 * DATE: April 29, 2023
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
  
    // using defer in script tag so page is ready when JS is ran

    /**
     * This is a function that initializes the event listeners for the start and main buttons.
     * No parameters, and no returns.
     */
    function init() {
      // this code is ran after page is loaded!
      const startBtn = qs("#start-btn");
      const mainBtn = qs("#back-btn");
      startBtn.addEventListener("click", toggleView);
      mainBtn.addEventListener("click", toggleView);
    }
    /**
     * This is a function that toggles the visibility of the #menu-view and #game-view elements.
     * No parameters, and no returns.
     */
    function toggleView() { // (e) is optional event object, see Lec07/08 P39
      const menuView = qs("#menu-view");
      const gameView = qs("#game-view");
      menuView.classList.toggle("hidden"); // Removes a class that is in the list, adds a class that is not in the list.
      gameView.classList.toggle("hidden");
    }
    
    init();
  })();