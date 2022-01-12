// The Conic Language Interpreter
"use strict";

import {readFileSync}			from "fs";
import {get as loget,
		set as loset}			from "lodash";
import ohm						from "ohm-js";
import {ConNumber,
		ConString,
		ConBoolean,
		ConEmpty,
		ConObject,
		ConicRuntimeError}		from "./classes";
import	{question as prompt}	from "readline-sync";

const grammar = ohm.grammar(readFileSync("conic.ohm", "utf-8"));

const mainFile: string = process.argv[2];
let code: string;

try {
	code = readFileSync(mainFile ?? "main.con", "utf8");
} catch (err) {
	console.error(
		"There was a problem loading code. Error:\n" + err.message);
}

let semantics = grammar.createSemantics().addOperation("run", {
	_iter(...children) {return children.map(val => val.run())},
	_terminal() {return false},

	// Statements
	Statement_Call(varval, _eol) {
		return varval.run();
	},

	Statement_if(_if, boolcheck, ifblock, _elseif, _elif,
				 boolcheck2, elifblock, _else, elseblock) {
		//
	},

	Statement_Print(_conout, exp, _eol) {
		console.log(exp.run()[0].value);
	},

	MVarVal_Call(varval, _open, args, _close) {
		// Function call
	},

	
	// Declarations
	VariableD(vtype, vname, _equal, newval, _eol) {
		let conObject = new ConObject(vtype.sourceString);
		conObject.value = newval.run();
		loset(globalSpace, vname.sourceString, conObject);
	},
	
	FunctionD(rtype, fname, _open, params, _close, codeblock, _eol) {
		//
	},

	
	// Literals and value-returners
	numLiteral(_) {return parseFloat(this.sourceString)},
	strLiteral(_) {
		const str = this.sourceString.slice(1,-1);
		return new ConString(str);
	},
	ArrLiteral(_open, vals, _close) {
		return []
	},
	
	StrInterpolate(_p1, _, _p2) {
		return _.run();
	},

	conin(_) {
		return new ConString(prompt());
	},

	
	
	// Assignments
	Statement_Assignment(node, _eol) { return node.run(); },
	AssignEqual(varval, _eq, newval) {
		setVariable(varval.sourceString, newval.run());
		return getVariable(varval.sourceString).value;
	},
	AssignQequal(varval, mathop, _eq, coefficient) {
		//
	},
	AssignIncrement_Before(op, varval) {
		//
	},
	AssignIncrement_After(varval, op) {
		const oldval = getVariable(varval.sourceString);
		let opv = op.sourceString;
		const modifier =	(opv === "++") ? 1	:
							(opv === "--") ? -1	: null;

		if (modifier === null)
			throw new ConicRuntimeError("Unknown",
				"No clue how you got here. L bozo, I guess.",
				this.source.getLineAndColumnMessage());
		
		setVariable(varval.sourceString, oldval + modifier);

		return oldval + modifier;
	},

	comment(_) {},
});



const globalSpace: Record<any, any> = {};

execute(code);

function execute(code: string) {
	let matched = grammar.match(code);
	
	if (matched.failed())
		throw SyntaxError("Compiler error: " + matched);
	else
		semantics(matched).run();

	console.log("\n\n\nCode complete!\nVariable list: (For debugging)")
	console.log(globalSpace);
}

function setVariable(path: string, val: any) {
	let conObject: ConObject = loget(globalSpace, path);
	
	if (conObject === undefined) // If variable doesn't exist
		throw new ConicRuntimeError("Syntax",
			"Could not assign to undefined!",
			this.source.getLineAndColumnMessage());

	// If variable exists, assign to it
	conObject.value = val;
	loset(globalSpace, path, conObject);
}

function getVariable(path: string) {
	return loget(globalSpace, path);
}
