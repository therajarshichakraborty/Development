let map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

export async function getUsersCurrentLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)
      },
      (error) => {
        console.error("Error Code: " + error.code + " - " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
    return {
      latitude,
      longitude
    }
  } else {
    alert("geolocation of the user is not found");
  }
}

export async function main() {
  const { latitude, longitude } = await getUsersCurrentLocation();
  map.setView([latitude, longitude], 13);
  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("you are here")
    .openPopup();
}

window.addEventListener("load", main);
