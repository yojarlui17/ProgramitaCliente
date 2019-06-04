import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "sign-in",
    pathMatch: "full"
  },
  {
    path: "inicio",
    loadChildren: "./pages/inicio/inicio.module#InicioPageModule"
  },
  {
    path: "list",
    loadChildren: "./list/list.module#ListPageModule"
  },
  {
    path: "configuracion",
    loadChildren:
      "./pages/configuracion/configuracion.module#ConfiguracionPageModule"
  },
  { path: "logeo", loadChildren: "./pages/logeo/logeo.module#LogeoPageModule" },
  {
    path: "tusviajes",
    loadChildren: "./pages/tusviajes/tusviajes.module#TusviajesPageModule"
  },
  {
    path: "sign-in",
    loadChildren: "./pages/sign-in/sign-in.module#SignInPageModule"
  },
  {
    path: "reset-password",
    loadChildren:
      "./pages/reset-password/reset-password.module#ResetPasswordPageModule"
  },
  { path: 'inicio2', loadChildren: './pages/inicio2/inicio2.module#Inicio2PageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
