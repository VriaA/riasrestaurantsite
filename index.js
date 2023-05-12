
//ELEMENTS SAVED IN VARIABLES
const body = document.getElementById('body')
const header = document.getElementById('header')
const modeCheckbox = document.getElementById('mode-checkbox')
const modeToggle = document.getElementById('toggle')
const homeCntr = document.getElementById('home-cntr') 
const homeImgCntr = document.getElementById('home-img-cntr')
const startOrder = document.getElementById('start-order')
const startOrderBtn = document.getElementById('start-order-btn')
const mainMenuHome = document.getElementById('main-menu-home')
const menu = document.getElementById('menu')
const cancelOrderMobile = document.getElementById('cancel-order-mobile')
const cancelOrder1024 = document.getElementById('cancel-order-1024')
const cartItemNum = document.getElementById('cart-item-num')

//SCROLLS TO TOP
window.scrollTo(0,0)

//CALLED FUNCTION THAT 'DISABLES' SCROLLING
disableScrollHome() 

//Gets the viewport height and multiplies it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then sets the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`)

//CHECKS IF A PREFERRED MODE IS SAVED TO LOCAL STORAGE
//THE SAVED MODE IS TRANSFERRABLE ACROSS PAGES
const savedMode = JSON.parse(localStorage.getItem('riasMode'))

//SETS PAGE MODE TO DARK OR LIGHT ACCORDING TO USER PREFERENCE ON PAGE LOAD
if( (savedMode !== 'light') && (window.matchMedia && window.matchMedia('prefers-color-scheme-dark').matches) ) {
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

//SWITCHES PAGE THEME BETWEEN LIGHT AND DARK WHEN A TOGGLE IS CLICKED
document.addEventListener('click', e=>{
    if(e.target.id === 'toggle') {
        toggleMode()
    }
})

function toggleMode() { 
        modeToggle.style.transition = '1s transform ease'
        if(!modeCheckbox.checked) {
            darkMode()
        } else {
            lightMode()
        }
}

function darkMode() {
    body.style.background = '#111'
    header.style.background = '#222223'
    homeCntr.style.background = '#222223'
    homeImgCntr.style.background = '#222223'
    modeToggle.style.transform = 'translateX(-25px)'
    localStorage.setItem('riasMode', JSON.stringify('dark'))
}

function lightMode() {
    header.style.background = '#e1e1e1'
    body.style.background = '#f5f5f5'
    homeCntr.style.background = '#f5f5f5'
    homeImgCntr.style.background = '#f5f5f5'
    modeToggle.style.transform = 'translateX(0)'
    localStorage.setItem('riasMode', JSON.stringify('light'))
}

//REVEALS THE MAIN MENU WHEN THE START ORDER BUTTON IS CLICKED
startOrderBtn.addEventListener('click', _=>{
    homeImgCntr.style.transform ='translateY(-100%)'
    mainMenuHome.style.display = 'flex'
    enableScrollHome()
    setTimeout(_=> {
        homeCntr.style.zIndex = '0'
        homeCntr.style.opacity = '0'
        mainMenuHome.style.opacity = '1'
        startOrder.style.display = 'none'
        setTimeout(_=>{
            homeImgCntr.style.opacity = '0'
            startOrder.style.display = 'none'
            cancelOrder1024.style.display = 'flex'
            cancelOrderMobile.style.display = 'flex'
        }, 2000)
    }, 200)
})

// EMPTIES THE CART AND RETURNS TO THE HOME PAGE WHEN A CANCEL BUTTON IS CLICKED
cancelOrderMobile.addEventListener('click', cancelOrder)
cancelOrder1024.addEventListener('click', cancelOrder)

function cancelOrder() {
        homeCntr.style.zIndex = '10'
        homeCntr.style.opacity = '1'
        homeImgCntr.style.opacity = '1'
        homeImgCntr.style.transform ='translateY(0)'
        setTimeout(_=> {
            window.scrollTo(0, 0)
            mainMenuHome.style.opacity = '0'
            cancelOrder1024.style.display = 'none'
            cancelOrderMobile.style.display = 'none'
            disableScrollHome() 
            setTimeout(_=>{
                startOrder.style.display = 'flex'
            }, 2000)
        }, 200)
}

//PREVENTS SCROLLING WHEN CALLED
function disableScrollHome() {
    body.style.height = '100vh'
    body.style.overflow = 'hidden'
}

//ENABLES SCROLLING WHEN CALLED
function enableScrollHome() {
    body.style.removeProperty('height')
    body.style.minHeight = '100vh'
    body.style.overflowY = 'scroll'
}