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
