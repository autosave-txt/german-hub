const CACHE_NAME = 'german-hub-v2';

const PRECACHE_URLS = [
  "./",
  "manifest.json",
  "alice.html",
  "books.html",
  "haben.html",
  "index.html",
  "listening.html",
  "menschen-a1.html",
  "phrasebook.html",
  "practice-ch1.html",
  "practice-ch2.html",
  "practice-ch3.html",
  "practice-ch4.html",
  "practice-ch5.html",
  "scenarios.html",
  "translate.html",
  "verb-duerfen.html",
  "verb-koennen.html",
  "verb-muessen.html",
  "verb-sein.html",
  "verb-sollen.html",
  "verb-werden.html",
  "verb-wollen.html",
  "verbs.html",
  "vocabulary.html",
  "watch.html",
  "writing-practice.html",
  "audio/A1_01_Greetings_and_Introductions.mp3",
  "audio/A1_02_Numbers.mp3",
  "audio/A1_03_Days_of_the_Week_and_Parts_of_the_Day.mp3",
  "audio/A1_04_Months_Seasons_and_Dates.mp3",
  "audio/A1_05_Telling_the_Time.mp3",
  "audio/A1_06_Family_and_People.mp3",
  "audio/A1_07_Colors_and_Appearances.mp3",
  "audio/A1_08_Food_and_Drink.mp3",
  "audio/A1_09_Shopping_and_Money.mp3",
  "audio/A1_10_Home_and_Living.mp3",
  "audio/A1_11_Body_and_Health.mp3",
  "audio/A1_12_Getting_Around_Directions_and_Transport.mp3",
  "audio/A1_13_Travel_and_Accommodation.mp3",
  "audio/A1_14_Work_and_Daily_Routine.mp3",
  "audio/A1_15_School_and_Learning.mp3",
  "audio/A1_16_Hobbies_and_Free_Time.mp3",
  "audio/A1_17_Weather_and_Nature.mp3",
  "audio/A1_18_Post_Office_Bank_and_Official_Matters.mp3",
  "audio/A1_19_Measures_Weights_and_Units.mp3",
  "audio/A1_20_Essential_Verbs.mp3",
  "audio/A1_21_Describing_Things_Adjectives_and_Adverbs.mp3",
  "audio/A1_22_Question_Words.mp3",
  "audio/A1_23_Pronouns_Articles_and_Small_Words.mp3",
  "audio/A1_24_Prepositions_and_Linking_Words.mp3",
  "audio/A1_25_Common_Everyday_Expressions.mp3"
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        return Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch(() => console.warn('Could not cache:', url))
          )
        );
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
        });
    })
  );
});
