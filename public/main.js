
// let test = document.getElementById('test').innerHTML;
// let templateTest = Handlebars.compile(test);
// let counter2 = {
//    test: 1
// };


let template2 = Handlebars.compile(`<div class="chatroom">
<div class="chatroom__container">
    <div class="users">
        <ul class="users__list">
        </ul>
    </div>
    <div class="messages">
        <div class="messages__head">
            <div class="messages__text">Чат</div>
            <div class="messages__users">{{counter}}</div>
        </div>
        <div class="messages__content"></div>
        <div class="messages__footer">
            <input type="text" class="messages__send" placeholder='Введите сообщение...'>
            <button class="messages__btn">Отправить</button>
        </div>
    </div>
</div>
</div>`)

let template3 = Handlebars.compile(`{{#each currentUsers}}
<li class="user__item">
    <div class="user__img">
        <img src="" alt="" class="user__pic">
    </div>
    <div class="user__info">
        <div class="user__name"> {{name}}
        </div>
        <div class="user__last_msg">{{msg}}</div>
    </div>
</li>
{{/each}}`)



let socket = io.connect('http://localhost:3000');

let chat = document.getElementById('chat').innerHTML;
let template = Handlebars.compile(chat);

let wrapper = document.querySelector('.wrapper')
let form = document.querySelector('.form');

let formBtn = document.querySelector('.form__button');

document.addEventListener('click', (e)=>{
   e.preventDefault();
   //Авторизация
   if(e.target.classList.contains('form__button')){
      let name = form.elements.name.value
      let nickname = form.elements.nickname.value
      socket.emit('change_username', {username : name, userNickname : nickname})
      wrapper.innerHTML = template2();
   }
   //Отправить сообщение на сервер
   if(e.target.classList.contains('messages__btn')){
      let inputMsg = document.querySelector('.messages__send');
      socket.emit('new_message', {message : inputMsg.value})
   }
})

socket.on('user_connected', (data)=>{
   let usersList = document.querySelector('.users__list')
   usersList.innerHTML = template3(data)
   let userNum = document.querySelector('.messages__users')
      userNum.textContent = data.counter + ' ' + 'онлайн';
   // wrapper.innerHTML = template2(data);
})

//Принимает полученные сообщения
socket.on('new_message', (data) => {
   let msgContent = document.querySelector('.messages__content')
   let msg = createMsg(`${data.username} : ${data.message}`);
   msgContent.appendChild(msg);
})

//Создать сообщение в DOM
function createMsg(value){
   let msg = document.createElement('div')
   msg.classList.add('messages__message')
   msg.textContent = value
   return msg
}


//Создать пользователя в DOM
function createUser(){}
