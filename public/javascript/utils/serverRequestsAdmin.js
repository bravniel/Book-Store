let resetBookName = ''

export async function getAdmin() {
    const usernameBtn = document.getElementById('user-name-btn');
    const editForm = document.getElementById('edit-form');

    const res = await fetch('/admins/connected-admin-info', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await res.json();
    console.log(data)
    if (data.Error) {
        localStorage.clear();
        window.location.replace('http://localhost:3000/admins/login-page');
    } else {
        editForm.children[0].children[0].placeholder = data.username;
        editForm.children[0].children[1].placeholder = 'password';
        usernameBtn.innerHTML = data.username;
    }
}

export async function logout() {
    await fetch('/admins/logout', {
        method: 'POST',
        headers: { Authorization: localStorage.getItem('token') }
    });
    localStorage.clear();
    alert('This admin token has been ruin!')
    window.location.replace('http://localhost:3000/admins/login-page');
}

export async function deleteAdmin() {
    await fetch('/admins', {
        method: 'DELETE',
        headers: { Authorization: localStorage.getItem('token') }
    });
    localStorage.clear();
    alert('This admin has been deleted!')
    window.location.replace('http://localhost:3000/admins/login-page');
}

export async function editAdminInfo(adminInfo) {
    const closeEditAdminBtn = document.getElementById('close-edit-user-btn');
    const editForm = document.getElementById('edit-form');
    const editErrorMessage = document.getElementById('edit-error-message');
    const res = await fetch('/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
        body: JSON.stringify(adminInfo)
    });
    const data = await res.json();
    if (!data.Error) {
        closeEditAdminBtn.click();
        editForm.reset();
        getAdmin();
        alert('Information has been updated!')
    }
    else
        editErrorMessage.innerHTML = data.Error;
}

export async function getBookInformation(bookName) {
    resetBookName = ''
    const bookInfo = document.getElementById('info');
    while (bookInfo.children.length > 0) {
        bookInfo.removeChild(bookInfo.lastChild)
    }

    const infoBookName = document.getElementById('book-name');
    const infoBookAuthor = document.getElementById('book-author');
    const infoBookYear = document.getElementById('book-year');
    const infoBookGenre = document.getElementById('book-genre');
    const infoBookDescription = document.getElementById('book-description');
    const infoBookImg = document.getElementById('book-img');
    const bookInformationModal = document.getElementById('book-information-modal');

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

    const editBookBtn = document.createElement('button');
    editBookBtn.className = 'editBook-btn';
    editBookBtn.innerHTML = "Edit Book"
    bookInfo.appendChild(editBookBtn)
    editBookBtn.addEventListener('click', () => {
        resetBookName = bookName
        loadEditBookInfo(bookName);
        bookInformationModal.className = 'hidden';
    });

    const deleteBookBtn = document.createElement('button');
    deleteBookBtn.className = 'deleteBook-btn';
    deleteBookBtn.innerHTML = "Delete Book"
    bookInfo.appendChild(deleteBookBtn)
    deleteBookBtn.addEventListener('click', () => {
        deleteBook(bookName);
        bookInformationModal.className = 'hidden';
    });
}

export async function loadEditBookInfo(bookName) {
    const editBookForm = document.getElementById('edit-book-form');
    const editBookModal = document.getElementById('edit-book-modal');
    const res = await fetch('/books/' + bookName, {
        method: 'GET'
    });
    const data = await res.json();
    editBookForm.children[0].children[0].children[1].value = data.book.name;
    editBookForm.children[0].children[1].children[1].value = data.book.author;
    editBookForm.children[0].children[2].children[1].value = data.book.year;
    editBookForm.children[0].children[3].children[1].value = data.book.genre;
    editBookForm.children[0].children[4].children[1].value = data.book.description;
    editBookForm.children[0].children[5].children[1].value = data.book.image;

    editBookModal.className = 'modal';
}
export async function editBook(bookInfo) {
    const editBookErrorMessage = document.getElementById('edit-book-error-message');
    const closeEditBookBtn = document.getElementById('close-editbook-btn');
    editBookErrorMessage.innerHTML = ''
    const res = await fetch('/books/' + resetBookName, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
        body: JSON.stringify(bookInfo)
    });
    const data = await res.json();
    if (!data.Error) {
        loadBooks()
        closeEditBookBtn.click();
        alert('Book information has been updated.');
    } else {
        editBookErrorMessage.innerHTML = data.Error
    }
}

export async function deleteBook(book) {
    const res = await fetch('/books/' + book, {
        method: 'DELETE',
        headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await res.json();
    if (!data.Error) {
        loadBooks()
        alert('Book has been deleted.');
    } else {
        alert('Book not found.');
    }
}

export async function addNewBook(bookInfo) {
    const closeNewBookBtn = document.getElementById('close-newbook-btn');
    const newBookErrorMessage = document.getElementById('new-book-error-message');

    newBookErrorMessage.innerHTML = ''
    const res = await fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
        body: JSON.stringify(bookInfo)
    });
    const data = await res.json();
    if (!data.Error) {
        loadBooks()
        closeNewBookBtn.click();
        alert('Book has been added.');
    } else {
        newBookErrorMessage.innerHTML = data.Error
    }
}

