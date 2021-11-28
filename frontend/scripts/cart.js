

function cart(orderId) { // we match the session id to the order id ....
  this._orderId = orderId;
  this._products = [];

  this.updateOrAddItemToCart = (productId, qty) => {
    let foundIndex = -1;
    for (let i = 0 ; i < this._products.length ; i++) {
      if (this._products[i].id() === productId) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex >= 0) {
      if (qty <= 0) {
        this._products.splice(i, 1);
      } else {
        this._products[i].setQty(qty);
      }
    } else if (qty > 0) {
      this._products.push(cartItem(productId, qty))
    }
  }

  getItems = () => {
    return this._products;
  }
}

function cartItem(productId, qty) {
  this._id = productId;
  this._qty = qty || 0;

  this.id = () => this._id;
  this.setQty = (qty) => this._qty = qty;
  this.addQty = (qty) => this._qty += qty;
  this.removeQty = (qty) => this._qty -= qty;
}

