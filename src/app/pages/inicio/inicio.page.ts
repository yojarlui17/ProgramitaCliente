import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit
} from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ActivatedRoute } from "@angular/router";
import { ClienteServiceService } from "../../services/clienteService/cliente-service.service";
import { AlertController, LoadingController } from "@ionic/angular";
import { HttpHeaders } from "@angular/common/http";

declare var google;
@Component({
  selector: "app-inicio",
  templateUrl: "inicio.page.html",
  styleUrls: ["inicio.page.scss"]
})
export class InicioPage implements OnInit {
  conductorG: any;
  tarifaG: any;
  distanciaG: any;
  eG: number;
  respuestaG: any;
  id_servicioG: any;
  confirmado: boolean;
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
  destination: any; //
  puntoB: string; //
  distancia: any; //
  id_direccion: any; //
  respuesta: any; //
  rpta: any; //
  e: any; //
  cliente: any;
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
  b1: any;
  b2: any;
  a1: any;
  a2: any;
  precio: any;
  lat: number = -12.04318;
  lng: number = -77.02824;
  @ViewChild("map") mapElement: ElementRef;
  map: google.maps.Map;
  image: any;
  marker: google.maps.Marker;
  @ViewChild("search")
  public searchElementRef;
  constructor(
    private geolocation: Geolocation,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute,
    public clienteServiceService: ClienteServiceService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    /* this.lugares = navParams.get("lugar");
    this.puntoGPS = navParams.get("puntoGPS");
    this.focus = navParams.get("focus"); */
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.lugares = params[this.lugar];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.cliente = params["params"];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.puntoGPS = params[this.puntoGPS];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.focus = params[this.focus];
    });
    this.confirmado = false;
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.conductorG = params[this.conductorG];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.tarifaG = params[this.tarifaG];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.distanciaG = params[this.distanciaG];
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.id_servicioG = params[this.id_servicioG];
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

    console.log();
  }
  ngOnInit() {
    /* this.terminadoServicio(22); */
    /* console.log("ID DEL CLIENTE", this.cliente.id_cliente);
    console.log("Tipo de PAgo Cliente", this.cliente.tipo_pago); */
  }
  //METODOS PARA LA UBICACION Y SELECCION DEL ORIGEN{
  selectSearchResultOrigin(itemO) {
    this.autocompleteItemsOrigin = [];
    this.geocoder.geocode({ placeId: itemO.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        console.log("Punto A?1: ", results[0]);
        console.log("Punto A?2: ", results[0].geometry.viewport.na.j);
        /*this.calcularRuta(results[0].geometry.location);*/
        //completar el input según tu búsqueda
        this.autocompleteOrigin.input = itemO.description;
      } else {
        console.log("Error al ubicar el destino.");
      }
    });
  }
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
  //FIN DE METODOS ORIGEN}
  /*  /////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////// */
  //METODOS PARA LA UBICACION Y SELECCION DEL DESTINO{
  selectSearchResultsDestination(itemD) {
    this.autocompleteItemsDestination = [];
    this.geocoder.geocode({ placeId: itemD.place_id }, (results, status) => {
      console.log("resultado punto", results);
      if (status === "OK" && results[0]) {
        console.log("location", results[0].formatted_address);
        this.puntoB = results[0].formatted_address;
        console.log("PuntoB_lat", results[0].geometry.viewport.na.j);
        console.log("PuntoB_lng", results[0].geometry.viewport.ga.l);
        this.b1 = results[0].geometry.viewport.na.j;
        this.b2 = results[0].geometry.viewport.ga.l;
        console.log(this.b1 + "," + this.b2);
        console.log(this.a1 + "," + this.a2);
        this.puntoLlegada =
          "POINT(" +
          results[0].geometry.viewport.ga.l +
          " " +
          results[0].geometry.viewport.na.j +
          ")";
        console.log(this.puntoLlegada);
        this.ionViewDidEnter();
        this.calcularRuta(results[0].formatted_address);
        /* this.id_direccion = 0; */
        this.calculateRate();
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
  o1: any;
  //FIN DE METODOS DESTINO}
  /*  /////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////// */
  //METODOS PARA CALCULAR LA RUTA Y LA TARIFA{
  calcularRuta(destino: any) {
    this.puntoA = this.puntoGPS;
    let request = {
      origin: this.map.getCenter(),
      /* origin: this.puntoA, */
      destination: destino,
      travelMode: "DRIVING"
    }; //AQUI VA EL ORIGEN -> PUNTO ACTUAL
    this.directionsService.route(request, (result, status) => {
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.nombredepunto();
      if (status == "OK") {
        this.directionsDisplay.setDirections(result);
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setOptions({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#13937b"
          }
        });
      } else {
        console.log("error");
      }
    });
  }
  calculateRate() {
    var destination = this.b1 + "," + this.b2;
    var origin1 = this.a1 + "," + this.a2;
    this.o1 = "POINT(" + this.a2 + " " + this.a1 + ")";
    console.log(origin1);
    console.log(destination);
    /* var origin2 = this.puntoB;
    var destinationA = this.destination;
    var destinationB = this.distancia; */
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        unitSystem: google.maps.UnitSystem.METRIC
      },
      (response, status) => {
        var origins = [origin1];
        var destinations = [destination];
        console.log("KM: ", response.rows[0].elements[0].distance);
        console.log("KM: ", response.rows[0].elements[0].distance.text);
        this.distancia = response.rows[0].elements[0].distance.text;
        console.log(this.distancia);
        let data = {
          id_cliente: 2,
          origen: this.o1,
          destino: this.puntoLlegada,
          distancia: this.distancia
        };
        console.log(data);
        this.clienteServiceService.getRate(data).subscribe(respuesta => {
          // La variable precio toma el resultado del API.
          // Será un número.
          this.tarifa = respuesta;
          this.mensaje(
            "TARIFA",
            "El costo aproximado del servicio es: S/." + this.tarifa
          );
          console.log("PRECIO", this.tarifa);
          if (this.tarifa != null) {
            this.trf = true;
          }
        });
      }
    );
  }
  //FIN DE METODOS}
  /*  /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////// */
  //METODOS DE FLUJO DEL PEDIDO DE CARRERA{

  callService() {
    let pago: number;
    if (
      this.cliente.cliente.tipo_pago === 1 ||
      this.cliente.cliente.tipo_pago === undefined
    ) {
      console.log("tipo pago es: " + 1);
      pago = 1;
    } else {
      console.log("tipo de paso es: " + 2);
      pago = 2;
    }
    let info = {
      id_usuario: this.cliente.id_cliente,
      origen: this.puntoA,
      punto_origen: this.o1,
      destino: this.puntoB,
      punto_destino: this.puntoLlegada,
      tipo_pago: pago,
      precio: this.tarifa
    };
    console.log("datos", info);
    this.clienteServiceService.newService(info).subscribe(r => {
      this.cliente = r;
      console.log("Nuevo Pedido", this.cliente);
      this.c1();
    });
  }
  //FIN DE METODOS}
  /*  /////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////// */
  //METODOS REUTILIZABLES{
  async mensaje(t: string, m: string) {
    const alert = await this.alertController.create({
      header: t,
      message: m,
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log("EL USUARIO ACEPTO");
          }
        }
      ]
    });
    await alert.present();
  }
  async cargaDeBusqueda() {
    //LOADIN!!!!
    const loading = await this.loadingController.create({
      message: "Ya te estamos buscando un Bigway cerca!...",
      translucent: true,
      spinner: "lines",
      duration: 3000
    });
    await loading.present();
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
  async mensajeSimple(t: string, m: string) {
    const alert = await this.alertController.create({
      header: t,
      message: m,
      buttons: ["OK"]
    });
    await alert.present();
  }
  pA: any;
  nombredepunto() {
    this.pA = this.a1 + "," + this.a2;
    var latlng = { lat: parseFloat(this.a1), lng: parseFloat(this.a2) };
    console.log("el punto A es: " + latlng);
    this.geocoder.geocode({ location: latlng }, results => {
      console.log("resultado punto", results);
      if (results[0]) {
        console.log("location", results[0].formatted_address);
        this.puntoA = results[1].formatted_address;
      }
    });
  }
  c1() {
    this.e = setInterval(() => {
      this.consultarServicio();
    }, 5000);
  }
  servRecu: any;
  consultarServicio() {
    let data = {
      id_usuario: this.cliente.id_usuario
    };
    console.log("ATENCION CONSUL SER", data);
    this.clienteServiceService.recoverService(data).subscribe(res => {
      this.servRecu = res;
      console.log(this.servRecu);
      if (this.servRecu.id_conductor !== 0) {
        this.confirmarConductor(this.servRecu.id);
        console.log("SE ENCONTRO CONDUCTOR PARA EL SERVICIO", this.servRecu.id);
      }
    });
  }
  confirmarConductor(idservicio) {
    clearInterval(this.e);
    this.mensajeconfirmacion(idservicio);
    /* this.e = setInterval(() => {
      this.terminadoServicio(idservicio);
    }, 5000); */
  }
  async mensajeconfirmacion(idservicio) {
    const alert = await this.alertController.create({
      header: "BigWay Informa!",
      message:
        "El conductor " +
        this.servRecu.conductor.nombre +
        " ya se encuentra en camino...",
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log("SE CONFIRMA LO SGT: ", idservicio);
            this.clienteServiceService
              .confirmOrder({ id: idservicio })
              .subscribe(res => {
                console.log(res);
              });
            console.log("INICIA EL BUCLE DE TERMINAR SERVICIO");
          }
        },
        {
          text: "CANCEL",
          handler: () => {
            console.log("SE CANCELO");
          }
        }
      ]
    });
    await alert.present();
  }

  terminadoServicio(idservicio) {
    this.clienteServiceService
      .recoverService(idservicio)
      .subscribe(resultado => {
        console.log("terminadoServicio", resultado);
        console.log(resultado["estado"]);
        if (resultado["estado"] == 4) {
          clearInterval(this.e);
          this.mensajeSimple("BigWay!", "Gracias por tu preferencia");
        }
      });
  }

  async m() {
    const alert = await this.alertController.create({
      header: "BigWay!",
      message:
        "El Conductor: " + this.respuesta.conductor.nombre + " está en camino",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            this.confirmarConductor(this.respuesta.id_servicio);
          }
        }
      ]
    });
    await alert.present();
  }
  //}FIN DE METODOS REUTILIZABLES
  /* /////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////// */
  enfoque() {
    this.map.setCenter(this.marker.getPosition());
  }
  getLocation() {
    /* console.log("hola :3"); */
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
          this.a1 = this.lat;
          this.a2 = this.lng;
          /* console.log(this.lat, this.lng); */
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
