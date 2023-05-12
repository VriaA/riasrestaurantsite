import { drinkMenu } from './data.js'
import { cart, localStoragePizzas, cartItemsCount, stylePizzaPrice } from './cart.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; 

//RENDER DRINKS FOR SALE ON LOAD
renderDrinks()
function renderDrinks() {
    const drinksCntr = document.getElementById('drinks-cntr')
    drinksCntr.innerHTML = getDrinkMenuItems()
}

//GETS DATA FROM THE DRINK MENU ARRAY AND PASSES IT INTO AN HTML BOILER PLATE TO BE RENDERED WHEN CALLED
function getDrinkMenuItems() {
    let itemsHTML = ''

        drinkMenu.forEach(drink => {
            itemsHTML += `  <div class="drink-cntr">
                            <div class="add-drink-icons-cntr" title="Add to cart">
                                <div class="add-drink-icons" id='add-drink-icons-${drink.uuid}'>
                                <span class="material-symbols-outlined add-cart-icon" id='add-${drink.uuid}' data-drink="${drink.uuid}">
                                add_shopping_cart
                                </span> 
                                <span class="material-symbols-outlined done-adding" id='done-${drink.uuid}' >
                                    done
                                </span>
                                </div>
                            </div>
                                <img class="drink-img" src="${drink.drinkImage}">

                                <section class="drink-info">
                                    <h2 class="drink-title">${drink.name}</h2>
                                    <p class='drink-price'>$${drink.price}</p>
                                </section>
                        </div>`
        })
    return itemsHTML
}

//LISTENS FOR CLICKS IN THE DOCUMENT AND EXCUTES ASSOCIATED CODE
document.addEventListener('click', e=> {
    if(e.target.dataset.drink) {
        getSelectedDrink(e.target.dataset.drink)
        iconIndicators(e.target.dataset.drink)
        addDrinkToCart()
    }
})

//SAVES THE DRINK THAT WAS CLICKED ON IN THE MENU TO A VARIABLE
let chosenDrink = ''
function getSelectedDrink(drinkId) {
        chosenDrink = drinkMenu.filter(drink=> {
            if(drinkId === drink.uuid) {
                return drink
            }
        })[0]
    checkCartForDrink()
}

//CHECKS THE CART FOR DRINKS AND SAVES THE DRINKS FOUND IN THE CART TO THE CART DRINK ARRAY VARIABLE
function checkCartForDrink() {
    let cartDrinkArr = []
    for (let i = 0; i < drinkMenu.length; i++) {
        const drinkInCart = cart.filter(cartitem=> cartitem.uuid === drinkMenu[i].uuid)[0]
        if (drinkInCart) {
            cartDrinkArr.push(drinkInCart)
        }
    }
    return cartDrinkArr
}

//INDICATES WHEN A DRINK HAS BEEN ADDED TO CART SUCCESSFULLY OR
//WHEN THE MAXIMUM AMOUNT ALLOWED HAS BEEN REACHED
function iconIndicators(drinkId) {
    const cartDrinkArr = checkCartForDrink() 
    const selectedDrink = drinkMenu.filter(drink=> drink.uuid === drinkId)[0]
    const cartDrink = cartDrinkArr.filter(drinkInCart=> drinkInCart.uuid === selectedDrink.uuid)[0]
    const addDrinkIcons = document.getElementById(`add-drink-icons-${selectedDrink.uuid}`)
    const doneIcon = document.getElementById(`done-${selectedDrink.uuid}`)
    const addDrink = document.getElementById(`add-${selectedDrink.uuid}`)

            if(cartDrink) {
                if(cartDrink.count < 10) {
                    renderDoneIcon(addDrink, doneIcon, addDrinkIcons)
                } else {
                    maxReached(addDrinkIcons)
                }
            } else {
                renderDoneIcon(addDrink, doneIcon, addDrinkIcons)
            }

}

//RENDERS THE DONE ICON WHEN CALLED AND REMOVES IT AFTER 1.2s
function renderDoneIcon(add, done, icons) {
    add.style.display = 'none'
    done.style.display = 'block'
    icons.style.background = '#4a49489c'
    setTimeout(_=> {
        add.style.display = 'block'
        done.style.display = 'none'
        icons.style.background = 'none'
    }, 1200)
}

/*CHANGES THE BAKGROUND OF THE DIV THAT WRAPS THE CART ICON TO RED 
WHEN CALLED THEN RETURNS IT BACK TO THE NORMAL COLOR AFTER THE 1.2s*/
function maxReached(drinkIcons) {
    drinkIcons.style.background = '#ff0000'
    setTimeout(_=> {
        drinkIcons.style.background = 'none'
    }, 1200)
}

//ADDS SELECTED DRINK TO CART WHEN CALLED
function addDrinkToCart() {
    
    const cartDrinkArr = checkCartForDrink() 
    const selectedDrink = chosenDrink
    const drinkInCart = cartDrinkArr.filter(drinkInCart=> drinkInCart.uuid === selectedDrink.uuid)[0]

            if (cartDrinkArr.length === 0) {
                if(localStoragePizzas.length > 0 ) {
                    PizzaDiscount()
                    addDrinkInitially()
                } else {
                    addDrinkInitially()
                } 
            } else {
                if(drinkInCart) {
                    if(drinkInCart.count < 10) {
                        addDrinkAgain(drinkInCart, selectedDrink) 
                    }
                } else {
                    addDrinkInitially()
                }
            }
    localStorage.setItem('savedCart', JSON.stringify(cart))
    localStorage.setItem("savedPizzas", JSON.stringify(localStoragePizzas))
    cartItemsCount()
}  

                                                /* INITTIL PRICE IS THE BURGER PRICE WITHOUT A DISCOUNT */

/*HALVES THE PRICE OF THE PIZZA IN THE CART AND LOCAL STROAGE (50% DISCOUNT) WHEN CALLED*/
/*THIS FUNCTION IS USED ONLY WHEN ADDING THE FIRST DRINK TO THE CART
 TO PREVENT REDUCING THE PRICE EVERYTIME A DRINK IS ADDED TO THE CART*/
function PizzaDiscount() {
        for (let i = 0; i < localStoragePizzas.length; i++) {
            const cartPizza = cart.filter(cartPizza=> cartPizza.cartUuid === localStoragePizzas[i].cartUuid)[0]
                cartPizza.price /= 2
                localStoragePizzas[i].price = cartPizza.price

                cartPizza.initialPrice = cartPizza.price * 2
                localStoragePizzas[i].initialPrice = cartPizza.initialPrice
        }
}

//ADDS THE SELECTED DRINK THE CART FOR THE FIRST TIME
function addDrinkInitially() {
    const selectedDrink = chosenDrink
        const newDrinkItem = {
            name: selectedDrink.name,
            cartName: selectedDrink.cartName,
            drinkImage: selectedDrink.drinkImage,
            size: '',
            initialPrice: selectedDrink.originalPrice,
            originalPrice: selectedDrink.originalPrice,
            price: selectedDrink.price,
            count: 1,
            uuid: selectedDrink.uuid,
            cartUuid: uuidv4()
        }
    cart.push(newDrinkItem)
    stylePizzaPrice()
}

/*IF THERE IS ALREADY A DRINK IN THE CART,
THE FUNCTION BELOW INCREASES THE COUNT OF THE SELCTED DRINK BY 
ONE AND INCREASES THE PRICE OF THE DRINK BY ITS ORIGINAL PRICE*/
function addDrinkAgain(cartDrink, drinkToAdd) {
        cartDrink.count ++
        cartDrink.price += drinkToAdd.originalPrice
        cartDrink.initialPrice = cartDrink.price 
} 