# Jev Avant BOAMP

**Détecte dans les délibérations locales des signaux d’achat public avant la publication d’un avis BOAMP.**

[![Tests](https://github.com/gbesse/jev-avant-boamp/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-avant-boamp/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.2 · Documentation française

Le dépôt normalise les délibérations au format SCDL, repère les intentions d’achat à examiner et peut relier ultérieurement un signal à un avis BOAMP publié.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-avant-boamp.git
cd jev-avant-boamp
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple repère un signal d’achat dans une délibération locale. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { detectSignal } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const act = {
  COLL_NOM: "Ville Exemple",
  COLL_SIRET: "12345678901234",
  DELIB_ID: "D-2026-42",
  DELIB_DATE: "2026-09-01",
  DELIB_MATIERE_CODE: "1.1",
  DELIB_MATIERE_NOM: "Marchés publics",
  DELIB_OBJET: "Lancement de la rénovation énergétique de deux écoles",
};
const provider = createFakeProvider(({ questions }) => ({
  model: "jev-1.13.0",
  answers: {
    signal: {
      type: "choice",
      choice: "procurement_signal",
      probabilities: {
        procurement_signal: 0.91,
        budget_signal: 0.05,
        routine_admin: 0.02,
        unrelated: 0.02,
      },
      confidence: 0.91,
    },
  },
  usage: { input_tokens: 40, output_tokens: 0 },
}));
const resultat = await detectSignal(act, provider);
assert.equal(resultat.signal, "procurement_signal");
console.log(JSON.stringify(resultat, null, 2));
```

Lancez-le avec :

```sh
npm run demo
```

Résultat à repérer : `signal: procurement_signal`.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-avant-boamp`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

La validation SCDL, l’identité de l’acheteur et la chronologie restent dans le code. Jev qualifie l’intention d’achat et la relation entre projets. Les résultats sont des pistes de veille.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://schema.data.gouv.fr/scdl/deliberations/2.0.0/documentation.html](https://schema.data.gouv.fr/scdl/deliberations/2.0.0/documentation.html)
- [https://www.boamp.fr/pages/api-boamp/](https://www.boamp.fr/pages/api-boamp/)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
