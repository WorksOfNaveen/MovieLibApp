# MoviesLibApp

A small React Native movie browser built with the RN CLI (no Expo). Browse popular films from [The Movie Database (TMDB)](https://www.themoviedb.org/), search by title, open details with cast info, and save favorites that stick around after you close the app.

Dark, Netflix-inspired UI using only core React Native components—no UI kits.

---

## What you can do

- **Movies** — Scroll a paginated list of popular movies. Pull down to refresh. Tap a card for details.
- **Search** — Find movies by name (debounced so we do not spam the API).
- **Details** — Poster, rating, overview, and a horizontal cast list.
- **Favorites** — Star a movie on the details screen; it shows up in the Favorites tab after restart.

---

## Tech stack

|            |                                                            |
| ---------- | ---------------------------------------------------------- |
| Framework  | React Native 0.85 (CLI)                                    |
| Language   | TypeScript                                                 |
| State      | Redux Toolkit + Redux Persist                              |
| Storage    | AsyncStorage (favorites only)                              |
| Navigation | React Navigation (bottom tabs + native stack)              |
| API        | TMDB REST API                                              |
| UI         | React Native core (`FlatList`, `Image`, `Pressable`, etc.) |

---

## Project layout

```
MoviesLibApp/
├── Screens/          List, Search, Details, Favorites
├── navigation/       Tabs + stack navigators
├── Store/            Redux slice + persist config
├── services/         TMDB API helpers
├── components/       MovieCard, ErrorBoundary
├── Types/            Shared TypeScript types
└── config/           Env wiring (see Setup)
```

---

## Setup

### 1. Prerequisites

- Node.js 22+ (see `package.json` engines)
- React Native environment for [Android and/or iOS](https://reactnative.dev/docs/set-up-your-environment)
- A free TMDB API key or read access token

### 2. Install dependencies

```sh
npm install
```

For iOS, install pods once:

```sh
cd ios && bundle exec pod install && cd ..
```

### 3. Environment variables

Copy the example env file and add your TMDB credential:

```sh
cp .env.example .env
```

Edit `.env`:

```env
TMDB=your_api_key_or_read_access_token_here
BaseUrl=https://api.themoviedb.org/3
ImageUrl=https://image.tmdb.org/t/p/w500
```

Metro reads `.env` on start and writes `config/env.generated.ts`. **Restart Metro** after changing `.env`.

> Do not commit `.env` — it is gitignored.

### 4. Run the app

Terminal 1 — start Metro:

```sh
npm start
```

Terminal 2 — run on a device or emulator:

```sh
# Android
npm run android

# iOS (macOS only)
npm run ios
```

---

## Deployment

| Resource | Link |
| -------- | ---- |
| Source code | https://github.com/WorksOfNaveen/MovieLibApp |
| Android APK (release) | https://github.com/WorksOfNaveen/MovieLibApp/releases/latest |

### Install APK on Android

1. Download the APK from [Releases](https://github.com/WorksOfNaveen/MovieLibApp/releases/latest) on your phone or transfer it from a PC.
2. Enable **Install unknown apps** for your browser or Files app (Android Settings).
3. Open the APK and install.
4. Open **MovieLibApp** — an internet connection is required for TMDB.

> Built with React Native CLI (not Expo). iOS distribution would require TestFlight and an Apple Developer account.

---

## How state and persistence work

**Redux** holds the popular list, search results, loading/error flags, and favorite movie IDs.

**What survives an app restart**

- Favorite movie IDs (via Redux Persist + AsyncStorage)

**What does not persist**

- The popular and search lists — they load fresh from TMDB when you open the app. That keeps data current and the stored payload small.

**App lifecycle**

- On first open, the Movies tab loads page 1 of popular movies.
- When the app returns to the foreground, the list refetches if it is empty or the last load failed.
- After a force-quit, favorites rehydrate from storage; lists fetch again on launch.

---

## Features mapped to the assignment brief

| Requirement                  | How it is handled                                           |
| ---------------------------- | ----------------------------------------------------------- |
| 2–3+ screens with navigation | Tabs (Movies, Search, Favorites) + Details stack            |
| Large list from a public API | TMDB popular movies with infinite scroll                    |
| Search                       | Debounced search screen                                     |
| Pagination                   | `onEndReached` + page state in Redux                        |
| Redux                        | `moviesSlice` with async thunks                             |
| Local storage after restart  | Favorites persisted with Redux Persist                      |
| Lifecycle                    | `AppState` refresh on Movies tab; rehydration on cold start |
| RN CLI, TypeScript, hooks    | Yes                                                         |
| No third-party UI libraries  | Core RN components only                                     |

---

## Technical choices (short)

- **Redux Toolkit** — Less boilerplate than hand-written Redux; still standard Redux patterns.
- **Details in local screen state** — Detail data is only needed on one screen, so it is fetched in `useEffect` instead of bloating the global store.
- **Deduped pagination** — Prevents duplicate `FlatList` keys when `onEndReached` fires twice.
- **Error boundary** — Catches unexpected render errors with a simple retry screen.

---

## Troubleshooting

**“Missing TMDB API key” or empty list**

- Check `.env` has `TMDB` set, then restart Metro (`npm start`).

**Android build: `Could not find org.asyncstorage.shared_storage:storage-android`**

- Async Storage 3.x needs a local Maven repo. This project already adds it in `android/build.gradle`. Run a clean build:

```sh
cd android && ./gradlew clean && cd ..
npm run android
```

**Port 8081 already in use**

- Stop the other Metro process, or start with another port and pass it to the run command per the CLI prompt.

**Duplicate key warning in the list**

- Should be handled in the Redux slice (merge by movie `id`). If it appears, pull to refresh.

---

## Scripts

| Command           | Description                 |
| ----------------- | --------------------------- |
| `npm start`       | Start Metro bundler         |
| `npm run android` | Build and run on Android    |
| `npm run ios`     | Build and run on iOS        |
| `npm run lint`    | ESLint                      |
| `npm test`        | Jest (basic app smoke test) |

---

## License

This project is for learning and interview purposes. Movie data and images are provided by TMDB.
