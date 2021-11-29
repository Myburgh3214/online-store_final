window.productsReady = (products) => {
  let productAttr = document.getElementById('products-list').getAttribute('patt') || null;
  let singleProduct = false;
  if (window.location.hash !== '' && window.location.hash !== '#') {
    singleProduct = window.location.hash.substring(1);
  }
  let newHtml = '';
  for (let product of products) {
    if (singleProduct !== false) {
      if (singleProduct !== product.id) continue;
      singleProduct = product;
    } else if (productAttr !== null) {
      if (product[productAttr] != "1") continue;
    }

    newHtml += `<div class="card ${singleProduct !== false ? 'enlarged' : ''}"><div class="av-center">
      <div class="av-prod-img ${(singleProduct === false ? 'av-sm' : '')}" style="background-image: url('images/${product.image}');"></div>
        </div><p class="product-name" >${product.name}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-price" >R${product.price}</p>`;
    if (singleProduct === false)
      newHtml +=`<button onclick="window.goToProduct('${product.id}')">VIEW ITEM</button>`
    newHtml += `<button onclick="addProductToCart('${product.id}', '${product.name}')" >ADD TO CART</button>
      </div>`;
  }
  document.getElementById('products-list').innerHTML = newHtml;
  if (singleProduct !== false) {
    document.getElementsByTagName('title')[0].innerText = `${singleProduct.name} - Online Store`;
  }
};
function addProductToCart(productId, name) {
  window.cart.addItemToCart(productId);
  window.showCart();
}

// handle cart code
function placeOrder() {
  window.cart.placeOrder(result => {
    if (result.status === 401) { // login required
      alert("Please login/sign up before placing your order...");
      location.href='logIn.html';
      return;
    }
    if (result.status === 201) { // login required
      alert("Thanks for placing your order with us :)");
      window.cart.clearCart();
      return;
    }
    result.text().then(console.log)
  });
}
function cartItemQtyChangeEvent (e) {
  let qty = Number.parseInt(e.value);
  if (qty < 1 || isNaN(qty))
    qty = 1;
  window.cart.updateOrAddItemToCart(e.getAttribute('productId'), qty);
}
window.cartUpdated = (newCart) => {
  let newHtml = '';

  for (let cartItem of newCart.getItems()) {
    let product = cartItem.getProduct();
    let sneakyId = `cart-product-qty-field-${product.id}`;
    newHtml += `<tr><td>${product.name}</td><td>
      <input type="number" value="${cartItem.getQty()}" style="width: 40px;" productId="${product.id}" onchange="cartItemQtyChangeEvent(this)" />
      <a href="javascript:window.cart.removeItemFromCart('${product.id}');">x</a>
      </td><td>R${cartItem.priceTotal().toFixed(2)}</td></tr>`;
  }

  document.getElementById('clean-cart-body').innerHTML = newHtml;
  document.getElementById('clean-cart-total').innerText = `R${newCart.getTotal().toFixed(2)}`;
}

window.showCart = () =>{  
  document.getElementById('clean-cart').classList.remove('hidden');
}
window.hideCart = () =>{  
  document.getElementById('clean-cart').classList.add('hidden');
}

function cart(orderId) { // we match the session id to the order id ....
  this._id = orderId;
  this._products = [];

  this._updateSession = (vm) => {
    window.sessionStorage.setItem('cart-'+orderId, JSON.stringify({
      id: vm._id,
      products: vm._products.map(x=>{
        return {
          id: x.id(),
          qty: x.getQty()
        }
      })
    }));
    if (window.cartUpdated !== undefined) {
      window.cartUpdated(vm); // if the productsReady function is on window, it will be called to let us know we can load the products on screen
    }
  }

  let existingOrder = window.sessionStorage.getItem('cart-'+orderId);
  if (existingOrder === undefined || existingOrder === null) {
    existingOrder = this;
    this._updateSession(this);
  } else {
    let vm = JSON.parse(existingOrder);
    this._id = vm.id;
    this._products = vm.products.map(x=>new cartItem(x.id, x.qty));
  }

  this.updateOrAddItemToCart = (productId, qty) => {
    let foundIndex = -1;
    for (let i = 0 ; i < this._products.length ; i++) {
      if (this._products[i].id() === productId) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex >= 0) {
      if (qty === true) { 
        this._products[foundIndex].addQty(qty);
        this._updateSession(this);
        return;
      }
      if (qty === false) {
        this._products.splice(foundIndex, 1);
        this._updateSession(this);
        return;
      }
      if (qty <= 0) {
        this._products.splice(foundIndex, 1);
      } else {
        this._products[foundIndex].setQty(qty);
      }
      this._updateSession(this);
      return;
    } 
    if (qty > 0) {
      if (qty === false) return;
      if (qty === true) {
        this._products.push(new cartItem(productId, 1));
        this._updateSession(this);
        return;
      }
      this._products.push(new cartItem(productId, qty))
      this._updateSession(this);
    }
  }

  this.getItems = () => {
    return this._products;
  }

  this.addItemToCart = (productId) => {
    this.updateOrAddItemToCart(productId, true);
  }
  this.removeItemFromCart = (productId) => {
    this.updateOrAddItemToCart(productId, false);
  }
  this.clearCart = () => {
    this._products = [];
    this._updateSession(this);
  }

  this.getTotal = () => {
    let total = 0;

    for (let item of this._products) {
      total += item.priceTotal();
    }

    return total;
  }

  // init loaded
  if (window.cartUpdated !== undefined) {
    window.cartUpdated(this); // if the productsReady function is on window, it will be called to let us know we can load the products on screen
  }

  this.placeOrder = (callback) => {
    postRequest('orders', {
      items: this.getItems().map(product => {
        return {
          id: product.id(),
          qty: product.getQty()
        }
      })
    }, callback);
    /*{
      items: [
        {
          id: 'a',
          qty: 1
        },
        {
          id: 'b',
          qty: 1
        }
      ]
    }*/
  }
}

function cartItem(productId, qty) {
  this._id = productId;
  this._qty = qty || 0;

  this.id = () => this._id;
  this.getQty = () => this._qty;
  this.setQty = (qty) => this._qty = qty;
  this.addQty = (qty) => this._qty += qty;
  this.removeQty = (qty) => this._qty -= qty;

  this.priceTotal = () => {
    return this.getProduct().price * this.getQty();
  }

  this.getProduct = () => {
    let thisProduct = null;
    for (let product of window.products) {
      if (product.id == this.id()) {
        thisProduct = product;
        break;
      }
    }
    return thisProduct;
  }
}


getRequest("products", (responseAsObj) => { // Get the current session information from the API for the current browser session
  responseAsObj.json().then(response => { // parse the response into JSON
    for (let i = 0 ; i < response.length ; i++) {
      response[i].price = Number.parseFloat(response[i].price);
    }
    if (window.productsReady !== undefined) {
      window.productsReady(response); // if the productsReady function is on window, it will be called to let us know we can load the products on screen
    }
    window.goToProduct = (id) => {
      if (location.pathname.indexOf('store.html') >= 0) {
        window.location.hash = `#${id}`;
        window.location.reload();
      } else  
        location.href=`store.html#${id}`;
    }
    window.products = response;
    window.cart = new cart(window.sessionId);

    window.hideCart();
  });
});