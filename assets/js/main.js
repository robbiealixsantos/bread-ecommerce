if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()

    ttq.track('ViewContent', {
        content_id: generateRandomID(),
        content_type: 'product',
        content_name: 'view main homepage'
    });
}

function checkForPixel() {
    return ttq ? pixelLoaded = true : pixelLoaded = false
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    document.getElementsByClassName('subscribe')[0].addEventListener('click', subscribeClicked)
    document.getElementsByClassName('footer__contact')[0].addEventListener('click', pixelTrackSubscribe)
}

function purchaseClicked() {
    alert('Thank you for your purchase')

    pixelTrackPurchase();

    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function subscribeClicked() {
    alert('Thank you for subscribing');
    pixelTrackSubscribe();
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function generateRandomID() {
    min = Math.ceil(1);
    max = Math.floor(10000);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pixelTrackAddToCart(title, price) {
    let priceString = price.replace("$", "");
    let priceInt = parseInt(priceString);

    ttq.track('AddToCart', {
        content_id: generateRandomID(),
        content_type: 'product',
        content_name: title,
        quantity: 1,
        price: priceInt,
        value: priceInt,
        currency: 'USD',
    });
    
    console.log("in the pixelTrackAddToCart");
}

function pixelTrackSubscribe() {
    ttq.track('Subscribe');
    console.log("in the pixelTrackSubscribe");
}

function pixelTrackContact() {
    ttq.track('Contact', {
        content_id: generateRandomID(),
        content_type: 'product',
        content_name: 'click on contact email address'
    });
}

function pixelTrackPurchase() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');

    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }

    let transactionID = generateRandomID();

    ttq.track('InitiateCheckout', {
        content_id: transactionID,
        content_type: 'product',
        content_name: 'initiate checkout',
        quantity: parseInt(quantity),
        price: total,
        value: total,
        currency: 'USD',
    });

    ttq.track('CompletePayment', {
        content_id: transactionID,
        content_type: 'product',
        content_name: 'complete payment',
        quantity: parseInt(quantity),
        price: total,
        value: total,
        currency: 'USD',
    });

    ttq.track('PlaceAnOrder', {
        content_id: transactionID,
        content_type: 'product',
        content_name: 'place an order',
        quantity: parseInt(quantity),
        price: total,
        value: total,
        currency: 'USD',
    });

    console.log("in the pixelTrackPurchase");
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    pixelTrackAddToCart(title, price);
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}