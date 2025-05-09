import { Controller } from "@hotwired/stimulus"
import mapboxgl from 'mapbox-gl'

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
    isPlannerMap: Boolean
  };

  connect() {
    this.element.addEventListener('cities:orderUpdated', (event) => {
      this.#updateRoute(event.detail.ids);
    });

    this.element.innerHTML = "";

    if (!mapboxgl.supported()) {
      alert('Your browser does not support Mapbox GL');
    } else {
      mapboxgl.accessToken = this.apiKeyValue;
      this.map = new mapboxgl.Map({
        container: this.element,
        style: "mapbox://styles/mapbox/streets-v12"
      });

      console.log("MAP GENERATION PROCEEDING");

      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.doubleClickZoom.disable();

      this.map.on('load', () => {
        this.#addMarkersToMap();
        this.#fitMapToMarkers();
        console.log("MAP LOADED");
        console.log("is planner map? ", this.isPlannerMapValue);
        if (this.isPlannerMapValue) {
          this.#addRouteToMap()
        };
      });

      this.map.on('dblclick', (e) => {
        const { lng, lat } = e.lngLat;
        this.#reverseGeocodeAndAddCity(lat, lng);
      });

      const parentElement = this.element.closest('.parent-class'); // Use the same shared parent class
      parentElement.addEventListener('cities:orderUpdated', (event) => {
        this.#updateRoute(event.detail.ids);
      });
    }
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window_html);
      new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(this.map);
    });
  };

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]));
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  };

  #addRouteToMap() {
    if (this.markersValue.length < 2) return;

    const coords = this.markersValue.map(marker => `${marker.lng},${marker.lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&steps=true&access_token=${this.apiKeyValue}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // const steps = data.routes[0].legs[0].steps;
        // const instructions = steps.map(step => step.maneuver.instruction);
        // console.log(instructions); // Or render these in a sidebar, modal, etc.

        const route = data.routes[0].geometry;

        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route
          }
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#007aff',
            'line-width': 4
          }
        });
      });
  };

  #updateRoute(ids) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.#getCoordinatesForCities(ids)}?geometries=geojson&overview=full&steps=true&access_token=${this.apiKeyValue}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const route = data.routes[0].geometry;

        // If a route layer already exists, remove it
        if (this.map.getLayer('route')) {
          this.map.removeLayer('route');
          this.map.removeSource('route');
        }

        // Add the new route layer
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route
          }
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#007aff',
            'line-width': 4
          }
        });
      });
  }

  #getCoordinatesForCities(ids) {
    return ids.map(id => {
      const city = this.markersValue.find(city => city.id === parseInt(id));
      return `${city.lng},${city.lat}`;
    }).join(';');
  }

  #reverseGeocodeAndAddCity(lat, lng) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${this.apiKeyValue}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const place = data.features[0];
        if (!place) {
          alert("No city found nearby.");
          return;
        }

        const name = place.text;
        const country = place.context.find(c => c.id.startsWith("country"))?.text;

        if (confirm(`Add ${name}, ${country} as a new city?`)) {
          this.#createCityOnServer(name, country, lat, lng);
        }
      });
  };

  #createCityOnServer(name, country, lat, lng) {
    fetch("/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content
      },
      body: JSON.stringify({
        city: {
          name,
          country,
          latitude: lat,
          longitude: lng
        }
      })
    })
    .then(res => {
      if (res.ok) {
        alert(`${name} added successfully!`);
        location.reload(); // or dynamically add the new marker to the map
      } else {
        alert("Failed to add city.");
      }
    });
  };
}
