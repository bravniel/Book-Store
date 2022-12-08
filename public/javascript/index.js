import { addClickEventToQueryAll, addEventListeners } from './utils/eventListeners.js';
import { getUser } from './utils/serverRequests.js';

const url = 'http://localhost:3000';

loadPage();
addEventListeners();
addClickEventToQueryAll();

async function loadPage() {
    if (localStorage.getItem('token')) {
        getUser();
    } else {
        localStorage.setItem('cart', null)
    }
}

// searchBook ->
// bookscontainer.innerHTML = 'No Book Results.';
// booksearcherrormessage.innerHTML = '* Invalid Search. There are no books by search value: "' + book + '". (You can search a book only by name) *';

// bookscontainer.innerHTML = 'No Books In Data.';
// addAuthorToContainer(dbbook.author.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)