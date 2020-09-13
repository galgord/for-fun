<template>
<div id="map" style="width:100vw; height:85vh">

  <MglMap
    :accessToken="mapboxAccessToken"
    :mapStyle.sync="mapStyle"
    :center="coordinates"
  >
    <MglMarker :coordinates="coordinates" color="blue" />
  </MglMap>
</div>
</template>

<script>
import { MglMap, MglMarker } from "vue-mapbox";

export default {
  components: {
    MglMap,
    MglMarker
  },
  data() {
    return {
      mapboxAccessToken:"pk.eyJ1IjoiZ2FsZ29yZG9uIiwiYSI6ImNrZjE2b280MzB2azIyeG8wbTdxazBvaXUifQ.UrMcasMni4SJeCf7KGYQrA",
      mapStyle: "mapbox://styles/galgordon/ckf15jvyz2or61at0ww55hapq",
      coordinates: [-111.549668, 39.014]
    };
  }
};
</script>

<style scoped>
#map {
  position: fixed;
  bottom: 0;
}
</style>