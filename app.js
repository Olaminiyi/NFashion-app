// variables declaration
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-btn");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOm = document.querySelector(".products-center");

//cart
let cart = [];
// buttons
let buttonsDOM = [];

// getting the products
class Products {
  async getProducts() {
    try {
      // get the products using fetch method
      let result = await fetch("products.json");
      // get data in json format
      let data = await result.json();
      let products = data.items;
      // using ES6 map function for destructuring the products objects
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
// display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
       <!--Single products -->
    <article class="product" >
     <div class="img-container">
      <img 
      src=${product.image} 
      alt="product" 
      class="product-img" />
      <button class="bag-btn" data-id=${product.id}>
       <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
     </div>
     <h3>${product.title}</h3>
     <h4>$${product.price}</h4>
        </article >
 <!-- end of Single products-- ->
     
     `;
    });
    productsDOm.innerHTML = result;
  }

  // getting all the add to bag button
  // add spread parameters ... to make the button an array
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //get product from products
        //make it an object
        // use spread operator to make the product an array
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        // add product to the cart
        //using spread operator to get all the item in the cart = empty
        // add cartItem to it
        cart = [...cart, cartItem];
        console.log(cart);

        // save cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // display cart item
        // show the cart
      });
    });
  }
  // using map function to map each item in the cart with price and amount
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    // use toFixed function to round the temTotal value to 2 d.c.p
    // use parseFloat to convert to float
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    console.log(cartTotal, cartItems);
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  // getting the product id from localStorage
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  // saving the cart in the local storage
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
