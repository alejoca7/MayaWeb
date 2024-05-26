'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "ce55a2f13b3b9a3fb1211d8083082120",
"assets/AssetManifest.bin.json": "cd450260dabff920056b0466de814a31",
"assets/AssetManifest.json": "bf8d2b05de7d1b5203b9cfb970353ba0",
"assets/assets/fonts/HindSiliguriBold.ttf": "09e7451bd892e6af09275b701369b454",
"assets/assets/fonts/HindSiliguriRegular.ttf": "5858488e9870f755271e8a71754eda49",
"assets/assets/fonts/HindSiliguriSemiBold.ttf": "c75e4224905a200c868801e66480b7d3",
"assets/assets/fonts/InterBold.ttf": "ba74cc325d5f67d0efbeda51616352db",
"assets/assets/fonts/InterRegular.ttf": "ea5879884a95551632e9eb1bba5b2128",
"assets/assets/fonts/RobotoRomanMedium.ttf": "68ea4734cf86bd544650aee05137d7bb",
"assets/assets/fonts/RobotoRomanRegular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"assets/assets/images/image_not_found.png": "a88029aaad6e6ea7596096c7c451840b",
"assets/assets/images/img_arrow_left_2.svg": "d5174326bf67907e72cb4f268a44bd82",
"assets/assets/images/img_checkmark.svg": "8e80b02d5b8d2d1c016ba40c6506df10",
"assets/assets/images/img_close.svg": "a2a5f25ca8ab98b9968d6927c89eb71d",
"assets/assets/images/img_close_gray_900.svg": "5a5fe865ab1e3958c5fca45e8ba7b68c",
"assets/assets/images/img_eye.svg": "dc34e693a212eaa798aa0a975ebeb9fb",
"assets/assets/images/img_fluent_speaker_1_24_regular.svg": "cdac5eb8b7e5eaec26738201a8f8621c",
"assets/assets/images/img_google.svg": "0241918e4afdffbfc060fb4411afa47b",
"assets/assets/images/img_group_730.png": "2a48cffc7c5afc9f6e27c5f73883069d",
"assets/assets/images/img_ic_round_swap_horiz.svg": "8e488a56d3e5f7b4be793558cc605721",
"assets/assets/images/img_location.svg": "64aa160ecada570bc8324fa49791d2b2",
"assets/assets/images/img_logo_3.png": "559aea78f094910e431cfd8d43acacb8",
"assets/assets/images/img_megaphone.svg": "7cb0a4531fbf5486dfd1621298e847b0",
"assets/assets/images/img_user.svg": "4bd661f2f0e4a832b2d357fccbffd6ed",
"assets/assets/images/img_wappgptlogo.svg": "253b9b56bbd01fad813a40e9232e7d71",
"assets/FontManifest.json": "bbcbdc660b9243d6a35aca631a17a1bf",
"assets/fonts/MaterialIcons-Regular.otf": "f520ea85ef7a2f19179852b6eed17206",
"assets/NOTICES": "ce522ac22cf01c28ae3145a4c70b2d7e",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"index.html": "299628a5cdbff8a6ebcaf22d584e1bf7",
"/": "299628a5cdbff8a6ebcaf22d584e1bf7",
"main.dart.js": "3fa118fbe9defed8c101a1f07d2a681c",
"version.json": "d3a6aa91c7a66dbe880057d8fd136e83"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
