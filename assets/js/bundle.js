(() => {
    const selector = selector => document.querySelector(selector);/* trecho omitido */
    const create = element => document.createElement(element) /* trecho omitido */

    const app = selector('#app');

    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
        e.preventDefault();
       
        const [email, password] = e.target;
        const {url} = await fakeAuthenticate(email.value, password.value);

        location.href='#users';        
        const users = await getDevelopersList(url);
        renderPageUsers(users);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        (!email.validity.valid || !email.value || password.value.length <= 5) 
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };

    Form.innerHTML =`<input type="email" name="email" placeholder="Entre com seu e-mail" required />
                    <input type="password" name="password" placeholder="Digite sua senha supersecreta" required />
                    <button name="button" type="submit" disabled="disabled"> Entrar </button>`;           
    
    app.appendChild(Logo);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {
       
        let response = await fetch('http://www.mocky.io/v2/5dba690e3000008c00028eb6');
        let data = await response.json();

        const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;   
        localStorage.setItem('token', fakeJwtToken);          

        return data;
    }

    async function getDevelopersList(url) {

        let response = fetch(url)
        .then(data=>data.json())
       
        return response; 
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = 'none';

        const Ul = create('ul');
        Ul.classList.add('container')

        users.map(i=>{
            let li = create('li')
            li.classList.add('lista-usuarios')
            li.innerHTML = ` <img src="${i.avatar_url}"/> <span>  ${i.login}</span> `;
            Ul.appendChild(li)
        })
        app.appendChild(Ul)

        const footer = create('footer')
        footer.innerHTML = `by&nbsp;<span>DiJosy &#128150;</span>`;
        app.appendChild(footer)
    }

    // init
    (async function(){
        const rawToken =  localStorage.getItem('token');
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href='#login';
            app.appendChild(Login);
        } else {
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()