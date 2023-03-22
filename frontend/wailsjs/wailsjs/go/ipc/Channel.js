// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT

export function CreateNewProject(arg1) {
  return window['go']['ipc']['Channel']['CreateNewProject'](arg1);
}

export function GetAreaById(arg1) {
  return window['go']['ipc']['Channel']['GetAreaById'](arg1);
}

export function GetCurrentSession() {
  return window['go']['ipc']['Channel']['GetCurrentSession']();
}

export function GetCurrentUser() {
  return window['go']['ipc']['Channel']['GetCurrentUser']();
}

export function GetDocumentById(arg1) {
  return window['go']['ipc']['Channel']['GetDocumentById'](arg1);
}

export function GetDocuments() {
  return window['go']['ipc']['Channel']['GetDocuments']();
}

export function GetProcessedAreasByDocumentId(arg1) {
  return window['go']['ipc']['Channel']['GetProcessedAreasByDocumentId'](arg1);
}

export function GetSuppportedLanguages() {
  return window['go']['ipc']['Channel']['GetSuppportedLanguages']();
}

export function GetUserMarkdownByDocumentId(arg1) {
  return window['go']['ipc']['Channel']['GetUserMarkdownByDocumentId'](arg1);
}

export function RequestAddArea(arg1, arg2) {
  return window['go']['ipc']['Channel']['RequestAddArea'](arg1, arg2);
}

export function RequestAddDocument(arg1, arg2) {
  return window['go']['ipc']['Channel']['RequestAddDocument'](arg1, arg2);
}

export function RequestAddDocumentGroup(arg1) {
  return window['go']['ipc']['Channel']['RequestAddDocumentGroup'](arg1);
}

export function RequestAddProcessedArea(arg1) {
  return window['go']['ipc']['Channel']['RequestAddProcessedArea'](arg1);
}

export function RequestChangeAreaOrder(arg1, arg2) {
  return window['go']['ipc']['Channel']['RequestChangeAreaOrder'](arg1, arg2);
}

export function RequestChooseUserAvatar() {
  return window['go']['ipc']['Channel']['RequestChooseUserAvatar']();
}

export function RequestDeleteAreaById(arg1) {
  return window['go']['ipc']['Channel']['RequestDeleteAreaById'](arg1);
}

export function RequestUpdateArea(arg1) {
  return window['go']['ipc']['Channel']['RequestUpdateArea'](arg1);
}

export function RequestUpdateCurrentUser(arg1) {
  return window['go']['ipc']['Channel']['RequestUpdateCurrentUser'](arg1);
}

export function RequestUpdateDocument(arg1) {
  return window['go']['ipc']['Channel']['RequestUpdateDocument'](arg1);
}

export function RequestUpdateDocumentUserMarkdown(arg1, arg2) {
  return window['go']['ipc']['Channel']['RequestUpdateDocumentUserMarkdown'](arg1, arg2);
}
