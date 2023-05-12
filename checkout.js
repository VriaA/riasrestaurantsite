const body = document.getElementById('body')
const payment = document.getElementById('payment')
const paymentFieldset = document.getElementById('payment-fieldset')
const paymentInputs = paymentFieldset.querySelectorAll('input')
const cardDetailsForm = document.getElementById('card-details-form')
const orderRecievedCntr = document.getElementById('order-recieved-cntr')
const orderRecieved = document.getElementById('order-recieved')
const paymentLoader = document.getElementById('payment-loader')
const recievedMessage = document.getElementById('recieved-message')
const doneCntr = document.getElementById('done-cntr')
const customerName = document.getElementById('customer-name')

//GETS DATA FROM LOCAL STORAGE
const savedMode = JSON.parse(localStorage.getItem('riasMode'))
const paymentMethod = JSON.parse(localStorage.getItem('paymentMethod'))
const contactDetails = JSON.parse(localStorage.getItem('contactDetails'))
const savedPizzas = JSON.parse(localStorage.getItem('savedPizzas'))

//CHANGES THE PAGE THEME TO LIGHT OR DARK BASED ON USER PREFERENCE
if((savedMode !== 'light') && (window.matchMedia && window.matchMedia('prefers-color-scheme: dark').matches)) {
    darkTheme()
}   else if (savedMode === 'dark') {
    darkTheme()
} else if (savedMode === 'light') {
    lightTheme()
}

function darkTheme() {
    body.style.background = '#111'
    payment.style.background = '#111'
    paymentInputs.forEach(input=>{
        input.style.color = '#e1e1e1'
    })
    orderRecievedCntr.style.background = '#111'
    orderRecieved.style.background = '#222223'
    cardDetailsForm.style.background = '#222223'
}

function lightTheme() {
    body.style.background = '#f5f5f5'
    payment.style.background = '#D3D3D3'
    paymentInputs.forEach(input=>{
        input.style.color = '#222'
    })
    orderRecievedCntr.style.background = '#D3D3D3'
    orderRecieved.style.background = '#f5f5f5'
    cardDetailsForm.style.background = '#f5f5f5'
}

/*RENDERS THE ORDER RECIEVED MESSAGE IF THE USER'S
 PREFERRED PAYMENT METHOD IS PAYMENT ON DELIVERY*/
if(paymentMethod === 'delivery') {
    orderCompleted() 
} else {
    /*RENDERS THE MODAL FOR INPUTING CART DETAILS IF THE USER'S PREFERED PAYMENT 
    METHOD IS PAY WITH BANK CARD THEN RENDERS THE ORDER RECIEVED MESSAGE */
    payment.style.display = 'flex'
    cardDetailsForm.addEventListener('submit', e=> {
        e.preventDefault()
        payment.style.display = 'none'
        orderCompleted() 
    })

}

/* RENDERS THE LOADER SVG AND THE ORDER RECIEVED MESSAGE WITH THE CUSTOMER NAME,
EMPTIES THE CART AND THEN REDIRECTS TO HOME PAGE  */
function orderCompleted() {
    orderRecievedCntr.style.display = 'flex'
    setTimeout(_=>{
        paymentLoader.style.display = 'none'
        doneCntr.style.display = 'flex'
        setTimeout(_=>{
            customerName.innerText = contactDetails.firstName
            recievedMessage.style.display = 'block'
            emptyCart()
            setTimeout(_=>{
                window.location.replace('index.html')
            }, 5200)
        }, 2300)
    }, 2000)
}

//EMPTIES THE CART AND PIZZAS SAVED TO LOCAL STORAGE
function emptyCart() {
    localStorage.removeItem('savedCart')
    if(savedPizzas) {
        localStorage.removeItem('savedPizzas')
    }
}