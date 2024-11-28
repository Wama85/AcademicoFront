import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),provideHttpClient()
    ,
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'sistemasacademicopdfs',
        appId: '1:397192621494:web:ad71d060eb0c9d804aa517',
        storageBucket: 'sistemasacademicopdfs.appspot.com',
        apiKey: 'AIzaSyADmvaixJEtyYnHIg-k7dqsyaSSDkPnghE',
        authDomain: 'sistemasacademicopdfs.firebaseapp.com',
        messagingSenderId: '397192621494',
        measurementId: 'G-W80L0CRFZM',
      })
    ),
    provideStorage(() => getStorage()), provideAnimationsAsync(), provideAnimationsAsync(),
  ],
};



