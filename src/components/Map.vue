<template>
<div>
<button @click="test(this)">Test Me</button>
<div id="map" style="width:100vw; height:85vh">
  <MglMap
    :accessToken="mapboxAccessToken"
    :mapStyle.sync="mapStyle"
    :center="coordinates"
    @load="onMapLoad"  
  >
    <MglMarker :coordinates="coordinates" color="blue" />
  </MglMap>
</div>
</div>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker } from "vue-mapbox";
import {MAP_ACCESS_TOKEN,MAP_STYLE} from '../../config.js'

export default {
  components: {
    MglMap,
    MglMarker
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
    const asyncActions = event.component.actions
    const newParams = await asyncActions.flyTo({
        center: [this.coordinates[0],this.coordinates[1]],
        zoom: 9,
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
    let lon = 0
    let lat = 0
    let error = ""
    navigator.geolocation.getCurrentPosition(
    position => {
     lon = position.coords.longitude
     lat = position.coords.latitude    
    
  },
     error => {
       error = error.message;
     })
 var ll = new Mapbox.LngLat(lon,lat)
 return this.coordinates = ll
}
},
// watch: {
//   getCoordinates: {
//     handler: function (newVal) {
//       this.$set(this.coordinates,newVal)
//       }
//   }
// },
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