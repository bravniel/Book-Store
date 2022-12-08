import { addNewBook, deleteAdmin, editAdminInfo, editBook, getBookInformation, loadEditBookInfo, logout } from "./serverRequestsAdmin.js";

export function addEventListeners() {
    const newBookbtn = document.getElementById('newBook-btn');
    const usernameBtn = document.getElementById('user-name-btn');
    const usernameItesm = document.getElementById('user-name-items');
    const adminEditBtn = document.getElementById('user-edit-btn');
    const adminLogoutBtn = document.getElementById('user-logout-btn');
    const bookSearchForm = document.getElementById('book-search-form');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const closeEditAdminBtn = document.getElementById('close-edit-user-btn');
    const editForm = document.getElementById('edit-form');
    const resetEditBtn = document.getElementById('resetEdit-btn');
    const deleteAdminBtn = document.getElementById('deleteUser-btn');
    const closeBookInformationBtn = document.getElementById('close-book-information-btn');
    const editBookModal = document.getElementById('edit-book-modal');
    const closeEditBookBtn = document.getElementById('close-editbook-btn');
    const editBookForm = document.getElementById('edit-book-form');
    const resetEditBookBtn = document.getElementById('resetEditBook-btn');
    const newBookModal = document.getElementById('new-book-modal');
    const closeNewBookBtn = document.getElementById('close-newbook-btn');
    const newBookForm = document.getElementById('new-book-form');
    const clearInfoBtn = document.getElementById('clear-btn');

    clearInfoBtn.addEventListener('click', () => {
        newBookForm.reset()
    });

    newBookbtn.addEventListener('click', () => {
        newBookModal.className = 'modal';
    });

    closeNewBookBtn.addEventListener('click', () => {
        newBookModal.className = 'hidden';
    });

    adminEditBtn.addEventListener('click', () => {
        const editAdminModal = document.getElementById('edit-user-modal');
        editAdminModal.className = 'modal';
        const usernameItesm = document.getElementById('user-name-items');
        usernameItesm.className = 'hidden';
    });

    closeEditAdminBtn.addEventListener('click', () => {
        const editAdminModal = document.getElementById('edit-user-modal');
        editAdminModal.className = 'hidden';
        editForm.reset()
    });

    closeEditBookBtn.addEventListener('click', () => {
        editBookModal.className = 'hidden';
    });

    adminLogoutBtn.addEventListener('click', () => {
        logout();
        const usernameItesm = document.getElementById('user-name-items');
        usernameItesm.className = 'hidden';
    });

    closeBookInformationBtn.addEventListener('click', () => {
        const bookInformationModal = document.getElementById('book-information-modal');
        bookInformationModal.className = 'hidden';
    });

    deleteAdminBtn.addEventListener('click', () => {
        deleteAdmin();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editInfo = { username: editForm.children[0].children[0].value, password: editForm.children[0].children[1].value, repeatPassword: editForm.children[0].children[2].value };
        editAdminInfo(editInfo);
    });

    resetEditBtn.addEventListener('click', () => {
        editForm.reset()
    });

    resetEditBookBtn.addEventListener('click', () => {
        editBookModal.className = 'hidden';
        console.log("reset book edit: " + resetBookName)
        loadEditBookInfo(resetBookName)
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
            fetch('/admins/home-page/books?' + page + "&" + searchValue, { method: 'GET' });
            window.location.replace(`/admins/home-page/books?${page}&${searchValue}`)
        } else {
            bookSearchButton.value = ''
            const page = "page=1";
            fetch('/admins/home-page/books?' + page, { method: 'GET' });
            window.location.replace(`/admins/home-page/books?${page}`)
        }
    });

    editBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editBookInfo = {
            name: editBookForm.children[0].children[0].children[1].value,
            author: editBookForm.children[0].children[1].children[1].value,
            year: editBookForm.children[0].children[2].children[1].value,
            genre: editBookForm.children[0].children[3].children[1].value,
            description: editBookForm.children[0].children[4].children[1].value,
            image: editBookForm.children[0].children[5].children[1].value
        };
        editBook(editBookInfo);
    });

    newBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newBookInfo = {
            name: newBookForm.children[0].children[0].children[1].value,
            author: newBookForm.children[0].children[1].children[1].value,
            year: newBookForm.children[0].children[2].children[1].value,
            genre: newBookForm.children[0].children[3].children[1].value,
            description: newBookForm.children[0].children[4].children[1].value,
            image: newBookForm.children[0].children[5].children[1].value
        };
        addNewBook(newBookInfo);
    });

    nextPageBtn?.addEventListener('click', () => {
        const pagenumber = document.getElementById('page-number');
        const nextPage = parseInt(pagenumber.innerHTML) + 1
        const page = "page=" + nextPage;

        if (window.location.href.includes('&search=')) {
            const searchValue = "search=" + window.location.href.slice(window.location.href.lastIndexOf("=") + 1);
            fetch('/admins/home-page/books?' + page + "&" + searchValue, { method: 'GET' });
            window.location.replace(`/admins/home-page/books?${page}&${searchValue}`)
        } else {
            fetch('/admins/home-page/books?' + page, { method: 'GET' });
            window.location.replace(`/admins/home-page/books?${page}`)
        }
    });

    prevPageBtn?.addEventListener('click', () => {
        const pagenumber = document.getElementById('page-number');
        const prePage = parseInt(pagenumber.innerHTML) - 1
        const page = "page=" + prePage;

        if (window.location.href.includes('&search=')) {
            const searchValue = "search=" + window.location.href.slice(window.location.href.lastIndexOf("=") + 1);
            fetch('/admins/home-page/books?' + page + "&" + searchValue, { method: 'GET' });
            window.location.replace(`/admins/home-page/books?${page}&${searchValue}`)
        } else {
            fetch('/admins/home-page/books?' + page, { method: 'GET' });
            window.location.replace(`/admins/home-page/books?${page}`)
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
