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
    populateCart(); // this function is copyed from HW2B, set game.
    const orderBtn = id("order-btn");
    orderBtn.addEventListener("click", submitOrder);
  }

  /**
   * This is a function that populate the cart with fetch/GET call.
   * No parameters, and no returns.
   */
  async function populateCart() {
    let cart = id("cart");
    while (cart.hasChildNodes()) {
      cart.removeChild(cart.firstChild);
    }
    try {
      let resp = await fetch("/cart");
      checkStatus(resp);
      let data = await resp.json();
      for (let item of data) {
        generateCard(item);
      }
    } catch (error) {
      handleError(error);
    }
  }

  // for main view, show keyboard_img, category, price
  // For detailed view, show keyboard_img, category, price ++ keyboard_descr, quantity
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
      let hr = gen("hr");
      let cardPrice = gen("p");
      cardPrice.textContent = "Unit price: $" + cardInfo[0].price;
      let cardQty = gen("p");
      cardQty.textContent = "Order quantity: " + item.order_qty;
      [cardTitle, cardImage, hr, cardPrice, cardQty].forEach(element => {
        newCard.appendChild(element);
      });
      let removeCartBtn = gen("button");
      removeCartBtn.textContent = "Remove from cart";
      let params =  new FormData();
      params.append("keyboard_id", item.keyboard_id);
      removeCartBtn.addEventListener("click", async () => {
        let resp = await fetch("/removeCart", { method : "POST", body : params });
        checkStatus(resp);
        id("order-message").textContent = (await resp.json()).msg;
        populateCart(); // refresh cart page
      });
      newCard.appendChild(removeCartBtn);
      id("cart").appendChild(newCard);
    } catch (error) {
      handleError(error);
    }
  }

  async function submitOrder() {
    try {
      let resp = await fetch("/cart");
      checkStatus(resp);
      resp = await resp.json();
      if (resp.length) { // cart is filled with keyboard
        for (let item of resp) { // order each item
          let params =  new FormData();
          params.append("keyboard_id", item.keyboard_id);
          params.append("order_qty", item.order_qty);
          let resp_order = await fetch("/order", { method : "POST", body : params });
          checkStatus(resp_order);
          id("order-message").textContent = (await resp_order.json()).msg;
        }
      } else { // cart is empty
        handleError("Cart is empty. There is nothing to order!");
      }
    } catch (error) {
      handleError(error);
    }
    populateCart(); // refresh cart page
  }
  

  /**
   * Displays an error message on the page.
   * Here is a fetch/GET call, so no user error like /contact.
   * A simple errMsg will show as a result.
   * @param {String} errMsg - optional specific error message to display on page.
   */
  function handleError(errMsg) {
    if (id("order-message").textContent.trim() !== "") { // empty message first
      id("order-message").textContent = "";
    }
    id("order-message").textContent = errMsg;
  }

  init();
})();