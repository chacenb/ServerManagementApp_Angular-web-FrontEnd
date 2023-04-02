import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "server-management" }, // Default Route
  {
    path: 'server-management', children: [
      { path: '', loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule) }
    ]
  },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, { useHash: true }),

  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
