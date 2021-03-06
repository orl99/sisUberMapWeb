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
  return mapObj
}

let mapStarts
window.addEventListener('DOMContentLoaded', async ()=>{
  mapStarts = await initMapJs()
  console.log(mapStarts)

  mapStarts.addListener('zoom_changed', (e)=>{
    console.log(mapStarts.zoom)
      if( mapStarts.zoom >=  17 ){
        map.changeCarZooom(48, 28)
      }
    // if( mapStarts.zoom <= 14 ){
    //   mapStarts.zoom = 15
    //   console.log(mapStarts.zoom)
    //   // console.log()
    // }

    // let location = await map.getMapLocation()
    // console.log('GET INITIAL LOCATION:')
    // console.log(location)
    // map.addNewMarkerandSetCenter(location)
  })

})




class MainMap{

  constructor(id){
    this.id = id
    this.map = null
    this.anotationLoc = null
    this.marker = null
    this.icon = null
  }

   initMapClass(location){
     //Startin the Map
    this.map = new google.maps.Map(document.getElementById(this.id), {
      center: location,
      zoom: 15
    });
    //Setting the minZoom and maxZoom
    let opt = { minZoom: 15, maxZoom: 17 };
    this.map.setOptions(opt);

    //Set Icons properties
    this.icon = {
      url: 'assets/img/sisUberCarBeta3.png',
      scaledSize: new google.maps.Size(38, 20), 
      // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    }


    //Setting the location
    this.anotationLoc = location;
    //Making the Marker
    this.marker = new SlidingMarker({
      position: this.anotationLoc,
      map: this.map,
      title: "I'm sliding marker",
      duration: 2000,
      easing: "easeOutExpo",
      // icon: 'assets/img/sisUberCarBeta2.png'
      icon: this.icon
    });
    //Setting the duration of the animation & the easing animation
    this.marker.setDuration(1000);
    this.marker.setEasing('linear')

    //Returning the map
    return this.map
  }

  changeCarZooom(width, height){
    //TODO: Mejorarla
    // //Set Icons properties
    // this.icon = {
    //   url: 'assets/img/sisUberCarBeta3.png',
    //   scaledSize: new google.maps.Size(38, 20), 
    //   // scaled size
    //   origin: new google.maps.Point(0,0), // origin
    //   anchor: new google.maps.Point(0, 0) // anchor
    // }


    // // //Setting the location
    // this.anotationLoc = location;
    // //Making the Marker
    // this.marker = new SlidingMarker({
    //   position: this.anotationLoc,
    //   map: this.map,
    //   title: "I'm sliding marker",
    //   duration: 2000,
    //   easing: "easeOutExpo",
    //   // icon: 'assets/img/sisUberCarBeta2.png'
    //   icon: this.icon
    // });

    // console.log(this.marker.icon.scaledSize = new google.maps.Size(68, 35))
    // this.marker.icon.origin = new google.maps.Point(0,0), // origin
    // this.marker.icon.anchor = new google.maps.Point(0, 0) // anchor
    // console.log(this.marker.icon.url = 'assets/img/sisUberCarBeta2.png')
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
          // console.log(pos)
          // console.log(map)
          resolve(pos)
          // this.map.setCenter(pos)
          // this.map.addNewMarker()
        })
      }
    })
  }

  addNewMarkerandSetCenter(location){
    this.marker.setPosition(location)
    this.map.setCenter(location)
  }


}