// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {ipc} from '../models';

export function GetDocumentById(arg1:string):Promise<ipc.Document>;

export function GetDocuments():Promise<ipc.GetDocumentsResponse>;

export function GetProcessedAreasByDocumentId(arg1:string):Promise<Array<ipc.ProcessedArea>>;

export function GetUserMarkdownByDocumentId(arg1:string):Promise<ipc.UserMarkdown>;

export function RequestAddArea(arg1:string,arg2:ipc.Area):Promise<ipc.Area>;

export function RequestAddDocument(arg1:string,arg2:string):Promise<ipc.Document>;

export function RequestAddDocumentGroup(arg1:string):Promise<ipc.Group>;

export function RequestAddProcessedArea(arg1:ipc.ProcessedArea):Promise<ipc.ProcessedArea>;

export function RequestUpdateArea(arg1:ipc.Area):Promise<ipc.Area>;

export function RequestUpdateDocumentUserMarkdown(arg1:string,arg2:string):Promise<ipc.UserMarkdown>;
