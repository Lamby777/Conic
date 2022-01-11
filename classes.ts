// Classes for index.ts
"use strict";

abstract class ConValue {
	abstract vtype: any;
	abstract value: any;
}

export class ConNumber extends ConValue {
	public value: number;
	public vtype: "num";
	constructor() {
		super();
	}
}

export class ConString extends ConValue {
	public value: string;
	public vtype: "str";
	constructor() {
		super();
	}
}

export class ConBoolean extends ConValue {
	public vtype: "bool";
	constructor(public value: boolean | ConEmpty = false) {
		super();
	}
}

export class ConEmpty extends ConValue {
	public vtype: "empty";
	public value: null;
}

export class ConObject extends ConValue {
	public value: ConValue;
	constructor(public vtype: string) {
		super();
	}
}

export type PrimitiveValue =	ConNumber	| ConString |
								ConBoolean	| ConEmpty;

export type PrimitiveType =	"num" | "str" | "bool" | "empty";



// Errors

export class ConicRuntimeError extends Error {
	constructor(category:		string,
				problem:		string,
				linecolmsg:		string) {
		super(linecolmsg + "\n" + category + " Error >> " + problem);
		this.stack = null; // Prevent spamming console with 2 traces
	}
}
