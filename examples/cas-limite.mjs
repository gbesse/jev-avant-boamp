// Cas limite : l’identité exacte de l’acheteur prime sur la similarité des objets.
import assert from "node:assert/strict";
import { deliberation, linkNotice } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const acte = deliberation({
  COLL_NOM: "Ville Exemple",
  COLL_SIRET: "12345678901234",
  DELIB_ID: "D-2026-43",
  DELIB_DATE: "2026-09-01",
  DELIB_MATIERE_CODE: "1.1",
  DELIB_MATIERE_NOM: "Marchés publics",
  DELIB_OBJET: "Rénovation d’une école",
});
const jev = createFakeProvider(() => {
  throw new Error("Jev ne doit pas être appelé");
});
const resultat = await linkNotice(
  { act: acte },
  {
    id: "BOAMP-2",
    object: "Rénovation d’une école",
    buyerSiret: "99999999999999",
    publishedAt: "2026-09-20",
  },
  jev,
);
assert.equal(resultat.relation, "different_buyer");
assert.equal(jev.calls, 0);
console.log(JSON.stringify(resultat, null, 2));
