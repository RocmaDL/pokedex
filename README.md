# Pokédex

TP du module Développement frontend avancé : un Pokédex en React (Vite) qui utilise
[PokéAPI](https://pokeapi.co/docs/v2). On peut parcourir la liste page par page, ouvrir la
fiche d'un pokémon et en créer un avec un formulaire.

- Site en ligne : <https://pokedex-three-gules-51.vercel.app>
- Dépôt : <https://github.com/RocmaDL/pokedex>

## Lancer le projet

```bash
npm install
npm run dev     # serveur de dev
npm test        # tests (Jest)
npm run lint
npm run build
```

## Fonctionnalités

- `/` : liste des pokémons, 20 par page, avec boutons « Page précédente » et « Page suivante »
  (désactivés sur la première et la dernière page). La page courante est dans l'URL (`?page=2`).
- `/pokemon/:id` : fiche détail (image, types, taille, poids, statistiques), récupérée avec
  `useParams`.
- `/creer` : formulaire d'ajout d'un pokémon.
- Un menu en haut de page permet de passer d'une page à l'autre (`NavLink`).

Les appels HTTP passent par axios (`src/shared/api/client.js`). Les messages de chargement,
d'erreur et de liste vide sont gérés sur la liste et sur la fiche.

PokéAPI ne permet pas de faire des `POST`. Le formulaire envoie donc ses données à
[JSONPlaceholder](https://jsonplaceholder.typicode.com/), qui répond comme une vraie API mais
n'enregistre rien. Les pokémons créés sont gardés dans le navigateur (voir Gestion d'état).

## Tests

Les tests sont écrits avec Jest et Testing Library. Les appels à l'API sont mockés avec
`jest.mock`, donc les tests n'ont pas besoin du réseau.

Tests unitaires :

- `src/entities/pokemon/lib/pokemon.test.js` : fonctions de formatage (numéro, taille, poids,
  types)
- `src/features/create-pokemon/model/validatePokemon.test.js` : validation du formulaire
- `src/entities/pokemon/model/createdPokemonStore.test.js` : ajout et suppression dans le store

Tests fonctionnels :

- `src/app/App.test.jsx` : affichage de la liste, page suivante, ouverture d'une fiche puis
  retour, liste vide, erreur de l'API
- `src/features/create-pokemon/ui/CreatePokemonForm.test.jsx` : envoi du formulaire, nom trop
  court, erreur réseau

## CI/CD

Le workflow `.github/workflows/ci-cd.yml` tourne à chaque push et pull request sur `main` :
installation, ESLint, Prettier, tests puis build. Si tout passe et qu'il s'agit d'un push sur
`main`, un second job déploie sur Vercel avec la CLI Vercel.

Il faut ajouter les secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID` dans les
réglages du dépôt GitHub. Le fichier `vercel.json` renvoie toutes les URL vers `index.html`,
sinon recharger `/pokemon/25` donne une 404.

## Optimisation des performances

J'ai fait du code splitting par route avec `React.lazy` et `Suspense` (dans `App.jsx`). La
page d'accueil est chargée directement, les autres pages (fiche, formulaire, 404) ne sont
téléchargées que quand on y va. On le voit dans `dist/` après le build : chaque page a son
propre fichier JS.

J'ai aussi fait attention aux images : petit sprite dans la liste au lieu de la grande
illustration, `width` et `height` renseignés, et `loading="lazy"` pour les cartes plus bas
dans la page.

## KISS et qualité du code

- Chaque composant fait une seule chose : `PokemonList` affiche, `HomePage` charge les
  données, `Pagination` ne connaît ni l'API ni le routeur.
- Pas de hook générique `useFetch` : seules deux pages chargent des données, donc l'appel est
  écrit directement dans leur `useEffect`.
- Les calculs (formatage, validation) sont dans des fonctions pures, faciles à tester.
- ESLint et Prettier sont vérifiés dans la CI.

## Gestion d'état

J'utilise Zustand pour les pokémons créés (`src/entities/pokemon/model/createdPokemonStore.js`).
Ils sont ajoutés par le formulaire et leur nombre est affiché dans le menu, deux composants
éloignés dans l'arbre : avec un store, pas besoin de faire passer les props par `App`. Le
middleware `persist` les sauvegarde dans le `localStorage`.

Le reste est en état local (`useState`) : champs du formulaire, chargement, erreurs, données
de PokéAPI.

## Stratégie de rendu

L'application fait du rendu côté client (CSR). Le serveur renvoie un `index.html` presque vide
et le JavaScript ; c'est React qui construit la page dans le navigateur, puis les données sont
récupérées sur PokéAPI.

C'est le plus simple pour ce projet : pas besoin de serveur Node, et Vercel sert juste des
fichiers statiques. L'inconvénient, c'est que rien ne s'affiche avant le chargement du JS et
que le référencement est moins bon. Si c'était important, on pourrait passer au SSG (une page
générée par pokémon au build, avec Next.js par exemple), vu que les données changent très peu.

## Organisation du code

Le projet suit Feature-Sliced Design. Une couche n'importe que les couches en dessous :
`app` → `pages` → `widgets` → `features` → `entities` → `shared`.

```
src/
├── app/        App.jsx (routes), styles globaux
├── pages/      une page par route (home, pokemon-details, create-pokemon, not-found)
├── widgets/    Header, PokemonList
├── features/   create-pokemon : formulaire, validation, appel POST
├── entities/   pokemon : appels GET, fonctions de formatage, store, PokemonCard, TypeBadge
└── shared/     instances axios, Button, Pagination, StatusMessage
```

Pour les composants visuels, on retrouve aussi les niveaux d'Atomic Design :

- atomes : `Button`, `StatusMessage`, `TypeBadge`
- molécules : `Pagination`, `PokemonCard`
- organismes : `Header`, `PokemonList`, `CreatePokemonForm`
- pages : les fichiers de `src/pages/`
