/*
 * NAME: Changhao Xu
 * DATE: June 2, 2023
 * CS 132 Spring 2023
 * 
 * This is the faq.js file for final project, an e-commerce store that sells keyboards.
 * This file handles all frequently-asked questions. (Option 6)
 */

(function() {
  "use strict";

  /**
   * This is a function that initializes the faq page with fetch/GET call.
   * No parameters, and no returns.
   */
  async function init() {
    try {
      let resp = await fetch("/faq");
      checkStatus(resp);
      let data = await resp.json();
      for (let item of data) {
        let faq_each = gen("div");
        let ques = gen("h3");
        ques.textContent = item.question;
        let answ = gen("p");
        answ.textContent = item.answer;

        faq_each.appendChild(ques);
        faq_each.appendChild(answ);
        id("faq-container").appendChild(faq_each);
      }
    } catch (error) {
      handleError(error);
    }
    
  }

  /**
   * Displays an error message on the page.
   * Here is a fetch/GET call, so no user error like /contact.
   * A simple errMsg will show as a result.
   * @param {String} errMsg - optional specific error message to display on page.
   */
  function handleError(errMsg) {
    let err = gen("p");
    err.textContent = errMsg;
    id("faq-container").appendChild(err);
  }

  init();
})();