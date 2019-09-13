import { create } from 'domain';

/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function() {
    let currentValue = filterNameInput.value;
    listTable.innerHTML = '';
    for (let cookie in cookies) {
        if (isMatching(cookie, currentValue) || isMatching(cookies[cookie], currentValue)) {
            createCookieNode(cookie, cookies[cookie]);
        }
    }
});

addButton.addEventListener('click', () => {
    if (addNameInput.value !== '' && addValueInput.value !== '') {
        document.cookie = `${addNameInput.value}=${addValueInput.value}; max-age=3600`;
        splitCookies();
        downloadCookies();
    }
});

let cookies;

function splitCookies() {
    if (document.cookie !== '') {
        cookies = document.cookie.split('; ').reduce((prev, current) => {
            const [name, value] = current.split('=');

            prev[name] = value;
            
            return prev;
        }, {});
    }
}
splitCookies();

function downloadCookies() {
    listTable.innerHTML = '';
    for (let cookie in cookies) {
        if(isMatching(cookie,filterNameInput.value)){
            createCookieNode(cookie, cookies[cookie]);
        }
    }
}

downloadCookies();

function createCookieNode(name, value) {
    let tr = document.createElement('tr');
    let thName = document.createElement('th');
    let thValue = document.createElement('th');
    let button = document.createElement('button');

    thName.textContent = name;
    thValue.textContent = value;
    button.textContent = 'Удалить';
    button.style.cssText = 'display : block; width: 100%; height: 100%;}';
    tr.appendChild(thName);
    tr.appendChild(thValue);
    tr.appendChild(button)
    button.addEventListener('click', (e)=>{
        if (e.target.tagName !== 'TR' && e.target.tagName !== 'TBODY') {
            deleteCookie(e);
        }
    })
    listTable.appendChild(tr)
    
    return tr
}

function deleteCookie(e) {
    let targetCookieName = e.target.parentNode.firstElementChild.textContent;

    document.cookie = `${targetCookieName}=''; max-age=0`;
    e.target.parentNode.remove();
}

function isMatching(full, chunk) {
    chunk = chunk.toLowerCase();
    full = full.toLowerCase();
    if (full.indexOf(chunk) !== -1) {
        return true;
    }
    
    return false;
}
