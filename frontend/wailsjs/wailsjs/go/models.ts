export namespace ipc {
	
	export class Document {
	    id: string;
	    groupId: string;
	    name: string;
	    path: string;
	    projectId: string;
	
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
	    }
	}
	export class DocumentGroup {
	    id: string;
	    parentId: string;
	    projectId: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new DocumentGroup(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.parentId = source["parentId"];
	        this.projectId = source["projectId"];
	        this.name = source["name"];
	    }
	}
	export class GetDocumentsResponse {
	    documents: Document[];
	    documentGroups: DocumentGroup[];
	
	    static createFrom(source: any = {}) {
	        return new GetDocumentsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.documents = this.convertValues(source["documents"], Document);
	        this.documentGroups = this.convertValues(source["documentGroups"], DocumentGroup);
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

}

