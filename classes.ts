// Classes for index.ts
"use strict";

export interface ConValue {
	vtype: any;
	value: any;
}

export class ConObject implements ConValue {
	public value: ConValue;
	constructor(public vtype: string) {}
}

export class ConicRuntimeError extends Error {
	constructor(category:	string,
				problem:	string,
			   	lineNumber:	number,
			   	colNumber:	number) {
		super(category + " Error >> " + problem + "\n" +
			  "L|C " + lineNumber + "|" + colNumber);
	}
}
