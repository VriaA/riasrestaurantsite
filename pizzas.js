
import { pizzaMenu, drinkMenu } from './data.js'
import { cart, localStoragePizzas, cartItemsCount, stylePizzaPrice } from './cart.js' 
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

//GETS SAVED DATA FROM LOCAL STORAGE
const savedMode = JSON.parse(localStorage.getItem('savedMode'))
const modeCheckbox = document.getElementById('mode-checkbox')

//RENDERS PIZZAS FOR SALE ON LOAD
renderPizzas()
function renderPizzas() {
    const pizzasCntr = document.getElementById('pizzas-cntr')
    pizzasCntr.innerHTML = getPizzaMenuItems()
}

//GETS DATA FROM THE PIZZA MENU ARRAY AND PASSES IT INTO AN HTML BOILER PLATE TO BE RENDERED WHEN CALLED
function getPizzaMenuItems() {

    let itemsHTML = ''
    
        pizzaMenu.forEach(pizza=> {

        itemsHTML += `  <div class="menu-item-cntr" id="pizzas-cntr">
                        
                            <h2 class="menu-item-title pizza">${pizza.name}</h2>

                                <div class="item-info pizza-info">
                                    <img class="item-img pizza-img" src="${pizza.PizzaImage}">
                                    <p class="item-toppings pizza-toppings">${pizza.toppings}</p>
                                </div>

                                <div class="add-to-cart" title="Add to cart"><span class="material-symbols-outlined" id="pizza-to-cart-${pizza.uuid}"data-pizza="${pizza.uuid}">
                                add_shopping_cart
                                </span></div>
                        </div>`
        })
    return itemsHTML
}

//LISTENS FOR CLICKS IN THE DOCUMENT AND EXCUTES ASSOCIATED CODE
document.addEventListener('click', e=> {

        if(e.target.dataset.pizza) {
            getSelectedPizza(e.target.dataset.pizza)
            renderSelectionModal()
            selectionModalTheme() 
        }

        if((e.target.id === 'small') || (e.target.id === 'medium') || (e.target.id === 'large')) {
            getPizzaSize()
        }
        if(e.target.dataset.pizzaPrice) {
            getPizzaPrices(e.target.dataset.pizzaPrice)
        }
        if(e.target.id === 'selection-done-btn') {
            e.preventDefault()
            pizzaToCart()
        }
})

//CHANGES THE THEME OF THE PIZZA SIZE SELECTION MODAL TO LIGHT OR DARK BASED ON USER PREFERENCE
function selectionModalTheme() {
    const sizeSelectionCntr = document.getElementById('size-selection-cntr')
    if(savedMode) {
        sizeSelectionModal.style.background = '#111'
        sizeSelectionCntr.style.background = '#222223'
    } else {
        if(!modeCheckbox.checked) {
            sizeSelectionModal.style.background = '#E2E2E2'
            sizeSelectionCntr.style.background = '#DFDFDF'
        } else {
            sizeSelectionModal.style.background = '#111'
            sizeSelectionCntr.style.background = '#222223'
        }
    }
}

//SAVES THE PIZZA THAT WAS CLICKED ON IN THE MENU TO A VARIABLE
let chosenPizza = ''
function getSelectedPizza(pizzaId) {
     chosenPizza = pizzaMenu.filter(pizza=>{
        return pizzaId === pizza.uuid
    })[0]
}

//GETS DATA FROM THE CHOSEN PIZZA AND PASSES IT INTO AN HTML BOILER PLATE TO BE RENDERED IN THE SIZE SELECTION MODAL WHEN CALLED
let sizeSelectionModal = ''
function renderSelectionModal() {

    const selectedPizza = chosenPizza
    let sizeSelectionHTML = ''

    sizeSelectionHTML = ` <section class="size-selection-cntr" id='size-selection-cntr'>
                            
                            <h3 class="size-selection-heading">Select Preferred Size</h3>
                            
                            <span class="material-symbols-outlined close-modal" id="close-size-selection" title="Close">
                            close
                            </span>

                            <div class="size-info">
                                <div class="selected-item">
                                    <img src="${selectedPizza.PizzaImage}">
                                    <p class="selected-item-price" id="selected-item-price"></p>
                                </div>
                                <form class="size-options-cntr">
                                
                                    <div class="size-options" id="size-options">
                                        <label for="small" class="size-option-label">
                                        <input type="radio" class="size-option small" id="small" value="Small" name="size" data-pizza-price=${selectedPizza.smallPrice}>
                                        Small</label>
                                        
                                        <label for="medium" class="size-option-label">
                                        <input type="radio" class="size-option medium" id="medium" value="Medium" name="size" data-pizza-price=${selectedPizza.mediumPrice}>
                                        Medium</label>

                                        <label for="large" class="size-option-label">
                                        <input type="radio" class="size-option large" id="large" value="Large" name="size" data-pizza-price=${selectedPizza.largePrice}>
                                        Large</label>
                                </div>

                            <button type="submit" id="selection-done-btn" class="add-pizza-to-cart" disabled> Add to Cart</button>   
                        </form>
                    </div>
                </section>`

                sizeSelectionModal = document.getElementById('size-selection-modal')
                sizeSelectionModal.innerHTML = sizeSelectionHTML
                sizeSelectionModal.style.display = 'block'
                renderAvailableSizes()
                window.scrollTo(0,0)

                const closeSelectionModal = document.getElementById('close-size-selection')
                closeSelectionModal.addEventListener('click', _=>{
                    sizeSelectionModal.style.display = 'none'
                })
}

//PREVENTS THE SELECTION OF THE PIZZA SIZE THAT HAS REACHED THE MAXIMUM COUNT ALLOWED IN THE CART (10)
//ALLOWS THE SELECTION OF THE PIZZA SIZE THAT HAS NOT REACHED THE MAXIMUM COUNT ALOWED IN THE CART (10)
function renderAvailableSizes() {
    const selectedPizza = chosenPizza   
    const radios = document.querySelectorAll('input[type=radio]')
    const cartPizza = cart.filter(cartItem=> cartItem.uuid === selectedPizza.uuid)[0]
                
            if(cartPizza) {
                radios.forEach(radio=>{
                    if((cartPizza.size === radio.value) && (cartPizza.count === 10)) {
                         const maxReached = document.getElementById(radio.id)
                         maxReached.parentElement.style.opacity = '.5'
                         maxReached.disabled = true
                     } else if ((cartPizza.size === radio.value) && (cartPizza.count < 10))  {
                         const selectable = document.getElementById(radio.id)
                         selectable.style.opacity = '1'
                         selectable.disabled = false
                     }
                 })
            }
}

//CHANGES THE SELECTED PIZZA SIZE TO THE ONE CHOSE IN THE SIZE SELECTION MODAL
function getPizzaSize() {
    const selectedPizza = chosenPizza   
    const radios = document.querySelectorAll('input[type=radio]')
    const selectionDoneBtn = document.getElementById('selection-done-btn')
                
            radios.forEach(radio=>{
                    if(radio.checked) {
                        selectedPizza.size = radio.value
                        selectionDoneBtn.disabled = false
                        selectionDoneBtn.style.opacity = '1'
                    }
            })
}

//CHANGES THE SELECTED PIZZA PRICE BASED ON THE CHOSEN SIZE. ALSO RENDERS THE CHOSEN PRICE IN THE SIZE SELECTION MODAL WHEN CALLED
function getPizzaPrices(pizzaPrice) {
        const selectedPizza = chosenPizza 
        const selecteditemPrice = document.getElementById('selected-item-price')

            selecteditemPrice.textContent = `Price: $${pizzaPrice}`
            selectedPizza.initialPrice = Number(pizzaPrice)
            selectedPizza.originalPrice = Number(pizzaPrice)
            selectedPizza.price = Number(pizzaPrice)      
}

//ADDS SELECTED PIZZA TO CART WHEN CALLED
function pizzaToCart() {
    const selectedPizza = chosenPizza
    const cartPizza = cart.filter(cartItem=> cartItem.uuid === selectedPizza.uuid && cartItem.size === selectedPizza.size)[0]

            if((cartPizza)) {
                if (cartPizza.count < 10) {
                    addPizzaAgain()
                }
            }
            else {
                addPizzaInitially()
            }
                localStorage.setItem('savedCart', JSON.stringify(cart))
                localStorage.setItem('savedPizzas', JSON.stringify(localStoragePizzas))
                cartItemsCount()
                sizeSelectionModal.style.display = 'none'
}

//SAVES THE DRINKS AREADY IN THE CART INTO A VARIABLE
const drinkInCartArr = getDrinkInCartArr()

//INCREASES THE PRICE AND COUNT OF THE PIZZA(S) ALREADY IN THE CART WHEN CALLED
function addPizzaAgain() {
    const selectedPizza = chosenPizza
    const cartPizza = cart.filter(cartItem=> cartItem.uuid === selectedPizza.uuid && cartItem.size === selectedPizza.size)[0]
    const localStoragePizza = localStoragePizzas.filter(pizza=> (pizza.uuid === selectedPizza.uuid) && (pizza.size === selectedPizza.size))[0]
    
        if(drinkInCartArr.length > 0) {
            addDiscountedPizza(cartPizza, localStoragePizza)
        } else {
            addRegularPizza(cartPizza, localStoragePizza) 
        }
}

/*INCREASES THE COUNT OF THE SELECT PIZZA WHEN IT IS ALREADY IN THE CART BY ONE 
AND INCREASES THE PRICE BY HALF IT'S ORIGINAL PRICE WHEN THERE IS A DRINK IN THE CART*/
function addDiscountedPizza(cartPizza, localStoragePizza) {  
        cartPizza.count++
        localStoragePizza.count = cartPizza.count
            cartPizza.price += cartPizza.originalPrice /2
            localStoragePizza.price = cartPizza.price
                cartPizza.initialPrice = cartPizza.price * 2
                localStoragePizza.initialPrice = cartPizza.initialPrice
}

//INCREASES THE SELECTED PRICE BY THE ORIGINAL PRICE AND THE COUNT BY ONE WHEN THE SELECTED PIZZA IS ALREADY IN THE CART
function addRegularPizza(cartPizza, localStoragePizza) {
        cartPizza.count++
        localStoragePizza.count = cartPizza.count
            cartPizza.initialPrice += cartPizza.originalPrice
            cartPizza.price = cartPizza.initialPrice
                localStoragePizza.initialPrice = cartPizza.initialPrice
                localStoragePizza.price = cartPizza.price
}

//ADDS THE SELECTED PIZZA TO THE CART FOR THE FIRST TIME
function addPizzaInitially() {
    const selectedPizza = chosenPizza

        if((cart.length > 0)&& (drinkInCartArr.length > 0)) {
            selectedPizza.price /= 2
            selectedPizza.discountClass = 'discounted-price'
            selectedPizza.originalClass = 'original-price'
        }
        
            const newCartItem = {
                name: selectedPizza.name,
                cartName: selectedPizza.cartName,
                PizzaImage: selectedPizza.PizzaImage,
                size: selectedPizza.size,
                initialPrice: selectedPizza.originalPrice,
                originalPrice: selectedPizza.originalPrice,
                price: selectedPizza.price,
                count: 1,
                discountClass: selectedPizza.discountClass,
                originalClass: selectedPizza.originalClass,
                uuid: selectedPizza.uuid,
                cartUuid: uuidv4()
            }
    localStoragePizzas.push(newCartItem)
    cart.push(newCartItem)
    stylePizzaPrice()
}

//CHECKS THE CART FOR DRINKS AND SAVES THE DRINKS FOUND IN THE CART TO THE DRINK IN CART ARRAY VARIABLE
function getDrinkInCartArr() {
    const drinkInCartArr = []
    
        for (let i = 0; i < drinkMenu.length; i++) {
            const drinkInCart = cart.filter(cartItem=> {
                return cartItem.uuid === drinkMenu[i].uuid
            })[0]
                if(drinkInCart) {
                    drinkInCartArr.push(drinkInCart)
                }
        }
    return drinkInCartArr
}
console.log(drinkInCartArr)