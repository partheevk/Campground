mapboxgl.accessToken = 'pk.eyJ1IjoicGFydGhlZXYxMiIsImEiOiJjbDhtcjhtYjEwaXN1M3lvYXlubTlyZ2tlIn0.MxVHQY7JnTdUJsjupcDCTQ';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
projection: 'globe' // display the map as a 3D globe
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${campground.title} </h3><p>${campground.location}</p>`
        )
)
.addTo(map);