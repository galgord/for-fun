<template>
<div>
<button @click="test(this)">Test Me</button>
<div id="map" style="width:100vw; height:85vh">
  <MglMap
    :accessToken="mapboxAccessToken"
    :mapStyle.sync="mapStyle"
    :center="coordinates"
    @load="onMapLoad" 
    :attributionControl="false"
  >
    <MglMarker :coordinates="coordinates" color="blue" />
    <AttributionControl />
    <NavigationControl position="top-right" />
    <GeolocateControl position="top-right" />
    <ScaleControl />

  </MglMap>
</div>
</div>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap,
         MglMarker, 
         MglAttributionControl,
         MglNavigationControl,
         MglGeolocateControl,
         MglScaleControl 
         } from "vue-mapbox";
import {MAP_ACCESS_TOKEN,MAP_STYLE} from '../../config.js'

export default {
  components: {
    MglMap,
    MglMarker,
    AttributionControl: MglAttributionControl,
    NavigationControl: MglNavigationControl,
    GeolocateControl: MglGeolocateControl,
    ScaleControl: MglScaleControl
  },
  data() {
    return {
      mapboxAccessToken: MAP_ACCESS_TOKEN,
      mapStyle: MAP_STYLE,
      coordinates: [0,0]
    };
  },
  methods:{
    async onMapLoad(event) {
      // Here we cathing 'load' map event
//       this.MglMap.addControl(new Mapbox.GeolocateControl({
// positionOptions: {
// enableHighAccuracy: true
// },
// trackUserLocation: true
// }));
    const asyncActions = event.component.actions
    const newParams = await asyncActions.flyTo({
        center: this.coordinates,
        zoom: 15,
        speed: 1
      })
      /* => {
              center: [30, 30],
              zoom: 9,
              bearing: 9,
              pitch: 7
            }
      */
    }
},
computed:{
    getCoordinates: function(){
    let lon;
    let lat;
    var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
    navigator.geolocation.getCurrentPosition(
    position => {
     lon = position.coords.longitude
     lat = position.coords.latitude   
     console.log(lon,lat) 
      return this.coordinates = [lon,lat]
  },
     error => {
       error = error.message;
     },options
    )
    //  var ll = new Mapbox.LngLat(lon,lat)
    //  console.log(ll) 
 return []
}
},
watch: {
  getCoordinates: {
    handler: function (newVal) {
      this.coordinates =newVal
      }
  }
},
    // beforeMount(){
    // this.getLocation()
    // },
      created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  }
  };
</script>

<style scoped>
#map {
  position: fixed;
  bottom: 0;
}
</style>