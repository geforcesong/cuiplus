var version = '4.0';

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(version));
});

self.addEventListener('activate', function (event) {
    event.waitUntil(new Promise(function (resolve, reject) {
        console.log('activated!!!');
        caches.keys().then(function (keys) {
            keys.forEach(function (key) {
                if (version !== key) {
                    return caches.delete(key);
                }
            });
            resolve();
        });
    }));
});

self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request.url).then(function (cached) {
        if (cached) {
            return cached;
        }
        return fetch(event.request).then(function (response) {
            var cacheCopy = response.clone();
            caches.open(version).then(function add(cache) {
                cache.put(event.request.url, cacheCopy);
            });
            return response;
        });
    }));
});
