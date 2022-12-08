const loginModal = document.getElementById('login-register-modal');;
const loginForm = document.getElementById('login-form');
const loginErrorMessage = document.getElementById('login-error-message');
const registerBtn = document.getElementById('register-btn');

const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const registerErrorMessage = document.getElementById('register-error-message');
const backToLoginBtn = document.getElementById('backToLogin-btn');

const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', () => {
    loginForm.reset()
    registerForm.reset()
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginInfo = { username: loginForm.children[0].children[0].value, password: loginForm.children[0].children[1].value };
    Login(loginInfo);
});

registerBtn.addEventListener('click', () => {
    loginModal.className = 'hidden';
    registerModal.className = 'modal';
});

backToLoginBtn.addEventListener('click', () => {
    registerModal.className = 'hidden';
    loginModal.className = 'modal';
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const registerInfo = { username: registerForm.children[0].children[0].value, password: registerForm.children[0].children[1].value };
    Register(registerInfo);
});

async function Login(loginInfo) {
    console.log("on login- login info: " + JSON.stringify(loginInfo))
    const res = await fetch('/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
    });
    const data = await res.json();
    if (!data.Error) {
        localStorage.setItem('token', data.token);
        localStorage.removeItem('cart')
        loginForm.reset();
        window.location.replace('/admins/home-page');
    }
    else
        loginErrorMessage.innerHTML = data.Error;
    loginForm.reset();
    console.log("on login- local storage token: " + localStorage.getItem('token'))
};

async function Register(registerInfo) {
    const res = await fetch('/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerInfo)
    });
    const data = await res.json();
    if (!data.Error) {
        localStorage.setItem('token', data.token);
        localStorage.removeItem('cart')
        registerForm.reset();
        window.location.replace('/admins/home-page');
    }
    else {
        registerErrorMessage.innerHTML = data.Error;
        registerForm.reset();
    }
    console.log("register: " + localStorage.getItem('token'))
}