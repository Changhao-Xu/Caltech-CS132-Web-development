/*
NAME: Changhao Xu
DATE: June 2, 2023
CS 132 Spring 2023

This is the sql database file for final project, an e-commerce store that sells keyboards.
This database contains 4 tables:
  store contains all keyboards in the store,
  cart contains user's shopping cart,
  contact contains users' inquiries (such as shipping estimate),
  faq contains frequently-asked questions.
*/

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
flush privileges;
CREATE DATABASE IF NOT EXISTS keyboarddb;
USE keyboarddb;

-- These clear the database so we can easily repopulate if needed.
DROP TABLE IF EXISTS cart;      -- cart: id (same with store id), order_qty
DROP TABLE IF EXISTS store;     -- store: id, img, description, category, quantity
DROP TABLE IF EXISTS contact;   -- contact: id, name, email, subject, inquiry
DROP TABLE IF EXISTS faq;       -- faq: id, question, answer

CREATE TABLE store(
  keyboard_id    INT PRIMARY KEY,
  keyboard_img   VARCHAR(255) NOT NULL,
  keyboard_descr TEXT NOT NULL,
  category       VARCHAR(255) NOT NULL,
  price          INT NOT NULL,
  quantity       INT NOT NULL DEFAULT 10 CHECK (quantity >= 0)
);

CREATE TABLE cart(
  keyboard_id    INT PRIMARY KEY,
  order_qty      INT NOT NULL,
  FOREIGN KEY (keyboard_id) REFERENCES store(keyboard_id) -- require same keyboard id
);

CREATE TABLE contact(
  inquiry_id     INT PRIMARY KEY AUTO_INCREMENT,
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  subject        VARCHAR(255) NOT NULL,
  inquiry        TEXT NOT NULL
);

CREATE TABLE faq(
  faq_id         INT PRIMARY KEY,
  question       TEXT NOT NULL,
  answer         TEXT NOT NULL
);

INSERT INTO store(keyboard_id, keyboard_img, keyboard_descr, category, price, quantity) VALUES
(10001, "office-1.jpg", "A classical office keyboard from Logitech", "office", 29, 10),
(10002, "office-2.jpg", "A cute office keyboard from Logitech", "office", 29, 10),
(10003, "office-3.jpg", "A classical office keyboard from Microsoft", "office", 29, 10),
(20001, "mechanical-1.jpg", "A white mechanical keyboard from Cherry", "mechanical", 49, 10),
(20002, "mechanical-2.jpg", "A purple mechanical keyboard from Cherry", "mechanical", 49, 10),
(20003, "mechanical-3.jpg", "A black mechanical keyboard from Cherry", "mechanical", 49, 10),
(30001, "gaming-1.jpg", "An intermediate gaming keyboard from HyperX", "gaming", 69, 10),
(30002, "gaming-2.jpg", "A professional gaming keyboard from HyperX", "gaming", 79, 10),
(30003, "gaming-3.jpg", "A beginner gaming keyboard from Cherry", "gaming", 59, 10),
(40001, "ergonomic-1.jpg", "An ergonomic keyboard from Logitech", "ergonomic", 89, 10),
(40002, "ergonomic-2.jpg", "An ergonomic keyboard from Microsoft", "ergonomic", 89, 10),
(40003, "ergonomic-3.jpg", "An ergonomic keyboard from HyperX", "ergonomic", 89, 10),
-- customized keyboards are unique, only 1 in stock for each!
(50001, "customized-1.jpg", "A customized sakura keyboard from our store", "customized", 99, 1),
(50002, "customized-2.jpg", "A customized leaf-specimen keyboard from our store", "customized", 129, 1),
(50003, "customized-3.jpg", "A customized keyboard with custom keycaps from our store", "customized", 129, 1);

INSERT INTO faq(faq_id, question, answer) VALUES
(100001, "How long does it take to ship?", "Our standard shipping times vary based on the destination. For domestic orders within the United States, please allow 3-5 business days for your order to arrive. International orders typically take 1-2 weeks, depending on customs clearance times. Please note that these are estimates and actual shipping times may vary. We recommend you to contact us for the most accurate delivery information."),
(100002, "What is your return policy for keyboards?", "We offer a 30-day return policy for keyboards that are in their original condition. If the product is defective or damaged, we will cover the return shipping costs."),
(100003, "Do you offer any warranties on your keyboards?", "Yes, all our keyboards come with a one-year manufacturer's warranty. This covers any defects in materials or workmanship. Please note, the warranty does not cover accidental damage or misuse."),
(100004, "Do you sell spare parts for the keyboards or provide repair services?", "Yes, we offer a range of spare parts for our keyboards, and we also have a repair service. Please contact our customer service team for more information or to schedule a repair."),
(100005, "Do you offer discounts for bulk purchases?", "Yes, we do offer discounts for bulk orders. Please contact our sales team with the details of the keyboards you wish to purchase and the quantities, and they will provide you with a quote."),
(100006, "What payment methods do you accept?", "We accept all major credit and debit cards, PayPal, and Bank Transfers. If you have a specific payment method in mind that is not listed, please contact our customer service to see if we can accommodate it."),
(100007, "Are your keyboards suitable for gaming or professional use?", "Yes, we offer a wide variety of keyboards designed for different uses, including gaming and professional work. You can filter your search on our website based on your specific requirements to find the right fit."),
(100008, "Where is your store located?", "Our store is based in Pasadena, California. We are opening our first store in Beverly center soon! Please stay tuned! Remember, our customer service team is always here to help if you have any other questions or concerns.");