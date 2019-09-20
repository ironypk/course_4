import render from '../templates/rewiews-content.hbs';
import {currentDate} from './currentDate';

function mapInit() {
  //Создаем карту
  let myMap = new ymaps.Map(
    "my_map",
    {
      center: [53.07286123980068, 158.64619359448886],
      zoom: 16
    },
    {
      searchControlProvider: "yandex#search"
    }
  ),
  //Создаем метку
  myPlacemark,
  //Создаем шаблон балуна
  myBalloonLayout = ymaps.templateLayoutFactory.createClass(
    `<div class="rewiew">
    <div class="rewiew_container">
        <div class="rewiew_head">
            <p class='adress'></p>
            <div class="close_button">
            </div>
        </div>
        <div class="rewiew_main">
            <ul class="rewiews">
                 отзывов пока нет
            </ul>
            <form class='form'>
                <div class="form_text">ВАШ ОТЗЫВ</div>
                <input class='form_row' type="text" name="name" placeholder="Ваше имя">
                <input class='form_row' type="text" name="place" placeholder="Укажите место">
                <textarea class='form_row form_textarea' name="rewiew"
                    placeholder="Поделитесь впечатлениями"></textarea>
                <button class="form_button">Добавить</button>
            </form>
        </div>
    </div>
</div>`
  ),
  //Создаем массив с нашими данными
  placeRewiew = [],
  //Создаем координаты текущего нажатия
  coords = "";

  //Помещаем созданный шаблон балуна в хранилище шаблонов
  ymaps.layout.storage.add("my#balloonlayout", myBalloonLayout);



  //Обработка ивентов по форме
  document.addEventListener("click", e => {
    if (e.target.classList.value === "close_button") {
      myMap.balloon.close();
    }
    if (e.target.classList.value === "form_button") {
      e.preventDefault();
      let form = document.querySelector('.form');
      let rewiewsList = document.querySelector('.rewiews');
      placeRewiew.push({
                date : currentDate(),
                name : form.elements.name.value,
                place : form.elements.place.value,
                rewiew : form.elements.rewiew.value
            })
            rewiewsList.innerHTML = render({placeRewiew});
            form.elements.name.value = '';
            form.elements.place.value = '';
            form.elements.rewiew.value = '';
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            console.log(myBalloonLayout)
            // myMap.balloon.close();
  }
  });


  myMap.events.add("click", function(e) {
    coords = e.get("coords");
    myMap.balloon.open(coords, "", {
      closeButton: false,
      contentLayout: "my#balloonlayout",
      minHeight: 530,
      minWidth: 380
    });
    getAddress(coords)
  });

  // Определяем адрес по координатам
  function getAddress(coords) {
    ymaps.geocode(coords).then(function(res) {
      var firstGeoObject = res.geoObjects.get(0);
      adress.textContent = firstGeoObject.getAddressLine();
    });
  }

  function createPlacemark(coords) {
    return new ymaps.Placemark(
      coords,
      {
        iconCaption: ""
      },
      {
        preset: "islands#violetDotIconWithCaption"
      }
    );
  }
}

export { mapInit };
