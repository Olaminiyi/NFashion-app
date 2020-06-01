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
}

//local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  products.getProducts().then((products) => ui.displayProducts(products));
});
