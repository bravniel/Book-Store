export async function getUser() {
    const loginBtn = document.getElementById('login-btn');
    const usernameBtn = document.getElementById('user-name-btn');
    const editForm = document.getElementById('edit-form');

    const res = await fetch('/users/connected-user-info', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await res.json();
    console.log(data)
    if (data.Error) {
        localStorage.clear();
        loginBtn.className = 'nav-item';
        usernameBtn.className = 'hidden';
        document.getElementById('user-name-seperator').className = 'hidden';
        loadPage();
    } else {
        loginBtn.className = 'hidden';
        usernameBtn.className = 'nav-item';
        document.getElementById('user-name-seperator').className = '';
        editForm.children[0].children[0].placeholder = data.name;
        editForm.children[0].children[1].placeholder = data.email;
        editForm.children[0].children[2].placeholder = 'password';
        usernameBtn.innerHTML = data.name;
    }
}

export async function loadUserCart() {
    let cart = []
    if (localStorage.getItem('cart') && localStorage.getItem('cart') !== 'null') {
        cart = JSON.parse(localStorage.getItem('cart'))
        cart.forEach((el) => { addBookToDBCart(el.book, el.quantity) })
    }
}

export async function login(loginInfo) {
    console.log("on login- login info: " + JSON.stringify(loginInfo))
    const loginBtn = document.getElementById('login-btn');
    const usernameBtn = document.getElementById('user-name-btn');
    const closeLoginBtn = document.getElementById('close-login-register-btn');
    const loginForm = document.getElementById('login-form');
    const loginErrorMessage = document.getElementById('login-error-message');
    const res = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
    });
    const data = await res.json();
    if (!data.Error) {
        localStorage.setItem('token', data.token);
        loginBtn.className = 'hidden';
        usernameBtn.className = 'nav-item';
        usernameBtn.innerHTML = (data.name);
        document.getElementById('user-name-seperator').className = '';
        closeLoginBtn.click();
        loginForm.reset();
        getUser()
        loadUserCart()
    }
    else
        loginErrorMessage.innerHTML = data.Error;
    console.log("on login- local storage token: " + localStorage.getItem('token'))
};

export async function logout() {
    const loginBtn = document.getElementById('login-btn');
    const usernameBtn = document.getElementById('user-name-btn');
    await fetch('/users/logout', {
        method: 'POST',
        headers: { Authorization: localStorage.getItem('token') }
    });
    localStorage.clear();
    localStorage.setItem('cart', null)
    loginBtn.className = 'nav-item';
    usernameBtn.className = 'hidden';
    document.getElementById('user-name-seperator').className = 'hidden';
}

export async function registerUser(registerInfo) {
    const loginBtn = document.getElementById('login-btn');
    const usernameBtn = document.getElementById('user-name-btn');
    const closeRegisterBtn = document.getElementById('close-register-btn');
    const registerForm = document.getElementById('register-form');
    const registerErrorMessage = document.getElementById('register-error-message');
    const res = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerInfo)
    });
    const data = await res.json();
    if (!data.Error) {
        localStorage.setItem('token', data.token);
        loginBtn.className = 'hidden';
        usernameBtn.className = 'nav-item';
        usernameBtn.innerHTML = data.name;
        document.getElementById('user-name-seperator').className = '';
        closeRegisterBtn.click();
        registerForm.reset();
        getUser()
        loadUserCart()
    }
    else {
        registerErrorMessage.innerHTML = data.Error;
    }
    console.log("register: " + localStorage.getItem('token'))
}
export async function deleteUser() {
    const loginBtn = document.getElementById('login-btn');
    const usernameBtn = document.getElementById('user-name-btn');
    await fetch('/users', {
        method: 'DELETE',
        headers: { Authorization: localStorage.getItem('token') }
    });
    localStorage.clear();
    loginBtn.className = 'nav-item';
    usernameBtn.className = 'hidden';
    document.getElementById('user-name-seperator').className = 'hidden';
}

export async function editUser(userInfo) {
    const closeEditUserBtn = document.getElementById('close-edit-user-btn');
    const editForm = document.getElementById('edit-form');
    const editErrorMessage = document.getElementById('edit-error-message');
    const res = await fetch('/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
        body: JSON.stringify(userInfo)
    });
    const data = await res.json();
    if (!data.Error) {
        closeEditUserBtn.click();
        editForm.reset();
        getUser();
    }
    else
        editErrorMessage.innerHTML = data.Error;
}

export async function getBookInformation(bookName) {
    const modalInfoBookFooter = document.getElementById('modal-infoBook-footer');
    const infoBookName = document.getElementById('book-name');
    const infoBookAuthor = document.getElementById('book-author');
    const infoBookYear = document.getElementById('book-year');
    const infoBookGenre = document.getElementById('book-genre');
    const infoBookDescription = document.getElementById('book-description');
    const infoBookImg = document.getElementById('book-img');
    const infoQuantityNumber = document.getElementById('quantityNumber');
    const infoAddBookMessage = document.getElementById('add-book-message');
    const bookInformationModal = document.getElementById('book-information-modal');


    modalInfoBookFooter.removeChild(modalInfoBookFooter.lastChild)
    infoQuantityNumber.innerHTML = '1';
    console.log(bookName);
    const res = await fetch('/books/' + bookName, {
        method: 'GET'
    });
    const data = await res.json();
    console.log(data)
    infoBookName.children[1].innerHTML = ' ' + data.book.name;
    infoBookAuthor.children[1].innerHTML = ' ' + data.book.author;
    infoBookYear.children[1].innerHTML = ' ' + data.book.year;
    infoBookGenre.children[1].innerHTML = ' ' + data.book.genre;
    infoBookDescription.children[1].innerHTML = ' ' + data.book.description;
    infoBookImg.style.backgroundImage = "url('" + data.book.image + "')"
    infoAddBookMessage.innerHTML = '';

    const addBookBtn = document.createElement('button');
    addBookBtn.className = 'addBook-btn';
    addBookBtn.id = 'addBook-btn';
    addBookBtn.classList.add('cursor')
    addBookBtn.innerHTML = "Add Book"
    modalInfoBookFooter.appendChild(addBookBtn)

    addBookBtn.addEventListener('click', () => {
        const value = parseInt(infoQuantityNumber.innerHTML);
        addBookToDBCart(bookName, value);
        bookInformationModal.className = 'hidden';
    });

    let booksCartNames = await loadCart()
    booksCartNames?.forEach((el) => {
        if (el.book === bookName) {
            infoAddBookMessage.innerHTML = 'Book has been already added to the cart previously.';
        }
    })
}

export async function removeBookFromDBCart(bookName, num) {
    console.log("(delete cart)... " + bookName + " -> " + num)
    const response = await fetch('/users/cart/' + bookName, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
        body: JSON.stringify({ num })
    });
    const res = await response.json()
    console.log("remove res -> " + res.Error)
    if (res.Error === 'not authenticate') {
        return removeBookFromLocalStorageCart(bookName, num)
    }
    loadCart()
    alert(`${num} books named: "${bookName}" has been deleted from cart`)
}

export async function loadCart() {
    const cartBookBody = document.getElementById('cart-book-body');
    while (cartBookBody.firstChild) {
        cartBookBody.removeChild(cartBookBody.firstChild)
    }
    cartBookBody.innerHTML = '';

    const response = await fetch('/users/cart', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') }
    });
    const res = await response.json()
    let cart = [];
    if (res.Error === 'not authenticate') {
        cart = JSON.parse(localStorage.getItem('cart'))
    } else {
        cart = res
    }
    console.log("cart: " + cart)
    if (!cart || res.Error === 'No books in cart') {
        cartBookBody.innerHTML = 'No books in cart.';
    } else {
        for (let i = 0; i < cart.length; i++) {
            const res = await fetch('/books/' + cart[i].book, {
                method: 'GET'
            });
            const data = await res.json();
            let cartBookDiv = document.createElement('div');
            cartBookDiv.className = 'cart-book'
            cartBookDiv.id = cart[i].book
            let cartBookImg = document.createElement('div');
            cartBookImg.className = 'cart-book-img'
            cartBookImg.style.backgroundImage = "url('" + data.book.image + "')"
            let cartBookName = document.createElement('div');
            cartBookName.className = 'cart-book-name'
            cartBookName.innerHTML = data.book.name;

            let cartBookDivFooter = document.createElement('div');
            cartBookDivFooter.className = 'cart-infoBook-footer'
            let cartBookQuantityContainer = document.createElement('div');
            cartBookQuantityContainer.className = 'cart-quantity-container'
            let cartBookQuantityNumber = document.createElement('div');
            cartBookQuantityNumber.className = 'cartquantityNumber'
            cartBookQuantityNumber.innerHTML = cart[i].quantity
            let cartBookBtnQuantityContainer = document.createElement('div');
            cartBookBtnQuantityContainer.className = 'btn-quantity-container'
            let cartBookIncreaseBtn = document.createElement('button');
            cartBookIncreaseBtn.className = 'cart-increase-decrease-btn'
            cartBookIncreaseBtn.innerHTML = '+'
            let cartBookDecreaseBtn = document.createElement('button');
            cartBookDecreaseBtn.className = 'cart-increase-decrease-btn'
            cartBookDecreaseBtn.innerHTML = '-'
            let cartBookRemoveBtn = document.createElement('button');
            cartBookRemoveBtn.className = 'remove-btn'
            cartBookRemoveBtn.innerHTML = 'DEL'

            cartBookBtnQuantityContainer.appendChild(cartBookIncreaseBtn)
            cartBookBtnQuantityContainer.appendChild(cartBookDecreaseBtn)

            cartBookQuantityContainer.appendChild(cartBookBtnQuantityContainer)
            cartBookQuantityContainer.appendChild(cartBookQuantityNumber)

            cartBookDivFooter.appendChild(cartBookQuantityContainer)
            cartBookDivFooter.appendChild(cartBookRemoveBtn)

            cartBookDiv.appendChild(cartBookDivFooter);
            cartBookDiv.appendChild(cartBookImg);
            cartBookDiv.appendChild(cartBookName);
            cartBookBody.appendChild(cartBookDiv);

            cartBookIncreaseBtn.addEventListener('click', () => {
                cartBookQuantityNumber.innerHTML = cartIncreaseAddBookValue(cartBookQuantityNumber.innerHTML, cart[i].quantity)
            });

            cartBookDecreaseBtn.addEventListener('click', () => {
                cartBookQuantityNumber.innerHTML = cartDecreaseAddBookValue(cartBookQuantityNumber.innerHTML)
            });

            cartBookRemoveBtn.addEventListener('click', () => {
                removeBookFromDBCart(data.book.name, cartBookQuantityNumber.innerHTML)
            });

        }
    }
    return cart
}

function cartIncreaseAddBookValue(quantityNumber, quantity) {
    let value = parseInt(quantityNumber);
    let maxValue = parseInt(quantity);
    if (value === maxValue) {
        return maxValue;
    } else {
        value++;
        return value;
    }
}
function cartDecreaseAddBookValue(quantityNumber) {
    let value = parseInt(quantityNumber);
    if (value === 1) {
        return 1;
    } else {
        value--;
        return value;
    }
}

export async function addBookToDBCart(bookName, num) {
    console.log(bookName + " -> " + num)
    const response = await fetch('/users/cart/' + bookName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
        body: JSON.stringify({ num })
    });
    const res = await response.json()
    console.log("add res -> " + res.Error)
    if (res.Error === 'not authenticate') {
        return addBookToLocalStorageCart(bookName, num)
    }
    alert('book has been added to cart')
}

export async function addBookToLocalStorageCart(bookName, num) {
    let cart = []
    if (localStorage.getItem('cart') && localStorage.getItem('cart') !== 'null') {
        cart = localStorage.getItem('cart')
        cart = JSON.parse(cart)
    }
    let isExists = false
    cart.forEach((el) => {
        if (el.book === bookName) {
            el.quantity += num
            isExists = true
        }
    })
    if (!isExists)
        cart.push({ book: bookName, quantity: num })
    cart = JSON.stringify(cart)
    localStorage.setItem('cart', cart)
    alert('book has been added to cart')
}

export async function removeBookFromLocalStorageCart(bookName, num) {
    let cart = []
    cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    cart.forEach((el) => {
        if (el.book === bookName) {
            el.quantity -= num
            if (el.quantity === 0) {
                //delete el;
                cart = cart.filter((obj) => obj.book !== bookName);
            }
        }
    })
    if (!cart || cart.length === 0) {
        localStorage.setItem('cart', null)
    } else {
        cart = JSON.stringify(cart)
        localStorage.setItem('cart', cart)
    }
    loadCart();
    alert(`${num} books named: "${bookName}" has been deleted from cart`)
}

export async function buyAllBooksFromCart() {
    const response = await fetch('/users/cart', {
        method: 'DELETE',
        headers: { Authorization: localStorage.getItem('token') }
    });
    const res = await response.json()
    console.log("buy res -> " + res)
    if (res.Error === 'not authenticate') {
        localStorage.setItem('cart', null)
    }
    alert('Thanks for buying');
}