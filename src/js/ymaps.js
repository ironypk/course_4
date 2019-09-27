import modal from "../templates/modal-content.hbs";
import render from "../templates/item-content.hbs";
import { currentDate } from "./currentDate";
import { map } from "when";

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
    dataMap = new Map(),
    //Текущие отзывы в модальном окне.
    coordsValue = [],
    //Координаты текущего нажатия по карте или  текущей метки.
    coords,
    customItemContentLayout = ymaps.templateLayoutFactory.createClass(
      // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
      "<div class=ballon_header>{{ properties.balloonContentHeader|raw }}</div>" +
        "<a class=ballon_link>{{ properties.balloonContentLink|raw }}</a>" +
        "<div class=ballon_text>{{ properties.balloonContentText|raw }}</div>" +
        "<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>"
    ),
    clusterer = new ymaps.Clusterer({
      preset: "islands#invertedVioletClusterIcons",
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false,
      clusterBalloonContentLayout: "cluster#balloonCarousel",
      clusterBalloonItemContentLayout: customItemContentLayout,
      clusterBalloonContentLayoutWidth: 200,
      clusterBalloonContentLayoutHeight: 130,
      clusterBalloonPagerSize: 3
    }),
    geoObjects = [],
    modal,
    rewiewsList,
    adress;

  //Обработка ивентов по форме
  document.addEventListener("click", e => {
    if (e.target.classList.value === "close_button") {
      myMap.balloon.close();
    }
    if (e.target.classList.value === "form_button") {
      e.preventDefault();
      if (geoObjects.length) {
        deleteSameCoordsGeoobject();
      }
      createNewRewiew();
    }
    if (e.target.classList.value === "ballon_link") {
      let currentAdress = e.target.textContent;

      getCoords(currentAdress);
    }
  });

// Получаем ключ по тексту ссылки. И отрисовываем модалку.
  function getCoords(currentAdress){
    for(let [key, value] of dataMap){
      if(value[0].adress === currentAdress){
        coords = key;
        coordsValue = dataMap.get(coords);
        adress.textContent = currentAdress;
        rewiewsList.innerHTML = render({ coordsValue });
        myMap.balloon.open(coords, modal.outerHTML, {
          layout: "default#imageWithContent"
        });
      }
    }
  }

  myMap.events.add("click", function(e) {
    coords = e.get("coords");
    myMap.balloon.open(coords, modalTemplate, {
      closeButton: false,
      layout: "default#imageWithContent"
    });
    getAddress(coords);
  });

  /// Добавление нового отзыва в метку или добаление нвойо метки с отзывом.
  function createNewRewiew() {
    modal = document.querySelector(".rewiew");
    var form = document.querySelector(".form");
    rewiewsList = document.querySelector(".rewiews");
    adress = document.querySelector(".adress");
    var item = {
      date: currentDate(),
      adress: adress.textContent,
      name: form.elements.name.value,
      place: form.elements.place.value,
      rewiew: form.elements.rewiew.value
    };
    if (dataMap.get(coords) === undefined) {
      coordsValue = [];
      coordsValue.push(item);
    } else {
      coordsValue = dataMap.get(coords);
      coordsValue.push(item);
    }
    dataMap.set(coords, coordsValue);
    rewiewsList.innerHTML = render({ coordsValue });
    form.elements.name.value = "";
    form.elements.place.value = "";
    form.elements.rewiew.value = "";
    myPlacemark = createPlacemark(coords, item);
    myMap.geoObjects.add(myPlacemark);
    geoObjects.push(myPlacemark);
    clusterer.add(myPlacemark);
    myMap.geoObjects.add(clusterer);
    myPlacemark.events.add("click", e => {
      coords = e.originalEvent.target.geometry.getCoordinates();
      getAddress(coords);
      openPlacemarkModal();
    });
  }

  function openPlacemarkModal() {
    coordsValue = dataMap.get(coords);
    rewiewsList.innerHTML = render({ coordsValue });
    myMap.balloon.open(coords, modal.outerHTML, {
      layout: "default#imageWithContent"
    });
  }

  // Определяем адрес по координатам
  function getAddress(coords) {
    ymaps.geocode(coords).then(function(res) {
      var firstGeoObject = res.geoObjects.get(0);
      let adress = document.querySelector(".adress");
      adress.textContent = firstGeoObject.getAddressLine();
    });
  }

  function createPlacemark(coords, item) {
    return new ymaps.Placemark(
      coords,
      {
        balloonContentHeader: item.place,
        balloonContentLink: item.adress,
        balloonContentText: item.rewiew,
        balloonContentFooter: item.date
      },
      { hasBalloon: false, preset: "islands#violetDotIconWithCaption" }
    );
  }

  function deleteSameCoordsGeoobject() {
    geoObjects.forEach(item => {
      if (item.geometry.getCoordinates() === coords) {
        myMap.geoObjects.remove(item);
      }
    });
  }
}

export { mapInit };
