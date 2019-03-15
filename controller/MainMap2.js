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


// Setting Routes on change value of the panel locations
let starLocation = document.getElementById('start').value;
let endLocation = document.getElementById('end').value;
let gooRouteBtn = document.getElementById('gooRoute')
console.log(gooRouteBtn)
gooRouteBtn.addEventListener('click', ()=>{
    console.log('Goo route')
    map.onChangeHandler(starLocation, endLocation)
});



class MainMap{

  constructor(id){
    this.id = id
    this.map = null
    this.anotationLoc = null
    this.marker = null
    this.icon = null
    this.displayDirectionServices = null
    this.displayDirectionRoute = null
    // this.displayDirectionServices = new google.maps.DirectionsService;
    // this.displayDirectionRoute = new google.maps.DirectionsRenderer
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

  onChangeHandler(startLoc, endLoc) {
    // calculateAndDisplayRoute(directionsService, directionsDisplay);
    this.setGoogleRoute(startLoc, endLoc, this.marker)
  }

  setGoogleRoute(start, end, marker){
    this.displayDirectionServices = new google.maps.DirectionsService;
    let displayDirectionDrawn = this.displayDirectionRoute = new google.maps.DirectionsRenderer;
    displayDirectionDrawn.setMap(this.map)
    // console.log(this.map)
    // this.displayDirectionRoute.setMap(this.map)
    // console.log(this.displayDirectionServices)
    console.log(displayDirectionDrawn)
    
    // function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    this.displayDirectionServices.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
            // console.log(response)
            // console.log(displayDirectionDrawn)
            displayDirectionDrawn.setDirections(response);
            let allRoute = response
            console.log(allRoute)
            let oneStep = allRoute.routes[0].overview_path;
            console.log(oneStep);
            console.log(marker)

            let i = 0
            setInterval(()=>{
                let stepLat = oneStep[i].lat()
                let stepLon = oneStep[i].lng()
                let location = {
                    lat: stepLat,
                    lng: stepLon
                }
                marker.setPosition(location)
                i++
                if( i > oneStep.length){
                    i = 0
                }
            }, 1000)
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });


  }


}
