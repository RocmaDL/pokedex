# Pokédex

Application React (Vite) qui affiche les pokémons de [PokéAPI](https://pokeapi.co/docs/v2) :
liste paginée, fiche détail et formulaire de création.
TP du module Développement frontend avancé.

- Site en ligne : <https://pokedex-three-gules-51.vercel.app>
- Dépôt GitHub : <https://github.com/RocmaDL/pokedex> (privé)

## Lancer le projet

```bash
npm install
npm run dev          # serveur de développement
npm test             # tests unitaires et fonctionnels (Vitest)
npm run lint         # ESLint
npm run format:check # Prettier
npm run build        # build de production dans dist/
```

Node.js 22 est utilisé en local et dans la CI.

## Où trouver chaque critère de la grille

### Projet initial

| Critère                                  | Où                                                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page qui affiche une liste de pokémons   | `src/pages/home/HomePage.jsx`, `src/widgets/pokemon-list/PokemonList.jsx`                                                                            |
| Navigation liste → fiche détail          | `PokemonCard` (lien vers `/pokemon/:id`), `src/pages/pokemon-details/PokemonDetailsPage.jsx` (`useParams`)                                           |
| Formulaire d'ajout                       | `src/features/create-pokemon/ui/CreatePokemonForm.jsx`, route `/creer`                                                                               |
| Menu de navigation global                | `src/widgets/header/Header.jsx` (`NavLink`)                                                                                                          |
| React Router                             | `BrowserRouter` dans `src/main.jsx`, `Routes` dans `src/app/App.jsx`, `useParams`, `useSearchParams`, `useLocation`                                  |
| API REST consommée                       | PokéAPI : `GET /pokemon`, `GET /pokemon/:id`, `GET /pokemon-species/:id`                                                                             |
| Axios en GET et POST                     | Instances dans `src/shared/api/client.js`. GET : `src/entities/pokemon/api/pokemonApi.js`. POST : `src/features/create-pokemon/api/createPokemon.js` |
| Pagination client (précédente, suivante) | `src/shared/ui/Pagination.jsx` ; boutons désactivés en page 1 et quand l'API ne renvoie pas de page suivante                                         |
| Hooks `useState` et `useEffect`          | `HomePage`, `PokemonDetailsPage`, `CreatePokemonForm`                                                                                                |
| Code organisé en composants séparés      | Voir [Organisation du code](#organisation-du-code)                                                                                                   |

Les états de chargement, d'erreur (avec un bouton « Réessayer ») et de liste vide (« Aucun
pokémon disponible. ») sont gérés sur la liste et sur la fiche.

#### Pourquoi le POST ne part pas vers PokéAPI

PokéAPI est en lecture seule : elle refuse les `POST`. Le formulaire envoie donc ses données à
[JSONPlaceholder](https://jsonplaceholder.typicode.com/) (`POST /posts`), une API REST de
démonstration qui répond `201 Created` comme un vrai backend mais n'enregistre rien. Pour que la
création reste visible, le pokémon renvoyé est gardé côté client dans un store Zustand persisté
dans le `localStorage`. Avec un backend à soi (l'API Symfony prévue dans l'énoncé, par exemple),
il suffirait de changer `baseURL` dans `src/shared/api/client.js`.

### Partie « Extended »

| Critère                               | Où                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| Mise en ligne                         | Vercel, avec `vercel.json` (réécriture vers `index.html` pour les routes de la SPA) |
| Pipeline CI/CD                        | `.github/workflows/ci-cd.yml`                                                       |
| 2 tests unitaires + 2 fonctionnels    | Voir [Tests](#tests)                                                                |
| Optimisation des performances         | Voir [Performances](#performances)                                                  |
| KISS et qualité du code               | Voir [KISS et qualité du code](#kiss-et-qualité-du-code)                            |
| Gestion d'état moderne                | Voir [Gestion d'état](#gestion-détat)                                               |
| Stratégie de rendu                    | Voir [Stratégie de rendu](#stratégie-de-rendu)                                      |
| Atomic Design / Feature-Sliced Design | Voir [Organisation du code](#organisation-du-code)                                  |

## Tests

Vitest et Testing Library. Vitest reprend l'API de Jest vue en cours (`describe`, `it`,
`expect`, `toBe`, `toEqual`…) et s'intègre directement à Vite, sans configuration Babel.
L'API est simulée avec `vi.mock` : les tests ne dépendent pas du réseau.

**Tests unitaires** (fonctions isolées, sans rendu) :

- `src/entities/pokemon/lib/pokemon.test.js` : extraction de l'id depuis une URL, numéro sur
  4 chiffres, traduction des types, conversion des unités, transformation de la réponse API.
- `src/features/create-pokemon/model/validatePokemon.test.js` : règles de validation du
  formulaire.
- `src/entities/pokemon/model/createdPokemonStore.test.js` : ajout et suppression dans le store.

**Tests fonctionnels** (l'interface est rendue et manipulée comme par un utilisateur) :

- `src/app/App.test.jsx` : affichage de la première page, clic sur « Page suivante »,
  clic sur un pokémon puis retour à la liste, message de liste vide, message d'erreur.
- `src/features/create-pokemon/ui/CreatePokemonForm.test.jsx` : saisie et envoi du formulaire,
  refus d'un nom trop court, erreur réseau.

## CI/CD

Le workflow GitHub Actions `.github/workflows/ci-cd.yml` reprend le principe du cours :
le déploiement attend que les tests passent (`needs: test`).

1. **CI** (job `test`, sur chaque push et pull request vers `main`) : `npm ci`, ESLint,
   vérification Prettier, tests, build. Si une étape échoue, le job s'arrête.
2. **CD** (job `deploy`, seulement après un push sur `main` et si la CI est verte) :
   build et déploiement en production avec la CLI Vercel.

Configuration à faire une fois :

1. Créer le projet sur Vercel et le lier en local avec `npx vercel link`. Le fichier
   `.vercel/project.json` contient alors `orgId` et `projectId`.
2. Créer un token sur <https://vercel.com/account/tokens>.
3. Dans GitHub > Settings > Secrets and variables > Actions, ajouter `VERCEL_TOKEN`,
   `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID`.
4. Dans Vercel, désactiver le déploiement automatique lié à Git, pour que seul le workflow
   déploie (sinon chaque push est déployé deux fois, dont une fois sans passer par les tests).

## Performances

J'ai découpé le code par route, dans `src/app/App.jsx`. La page d'accueil est importée
normalement, puisque c'est elle que voit presque tout visiteur. La fiche détail, le formulaire et la page 404 sont chargés avec `React.lazy` et `Suspense` :
leur code n'est téléchargé qu'au moment où l'on visite la route. Le build produit bien des
fichiers séparés (`PokemonDetailsPage-*.js`, `CreatePokemonPage-*.js`, `NotFoundPage-*.js`).

Choix liés aux images, appliqués en complément :

- Dans la liste, chaque carte utilise le petit sprite de PokéAPI (96 × 96 px) plutôt que
  l'illustration officielle. Pour Dracaufeu, le sprite pèse 1 330 octets contre 144 568 pour
  l'illustration (mesuré avec `curl`). L'illustration n'est chargée que sur la fiche.
- Toutes les images ont `width` et `height` : le navigateur réserve leur place avant le
  chargement, la page ne saute pas (CLS).
- Les 8 premières cartes sont chargées tout de suite, les suivantes avec `loading="lazy"`.
- Sur la fiche, l'illustration est l'élément principal de la page (LCP) : elle a
  `fetchPriority="high"` et n'est pas différée.
- Pendant un changement de page, l'ancienne liste reste affichée (atténuée) au lieu d'être
  remplacée par un message, ce qui évite un saut de mise en page.

## KISS et qualité du code

J'ai essayé de garder le code simple plutôt que générique, et de laisser ESLint et Prettier
vérifier le reste.

- Pas d'abstraction sans besoin. L'appel API de chaque page est écrit directement dans son
  `useEffect` plutôt que dans un hook générique `useFetch` : il n'y a que deux pages qui
  chargent des données et leurs besoins diffèrent (pagination d'un côté, 404 de l'autre).
- Les règles métier sont dans des fonctions pures au nom explicite (`formatPokemonNumber`,
  `formatWeight`, `validatePokemon`…), testables sans React.
- Les composants ont une seule responsabilité : `PokemonList` affiche, `HomePage` charge les
  données, `Pagination` ne connaît ni l'API ni le routeur.
- ESLint (`eslint.config.js`) avec les règles des hooks React, qui signalent par exemple une
  dépendance manquante dans un `useEffect`. Prettier (`.prettierrc`) pour le formatage.
  La CI bloque si l'un des deux échoue.
- Conventions : composants en PascalCase, fonctions en camelCase, gestionnaires d'événements
  préfixés `handle`, un composant par fichier.

## Gestion d'état

L'état partagé passe par Zustand (`src/entities/pokemon/model/createdPokemonStore.js`). Le
reste n'en a pas besoin : les champs du formulaire, le chargement et les erreurs sont de l'état
local (`useState`), et la page courante de la liste est dans l'URL (`useSearchParams`).

Les pokémons créés sont écrits par le formulaire et lus par l'en-tête, deux composants
éloignés dans l'arbre. Sans store, il faudrait remonter l'état jusqu'à `App` et le passer en
props à travers plusieurs niveaux. Le middleware `persist` les garde dans le `localStorage`.
L'en-tête lit l'état avec un sélecteur (`state => state.pokemons.length`) : il ne se re-rend
que si le nombre de créations change.

Les données de PokéAPI (état serveur) ne sont pas copiées dans le store, comme le recommande
le cours. Elles restent dans l'état local de la page qui les affiche.

## Stratégie de rendu

L'application utilise le **rendu côté client (CSR)**. Vite produit un `index.html` presque
vide (`<div id="root">`) et des fichiers JavaScript. Le navigateur télécharge ce JavaScript,
React construit l'interface, puis les données sont demandées à PokéAPI depuis le navigateur.
Vercel sert ces fichiers statiques, et `vercel.json` renvoie `index.html` pour toute URL afin
que React Router prenne le relais (sans cela, recharger `/pokemon/25` donnerait une 404).

Pourquoi ce choix : l'application est très interactive (pagination, formulaire, état
partagé), n'a pas de données privées à protéger côté serveur et n'a pas besoin d'un serveur
Node. Le CSR est le plus simple à développer et à héberger.

Ce que ça coûte : rien ne s'affiche avant le chargement du JavaScript, et le HTML reçu par un
robot ne contient pas la liste. Le code splitting par route limite le premier point. Pour un
Pokédex public où le référencement compterait, le **SSG** serait le choix suivant : les
pokémons changent très rarement, on pourrait générer une page HTML par pokémon au build
(avec Next.js, par exemple) et la servir depuis un CDN.

## Organisation du code

Le projet suit **Feature-Sliced Design** pour les dossiers, avec **Atomic Design** pour
classer les composants visuels. Une couche ne peut importer que les couches situées en dessous
d'elle : `app` → `pages` → `widgets` → `features` → `entities` → `shared`.

```
src/
├── main.jsx                      point d'entrée, BrowserRouter
├── app/                          configuration globale
│   ├── App.jsx                   routes, layout, code splitting
│   └── styles/global.css         tokens (couleurs, polices) et styles
├── pages/                        une page par route
│   ├── home/HomePage.jsx                       /
│   ├── pokemon-details/PokemonDetailsPage.jsx  /pokemon/:id
│   ├── create-pokemon/CreatePokemonPage.jsx    /creer
│   └── not-found/NotFoundPage.jsx              *
├── widgets/                      blocs d'interface composés
│   ├── header/Header.jsx         en-tête et menu global
│   └── pokemon-list/PokemonList.jsx
├── features/                     actions de l'utilisateur
│   └── create-pokemon/
│       ├── api/createPokemon.js  POST
│       ├── model/validatePokemon.js
│       └── ui/                   formulaire, liste des créations
├── entities/                     objet métier « pokémon »
│   └── pokemon/
│       ├── api/pokemonApi.js     GET
│       ├── lib/pokemon.js        fonctions pures (formatage, traduction)
│       ├── model/createdPokemonStore.js  store Zustand
│       └── ui/                   PokemonCard, TypeBadge
├── shared/                       code générique, sans notion de pokémon
│   ├── api/client.js             instances Axios
│   └── ui/                       Button, StatusMessage, Pagination
└── test/                         configuration des tests
```

Correspondance avec les niveaux d'Atomic Design :

| Niveau     | Composants                                             |
| ---------- | ------------------------------------------------------ |
| Atomes     | `Button`, `StatusMessage`, `TypeBadge`                 |
| Molécules  | `Pagination`, `PokemonCard`                            |
| Organismes | `Header`, `PokemonList`, `CreatePokemonForm`           |
| Template   | Le layout de `App.jsx` (en-tête, `main`, pied de page) |
| Pages      | Les fichiers de `src/pages/`                           |

FSD répond à « où mettre l'appel API, la validation, le store ? », ce qu'Atomic Design ne dit
pas. Atomic Design reste utile pour nommer le niveau de chaque composant visuel.
