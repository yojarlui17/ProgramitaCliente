import {
  Component,
  ViewChild,
  ElementRef,
  NgZone
  /* ResolvedReflectiveProvider, */
} from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ActivatedRoute } from "@angular/router";

declare var google;
@Component({
  selector: "app-inicio",
  templateUrl: "inicio.page.html",
  styleUrls: ["inicio.page.scss"]
})
export class InicioPage {
  GoogleAutocomplete: any; //
  autocompleteOrigin: any; //
  autocompleteDestination: any; //
  autocompleteItemsOrigin: any; //
  autocompleteItemsDestination: any; //
  directionsService: any; //
  directionsDisplay: any; //
  geocoder: any; //
  markers: any; //
  public puntoLlegada: any; //
  tarifa: any; //
  trf: boolean; //
  myMarker: any; /**/
  puntoA: string; //
  destinationA: any; //
  puntoB: string; //
  destinationB: any; //
  id_direccion: any; //
  respuesta: any; //
  rpta: any; //
  e: any; //
  arreglo: any; //
  rptaPedido: Response; //
  public estado: any = 1; //
  lugar: any; //
  lugares: any; //
  puntoGPS: any; //
  focus: any; //
  loading: any;
  coordsA: any;
  coordsB: string;
  precio: any;
  lat: number = 0;
  lng: number = 0;
  @ViewChild("map") mapElement: ElementRef;
  map: google.maps.Map;
  image: any;
  marker: google.maps.Marker;
  @ViewChild("search")
  public searchElementRef;
  constructor(
    private geolocation: Geolocation,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute
  ) /* public restProvider: ResolvedReflectiveProvider */
  {
    /* this.lugares = navParams.get("lugar");
    this.puntoGPS = navParams.get("puntoGPS");
    this.focus = navParams.get("focus"); */
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.lugares = params[this.lugar];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.puntoGPS = params[this.puntoGPS];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.focus = params[this.focus];
    });

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocompleteOrigin = { input: "" };
    this.autocompleteItemsOrigin = [];
    this.autocompleteDestination = { input: "" };
    this.autocompleteItemsDestination = [];
    this.geocoder = new google.maps.Geocoder();
    this.markers = [];
    this.directionsService = new google.maps.DirectionsService();
    /* this.marker = true; */
    this.trf = false;
    /* this.navParams.get("puntoA"); */
    /* this.puntoA = this.navParams.get("data");
    this.lugar = this.navParams.get("lugar"); */
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.puntoA = params["data"];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.lugar = params[this.lugar];
    });
    this.getLocation();
    /* this.image = {
      url: "../../../assets/google-maps/start.png"
    }; */

    setInterval(() => {
      this.marker.setMap(null);
      this.getLocation();
    }, 50);
  }
  //METODOS PARA LA UBICACION Y SELECCION DEL ORIGEN{
  updateSearchResultsOrigin() {
    if (this.autocompleteOrigin.input == "") {
      this.autocompleteItemsOrigin = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      {
        input: this.autocompleteOrigin.input,
        componentRestrictions: { country: "pe" }
      },
      (predictions, status) => {
        this.autocompleteItemsOrigin = [];
        this.zone.run(() => {
          predictions.forEach(prediction => {
            this.autocompleteItemsOrigin.push(prediction);
          });
        });
      }
    );
  }
  selectSearchResultOrigin(itemO) {
    this.autocompleteItemsOrigin = [];
    this.geocoder.geocode({ placeId: itemO.place_id }, (results, status) => {
      console.log("Punto B:", itemO.description);
      if (status === "OK" && results[0]) {
        console.log("Punto A?1: ", results[0]);
        /* console.log("Punto A?2: ", results[0].geometry.viewport.ma.lat); */
        /* this.trf = true;
        this.coordsB = results[0].geometry.location;
        this.calcularRuta(results[0].geometry.location); */
        //completar el input según tu búsqueda
        this.autocompleteOrigin.input = itemO.description;
      } else {
        console.log("Error al ubicar el destino.");
      }
    });
  }
  //FIN DE METODOS ORIGEN}
  /*  /////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////// */
  //METODOS PARA LA UBICACION Y SELECCION DEL DESTINO{
  selectSearchResultsDestination(itemD) {
    this.autocompleteItemsDestination = [];
    this.geocoder.geocode({ placeId: itemD.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        console.log("location", results[0].formatted_address);
        this.puntoB = results[0].formatted_address;
        console.log("PuntoB_lat", results[0].geometry.viewport.ma.j);
        console.log("PuntoB_lng", results[0].geometry.viewport.ga.l);
        this.puntoLlegada =
          "POINT(" +
          results[0].geometry.viewport.ga.l +
          " " +
          results[0].geometry.viewport.ma.j +
          ")";
        console.log(this.puntoLlegada);
        this.ionViewDidEnter();
        this.calcularRuta(results[0].formatted_address);
        /*           this.id_direccion = 0; */
        this.calcularTarifa();
        //completar el input según tu búsqueda
        this.autocompleteDestination.input = itemD.description;

        // LLAMAR AL METODO QUE CALCULE LA TARIFA
      } else {
        console.log("Error al ubicar el destino.");
      }
    });
  }
  updateSearchResultsDestination() {
    if (this.autocompleteDestination.input == "") {
      this.autocompleteItemsDestination = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      {
        input: this.autocompleteDestination.input,
        componentRestrictions: { country: "pe" }
      },
      (predictions, status) => {
        this.autocompleteItemsDestination = [];
        this.zone.run(() => {
          predictions.forEach(prediction => {
            this.autocompleteItemsDestination.push(prediction);
          });
        });
      }
    );
  }
  //FIN DE METODOS DESTINO}
  calcularTarifa() {
    this.destinationA = this.puntoB;
    var origin = this.puntoA;
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [this.destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        unitSystem: google.maps.UnitSystem.METRIC
      },
      (response, status) => {
        var origin = this.puntoA;
        var destinations = this.puntoB;
        console.log("KM: ", response.rows[0].elements[0].distance);
        console.log("KM: ", response.rows[0].elements[0].distance.text);
        this.destinationB = response.rows[0].elements[0].distance.text;
        /* this.restProvider
          .getTarifa(this.id_direccion, this.puntoLlegada, this.destinationB)
          .then(respuesta => {
            // La variable precio toma el resultado del API.
            // Será un número.
            this.tarifa = respuesta;
            console.log("PRECIO", this.tarifa);
            if (this.tarifa != null) {
              this.trf = true;
            }
          }); */
      }
    );
  }

  calcularRuta(destino: any) {
    let request = {
      origin: this.map.getCenter(),
      destination: destino,
      travelMode: "DRIVING"
    }; //AQUI VA EL ORIGEN -> PUNTO ACTUAL
    this.directionsService.route(request, (result, status) => {
      this.directionsDisplay = new google.maps.DirectionsRenderer();

      if (status == "OK") {
        this.directionsDisplay.setDirections(result);
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setOptions({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#13937b"
          }
        });
      }
    });
  }
  selectStart() {
    this.geocoder.geocode(
      { location: this.map.getCenter() },
      (result, status) => {
        if (status == "OK" && result[0]) {
          console.log("Direccion de tu marcador:", result[0].formatted_address);
          this.coordsA = this.map.getCenter();
          this.puntoA = result[0].formatted_address;
        }
      }
    );
  }
  /* selectSearchResult(item) {
    --this.deleteMarker();
    this.autocompleteItems = [];

    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      console.log("Punto B:", item.description);

      if (status === "OK" && results[0]) {
        --this.marker = false;
        this.trf = true;
        this.coordsB = results[0].geometry.location;
        this.calcularRuta(results[0].geometry.location);
        completar el input según tu búsqueda
        this.autocomplete.input = item.description;
      } else {
        console.log("Error al ubicar el destino.");
      }
    });
  } */

  getLocation() {
    console.log("hola :3");
    this.geolocation
      .getCurrentPosition({
        maximumAge: 1000,
        timeout: 5000,
        enableHighAccuracy: true
      })
      .then(
        resp => {
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
          console.log(this.lat, this.lng);
        },
        er => {
          console.log("ERROR", er);
        }
      )
      .catch(error => {
        console.log("ERROR", error);
      });
    this.marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map
      /* icon: this.image */
    });
  }

  ionViewDidEnter() {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: this.lat, lng: this.lng },
      zoom: 15,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP /* INICIO DEL STYLE */
      /* styles:
       [
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#bdbdbd" }]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }]
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#dadada" }]
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }]
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }]
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#c9c9c9" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        }
      ]
      */
    });
  }
}
