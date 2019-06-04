import { Component, OnInit } from "@angular/core";
import { ClientService } from "../../services/cliente/client.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { Button } from "protractor";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.page.html",
  styleUrls: ["./sign-in.page.scss"]
})
export class SignInPage implements OnInit {
  _correo: string;
  _clave: string;
  cliente: any;
  loading = false;
  constructor(
    private client: ClientService,
    private router: Router,
    private alertController: AlertController
  ) {}
  login() {
    this.loading = true;
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
        this.loading = false;
      } else {
        this.loading = false;
        this.mensaje(
          "Error de Autenticacion",
          "usuario y/o contraseña invalidos"
        );
        console.log("usuario no encontrado | no registrado | mal ingresado");
      }
    });
  }
  goCliente() {
    this.router.navigate(["/inicio"], { queryParams: this.cliente });
  }
  ngOnInit() {}

  async mensaje(h: string, t: string) {
    const alert = await this.alertController.create({
      header: h,
      message: t,
      buttons: ["OK"]
    });
    await alert.present();
  }
}
