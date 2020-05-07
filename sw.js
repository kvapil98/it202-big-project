let CACHE_NAME = 'big-project-cache';
let urlsToCache = [
  './',
  './manifest.json',  
  './js/states.js',
  './img/shutterstock_240459751-600x400.jpg',
  './img/favicon-32x32.png',
  './img/android-chrome-192x192.png', 
  'https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css',
  'https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js',
  'https://unpkg.com/dexie@latest/dist/dexie.js'
];


self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


//fetch and cache new urls or take from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
