import chat from './templates/chat-content.hbs';
import editor from './templates/image-content.hbs';

let socket = io.connect('http://localhost:3000');


let wrapper = document.querySelector('.wrapper')
let form = document.querySelector('.form');
let usersMenu;
let photoUrl = null;

//DATA
let usersData = {};
//Messages
let messages = [];


document.addEventListener('click', (e)=>{
   // e.preventDefault();
   //Авторизация
   if(e.target.classList.contains('form__button')){
      let name = form.elements.name.value
      let nickname = form.elements.nickname.value
      if(name && nickname){
         socket.emit('change_username', {username : name, userNickname : nickname})
         wrapper.innerHTML = chat();
      }
   }
   //Отправить сообщение на сервер
   if(e.target.classList.contains('messages__btn')){
      let inputMsg = document.querySelector('.messages__send').value;
      if(inputMsg){
         socket.emit('new_message', {message : inputMsg})
      }
   }
   //Открыть бургер
   if(e.target.classList.contains('hamburger-menu-link') || e.target.classList.contains('hamburger-menu-link__bars') ){
       usersMenu = document.querySelector('.users__menu');
       usersMenu.style =  'display : block';
   }
   ///Закрыть бургер
   if(e.target.classList.contains('users__menu_close')){
    usersMenu.style =  'display : none';
   }

   //Открыть editor
   if(e.target.classList.contains('users__menu_avatar')){
      wrapper.innerHTML = editor();
   }
   //Выбрать фото
   if(e.target.classList.contains('img_editor__input')){
      let editor  = document.querySelector('.img_editor__input');
      editor.addEventListener('change', (e) =>{
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        photoUrl = reader.result;
        document.querySelector('.img_editor__pic').src = photoUrl;
      };
})
   }
   //Сохранить фото
   if(e.target.classList.contains('img_editor__accept')){
      if(photoUrl){
         socket.emit('new_avatar', photoUrl)
      }

   }
})


socket.on('user_connected', (data)=>{
      usersData.counter = data.usersValue.length
      usersData.usersValue = data.usersValue
    wrapper.innerHTML = chat(usersData)
})

//Принимает полученные сообщения
socket.on('new_message', (data) => {
   usersData.usersValue = data.usersValue;
   messages.push(data.message);
   usersData.messages = messages;
   wrapper.innerHTML = chat(usersData);
})

socket.on('new_avatar', (data) =>{
   usersData.usersValue = data;
   wrapper.innerHTML = chat(usersData);
})


socket.on('disconnect', (data) =>{
   usersData.usersValue = data;
   wrapper.innerHTML = chat(usersData);
})
