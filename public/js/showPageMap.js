mapboxgl.accessToken =mapToken;
          const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://sprites/mapbox/dark-v10',
          zoom:7,
          center:campground.geometry.coordinates          
          
          });
    
const marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(`<h3>${campground.title}</h3>`)
)

.addTo(map)