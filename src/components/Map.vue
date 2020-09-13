<template>
<div id='map' style='width: 100vw; height: 85vh'>
  <MglMap :accessToken="accessToken" :mapStyle="mapStyle" />
</div>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap } from "vue-mapbox";

export default {
  components: {
    MglMap
  },
  data() {
    return {
      accessToken: "pk.eyJ1IjoiZ2FsZ29yZG9uIiwiYSI6ImNrZjE1Y2JuYjEwbjQyenBobGJ2ZGg2dDgifQ.AN0iqcgNOu9E-u83IhE8nQ", // your access token. Needed if you using Mapbox maps
      mapStyle: "mapbox://styles/galgordon/ckf15jvyz2or61at0ww55hapq" // your map style
    };
  },

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