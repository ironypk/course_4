clusterer = new ymaps.Clusterer({
    preset: 'islands#invertedVioletClusterIcons',
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false
}),
geoObjects = [];



function createCluster(currentGeoObject){
if(geoObjects.length === 0){
  geoObjects.push(currentGeoObject)
} else {
  for( let geoObject of geoObjects){
    if(currentGeoObject.geometry.getCoordinates() !== geoObject.geometry.getCoordinates()){     
      geoObjects.push(currentGeoObject)
    }
  }
}
clusterer.add(geoObjects);
myMap.geoObjects.add(clusterer);
}