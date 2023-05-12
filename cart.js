
import { drinkMenu } from './data.js'

export let cart = []
export let localStoragePizzas = []
const body = document.getElementById('body')
const header = document.getElementById('header')
const modeToggle = document.getElementById('toggle')
const modeCheckbox = document.getElementById('mode-checkbox')
const gotoMainMenu = document.getElementById('goto-main-menu')
const cartItemNum = document.getElementById('cart-item-num')
const cartIcon = document.getElementById('cart-icon')
const cartCntr = document.getElementById('cart-cntr')
const contactDetailsCntr = document.getElementById('contact-details-cntr') 
const contactDetails = document.getElementById('contact-details')
const contactDetailsFieldset =document.getElementById('contact-details-fieldset')
const closeContactForm = document.getElementById('close-contact-form')
const contactInputs = contactDetails.querySelectorAll('input')
const firstName = document.getElementById('first-name')
const lastName = document.getElementById('last-name')
const phoneNumber = document.getElementById('phone-number')
const isSameAddress = document.getElementById('is-same-address')
const billingAddress = document.getElementById('billing-address')
const shippingAddress = document.getElementById('shipping-address')
const contacttextAreas = contactDetails.querySelectorAll('textarea') 

//GETS DATA FROM LOCALSTORAGE
const savedContactDetails = JSON.parse(localStorage.getItem('contactDetails'))
let localStorageItems = JSON.parse(localStorage.getItem('savedCart'))
let originalExistingPizza = JSON.parse(localStorage.getItem('savedPizzas'))
let savedMode = JSON.parse(localStorage.getItem('riasMode'))

//ASSIGNS THE SAVED CART IN LOCAL STORAGE TO CART 
if (localStorageItems) {
    cart = localStorageItems
}
//ASSIGNS THE PIZZAS THAT WERE ADDED TO CART AND SAVED TO LOCAL STORAGE TO LOCALSTORAGEPIZZAS
if (originalExistingPizza) {
    localStoragePizzas = originalExistingPizza
}

//CHANGES THE PAGE MODE TO DARK OR LIGHT BASED ON BROWSER PREFERENCE ON LOAD
if(window.matchMedia && window.matchMedia('prefers-color-scheme-dark').matches) {
    modeCheckbox.checked = true
    darkMode()
    modeToggle.style.transition = 'none'
} else if (savedMode === 'dark') {
    modeCheckbox.checked = true
    darkMode()
    modeToggle.style.transition = 'none'
} else if (savedMode === 'light') {
    lightMode()  
} else {
    lightMode()
}


//SWITCHES BETWEEN LIGHT AND DARK MODE WHEN A TOGGLE IS CLICKED
document.addEventListener('click', e=>{
    if(e.target.id === 'toggle') {
        pageTheme()
    }
})

function pageTheme() {
        if(savedMode) {
            lightMode() 
        } else {
            modeToggle.style.transition = '1s transform ease'
            if(!modeCheckbox.checked) {
                darkMode() 
            } else {
                lightMode() 
            }
        }
}

function darkMode() {
    body.style.background = '#111'
    header.style.background = '#222223'
    gotoMainMenu.style.background = '#222223'
    contactDetailsCntr.style.background = '#222223'
    contactDetails.style.background = '#222223'
    contactInputs.forEach(input=> {
        input.style.color = '#e1e1e1'
    })
    contacttextAreas.forEach(area=> {
        area.style.color = '#e1e1e1'
    })
    modeToggle.style.transform = 'translateX(-25px)'
    localStorage.setItem('riasMode', JSON.stringify('dark'))
}

function lightMode() {
    body.style.background = '#f5f5f5'
    header.style.background = '#e7e6e6'
    gotoMainMenu.style.background = '#f5f5f5'
    contactDetailsCntr.style.background = '#e7e6e6'
    contactDetails.style.background = '#e7e6e6'
    contactInputs.forEach(input=> {
        input.style.color = '#222'
    })
    contacttextAreas.forEach(input=> {
        input.style.color = '#222'
    })
    savedMode = ''
    modeToggle.style.transform = 'translateX(0)'
    localStorage.setItem('riasMode', JSON.stringify('light'))
}

//CHANGES CART THEME BASED ON USER PREFERENCE WHEN CALLED
function cartTheme() {
    const yourCart = document.getElementById('cart')
    const paymentMethodsCntr = document.getElementById('payment-methods-cntr')
    if(savedMode) {
        cartCntr.style.background = '#111'
        yourCart.style.background = '#222223'
        paymentMethodsCntr.style.color = '#e1e1e1'
    } else {
        if(!modeCheckbox.checked) {
            cartCntr.style.background = '#f5f5f5'
            yourCart.style.background = '#e7e6e6'
            paymentMethodsCntr.style.color = '#111'
        } else {
            cartCntr.style.background = '#111'
            yourCart.style.background = '#222223'
            paymentMethodsCntr.style.color = '#e1e1e1'
        }
    }
}

//OPENS CART WHEN THE CART ICON IS CLICKED
cartIcon.addEventListener('click', _=>{
    window.scrollTo(0,0)
    cartCntr.style.display = 'flex'
    renderCartItems()
    document.getElementById('menu').addEventListener('click', closeCart)
    modeToggle.addEventListener('click', closeCart)
})

//CLOSES CART WHEN CALLED
function closeCart() {
        cartCntr.style.display = 'none'
}

//RENDERS CART CONTENTS WHEN CALLED
function renderCartItems() {
    cartCntr.innerHTML = getCartItems()
    cartTheme() 
    cartItemsCount()
    paymentMethods()
    checkoutBtn()     
}

//RENDERS THE NUMBER OF ITEMS IN THE CART ON PAGE LOAD
cartItemsCount()
//RENDERS THE NUMBER OF ITEMS IN THE CART WHEN CALLED
export function cartItemsCount() {
    let count = 0
    if(cart.length > 0) {
        cart.forEach(cartItem=>{
            count += cartItem.count
        })
    }
    cartItemNum.innerText = count
}

//PASSES THE DATA IN CART ARRAY INTO AN HTML BOILERPLATE TO BE RENDERED WHEN CALLED
function getCartItems() {
    let cartItemHTML = ''
    let cartCntrHTML = ''
    let total = 0

    if (cart.length > 0) {
        cart.forEach(cartItem=>{

            total += cartItem.price

            cartItemHTML += `<div class="cart-item" id='cart-item-${cartItem.cartUuid}'>
                                <h4 class="cart-item-name"><span>${cartItem.size}</span> ${cartItem.cartName}</h4>
    
                                <div class="cart-item-info">
                                <div class="cart-item-prices">
                                    <p class="cart-item-price ${cartItem.discountClass}">$${cartItem.initialPrice.toFixed(2)}</p>
                                    <p class="original cart-item-price ${cartItem.originalClass}" id="original-price-${cartItem.uuid}">$${cartItem.price.toFixed(2)}</p>
                                </div>
    
                                <form class="cart-item-quatity-control">
                                    <div class="cart-buttons-cntr">
                                    <button type="button" class="add-cart-item cart-buttons" id="add-${cartItem.cartUuid}" data-add="${cartItem.cartUuid}">+</button>
                                    <input type="number" id="cart-item-quantity" class="cart-item-quantity" value="${cartItem.count}" disabled>
                                    <button type="button" class="decrease-cart-item cart-buttons" id="decrease-cart-item" data-deduct="${cartItem.cartUuid}">-</button>
                                    </div>
                                    
                                    <div class="remove-item-cntr">
                                    <p class="remove-cart-item" id="remove-cart-item" data-remove-item=${cartItem.cartUuid}>remove</p>
                                    </div>
                                </form>
                                
                                </div>
                                
                            </div>`
        })
    } else {
            cartItemHTML = `<p class='empty-cart-message'> Your cart is empty </p>`
        }

        cartCntrHTML = `<section class="cart" id='cart'>
                                <h2 class="your-cart-heading">Your Cart</h2>
                                
                                <span class="material-symbols-outlined close-modal" id="close-cart" title="Close">
                                    close
                                    </span>


                                    <div class="cart-items-cntr" id="cart-items-cntr">
                                    ${cartItemHTML}
                                    </div>  

                            <div class="total-and-payment-cntr">

                            <section id="payment-methods-cntr" class="payment-methods-cntr">
                                <h3 class="payment-method">PAYMENT METHODS</h3>
                                
                                    <label for="pay-with-card" class="payment-methods">
                                        <input type="checkbox" id="pay-with-card" value="card">
                                        <div class="visible-checkbox"></div>
                                    Pay with bank card </label>

                                    <label for="pay-on-delivery" class="payment-methods">
                                        <input type="checkbox" id="pay-on-delivery" value="delivery">
                                        <div class="visible-checkbox"></div>
                                    Pay on delivery </label>
                            </section>
                                
                                    <p class="total-price-cntr">
                                        <span class='total'>Total: $${total.toLocaleString()}</span> 
                                        <span class="total-price" id="total-price"></span>
                                    </p>
                                    
                                </div>

                                <button type="button" class="checkout-btn" id="checkout-btn"> CHECKOUT</button>
                            </section>`
                            stylePizzaPrice()
         return cartCntrHTML
}

//LISTENS FOR CLICKS IN THE CART THEN EXECUTES ASSOCIATED CODE. ALSO SAVES THE NEW CART DATA TO LOCAL STORAGE
cartCntr.addEventListener('click', e=> {

    //CLOSE CART
    if(e.target.id === 'close-cart'){
       cartCntr.style.display = 'none'
    }

    if(e.target.dataset.add) {
        handleAddClick(e.target.dataset.add)
    }

    if(e.target.dataset.removeItem) {
        handleRemoveClick(e.target.dataset.removeItem)
    }

    if(e.target.dataset.deduct) {
        handleDeductClick(e.target.dataset.deduct)
    }
    if(e.target.id === 'pay-on-delivery' || e.target.id === 'pay-with-card') {
        getPaymentMethod()
    }

    if(e.target.id === 'checkout-btn') {
        e.preventDefault()
        manageContactDetails()
    }
    
    stylePizzaPrice()

    if (cart.length < 1) {
        localStorage.removeItem("savedCart")
    } else {
        localStorage.setItem("savedCart", JSON.stringify(cart))
    }
    if (localStoragePizzas.length === 0) {
        localStorage.removeItem('savedPizzas')
    } else {
        localStorage.setItem("savedPizzas", JSON.stringify(localStoragePizzas))
    }

    localStorage.setItem("savedCart", JSON.stringify(cart))
})

//RENDERS PAYMENT METHOD OPTIONS WHEN CART ARRAY IS NOT EMPTY
function paymentMethods() {
    const paymentMethodsCntr = document.getElementById('payment-methods-cntr')
    if(cart.length > 0) {
        paymentMethodsCntr.style.display = 'block'
    } else {
        paymentMethodsCntr.style.display = 'none'
    }
}

//SAVES THE PAYMENT METHOD THE USER SELECTED TO LOCAL STORAGE AND PREVENTS PICKING MORE THAN ONE
export function getPaymentMethod() {
    let paymentMethod = ''
    const paymentMethodsCntr = document.getElementById('payment-methods-cntr')
    const checkBoxes = paymentMethodsCntr.querySelectorAll('input[type=checkbox]')

        if(checkBoxes[0].checked) {
            paymentMethod = checkBoxes[0].value;
            checkBoxes[1].disabled = true
        } else {
            if(checkBoxes[1].disabled = true) {
                checkBoxes[1].disabled = false
            }
        }

         if (checkBoxes[1].checked) {
            paymentMethod = checkBoxes[1].value;
            checkBoxes[0].disabled = true
         }else {
            if(checkBoxes[0].disabled = true) {
                checkBoxes[0].disabled = false
            }
        }
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod))
    return paymentMethod
}

//ENABLES THE CHECKOUT BUTTON WHEN CART ARRAY IS NOT EMPTY
function checkoutBtn() {
    const checkoutBtn = document.getElementById('checkout-btn')
    if(cart.length > 0) {
        checkoutBtn.style.opacity = '1'
        checkoutBtn.disabled = false
    } else {
        checkoutBtn.style.opacity = '.6'
        checkoutBtn.disabled = true
    }
}

//INCREASES THE COUNT AND PRICE OF ITEM(S) WHEN THE ADD BUTTON IS CLICKED
function handleAddClick(cartItemId) { 
    const cartItem = cart.filter(item=> item.cartUuid === cartItemId)[0]
    const pizza = localStoragePizzas.filter(storagePizza=> cartItem.cartUuid === storagePizza.cartUuid)[0]
        if(cartItem.count < 10) {
            if(pizza) {
                if(cartItem.cartUuid === pizza.cartUuid) {
                    addPizza(cartItem, pizza)
                }
            } else {
            addCartItem(cartItem)
            }
        }
    localStorage.setItem("savedCart", JSON.stringify(cart))
    renderCartItems()
}

//INCREASES THE PRICE AND COUNT OF PIZZA(S) IN THE CART WHEN CALLED
function addPizza(cartItem, pizza) {
            const drinksInCartArr = getDrinksInCartArr()
                if(drinksInCartArr.length > 0) {
                    addDiscountedPizza(cartItem)
                } else {
                    addCartItem(cartItem)
                }   
            pizza.count = cartItem.count
            pizza.price = cartItem.price
}

                                        /*THE INITIAL PRICE IS THE ITEM PRICE WITHOUT DISCOUNT AND WILL ALSO BE RENDERED*/

/*INCREASES THE COUNT OF PIZZA(S) IN THE CART BY ONE THEN INCREASES THE PRICE BY HALF
 IT'S ORIGINAL PRICE WHEN THERE IS A DRINK IN THE CART (50% DISCOUNT) WHEN CALLED*/
function addDiscountedPizza(item) {
                item.count++
                item.price += item.originalPrice /2
                item.initialPrice = item.price * 2
}

//INCREASES THE PRICE OF AN ITEM IN THE CART BY IT'S ORIGINAL PRICE AND THE COUNT BY ONE WHEN CALLED
function addCartItem(itemCart) {
            itemCart.count++
            itemCart.initialPrice += itemCart.originalPrice
            itemCart.price = itemCart.initialPrice
}

//DECREASES THE COUNT AND PRICE OF ITEMS IN THE CART WHEN THE DEDUCT BUTTON IS CLICKED
function handleDeductClick(cartItemId) {
    const cartItem = cart.filter(item=> item.cartUuid === cartItemId)[0]
    const pizza = localStoragePizzas.filter(pizza=> pizza.cartUuid === cartItem.cartUuid)[0]

        if((cartItem.cartUuid === cartItemId) && (cartItem.count > 1)) {
            if(pizza) {
                if(pizza.cartUuid === cartItem.cartUuid) {
                    deductPizza(cartItem, pizza)
                }
            } else {
                deductCartItem(cartItem)
            }
        }       
    localStorage.setItem("savedCart", JSON.stringify(cart))
    renderCartItems()
} 

//DECREASES THE PRICE AND COUNT OF PIZZA(S) IN THE CART WHEN CALLED
function deductPizza(cartItem, pizza) {
                let drinksInCartArr = getDrinksInCartArr()
                if(drinksInCartArr.length > 0) {
                    deductDiscountedPizza(cartItem)
                } else {
                    deductCartItem(cartItem)
                }
            pizza.count = cartItem.count
            pizza.price = cartItem.price
}

/*DECREASES THE COUNT OF PIZZA(S) IN THE CART BY ONE THEN DECREASES THE PRICE BY HALF
 IT'S ORIGINAL PRICE WHEN THERE IS A DRINK IN THE CART (50% DISCOUNT) WHEN CALLED*/
function deductDiscountedPizza(item) {
    item.count--
    item.price -= item.originalPrice /2
    item.initialPrice = item.price * 2
}

//DECREASES THE PRICE OF AN ITEM IN THE CART BY IT'S ORIGINAL PRICE AND THE COUNT BY ONE WHEN CALLED
function deductCartItem(itemCart) {
    itemCart.count--
    itemCart.initialPrice -= itemCart.originalPrice
    itemCart.price = itemCart.initialPrice
}
   
//REMOVES AN ITEM FROM THE CART WHEN CALLED
function handleRemoveClick(cartItemId) {
    
    const cartItem = cart.filter(cartItem=> cartItem.cartUuid === cartItemId)[0]
    const pizza = localStoragePizzas.filter(pizza=> pizza.cartUuid === cartItemId)[0]
    let drinkInCartArr = getDrinksInCartArr()
    const drink = drinkInCartArr.filter(cartDrink=> cartDrink.cartUuid === cartItemId)[0]

            if(pizza) {
                removePizza(cartItem, cartItemId)
            } else if(drink) {
                removeCartItem(cartItem, cartItemId)
                drinkInCartArr = getDrinksInCartArr()
                    if(localStoragePizzas.length > 0 && (drinkInCartArr.length === 0)) {
                        pizzaPricePostDrinkRemoval()
                        stylePizzaPrice()
                        renderCartItems()
                    }
            } else {
                removeCartItem(cartItem, cartItemId)
            }
    renderCartItems()
}

//REMOVES A PIZZA FROM CART ARRAY, LOCAL STORAGE PIZZAS ARRAY AND THE DOM WHEN CALLED
function removePizza(cartItem, cartItemId) {
    const itemIndex = cart.findIndex(item=> item.cartUuid === cartItemId)
    const cartItemCntr = document.getElementById(`cart-item-${cartItem.cartUuid}`)
    const pizzaIndex = localStoragePizzas.findIndex(pizza=> pizza.cartUuid === cartItemId)
            cartItemCntr.remove();
            cart.splice(itemIndex, 1);
            localStoragePizzas.splice(pizzaIndex, 1);
}

//REMOVES AN ITEM FROM CART ARRAY AND THE DOM WHEN CALLED
function removeCartItem(cartItem, cartItemId) {
    const itemIndex = cart.findIndex(item=> item.cartUuid === cartItemId)
    const cartItemCntr = document.getElementById(`cart-item-${cartItem.cartUuid}`)
    cartItemCntr.remove()
    cart.splice(itemIndex, 1)
    if(localStoragePizzas.length === 0) {
        localStorage.removeItem("savedPizzas")
    } else {
        localStorage.setItem("savedPizzas", JSON.stringify(localStoragePizzas))
    }
}

//RETURNS THE PRICE OF PIZZAS IN THE CART TO NORMAL WHEN ALL DRINKS HAVE BEEN REMOVED FROM THE CART (REMOVES THE 50% DISCOUNT)
function pizzaPricePostDrinkRemoval() {
    cart.forEach(item=>{
        localStoragePizzas.forEach(pizzaItem=>{
            if(item.cartUuid === pizzaItem.cartUuid)  {
                let drinksInCartArr = getDrinksInCartArr()
                    if(drinksInCartArr.length === 0)  {
                        item.price = item.originalPrice * item.count
                        item.initialPrice = item.price
                    }
            } 
        })
    })
}

//SAVES ALL THE DRINKS IN THE CART INTO AN ARRAY
//USED TO KNOW WHEN TO APPLY THE 50% DISCOUNT TO PIZZAS
function getDrinksInCartArr() {
    let drinksInCartArr = []
    for(let i = 0; i < drinkMenu.length; i++) {
        const drink = cart.filter(item=> item.uuid === drinkMenu[i].uuid)[0]
        if(drink) {
            drinksInCartArr.push(drink)
        }
    }
    return drinksInCartArr
}

//ADDS CLASSES TO PIZZA PRICES TO INDICATE WHEN THERE IS A DISCOUNT OR NOT
export function stylePizzaPrice() {
    
    let drinksInCartArr = getDrinksInCartArr()

    if (localStoragePizzas.length > 0) {

        localStoragePizzas.forEach(pizza=>{

            cart.forEach(cartItem=> {

                if(cartItem.cartUuid === pizza.cartUuid) {

                    if(drinksInCartArr.length > 0) {
                        cartItem.discountClass = 'discounted-price'
                        cartItem.originalClass = 'original-price'
                        pizza.discountClass = 'discounted-price'
                        pizza.originalClass = 'original-price'
                        
                    } else {
                        cartItem.discountClass = ''
                        cartItem.originalClass = ''
                        pizza.discountClass = ''
                        pizza.originalClass = ''
                    }
                }
            })
        })
    } 
}

//RENDERS OR CLOSES THE CONTACT DETAILS FORM BASED ON USER INTERACTION
function manageContactDetails() {
    let paymentMethod = getPaymentMethod()
        if(paymentMethod) {
            handleCheckOutBtnClick()
            closeContactForm.addEventListener('click', _=>{
                contactDetailsCntr.style.display = 'none'
            })
        }
}

//RENDERS CONTACT DETAILS FORM WHEN THE CHECK OUT BUTTON IS CLICKED
function handleCheckOutBtnClick() {
    const contactDetailsCntr = document.getElementById('contact-details-cntr')
    contactDetailsCntr.style.display = 'block'
    oldDetails()
    window.scrollTo(0, 0)
}

//FILLS THE CONTACT DETAILS FORM AUTOMATICALLY IF CUSTOMER DETAILS WERE SAVED TO LOCAL STORAGE PRIOR
function oldDetails() {
    if(savedContactDetails) {
        isSameAddress.disabled = false
        firstName.value = savedContactDetails.firstName
        lastName.value = savedContactDetails.lastName
        phoneNumber.value = savedContactDetails.phoneNumber
        shippingAddress.value = savedContactDetails.shippingAddress
        if(savedContactDetails.isSameAddress === 'on') {
            isSameAddress.checked = true
        }
        billingAddress.value = savedContactDetails.billingAddress
    }
}

//ENABLES THE IS SAME ADDRESS CHECKBOX WHEN THERE IS A VALUE IN THE SHIPPING ADDRESS INPUT FIELD
//CHANGES THE VALUE IN THE BILLING ADDRESS INPUT FIELD TO THE VALUE IN THE SHIPPING ADDRESS INPUT FIELD WHEN THE IS SAME ADDRESS CHEKBOX IS CLICKED
contactDetailsFieldset.addEventListener('input', e=> {
    if(shippingAddress.value) {
        isSameAddress.disabled = false
    }
    if((isSameAddress.checked)) {
        billingAddress.value = shippingAddress.value
    }
})

//SAVES NEW CUSTOMER DETAILS AND REDIRECTS TO CHECKOUT PAGE WHEN A SUBMIT EVENT OCCURS IN THE CONTACT DEATILS FORM
contactDetails.addEventListener('submit', e=> {
    e.preventDefault()
    getContactDetails()
        gotoPayment()
})

//GETS CUSTOMER DEDAILS FORM DATA,
//CHANGES THE FORM DATA TO OBJECT,
//SAVES NEW CUSTOMER DETAILS OBJECT TO LOCAL STORAGE WHEN CALLED
function getContactDetails() {
    const form = document.getElementById('contact-details');
    const contactDetailsFormData = new FormData(form)
    const contactDetailsFormDataObject = Object.fromEntries(contactDetailsFormData.entries())
    localStorage.setItem('contactDetails', JSON.stringify(contactDetailsFormDataObject))
}

//REDIRECTS TO CHECKOUT PAGE WHEN CLICKED
function gotoPayment() {
    window.location.replace('checkout.html')
}