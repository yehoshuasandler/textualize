// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {ipc} from '../models';

export function CreateNewProject(arg1:string):Promise<ipc.Session>;

export function GetAllLocalProjects():Promise<Array<ipc.Project>>;

export function GetAreaById(arg1:string):Promise<ipc.Area>;

export function GetCurrentSession():Promise<ipc.Session>;

export function GetCurrentUser():Promise<ipc.User>;

export function GetDocumentById(arg1:string):Promise<ipc.Document>;

export function GetDocuments():Promise<ipc.GetDocumentsResponse>;

export function GetProcessedAreasByDocumentId(arg1:string):Promise<Array<ipc.ProcessedArea>>;

export function GetProjectByName(arg1:string):Promise<ipc.Project>;

export function GetSuppportedLanguages():Promise<Array<ipc.Language>>;

export function GetUserMarkdownByDocumentId(arg1:string):Promise<ipc.UserMarkdown>;

export function RequestAddArea(arg1:string,arg2:ipc.Area):Promise<ipc.Area>;

export function RequestAddDocument(arg1:string,arg2:string):Promise<ipc.Document>;

export function RequestAddDocumentGroup(arg1:string):Promise<ipc.Group>;

export function RequestAddProcessedArea(arg1:ipc.ProcessedArea):Promise<ipc.ProcessedArea>;

export function RequestChangeAreaOrder(arg1:string,arg2:number):Promise<ipc.Document>;

export function RequestChangeGroupOrder(arg1:string,arg2:number):Promise<ipc.Group>;

export function RequestChangeSessionProjectByName(arg1:string):Promise<boolean>;

export function RequestChooseUserAvatar():Promise<string>;

export function RequestDeleteAreaById(arg1:string):Promise<boolean>;

export function RequestSaveDocumentCollection():Promise<boolean>;

export function RequestSaveGroupCollection():Promise<boolean>;

export function RequestUpdateArea(arg1:ipc.Area):Promise<ipc.Area>;

export function RequestUpdateCurrentUser(arg1:ipc.User):Promise<ipc.User>;

export function RequestUpdateDocument(arg1:ipc.Document):Promise<ipc.Document>;

export function RequestUpdateDocumentUserMarkdown(arg1:string,arg2:string):Promise<ipc.UserMarkdown>;
