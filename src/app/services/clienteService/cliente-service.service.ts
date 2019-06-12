import { Injectable } from "@angular/core";
import { DataconectionService } from "../conection/dataconection.service";

@Injectable({
  providedIn: "root"
})
export class ClienteServiceService {
  constructor(private data: DataconectionService) {}
  getRate(data) {
    return this.data.post("api/tarifa/zona", data);
  }
  newService(data) {
    return this.data.post("api/servicio/registrar", data);
  }
  confirmOrder(data) {
    return this.data.post("api/servicio/procesar", data);
  }
  recoverService(data) {
    return this.data.post("api/servicio/recuperar_servicio", data);
  }
}
/* ,
"id_conductor": 44,
  "id_auto": 35,
    "tipo_auto": 2,
      "fecha_servicio": "2019-06-07 05:23:34" */
