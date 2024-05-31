if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', readyEventHandler)
} else {
    readyEventHandler()
}

function checkForPixel() {
    return ttq ? pixelLoaded = true : pixelLoaded = false
}

function generateRandomID() {
    min = Math.ceil(1);
    max = Math.floor(10000);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Global vars for mock login flow - most information should be coming from application backend/db
let userEmailAddress = "";
let loggedIn = false;
let isNewUser = true;
let visit_id = 0;

let external_id = '9136abb9cb6c3d79df9bbd7b46c1f96a12557a8f89ada3f0a84ce0671d45e5a2';
let userPhoneNumber = '162af733d29d9bdf48e4a2cc5637af46983b893a4c92c257a460d24256d16c9f';

// TODO: Change this Pixel Reference for easy switching if required
let ttqInstancePixelReference = 'CO67I9JC77UFE3KSC7VG';

// Cart array to build JSON object for checkout event
let cart = []

//TT Events can be used as proxies
function readyEventHandler() {
    visit_id = generateRandomID();

    let removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    let quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    let addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    document.getElementsByClassName('subscribe')[0].addEventListener('click', subscribeClicked)
    document.getElementsByClassName('footer__contact')[0].addEventListener('click', pixelTrackContact)
    document.getElementsByClassName('login__link')[0].addEventListener('click', mockLogin)
    document.getElementsByClassName('disable__cookie')[0].addEventListener('click', ttqDisableCookieFire)

    //Track if user is on landing page for more than 10 seconds
    //window.setTimeout(pixelTrackLandingPageTime, 10000);
}


function pixelIdentifyHandler(externalId, userEmailAddress) {
    ttq.identify({
        email: userEmailAddress
    })
}

function viewContentImgClick(name, product_id, cost) {
    alert("This is simulating a PDP (Product Display Page) view and a ViewContent event will be triggered." + "\n" +
    "Please check the Pixel Helper for Parameter Details");
    
    pixelIdentifyHandler(userEmailAddress);
    ttq.track('ViewContent', {
        content_id: product_id,
        content_name: name,
        content_type: 'product',
        price: cost,
        value: cost,
        currency: 'USD'
    });
}

function viewContentImgClickIncorrect(name, product_id, cost) {
    alert("This is simulating a PDP (Product Display Page) view and a ViewContent event will be triggered." + "\n" +
    "Please check the Pixel Helper for Parameter Details");

    ttq.track('ViewContent', {
        content_name: name,
        content_type: 'bread',
        price: cost,
        currency: 'usd'
    });
}

function viewContentImgClickIncorrect2x(name, product_id, cost) {
    alert("This is simulating a PDP (Product Display Page) view and a ViewContent event will be triggered." + "\n" +
    "Please check the Pixel Helper for Parameter Details");

    ttq.track('ViewContent', {
        content_name: name,
        content_type: 'bread',
        price: cost,
        currency: 'usd'
    });
    ttq.track('ViewContent', {
        content_name: name,
        content_type: 'bread',
        price: cost,
        currency: 'usd'
    });
}

function viewContentDoubleFiringImageClickHandler(name, product_id, cost) {
    alert("Duplicate ViewContent event due to client misconfiguration");

    pixelIdentifyHandler(userEmailAddress);
    ttq.track('ViewContent', {
        content_id: product_id,
        content_name: name,
        content_type: 'product',
        price: cost,
        value: cost,
        currency: 'USD'
    });
}
//window.setTimeout(pixelTrackLandingPageTime, 10000);

function pixelTrackLandingPageTime() {
    ttq.track('ViewContent', {
        content_name: `view home page - 10 seconds`
    });
}

function mockLogin() {
    let emailAddress = prompt("Mock login screen - enter any email address to continue. Entered email address will be used for Manual Advanced Matching.", "");
    
    if (emailAddress.length > 0) {
      document.getElementById("login").innerHTML = "Welcome " + emailAddress;
      
      //Log in user and assign email address and external id values for advanced matching on user for associated events
      loggedIn = true;
      userEmailAddress = emailAddress;
      //external_id = generateRandomID();

      pixelIdentifyHandler(external_id, userEmailAddress);
      pixelCompleteRegistrationHandler();
    }
}

function ttqDisableCookieFire() {
    ttq.disableCookie();
    alert("ttq.disableCookie() fired! Cookies should now be disabled. Please check the Pixel Helper." + "\n" +
     "Inside the Cookie details tile, you will see a red notification that says 'Not found'." + "\n" +
     "This means that the Pixel and thus the 1st Party Cookies are disabled."
    );
}

function pixelIdentifyFunction(userPhoneNumber, userEmailAddress) {
    ttq.identify({
        email: userEmailAddress,
        phone_number: userPhoneNumber,
        external_id: external_id
    })
}

function pixelCompleteRegistrationHandler() {
    alert("CompleteRegistration event fired. Please check the Pixel Helper to view the hashed value of the Email address you entered on the previous step.");
    ttq.instance(ttqInstancePixelReference).track('CompleteRegistration', {
        content_name: 'Complete Registration' 
    });
}

function mockPaymentDetailsDialogBox() {
    let retVal = confirm("This is a Mock Payment Information Screen - User Inputs Payment Information here and InitiateCheckout event is triggered. Clicking cancel here stops payment process and only InitiateCheckout event is tracked");

    let cartItemContainer = document.getElementsByClassName('cart-items')[0];
    let cartRows = cartItemContainer.getElementsByClassName('cart-row');

    let quantity = 0;
    let price = 0;
    let total = 0

    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        price = parseFloat(priceElement.innerText.replace('$', ''))
        quantity = quantityElement.value
        total = total + (price * quantity)
    }

    if (loggedIn) {
        pixelIdentifyHandler(external_id, userEmailAddress)
    }

    ttq.instance(ttqInstancePixelReference).track('InitiateCheckout', {
        quantity: parseInt(quantity),
        price: total,
        value: total,
        currency: 'USD',
    });

    if (retVal === true) {
        if (!loggedIn) {
            let emailAddress = prompt("Email address prompt for mock payment and to apply Advanced Matching with related events", "");
            userEmailAddress = emailAddress;
            loggedIn = true;

            document.getElementById("login").innerHTML = "Welcome " + emailAddress;

            pixelIdentifyHandler(external_id, userEmailAddress)
            pixelCompleteRegistrationHandler();
            return true;
        } else {
            return true;
        }
    } else {
        alert("Payment step cancelled!");
        return false;
    }
}

function purchaseClicked() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var contentsArray = [];

    var total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }

    if (total === 0) {
        alert ("Please add items to your cart!")
        return;
    }
    
    var paymentDetailsEntered = false;
    paymentDetailsEntered = mockPaymentDetailsDialogBox();

    if (paymentDetailsEntered) {
        alert('CompleteRegistration, AddPaymentInfo, and CompletePayment events should have fired at the same time.' + "\n" + 
        'Several events can fire at the same time and does not necessarily mean there is an issue. Please confirm with the client if this occurs.'
        );

        pixelTrackPurchase();
    
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal()
    }
}

function emailValidation(input) {
    let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regexEmail.test(input)) {
        return true;
    } else {
        return false;
    }
}

function subscribeClicked() {
    // alert("Auto AM test - No ttq.identify() function placed before the tracking event");
    console.log("in the click");
    let input = document.getElementById("subscription_email").value;
    
    if (emailValidation(input)) {
        ttq.instance(ttqInstancePixelReference).track("Subscribe",{});
        // alert('Please check the Pixel Helper for the Auto_email parameter!');
    } else {
        //alert('Please enter a valid email address');
    }
    
    document.getElementById("subscribeButton").hidden = true
}

function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    
    updateCartTotal()
}

function quantityChanged(event) {
    if (loggedIn) {
        pixelIdentifyHandler(external_id, userEmailAddress)
    }

    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }

    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }

    // ttq.track('ClickButton', {
    //     content_id: visit_id,
    //     content_name: "content_name placeholder",
    //     value: input.value,
    //     price: total
    // });

    ttq.instance(ttqInstancePixelReference).track('ClickButton', {
        value: input.value,
        price: total
    });

    updateCartTotal()
}

function pixelTrackAddToCart(title, price) {
    let priceString = price.replace("$", "");
    let priceInt = parseInt(priceString);

    if (loggedIn) {
        pixelIdentifyHandler(external_id, userEmailAddress)
    }

    ttq.instance(ttqInstancePixelReference).track('AddToCart', {
        content_id: visit_id,
        content_type: 'product',
        content_name: title,
        quantity: 1,
        price: priceInt,
        value: priceInt,
        currency: 'USD',
    });
}

function pixelTrackSubscribe() {
    if (loggedIn) {
        pixelIdentifyHandler(external_id, userEmailAddress)
    }

    ttq.instance(ttqInstancePixelReference).track('Subscribe', {
        content_id: visit_id,
        content_name: "content_name placeholder"
    });

    console.log("in the pixelTrackSubscribe");
}

function pixelTrackContact() {
    if (loggedIn) {
        pixelIdentifyHandler(external_id, userEmailAddress)
    }

    ttq.instance(ttqInstancePixelReference).track('Contact', {});
}

function pixelTrackPurchase() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0];
    let cartRows = cartItemContainer.getElementsByClassName('cart-row');

    let quantity = 0;
    let total = 0

    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        quantity = quantityElement.value
        total = total + (price * quantity)
    }

    if (loggedIn) {
        pixelIdentifyHandler(external_id, userEmailAddress)
    }

    ttq.instance(ttqInstancePixelReference).track('AddPaymentInfo', {
        quantity: parseInt(quantity), //amount of items
        price: total, //total amount
        value: total, //per item
        currency: 'USD',
    });

    ttq.instance(ttqInstancePixelReference).track('CompletePayment', {
        quantity: parseInt(quantity),
        price: total,
        value: total,
        currency: 'USD',
    });
}

function addToCartClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    let price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    let imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    //pixelTrackAddToCart(title, price);
    //pixelTrackAddToCartLatest(title, product_id, price)
    updateCartTotal()
}


//NEW ADDTOCART
function pixelTrackAddToCartLatest(title, product_id, price) {
    alert("Item Added To Cart. Please check the Pixel Helper for parameter details. Scroll down to the bottom of the page to view your cart.");
    pixelIdentifyHandler(userEmailAddress);
    ttq.track('AddToCart', {
        content_id: product_id,
        content_name: title,
        content_type: 'product',
        price: price,
        value: price,
        currency: 'USD'
    });

    var itemAddedToCart = {
        content_id: product_id,
        content_name: title,
        content_type: 'product',
        price: price,
        value: price,
        currency: 'USD'
    }
    console.log(cart.includes(product_id));
    if (cart.includes(itemAddedToCart) == false) {
        cart.push(itemAddedToCart);
    }
    
    console.log(cart)
}

function pixelTrackAddToCartLatest2x(title, product_id, price) {
    alert("Item Added To Cart. Please check the Pixel Helper for parameter details. Scroll down to the bottom of the page to view your cart.");
    pixelIdentifyHandler(userEmailAddress);
    ttq.track('AddToCart', {
        content_id: product_id,
        content_name: title,
        content_type: 'product',
        price: price,
        value: price,
        currency: 'USD'
    });
    ttq.track('AddToCart', {
        content_id: product_id,
        content_name: title,
        content_type: 'product',
        price: price,
        value: price,
        currency: 'USD'
    });

    var itemAddedToCart = {
        content_id: product_id,
        content_name: title,
        content_type: 'product',
        price: price,
        value: price,
        currency: 'USD'
    }
    console.log(cart.includes(product_id));
    if (cart.includes(itemAddedToCart) == false) {
        cart.push(itemAddedToCart);
    }
    
    console.log(cart)
}

function addItemToCart(title, price, imageSrc) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('This item is already added to the cart')
            return
        }
    }
    let cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <a onClick="removeFromCartArray('${title}')" class="button shop-item-button remove-item" type="button">REMOVE</a>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('remove-item')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function removeFromCartArray(product_name) {
    product_name = product_name.charAt(0) + product_name.substring(1).toLowerCase();
    console.log(product_name);
    cart.includes(product_name);
    var index = cart.indexOf(product_name);
    console.log(index)
    cart.splice(index,2);
    console.log(cart);
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}


