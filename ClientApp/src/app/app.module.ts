import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { ClassificationComponent } from './components/classification/classification.component'
import { IntelligenceComponent } from './components/intelligence/intelligence.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    ClassificationComponent,
    IntelligenceComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'classification', component: ClassificationComponent },
      { path: 'classification/:projectId', component: ClassificationComponent },
      { path: 'classification/:projectId/:objectId', component: ClassificationComponent },
      { path: 'classification/:projectId/:objectId/:pageId', component: ClassificationComponent },
      { path: 'classification/:projectId/:objectId/:pageId/:imageId', component: ClassificationComponent },
      { path: 'intelligence', component: IntelligenceComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
