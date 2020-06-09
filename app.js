// adding contentful
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "pu6s20v1iy4k",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "JdR0FpkOggbpMBN6q1zp7pXjOO1VYE9zhex7dIPrupk",
});

//console.log(client);

// variables declaration
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
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
      // getting items through contentful inplace of json
      let contentful = await client.getEntries({
        content_type: "nFashion",
      });
      // ====== contentful
      // .then((response) => console.log(response.items))
      // .catch(console.error)
      //=========================================
      // get the products using fetch method
      // using local data
      // let result = await fetch("products.json");
      // get data in json format
      // let data = await result.json();
      //=============================================

      let products = contentful.items;
      // let products = data.items;
      // using ES6 map function for destructuring the products objects
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          title,
          price,
          id,
          image,
        };
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
              add to cart
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
        let cartItem = {
          ...Storage.getProduct(id),
          amount: 1,
        };

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
        this.addCartItem(cartItem);
        // show the cart
        this.showCart();
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
    // use toFixed method to round the temTotal value to 2 d.c.p
    // use parseFloat to convert to float
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    //console.log(cartTotal, cartItems);
  }
  // method to add cart to the cart-item div
  addCartItem(item) {
    // create a div using document.createElement
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = ` <img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>

    `;
    cartContent.appendChild(div);
    //console.log(cartContent);
  }
  // show the cart
  // using the 'transparentBcg' and 'showCart' css class
  // add 'transparentBcg' class style to the cartOverlay
  // add 'showCart' class style to the cartDom
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  //set the cart values to the item saved already in the local storage
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    // cart functionality
    cartContent.addEventListener("click", (event) => {
      //accessing the css class of remove-item, increase and decrease button
      // using event,target.classlist
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        // using removeChild method to remove it from the dom
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      }
      // for adding button
      else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        //console.log(addAmount);
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      }
      // for lower button
      else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        // if the selected item in the cart = 1 or more than 1
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        }
        // if the selected is not present in the cart again
        else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    console.log(cartContent.children);

    // removing the item from the item from the cart dom using the children attribute
    // loop through the cart content and remove them one by one
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    // update the cart values
    this.setCartValues(cart);
    // save the current items in the cart to local storage
    Storage.saveCart(cart);
    // make the add to bag button of the item be active
    // and change from in cart to add bag to button
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart">add to cart
    </i> `;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
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
  // get item present in the local storage when loading the page
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  // setup App
  ui.setupAPP();
  // get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
