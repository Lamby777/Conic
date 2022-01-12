// Classes for index.ts
"use strict";

abstract class ConValue {
	abstract vtype: string;
	abstract value: any;
}

export class ConNumber extends ConValue {
	public value: number;
	public vtype = "num";
	constructor() {
		super();
	}
}

export class ConString extends ConValue {
	public vtype = "str";
	constructor(public value: string = "") {
		super();
		//this.value = value;
	}
}

export class ConBoolean extends ConValue {
	public vtype = "bool";
	constructor(public value: boolean | ConEmpty = false) {
		super();
	}
}

export class ConEmpty extends ConValue {
	public vtype = "empty";
	public value: null;
}

export class ConObject extends ConValue {
	public value: ConValue;
	constructor(public vtype: string) {
		super();
	}
}

/**	Used for variables.
 *	Holds a variable + its type and a
 *	reference to some ConValue child class it may store
*/
export class ConTainer {
	// Type of variable's held value (aka variable's type)
	public vhtype: string;
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
