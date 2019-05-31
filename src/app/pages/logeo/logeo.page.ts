import { Component, OnInit } from "@angular/core";
import { DriverService } from "../../services/driver/driver.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-logeo",
  templateUrl: "./logeo.page.html"
})
export class LogeoPage implements OnInit {
  id: string;
  pass: string;
  conductor: any;

  constructor(private driver: DriverService, public datepipe: DatePipe) {}

  login() {
    let cuenta = {
      correo: this.id,
      clave: this.pass
    };
    this.driver.login(cuenta).subscribe(r => {
      this.conductor = r;
      console.log(this.conductor);
      this.validarTurno();
    });
  }
  validarTurno() {
    let horario = {
      id_conductor: this.conductor.id,
      datetime: this.datepipe.transform(Date.now(), "yyyy-M-dd hh:mm:ss")
    };
    console.log(horario);
  }

  ngOnInit() {}
}
