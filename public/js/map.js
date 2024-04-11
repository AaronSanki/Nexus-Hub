mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // style: "mapbox://styles/mapbox/dark-v11",
    center: nexus.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});
console.log(nexus.geometry.coordinates);
const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(nexus.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
    `<h5 style="color: #202020">${nexus.title}</h5>
    <p style="color: #202020">${nexus.location}</p>`
    )
)
.addTo(map);