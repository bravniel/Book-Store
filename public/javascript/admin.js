import { addEventListeners, addClickEventToQueryAll } from "./utils/eventListenersAdmin.js";
import { getAdmin } from "./utils/serverRequestsAdmin.js";

LoadPage();

async function LoadPage() {
    if (localStorage.getItem('token')) {
        getAdmin();
        addEventListeners();
        addClickEventToQueryAll();
    } else {
        localStorage.clear();
        window.location.replace('http://localhost:3000/admins/login-page');
    }
}









