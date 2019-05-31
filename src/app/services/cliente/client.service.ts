import { Injectable } from "@angular/core";
import { DataconectionService } from "../conection/dataconection.service";

@Injectable({
  providedIn: "root"
})
export class ClientService {
  constructor(private data: DataconectionService) {}

  login(data) {
    return this.data.post("api/cliente/login", data);
  }
}
