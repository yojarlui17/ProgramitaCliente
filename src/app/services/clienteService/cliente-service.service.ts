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
}
