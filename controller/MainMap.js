/**
 * 
 * sisUberMapWeb
 * 
 * Made by OrLando GarCia
 * 
 * 
 */
let mapDom = document.getElementById('map')


let map, marker

async function initMapJs() {

  map = new MainMap('map');
  let mapLocation = await map.getMapLocation() 
  console.log(mapLocation)
  let mapObj = map.initMapClass(mapLocation) 

    //Url del Servio a consumir
    let urlx = 'API/api.php';
    //Service Id
    let serviceId = 51618
    let hebCar = await map.setHebMarker(urlx, serviceId)
    await map.getRealTimeDataLocation(urlx, serviceId)
  return mapObj
}

let mapStarts
window.addEventListener('DOMContentLoaded', async ()=>{
  mapStarts = await initMapJs()
    
  console.log(mapStarts)

})


class MainMap{

  constructor(id){
    this.id = id
    this.map = null
    this.anotationLoc = null
    this.anotationLocHeb = null
    this.userMarker = null
    this.hebCarMarker = null
    this.userIcon = null
    this.hebCarIcon = null
  }

  async setHebMarker(url, serviceId){
    console.log('inits:')
    //getting the hebCarLocation
    this.anotationLocHeb = await this.getCurentHebCarLocation(url, serviceId);
    console.log(this.anotationLocHeb)
    //Making the hebCarMarker

    //Set Icons properties
    this.hebCarIcon = {
      url: 'assets/img/sisUberCarBeta4.png',
      scaledSize: new google.maps.Size(30, 30)
    }

    this.hebCarMarker = new SlidingMarker({
      position: this.anotationLocHeb,
      map: this.map,
      title: "HEB Car Location",
      duration: 2000,
      easing: "easeOutExpo",
      icon: this.hebCarIcon
    });
    //Setting the duration of the animation & the easing animation
    this.hebCarMarker.setDuration(1000);
    this.hebCarMarker.setEasing('linear')
  }

  initMapClass(location){
     //Startin the Map
    this.map = new google.maps.Map(document.getElementById(this.id), {
      center: location,
      zoom: 15,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    //Setting the minZoom and maxZoom
    let opt = { minZoom: 13, maxZoom: 17 };
    this.map.setOptions(opt);

    //Set Icons properties
    this.userIcon = {
      url: 'assets/img/userIcon.png',
      origin: new google.maps.Point(0, 0)
    }
    
    //Setting the location
    this.anotationLoc = location;
    //Making the Marker
    this.userMarker = new google.maps.Marker({
      position: this.anotationLoc,
      map: this.map,
      title: "User Location",
      icon: this.userIcon
    });

    //Returning the map
    return this.map
  }


  getMapLocation(){
    return new Promise((resolve, reject) =>{
      if( navigator.geolocation ){
        navigator.geolocation.getCurrentPosition((position)=>{ 
          //Exito case
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          resolve(pos)
        })
      }
    })
  }

  addNewMarkerandSetCenter(location){
    this.userMarker.setPosition(location)
    this.map.setCenter(location)
  }

  async getRealTimeDataLocation(url, serviceId){
     setInterval(async ()=>{
      let realTimeLoc =  await this.getCurentHebCarLocation(url, serviceId)
      this.hebCarMarker.setPosition(realTimeLoc)
    }, 2000)
  }

  async getCurentHebCarLocation(url, serviceId){
    //serviceId data
    const data = new FormData();
    data.append('serviceId', serviceId)
    //custmo header for the fecth request
      const customHeader = new Headers();
      customHeader.append('Content-Type', 'application/json')
    //custom objetc for the fecth request
      const configAPIConsult = {
        method: 'POST',
        // headers: customHeader,
        body: data
      }

      //with async await
      const response = await fetch(url, configAPIConsult)

      switch ( response.status ) {
        case  200:
        let rowCoord = await response.json()
          let coords = {
            lat: parseFloat(rowCoord.data[0].latitude),
            lng: parseFloat(rowCoord.data[0].longitude)
          }
          return coords
          break;

        case 400:
          console.log('El servidor no pudo interpretar la solicitud')
          break;
        case 401:
          console.log('El servidor no autorizo la solicitud')
          break;
        case 403:
          console.log('El servidor no autorizo la solicitud')
          break;
        default:
          console.log('Error: ' + response.status)
          console.log('Error: ' + response.statusText)
          break;
      }
  } 
}