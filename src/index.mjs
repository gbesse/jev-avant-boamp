// Objectif : implémenter la frontière de décision métier propre au dépôt.
export function deliberation(input) {
  const required=["COLL_NOM","COLL_SIRET","DELIB_ID","DELIB_DATE","DELIB_MATIERE_CODE","DELIB_MATIERE_NOM","DELIB_OBJET"];
  for (const key of required) if (!input?.[key]) throw new TypeError(`Missing SCDL field ${key}`);
  if (!/^\d{14}$/.test(String(input.COLL_SIRET))) throw new TypeError("COLL_SIRET must contain 14 digits");
  const date=new Date(input.DELIB_DATE); if(Number.isNaN(date.valueOf())) throw new TypeError("DELIB_DATE must be an ISO date");
  return { authority:String(input.COLL_NOM), siret:String(input.COLL_SIRET), id:String(input.DELIB_ID), date:date.toISOString(),
    matterCode:String(input.DELIB_MATIERE_CODE), matter:String(input.DELIB_MATIERE_NOM), object:String(input.DELIB_OBJET),
    budgetYear:input.BUDGET_ANNEE ? String(input.BUDGET_ANNEE) : null, sourceUrl:String(input.sourceUrl || "") };
}
export function tenderNotice(input) {
  if(!input?.id || !input?.object || !input?.publishedAt) throw new TypeError("A notice needs id, object and publishedAt");
  const date=new Date(input.publishedAt); if(Number.isNaN(date.valueOf())) throw new TypeError("publishedAt must be an ISO date");
  return { id:String(input.id), object:String(input.object), buyerSiret:input.buyerSiret ? String(input.buyerSiret) : null,
    publishedAt:date.toISOString(), sourceUrl:String(input.sourceUrl || "") };
}
export async function detectSignal(input, provider) {
  const act=deliberation(input); const response=await provider.decide({state:{act},questions:{signal:{type:"choice",
    instructions:"Classify whether this adopted deliberation contains a concrete future procurement signal. A budget mention alone is budget_signal; ordinary governance is routine_admin.",
    criteria:{procurement_signal:"Concrete purchase, works, concession or service project",budget_signal:"Funding or budget intent without a concrete procurement",routine_admin:"Routine administration",unrelated:"No procurement-relevant intent"}}}});
  const a=response.answers.signal; return {act,signal:a.choice,probability:a.probabilities[a.choice],confidence:a.confidence,
    review:a.choice==="procurement_signal" || a.confidence<.8,usage:response.usage};
}
export async function linkNotice(signalResult, noticeInput, provider) {
  const notice=tenderNotice(noticeInput); const act=signalResult.act;
  if (notice.buyerSiret && notice.buyerSiret !== act.siret) return {relation:"different_buyer",probability:1,review:false,deterministic:true};
  if (new Date(notice.publishedAt) < new Date(act.date)) return {relation:"notice_predates_act",probability:1,review:false,deterministic:true};
  const response=await provider.decide({state:{act,notice},questions:{relation:{type:"choice",
    instructions:"Decide whether the later BOAMP notice implements the project described by the earlier deliberation. Use related_program for a broader programme without project identity.",
    criteria:{same_project:"Same concrete project",related_program:"Related programme but project identity is uncertain",unrelated:"Different subject"}}}});
  const a=response.answers.relation; return {relation:a.choice,probability:a.probabilities[a.choice],confidence:a.confidence,
    review:a.choice!=="unrelated" || a.confidence<.85,deterministic:false,usage:response.usage};
}
