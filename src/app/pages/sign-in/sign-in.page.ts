import { Component, OnInit } from "@angular/core";
import { ClientService } from "../../services/cliente/client.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.page.html",
  styleUrls: ["./sign-in.page.scss"]
})
export class SignInPage implements OnInit {
  _correo: string;
  _clave: string;
  cliente: any;
  constructor(private client: ClientService, private router: Router) {}
  login() {
    let cuenta = {
      correo: this._correo,
      clave: this._clave
    };
    this.client.login(cuenta).subscribe(r => {
      this.cliente = r;
      console.log(this.cliente);
      if (this.cliente["dni"] != "") {
        console.log("usuario conectado");
        this.goCliente();
      } else {
        console.log("usuario no encontrado | no registrado | mal ingresado");
      }
    });
  }
  goCliente() {
    this.router.navigate(["/inicio"], { queryParams: this.cliente });
  }
  ngOnInit() {}
}
