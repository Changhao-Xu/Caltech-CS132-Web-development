/*
 * NAME: Changhao Xu
 * DATE: June 2, 2023
 * CS 132 Spring 2023
 * 
 * This is the contact.js file for final project, an e-commerce store that sells keyboards.
 * This file handles all inquiries from customers.
 */

(function() {
  "use strict";

  /**
   * This is a function that initializes the event listeners for the submit button.
   * No parameters, and no returns.
   */
  function init() {
    qs(".contact-form").addEventListener("submit", (evt) => {
      evt.preventDefault(); // submit event handler to prevent the page from reloading
      submitContact();
    });
  }

  /**
   * This is a helper function that verify all inputs are valid before sending the contact to API.
   * No parameters, and no returns.
   */
  function checkInputs() {
    if (id("results").textContent.trim() !== "") { // empty results first
      id("results").textContent = "";
    }
    // The following check is actually redundant, since I already defined required in html.
    // Here is just to show that we can further check inputs from client JS.
    const name = id("name").value;
    const email = id("email").value;
    const subject = id("subject").value;
    const inquiry = id("inquiry").value;
    if (name === "") {
      handleError("Please provide your first and last name");
    }
    if (email === "") {
      handleError("Please provide your email");
    }
    if (subject === "") {
      handleError("Please provide your inquiry subject");
    }
    if (inquiry === "") {
      handleError("Please provide your inquiries");
    }
  }

  /**
   * This is the function for submitting contact.
   * No parameters, and no returns.
   */
  async function submitContact() {
    checkInputs();
    let params = new FormData(qs(".contact-form"));
    try {
      let resp = await fetch("/contact", { method : "POST", body : params });
      checkStatus(resp);
      id("results").textContent = (await resp.json()).msg;
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Displays an error message on the page.
   * If errMsg is passed as a string, the string is used to customize an error message.
   * Otherwise (the errMsg is an object or missing), a generic message is displayed.
   * @param {String} errMsg - optional specific error message to display on page.
   */
  function handleError(errMsg) {
    if (typeof errMsg === "string") {
      id("results").textContent = errMsg;
    } else {
      // the err object was passed, don't want to show it on the page;
      // instead use generic error message.
      id("results").textContent =
        "An error occurred submitting the inquiry. Please try again later.";
    }
  }

  init();
})();