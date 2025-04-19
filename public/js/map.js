var map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.stadiamaps.com/styles/osm_bright.json', // stylesheet location
    center: [85.368752,26.121473], // starting position [lng, lat]
    zoom: 15 // starting zoom
  });
  let marker = new Marker()
  .setLngLat([85.368752,26.121473])
  .addTo(map);