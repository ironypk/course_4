import modal from "../templates/modal-content.hbs";
import render from "../templates/item-content.hbs";
import { currentDate } from "./currentDate";
import { lift } from "when";

let modalTemplate = modal();

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
    //Создаем Map с нашими данными
    dataMap  = new Map(),
    //Текущие отзывы в модальном окне.
    coordsValue = [],
    //Координаты текущего нажатия по карте или  текущей метки.
    coords;


  //Обработка ивентов по форме
  document.addEventListener("click", e => {
    if (e.target.classList.value === "close_button") {
      myMap.balloon.close();
    }
    if (e.target.classList.value === "form_button") {
      e.preventDefault();
      createNewRewiew();
    }
  });


/// Добавление нового отзыва в метку или добаление нвойо метки с отзывом.
  function createNewRewiew(){
    let modal = document.querySelector('.rewiew')
    let form = document.querySelector(".form");
    let rewiewsList = document.querySelector(".rewiews");
    let adress = document.querySelector('.adress');
    let item  = {
      date: currentDate(),
      name: form.elements.name.value,
      place: form.elements.place.value,
      rewiew: form.elements.rewiew.value
    }
    adress.textContent = getAddress(coords);
    if(dataMap.get(coords) === undefined){
      coordsValue = [];
      coordsValue.push(item);
    } else {
      coordsValue = dataMap.get(coords);
      coordsValue.push(item);
    }
    dataMap.set(coords, coordsValue);
    rewiewsList.innerHTML = render({coordsValue});
    form.elements.name.value = "";
    form.elements.place.value = "";
    form.elements.rewiew.value = "";

    myPlacemark = createPlacemark(coords, modal.outerHTML);
    myMap.geoObjects.add(myPlacemark);
    myPlacemark.events.add('click', (e)=>{
      coords = e.originalEvent.target.geometry.getCoordinates();
      getAddress(coords);
    })
  }




  myMap.events.add("click", function(e) {
    coords = e.get("coords");

    myMap.balloon.open(coords, modalTemplate, {
      closeButton: false,
      layout: "default#imageWithContent"
    });
    getAddress(coords);
  });

  // Определяем адрес по координатам
  function getAddress(coords) {
      ymaps.geocode(coords).then(function(res) {
      var firstGeoObject = res.geoObjects.get(0);
      let adress = document.querySelector('.adress')
      adress.textContent = firstGeoObject.getAddressLine();
    });
  }

  function createPlacemark(coords, template) {
    return new ymaps.Placemark(
      coords,
      { 
        balloonContent: template,
      },
      {
        balloonLayout: "default#imageWithContent",
        preset: "islands#violetDotIconWithCaption"
      }
    );
  }
}

export { mapInit };
