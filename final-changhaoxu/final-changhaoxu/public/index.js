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
  function init() {
    populateStore(); // this function is copyed from HW2B, set game.
    qs('.search-container select').addEventListener('change',() => {
      fetchStore(qs('.search-container select').value);
    }); // a request to select for keyboards is made
    id('search-results').addEventListener('change', () => {
      if (id('search-results').value) {
        fetchStore(id('search-results').value); // a request to search for keyboards is made
      }
    });
  }

  /**
   * This is a function that populate the store with fetch/GET call.
   * No parameters, and no returns.
   */
  async function populateStore() {
    id("store").classList.remove("hidden");
    id("detail").classList.add("hidden");
    let store = id("store");
    while (store.hasChildNodes()) {
      store.removeChild(store.firstChild);
    }
    try {
      let resp = await fetch("/store");
      checkStatus(resp);
      let data = await resp.json();
      for (let item of data) {
        generateCard(item);
      }
    } catch (error) {
      handleError(error);
    }
  }

  async function fetchStore(category_key) {
    let store = id("store");
    while (store.hasChildNodes()) {
      store.removeChild(store.firstChild);
    }
    try {
      if (category_key === "all") {
        populateStore();
      } else {
        let resp = await fetch(`/store/${category_key}`);
        checkStatus(resp);
        let data = await resp.json();
        for (let item of data) {
          generateCard(item);
        }
      }
    } catch (error) {
      handleError(error);
    }
  }
  // for main view, show keyboard_img, category, price
  /* For my reference: the store fetch will return json in the format of
    {
      "keyboard_id": 10001,
      "keyboard_img": "office-1.jpg",
      "keyboard_descr": "A classical office keyboard from Logitech",
      "category": "office",
      "price": 29,
      "quantity": 10
    }
  */

  /**
   * This is a function that generates each keyboard card,
   * the code is reproduced from HW2: set.js with modifications.
   * @param {JSON} item - each item in cart, contains keyboard_id, order_qty
   * No returns
   */
  async function generateCard(item) {
    try {
      let newCard = gen("article");
      let resp = await fetch(`/detail?keyboard_id=${item.keyboard_id}`);
      checkStatus(resp);
      let cardInfo = await resp.json(); // This cardInfo contains all details to be populated
      let cardTitle = gen("h3");
      cardTitle.textContent = cardInfo[0].category + " keyboard";
      let cardImage = gen("img");
      cardImage.src = "imgs/" + cardInfo[0].keyboard_img;
      cardImage.alt = "This is a image of " + cardTitle.textContent;
      cardImage.addEventListener("click", () => {
        id("store").classList.add("hidden");
        id("detail").classList.remove("hidden");
        populateDetails(item);
      });
      let hr = gen("hr");
      let cardPrice = gen("p");
      cardPrice.textContent = "Unit price: $" + cardInfo[0].price;
      [cardTitle, cardImage, hr, cardPrice].forEach(element => {
        newCard.appendChild(element);
      });
      let addCartBtn = gen("button");
      addCartBtn.textContent = "Add to cart";
      addCartBtn.addEventListener("click", () => {
        addCart(item);
      });
      newCard.appendChild(addCartBtn);
      id("store").appendChild(newCard);
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * This is a helper function to add item to cart
   * @param {JSON} item - keyboard item
   * No returns
   */
  async function addCart(item) {
    try {
      let params =  new FormData();
      params.append("keyboard_id", item.keyboard_id);
      let resp = await fetch("/addCart", { method : "POST", body : params });
      checkStatus(resp);
      id("cart-message").textContent = (await resp.json()).msg;
    } catch (error) {
      handleError(error);
    }
  }
  
  // For detailed view, show keyboard_img, category, price ++ keyboard_descr, quantity
  function populateDetails(item) {
    while (id("detail").hasChildNodes()) {
      id("detail").removeChild(id("detail").firstChild);
    }
    let newCard = gen("article");
    let cardTitle = gen("h3");
    cardTitle.textContent = item.category + " keyboard";
    let cardImage = gen("img");
    cardImage.src = "imgs/" + item.keyboard_img;
    cardImage.alt = "This is a image of " + cardTitle.textContent;
    let hr = gen("hr");
    let cardPrice = gen("p");
    cardPrice.textContent = "Unit price: $" + item.price;
    let cardDescr = gen("p");
    cardDescr.textContent = item.keyboard_descr;
    let cardQty = gen("p");
    if (item.quantity) {
      cardQty.textContent = `Only ${item.quantity} keyboards left, order soon before it's gone!`;
    } else {
      cardQty.textContent = "All keyboards have sold out! Please contact us for replenishment!"
    }
    [cardTitle, cardImage, hr, cardPrice, cardDescr, cardQty].forEach(element => {
      newCard.appendChild(element);
    });
    id("detail").appendChild(newCard);
    let backBtn = gen("button");
    backBtn.textContent = "Back to Store";
    backBtn.addEventListener("click", populateStore);
    id("detail").appendChild(backBtn);
  }

  /**
   * Displays an error message on the page.
   * Here is a fetch/GET call, so no user error like /contact.
   * A simple errMsg will show as a result.
   * @param {String} errMsg - optional specific error message to display on page.
   */
  function handleError(errMsg) {
    if (id("cart-message").textContent.trim() !== "") { // empty message first
      id("cart-message").textContent = "";
    }
    id("cart-message").textContent = errMsg;
  }

  init();
})();