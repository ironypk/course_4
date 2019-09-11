/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

function loadTowns() {
    return fetch(
        'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json'
    )
        .then(response => {
            if (response.status >= 400) {
                return Promise.reject();
            }

            loadingBlock.style.display = 'none'
            filterInput.style.display = 'block'
            
            return response.json();
        })
        .then(towns => {
            return towns.sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            );
        })
        .catch(()=>{
            loadingBlock.innerHTML = 'Не удалось загрузить города';
            let button = repeatButton();

            loadingBlock.appendChild(button);
            button.addEventListener('click', ()=>{
                loadTowns()
            })
        });
    
}

// let repeatButton = document.querySelector('.repeat')
// repeatButton.addEventListener('click', loadTowns())

let towns = loadTowns();

function createTownNode(name) {
    let div = document.createElement('div');

    div.classList.add('town');
    div.textContent = name;
    
    return div;
}

let repeatButton= () => {
    let button = document.createElement('button');

    button.classList.add('repeat')
    button.textContent = 'Повторить'
    button.style.cssText = 'display : block; width: 100px; height:50px;}';
    
    return button;
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    if (chunk.length !== 0) {
        chunk = chunk.toLowerCase();
        full = full.toLowerCase();
        if (full.indexOf(chunk) !== -1) {
            return true;
        }
    }
    
    return false;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function() {
    let currentValue = filterInput.value;

    filterResult.innerHTML = '';
    towns.then(towns => {
        for (let { name } of towns) {
            if (isMatching(name, currentValue)) {
                let addTown = createTownNode(name);

                filterResult.appendChild(addTown);
            }
        }
    });
});

export { loadTowns, isMatching };
