import { buyAllBooksFromCart, deleteUser, editUser, getBookInformation, loadCart, login, logout, registerUser } from "./serverRequests.js";

export function addEventListeners() {
    const loginBtn = document.getElementById('login-btn');
    const cartBtn = document.getElementById('cart-btn');
    const usernameBtn = document.getElementById('user-name-btn');
    const usernameItesm = document.getElementById('user-name-items');
    const userEditBtn = document.getElementById('user-edit-btn');
    const userLogoutBtn = document.getElementById('user-logout-btn');
    const bookSearchForm = document.getElementById('book-search-form');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const closeLoginBtn = document.getElementById('close-login-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerBtn = document.getElementById('register-btn');
    const closeRegisterBtn = document.getElementById('close-register-btn');
    const registerForm = document.getElementById('register-form');
    const backToLoginBtn = document.getElementById('backToLogin-btn');
    const closeEditUserBtn = document.getElementById('close-edit-user-btn');
    const editForm = document.getElementById('edit-form');
    const resetEditBtn = document.getElementById('resetEdit-btn');
    const deleteUserBtn = document.getElementById('deleteUser-btn');
    const closeBookInformationBtn = document.getElementById('close-book-information-btn');
    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const buyAllBooksBtn = document.getElementById('buy-books-btn');
    const clearInfoBtn = document.getElementById('clear-btn');

    clearInfoBtn.addEventListener('click', () => {
        loginForm.reset()
        registerForm.reset()
    });

    loginBtn.addEventListener('click', () => {
        const loginModal = document.getElementById('login-register-modal');
        loginModal.className = 'modal';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginInfo = { email: loginForm.children[0].children[0].value, password: loginForm.children[0].children[1].value };
        login(loginInfo);
    });

    registerBtn.addEventListener('click', () => {
        const loginModal = document.getElementById('login-register-modal');
        const registerModal = document.getElementById('register-modal');
        loginModal.className = 'hidden';
        registerModal.className = 'modal';
    });

    closeLoginBtn.addEventListener('click', () => {
        const loginModal = document.getElementById('login-register-modal');
        loginModal.className = 'hidden';
    });

    cartBtn.addEventListener('click', () => {
        const cartModal = document.getElementById('cart-modal');
        loadCart()
        cartModal.className = 'modal';
    });

    closeCartBtn.addEventListener('click', () => {
        const cartModal = document.getElementById('cart-modal');
        cartModal.className = 'hidden';
    });

    userEditBtn.addEventListener('click', () => {
        const editUserModal = document.getElementById('edit-user-modal');
        editUserModal.className = 'modal';
        const usernameItesm = document.getElementById('user-name-items');
        usernameItesm.className = 'hidden';
    });

    closeEditUserBtn.addEventListener('click', () => {
        const editUserModal = document.getElementById('edit-user-modal');
        editUserModal.className = 'hidden';
    });

    userLogoutBtn.addEventListener('click', () => {
        logout();
        const usernameItesm = document.getElementById('user-name-items');
        usernameItesm.className = 'hidden';
    });

    backToLoginBtn.addEventListener('click', () => {
        const loginModal = document.getElementById('login-register-modal');
        const registerModal = document.getElementById('register-modal');
        registerModal.className = 'hidden';
        loginModal.className = 'modal';
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const registerInfo = { name: registerForm.children[0].children[0].value, email: registerForm.children[0].children[1].value, password: registerForm.children[0].children[2].value };
        registerUser(registerInfo);
    });

    closeRegisterBtn.addEventListener('click', () => {
        const registerModal = document.getElementById('register-modal');
        registerModal.className = 'hidden';
    });

    closeBookInformationBtn.addEventListener('click', () => {
        const bookInformationModal = document.getElementById('book-information-modal');
        bookInformationModal.className = 'hidden';
    });

    deleteUserBtn.addEventListener('click', () => {
        deleteUser();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editUserInfo = { name: editForm.children[0].children[0].value, email: editForm.children[0].children[1].value, password: editForm.children[0].children[2].value, repeatPassword: editForm.children[0].children[3].value };
        editUser(editUserInfo);
    });

    resetEditBtn.addEventListener('click', () => {
        editForm.reset()
    });

    bookSearchForm.addEventListener('submit', (e) => {
        const bookSearchInput = document.getElementById('book-search-input');
        const bookSearchButton = document.getElementById('book-search-button');
        const bookSearchErrorMessage = document.getElementById('book-search-error-message');
        const booksContainer = document.getElementById('books-container');
        e.preventDefault();
        booksContainer.innerHTML = '';
        bookSearchErrorMessage.innerHTML = '';
        bookSearchButton.value = ''
        if (bookSearchInput.value) {
            const page = "page=1";
            const searchValue = "search=" + bookSearchInput.value;
            fetch('/books?' + page + "&" + searchValue, { method: 'GET' });
            window.location.replace(`books?${page}&${searchValue}`)
        } else {
            bookSearchButton.value = ''
            const page = "page=1";
            fetch('/books?' + page, { method: 'GET' });
            window.location.replace(`books?${page}`)
        }
    });

    buyAllBooksBtn.addEventListener('click', () => {
        const cartbookbody = document.getElementById('cart-book-body');
        if (cartbookbody.innerHTML !== 'No books in cart.') {
            buyAllBooksFromCart();
        } else {
            alert('Cart is empty, you can not buy yet');
        }
        closeCartBtn.click()
    });

    nextPageBtn?.addEventListener('click', () => {
        const pagenumber = document.getElementById('page-number');
        const nextPage = parseInt(pagenumber.innerHTML) + 1
        const page = "page=" + nextPage;

        if (window.location.href.includes('&search=')) {
            const searchValue = "search=" + window.location.href.slice(window.location.href.lastIndexOf("=") + 1);
            fetch('/books?' + page + "&" + searchValue, { method: 'GET' });
            window.location.replace(`books?${page}&${searchValue}`)
        } else {
            fetch('/books?' + page, { method: 'GET' });
            window.location.replace(`books?${page}`)
        }
    });

    prevPageBtn?.addEventListener('click', () => {
        const pagenumber = document.getElementById('page-number');
        const prePage = parseInt(pagenumber.innerHTML) - 1
        const page = "page=" + prePage;

        if (window.location.href.includes('&search=')) {
            const searchValue = "search=" + window.location.href.slice(window.location.href.lastIndexOf("=") + 1);
            fetch('/books?' + page + "&" + searchValue, { method: 'GET' });
            window.location.replace(`books?${page}&${searchValue}`)
        } else {
            fetch('/books?' + page, { method: 'GET' });
            window.location.replace(`books?${page}`)
        }
    });

    increaseBtn.addEventListener('click', () => {
        const quantityNumber = document.getElementById('quantityNumber');
        let value = parseInt(quantityNumber.innerHTML);
        if (value === 100) {
            quantityNumber.innerHTML = '100'
        } else {
            value++;
            quantityNumber.innerHTML = value;
        }
        document.getElementById('addBook-btn').innerHTML = "Add Books"
    });

    decreaseBtn.addEventListener('click', () => {
        const quantityNumber = document.getElementById('quantityNumber');
        let value = parseInt(quantityNumber.innerHTML);
        if (value === 1) {
            quantityNumber.innerHTML = '1'
        } else {
            value--;
            quantityNumber.innerHTML = value;
            if (value === 1)
                document.getElementById('addBook-btn').innerHTML = "Add Book"
        }
    });

    usernameBtn.addEventListener('mouseenter', () => {
        usernameItesm.className = 'user-name-items';
    });

    usernameBtn.addEventListener('mouseleave', () => {
        usernameItesm.className = 'hidden';
    });

    usernameItesm.addEventListener('mouseenter', () => {
        usernameItesm.className = 'user-name-items';
    });

    usernameItesm.addEventListener('mouseleave', () => {
        usernameItesm.className = 'hidden';
    });
}

export function addClickEventToQueryAll() {
    const booksContainers = document.querySelectorAll('.book-img')
    const bookInformationModal = document.getElementById('book-information-modal');
    for (let book of booksContainers)
        book.addEventListener('click', () => {
            getBookInformation(book.id);
            bookInformationModal.className = 'modal';
        })
};


