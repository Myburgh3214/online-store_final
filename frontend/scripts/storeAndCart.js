window.showCart = () =>{  
  document.getElementById('clean-cart').classList.remove('hidden');
}
window.hideCart = () =>{  
  document.getElementById('clean-cart').classList.add('hidden');
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
      window.location.hash = `#${id}`;
      window.location.reload();
    }
    window.products = response;
    window.cart = new cart(window.sessionId);

    window.hideCart();
  });
});

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

                                                                                                                                                                               