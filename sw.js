/* Garde les outils en mémoire sur l'appareil pour qu'ils marchent sans internet.
   Les pages sont servies depuis la copie de l'appareil, sans retéléchargement à chaque ouverture.
   Une nouvelle version n'arrive que lorsque ce fichier change : pour publier une mise à jour,
   remplacer les fichiers ET changer la valeur de VERSION ci-dessous. */
const VERSION = "carnets-2026-11-15";
const FILES = [
  "./", "index.html", "archipel.html", "remarque.html", "peruvienne.html",
  "manifest.json", "manifest-archipel.json", "manifest-remarque.json", "manifest-peruvienne.json",
  "site-180.png", "site-192.png", "site-512.png",
  "archipel-180.png", "archipel-192.png", "archipel-512.png",
  "remarque-180.png", "remarque-192.png", "remarque-512.png",
  "peruvienne-180.png", "peruvienne-192.png", "peruvienne-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(cache => cache.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req))));
});
