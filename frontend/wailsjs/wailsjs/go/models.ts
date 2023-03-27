export namespace ipc {
	
	export class Language {
	    displayName: string;
	    processCode: string;
	    translateCode: string;
	
	    static createFrom(source: any = {}) {
	        return new Language(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.displayName = source["displayName"];
	        this.processCode = source["processCode"];
	        this.translateCode = source["translateCode"];
	    }
	}
	export class Area {
	    id: string;
	    name: string;
	    startX: number;
	    startY: number;
	    endX: number;
	    endY: number;
	    language: Language;
	    order: number;
	
	    static createFrom(source: any = {}) {
	        return new Area(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.startX = source["startX"];
	        this.startY = source["startY"];
	        this.endX = source["endX"];
	        this.endY = source["endY"];
	        this.language = this.convertValues(source["language"], Language);
	        this.order = source["order"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Document {
	    id: string;
	    groupId: string;
	    name: string;
	    path: string;
	    projectId: string;
	    areas: Area[];
	    defaultLanguage: Language;
	
	    static createFrom(source: any = {}) {
	        return new Document(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.groupId = source["groupId"];
	        this.name = source["name"];
	        this.path = source["path"];
	        this.projectId = source["projectId"];
	        this.areas = this.convertValues(source["areas"], Area);
	        this.defaultLanguage = this.convertValues(source["defaultLanguage"], Language);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Group {
	    id: string;
	    parentId: string;
	    projectId: string;
	    name: string;
	    order: number;
	
	    static createFrom(source: any = {}) {
	        return new Group(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.parentId = source["parentId"];
	        this.projectId = source["projectId"];
	        this.name = source["name"];
	        this.order = source["order"];
	    }
	}
	export class GetDocumentsResponse {
	    documents: Document[];
	    groups: Group[];
	
	    static createFrom(source: any = {}) {
	        return new GetDocumentsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.documents = this.convertValues(source["documents"], Document);
	        this.groups = this.convertValues(source["groups"], Group);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class User {
	    id: string;
	    localId: string;
	    firstName: string;
	    lastName: string;
	    avatarPath: string;
	    authToken: string;
	    email: string;
	
	    static createFrom(source: any = {}) {
	        return new User(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.localId = source["localId"];
	        this.firstName = source["firstName"];
	        this.lastName = source["lastName"];
	        this.avatarPath = source["avatarPath"];
	        this.authToken = source["authToken"];
	        this.email = source["email"];
	    }
	}
	export class Organization {
	    id: string;
	    name: string;
	    logoPath: string;
	    users: User[];
	
	    static createFrom(source: any = {}) {
	        return new Organization(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.logoPath = source["logoPath"];
	        this.users = this.convertValues(source["users"], User);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProcessedBoundingBox {
	    x0: number;
	    y0: number;
	    x1: number;
	    y1: number;
	
	    static createFrom(source: any = {}) {
	        return new ProcessedBoundingBox(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x0 = source["x0"];
	        this.y0 = source["y0"];
	        this.x1 = source["x1"];
	        this.y1 = source["y1"];
	    }
	}
	export class ProcessedSymbol {
	    text: string;
	    confidence: number;
	    boundingBox: ProcessedBoundingBox;
	
	    static createFrom(source: any = {}) {
	        return new ProcessedSymbol(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.text = source["text"];
	        this.confidence = source["confidence"];
	        this.boundingBox = this.convertValues(source["boundingBox"], ProcessedBoundingBox);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProcessedWord {
	    fullText: string;
	    symbols: ProcessedSymbol[];
	    confidence: number;
	    direction: string;
	    boundingBox: ProcessedBoundingBox;
	
	    static createFrom(source: any = {}) {
	        return new ProcessedWord(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fullText = source["fullText"];
	        this.symbols = this.convertValues(source["symbols"], ProcessedSymbol);
	        this.confidence = source["confidence"];
	        this.direction = source["direction"];
	        this.boundingBox = this.convertValues(source["boundingBox"], ProcessedBoundingBox);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProcessedLine {
	    fullText: string;
	    words: ProcessedWord[];
	
	    static createFrom(source: any = {}) {
	        return new ProcessedLine(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fullText = source["fullText"];
	        this.words = this.convertValues(source["words"], ProcessedWord);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProcessedArea {
	    id: string;
	    documentId: string;
	    fullText: string;
	    order: number;
	    lines: ProcessedLine[];
	
	    static createFrom(source: any = {}) {
	        return new ProcessedArea(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.documentId = source["documentId"];
	        this.fullText = source["fullText"];
	        this.order = source["order"];
	        this.lines = this.convertValues(source["lines"], ProcessedLine);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	
	export class ProjectSettings {
	    defaultProcessLanguage: Language;
	    defaultTranslateTargetLanguage: Language;
	    isHosted: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ProjectSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.defaultProcessLanguage = this.convertValues(source["defaultProcessLanguage"], Language);
	        this.defaultTranslateTargetLanguage = this.convertValues(source["defaultTranslateTargetLanguage"], Language);
	        this.isHosted = source["isHosted"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Project {
	    id: string;
	    organizationId: string;
	    name: string;
	    settings: ProjectSettings;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.organizationId = source["organizationId"];
	        this.name = source["name"];
	        this.settings = this.convertValues(source["settings"], ProjectSettings);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Session {
	    project: Project;
	    organization: Organization;
	    user: User;
	
	    static createFrom(source: any = {}) {
	        return new Session(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.project = this.convertValues(source["project"], Project);
	        this.organization = this.convertValues(source["organization"], Organization);
	        this.user = this.convertValues(source["user"], User);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class UserMarkdown {
	    id: string;
	    documentId: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new UserMarkdown(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.documentId = source["documentId"];
	        this.value = source["value"];
	    }
	}

}

