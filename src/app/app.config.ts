import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { CurrencyPipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    CurrencyPipe,
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'gebra-products-managemen-668af',
          appId: '1:474432050535:web:11f214e082e6e2f5ab4bc2',
          storageBucket: 'gebra-products-managemen-668af.appspot.com',
          apiKey: 'AIzaSyCInQDc7b2m1qdNmAIo1Xjvfx6OuxIn5CU',
          authDomain: 'gebra-products-managemen-668af.firebaseapp.com',
          messagingSenderId: '474432050535',
          measurementId: 'G-B8P52W2H0K',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideAuth(() => getAuth())),
  ],
};
