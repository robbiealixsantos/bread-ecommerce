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

// TODO: Change this Pixel Reference for easy switching if required
let ttqInstancePixelReference = 'CKR8EOJC77U1BIIGD66G';

//TT Events can be used as proxies 

function readyEventHandler() {
    visit_id = generateRandomID();
    // ttq.track('ViewContent', {
    //     content_id: visit_id,
    //     content_name: "view home page"
    // });

    // ttq.instance() for Custom Code Pixel only
    ttq.instance(ttqInstancePixelReference).track('ViewContent', {
        content_id: visit_id,
        content_name: "view home page"
    });

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
    window.setTimeout(pixelTrackLandingPageTime, 10000);
}

function pixelTrackLandingPageTime() {
    // ttq.track('ViewContent', {
    //     content_id: visit_id,
    //     content_name: `view home page - 10 seconds - sample bounce rate test`,
    //     content_type: 'product'
    // }, {event_id:'1239485'});
    ttq.instance(ttqInstancePixelReference).track('ViewContent', {
        content_id: visit_id,
        content_name: `view home page - 10 seconds - sample bounce rate test`,
        content_type: 'product'
    }, {event_id:'1239485'});
}

function mockLogin() {
    let emailAddress = prompt("Mock login screen - enter an email address to continue. Entered email address will be used for advanced matching. Example of a manual implementation with Auto AM active - ttq.identify() function placed before the tracking event", "");
    
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
    alert("ttq.disableCookie() fired! Cookies should now be disabled. Please check the Pixel Helper - it should show no Pixels present on page");
}

function pixelIdentifyFunction(userPhoneNumber, userEmailAddress) {
    ttq.identify({
        email: userEmailAddress,
        phone_number: userPhoneNumber,
        external_id: external_id
    })
}

function pixelCompleteRegistrationHandler() {
    // ttq.track('CompleteRegistration', {
    //     content_id: visit_id,
    //     content_name: 'registration complete'
    // });

    ttq.instance(ttqInstancePixelReference).track('CompleteRegistration', {
        content_id: visit_id,
        content_name: 'registration complete' 
    });
}

function mockPaymentDetailsDialogBox() {
    let retVal = confirm("This is a Mock Payment Information Screen - User Inputs Payment Information here and InitiateCheckout event is triggered. Events AddPaymentInfo, CompletePayment, " +
        "and PlaceAnOrder are triggered afterwards. Clicking cancel here stops payment process and only InitiateCheckout event is tracked");

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

    // ttq.track('InitiateCheckout', {
    //     content_id: visit_id,
    //     content_type: 'product',
    //     content_name: 'content_name placeholder',
    //     quantity: parseInt(quantity),
    //     price: total,
    //     value: total,
    //     currency: 'USD',
    // });

    ttq.instance(ttqInstancePixelReference).track('InitiateCheckout', {
        content_id: visit_id,
        content_type: 'product',
        content_name: 'content_name placeholder',
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
    let cartItemContainer = document.getElementsByClassName('cart-items')[0];
    let cartRows = cartItemContainer.getElementsByClassName('cart-row');

    let total = 0
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

    let paymentDetailsEntered = false;
    paymentDetailsEntered = mockPaymentDetailsDialogBox();

    if (paymentDetailsEntered) {
        alert('Thank you for your purchase')

        pixelTrackPurchase();
    
        let cartItems = document.getElementsByClassName('cart-items')[0]
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
    alert("Auto AM test - No ttq.identify() function placed before the tracking event");
    let input = document.getElementById("subscription_email").value;

    if (emailValidation(input)) {
        //ttq.track("Subscribe");
        ttq.instance(ttqInstancePixelReference).track("Subscribe");
        alert('Please check the Pixel Helper for the Auto_email parameter!');
    } else {
        alert('Please enter a valid email address');
    }
}

function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()

    if (loggedIn) {
        pixelIdentifyHandler(external_id, userEmailAddress)
    }

    //ttq.track('ClickButton', {
    //    content_id: "content_id placeholder",
    //    content_name: "content_name placeholder"
    //});

    ttq.instance(ttqInstancePixelReference).track('ClickButton', {
       content_id: "content_id placeholder",
       content_name: "content_name placeholder"
    });

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
        content_id: visit_id,
        content_name: "content_name placeholder",
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

    // ttq.track('AddToCart', {
    //     content_id: visit_id,
    //     content_type: 'product',
    //     content_name: title,
    //     quantity: 1,
    //     price: priceInt,
    //     value: priceInt,
    //     currency: 'USD',
    // });

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

    // ttq.track('Subscribe', {
    //     content_id: visit_id,
    //     content_name: "content_name placeholder"
    // });

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

    // ttq.track('Contact', {
    //     content_id: visit_id,
    //     content_type: 'product',
    //     content_name: "content_name placeholder"
    // });

    ttq.instance(ttqInstancePixelReference).track('Contact', {
        content_id: visit_id,
        content_type: 'product',
        content_name: "content_name placeholder"
    });
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

    // ttq.track('AddPaymentInfo', {
    //     content_id: visit_id,
    //     content_type: 'product',
    //     content_name: 'content_name placeholder',
    //     quantity: parseInt(quantity), //amount of items
    //     price: total, //total amount
    //     value: total, //per item
    //     currency: 'USD',
    // });

    // ttq.track('CompletePayment', {
    //     content_id: visit_id,
    //     content_type: 'product',
    //     content_name: 'content_name placeholder',
    //     quantity: parseInt(quantity),
    //     price: total,
    //     value: total,
    //     currency: 'USD',
    // });

    // ttq.track('PlaceAnOrder', {
    //     content_id: visit_id,
    //     content_type: 'product',
    //     content_name: 'content_name placeholder',
    //     quantity: parseInt(quantity),
    //     price: total,
    //     value: total,
    //     currency: 'USD',
    // });

    ttq.instance(ttqInstancePixelReference).track('AddPaymentInfo', {
        content_id: visit_id,
        content_type: 'product',
        content_name: 'content_name placeholder',
        quantity: parseInt(quantity), //amount of items
        price: total, //total amount
        value: total, //per item
        currency: 'USD',
    });

    ttq.instance(ttqInstancePixelReference).track('CompletePayment', {
        content_id: visit_id,
        content_type: 'product',
        content_name: 'content_name placeholder',
        quantity: parseInt(quantity),
        price: total,
        value: total,
        currency: 'USD',
    });

    ttq.instance(ttqInstancePixelReference).track('PlaceAnOrder', {
        content_id: visit_id,
        content_type: 'product',
        content_name: 'content_name placeholder',
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
    pixelTrackAddToCart(title, price);
    updateCartTotal()
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
            <a class="button shop-item-button remove-item" type="button">REMOVE</a>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('remove-item')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
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