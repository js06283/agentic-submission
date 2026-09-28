export type Design={tool:string;steps:string;sources:string;decisions:string;human:string;instructions:string;link:string;improvement:string;baselinePrompt:string};
export type Run={group_id:string;case_id:string;action:string;output:string;change_note:string;score:null|string;created:string};
export type Group={id:string;name:string;design:Design;reflection:string;updated:string;screenshots:string[];runs:Run[]};
export type CustomerCase={id:string;title:string;text:string;kind:'practice'|'challenge';bulletin?:string};
export type LabState={signedIn:boolean;instructor:boolean;phase:number;mine:Group|null;groups:Group[];cases:CustomerCase[];groupCount:number};
export const phaseNames=['Practice','Customer challenge','Policy twist','Class reveal'];
export const blankDesign:Design={tool:'Google Opal',steps:'',sources:'',decisions:'',human:'',instructions:'',link:'',improvement:'',baselinePrompt:''};
