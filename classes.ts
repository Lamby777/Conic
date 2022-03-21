// Classes for index.ts
"use strict";

import {Node as OhmNode}	from "ohm-js";
import	crypto					from "crypto";

// Conic types

export abstract class ConValue {
	abstract vtype: string;
	abstract value: any;
}

export class ConNumber extends ConValue {
	public vtype = "num";
	constructor(public value: number) {
		super();
	}
}

export class ConString extends ConValue {
	public vtype = "str";
	constructor(public value: string = "") {
		super();
	}
}

export class ConBoolean extends ConValue {
	public vtype = "bool";
	constructor(public value: boolean) {
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

export class ConFunction extends ConValue {
	public vtype:	string;

	constructor(public value:	OhmNode,
				public params:	any[],
				vtype:			string) { // Returned type
		super();
		this.vtype = vtype + "()"; // specify fn
	}
}

/**	Used for variables.
 *	Holds a variable + its type and a
 *	reference to some ConValue object it may store */
export class ConTainer {
	public heldType:	string;		// Type of held value
	public heldValue:	ConValue;	// (Reference to ConValue object)

	constructor(heldType?: string, heldValue?: ConValue) {
		if (heldValue && heldType === undefined)
			// Value given without type
			throw new SyntaxError(
				"Attempt to create untyped " +
				"initialized ConTainer");

		// Set given values (after guard function)
		if (heldType) this.heldType = heldType;
		if (heldValue) this.heldValue = heldValue;
	}
}

export type PrimitiveValue =	ConNumber	| ConString |
								ConBoolean	| ConEmpty;

export type PrimitiveType =	"num" | "str" | "bool" | "empty";

export interface Call {
	container:	"global" | ConTainer;
	hash:		string;
}

// Errors

export class ConicRuntimeError extends Error {
	constructor(category:		string,
				problem:		string,
				linecolMsg:		string) {
		super(linecolMsg + "\n" + category + " Error >> " + problem);
		this.stack = null; // Prevent spamming console with 2 traces
	}
}

export function hash(input: any, format?: string): string {
	return crypto.createHash("sha256")
		.update(input.toString()).digest(<any>(format ? format : "hex"));
}
