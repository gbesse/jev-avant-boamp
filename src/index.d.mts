import type { JevProvider } from "./jev.mjs";
export type Deliberation={authority:string;siret:string;id:string;date:string;matterCode:string;matter:string;object:string;budgetYear:string|null;sourceUrl:string};
export type TenderNotice={id:string;object:string;buyerSiret:string|null;publishedAt:string;sourceUrl:string};
export function deliberation(input:any):Deliberation; export function tenderNotice(input:any):TenderNotice;
export function detectSignal(input:any,provider:JevProvider):Promise<any>;
export function linkNotice(signal:any,notice:any,provider:JevProvider):Promise<any>;
