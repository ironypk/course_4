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
    //Создаем массив с нашими данными
    placeRewiew = [
    ],
    //Создаем координаты текущего нажатия
    coords = "";


  //Помещаем созданный шаблон балуна в хранилище шаблонов

  //Обработка ивентов по форме
  document.addEventListener("click", e => {
    if (e.target.classList.value === "close_button") {
      myMap.balloon.close();
    }
    if (e.target.classList.value === "form_button") {
      e.preventDefault();
      let modal = document.querySelector('.rewiew')
      let form = document.querySelector(".form");
      let rewiewsList = document.querySelector(".rewiews");
      let item  = {
        date: currentDate(),
        name: form.elements.name.value,
        place: form.elements.place.value,
        rewiew: form.elements.rewiew.value
      }
      placeRewiew.push(item);
      rewiewsList.innerHTML = render({placeRewiew});
      form.elements.name.value = "";
      form.elements.place.value = "";
      form.elements.rewiew.value = "";

      myPlacemark = createPlacemark(coords, modal.outerHTML);
      myMap.geoObjects.add(myPlacemark);
    }
  });

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
