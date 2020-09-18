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
import {MAP_ACCESS_TOKEN} from '../../config.js'

export default {
  components: {
    MglMap,
    MglMarker
  },
  data() {
    return {
      mapboxAccessToken: MAP_ACCESS_TOKEN,
      mapStyle: "mapbox://styles/galgordon/ckf15jvyz2or61at0ww55hapq",
      coordinates: [-111.549668, 39.014]
    };
  },
  methods:{
    async onMapLoad(event) {
      // Here we cathing 'load' map event
    const asyncActions = event.component.actions
    navigator.geolocation.getCurrentPosition(
    position => {
    let lon = position.coords.longitude
    let lat = position.coords.latitude
    this.coordinates[0] = lon
    this.coordinates[1] = lat
    console.log(this.coordinates)
  },
     error => {
       alert(error.message);
     })
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