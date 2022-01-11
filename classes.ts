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
	constructor(category:		string,
				problem:		string,
				linecolmsg:		string) {
		super(linecolmsg + "\n" + category + " Error >> " + problem);
		this.stack = null; // Prevent spamming console with 2 traces
	}
}
