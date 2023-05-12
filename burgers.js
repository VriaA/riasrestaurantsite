import { burgerMenu } from './data.js'
import { cart, cartItemsCount } from './cart.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; 

//RENDER BURGERS FOR SALE ON LOAD
renderBurgers()
function renderBurgers() {
    const burgersCntr = document.getElementById('burgers-cntr')
    burgersCntr.innerHTML = getBurgerMenuItems()
}

//GETS DATA FROM THE BURGER MENU ARRAY AND PASSES IT INTO AN HTML BOILER PLATE TO BE RENDERED WHEN CALLED
function getBurgerMenuItems() {
    let itemsHTML = ""

        burgerMenu.forEach(burger=> {
            itemsHTML += `  <div class="menu-item-cntr">
                            <p class='burger-price'>$${burger.price}</p>
                        
                            <h2 class="menu-item-title burger">${burger.name}</h2>

                                <div class="item-info burger-info">
                                    <img class="item-img burger-img" src="${burger.burgerImage}">
                                    <p class="item-toppings burger-toppings">${burger.toppings}</p>
                                </div>

                                <div class="add-to-cart" title="Add to cart">
                                    <div id="add-burger-icons-${burger.uuid}" class="add-burger-icons">
                                        <span class="material-symbols-outlined add-cart-icon" id="add-${burger.uuid}" data-burger="${burger.uuid}">
                                            add_shopping_cart
                                        </span>
                                        <span class="material-symbols-outlined done-adding" id='done-${burger.uuid}' >
                                            done
                                        </span>
                                    </div>
                                </div>
                        </div>`
        })
    return itemsHTML
}


//LISTENS FOR CLICKS IN THE DOCUMENT AND EXCUTES ASSOCIATED CODE
document.addEventListener('click', e=> {
        if(e.target.dataset.burger) {
            getSelectedBurger(e.target.dataset.burger) 
            iconIndicators(e.target.dataset.burger)
            addBurgerToCart()
        }
})

//SAVES THE BURGER THAT WAS CLICKED ON IN THE MENU TO A VARIABLE
let chosenBurger = ""
function getSelectedBurger(burgerId) {
     chosenBurger = burgerMenu.filter(burger=> {
        if (burgerId === burger.uuid) {
            return burger
        }
    })[0]
}

//INDICATES WHEN A BURGER HAS BEEN ADDED TO CART SUCCESSFULLY OR
//WHEN THE MAXIMUM AMOUNT ALLOWED HAS BEEN REACHED
function iconIndicators(burgerId) {
    const selectedBurger = burgerMenu.filter(burger=> burger.uuid === burgerId)[0]
    const addBurgerIcons = document.getElementById(`add-burger-icons-${selectedBurger.uuid}`)
    const addIcon = document.getElementById(`add-${selectedBurger.uuid}`)
    const doneIcon = document.getElementById(`done-${selectedBurger.uuid}`)
    const existingBurger = cart.filter(cartItem => cartItem.uuid === selectedBurger.uuid)[0]


        if(existingBurger) {
            if(existingBurger.count < 10) {
                renderDoneIcon(addBurgerIcons, addIcon, doneIcon)
            } else {
                maxReached(addBurgerIcons) 
            }
        } else {
            renderDoneIcon(addBurgerIcons, addIcon, doneIcon)
        }
}

//RENDERS THE DONE ICON WHEN CALLED AND REMOVES IT AFTER 1.2s
function renderDoneIcon(addIcons, add, done) {
    addIcons.style.background = "#f5f5f5"
    add.style.display = "none"
    done.style.display = "block"
    done.style.color = "#bc6c25"
    setTimeout(_=>{
        addIcons.style.background = "#f5f5f51a"
        add.style.display = "flex"
        done.style.display = "none"
    }, 1200)
}

/*CHANGES THE BAKGROUND OF THE DIV THAT WRAPS THE CART ICON TO RED 
WHEN CALLED THEN RETURNS IT BACK TO THE NORMAL COLOR AFTER THE 1.2s*/
function maxReached(icons) {
    icons.style.background = "#ff0000" 
    setTimeout(_=>{
        icons.style.background = "#f5f5f51a" 
    }, 1200)
}

//ADDS SELECTED BURGER TO CART WHEN CALLED
function addBurgerToCart() {
    const selectedBurger = chosenBurger
    const existingBurger = cart.filter(cartItem => cartItem.uuid === selectedBurger.uuid)[0]

        if(existingBurger) {
            if(existingBurger.count < 10) {
                addBurgerAgain() 
            }
        } else {
            addBurgerInitially()
        }
    localStorage.setItem('savedCart', JSON.stringify(cart))
    cartItemsCount()
}

                                                /* INITTIL PRICE IS THE BURGER PRICE WITHOUT A DISCOUNT */

/*IF THE SELECTED BURGER ALREADY EXISTS IN THE CART,
THE FUNCTION BELOW INCREASES THE SELECTED BURGER COUNT BY 
ONE AND INCREASES THE PRICE BY THE ORGINAL PRICE WHEN CALLED*/
function addBurgerAgain() {
    const selectedBurger = chosenBurger
    const existingBurger = cart.filter(cartItem => cartItem.uuid === selectedBurger.uuid)[0]
    
        existingBurger.count ++
        existingBurger.price += selectedBurger.originalPrice
        existingBurger.initialPrice = existingBurger.price
}

//ADDS THE SLECTED BURGER TO CART FOR THE FIRST TIME
function addBurgerInitially() {
    const selectedBurger = chosenBurger
        const newBurger = {
            name: selectedBurger.name,
            cartName: selectedBurger.cartName,
            burgerImage: selectedBurger.burgerImage,
            size:'',
            initialPrice: selectedBurger.originalPrice,
            originalPrice: selectedBurger.originalPrice,
            price: selectedBurger.originalPrice,
            count: 1,
            uuid: selectedBurger.uuid,
            cartUuid: uuidv4()
        }
    cart.push(newBurger)
}