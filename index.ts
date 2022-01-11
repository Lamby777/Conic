// The Conic Language Interpreter
"use strict";

import {readFileSync}			from "fs";
import {get as loget,
		set as loset}			from "lodash";
import ohm						from "ohm-js";
import {ConObject,
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
		console.log(exp.run());
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
	strLiteral(_) {return String(this.sourceString.slice(1,-1))},
	ArrLiteral(_open, vals, _close) {
		return []
	},
	
	StrInterpolate(_p1, _, _p2) {
		return _.run();
	},

	conin(_) {
		return prompt();
	},

	
	
	// Assignments
	Statement_Assignment(node, _eol) { return node.run(); },
	AssignEqual(varval, _eq, newval) {
		let conObject: ConObject = loget(globalSpace, varval.sourceString);
		if (conObject === undefined) {
			// If variable doesn't exist
			throw new ConicRuntimeError("Syntax",
				"Could not assign to undefined!",
				this.source.getLineAndColumnMessage());
		} else {
			conObject.value = newval.run();
			loset(globalSpace, varval.sourceString, conObject);
		}
	},
	AssignQequal(varval, mathop, _eq, coefficient) {},
	AssignIncrement_Before(op, varval) {},
	AssignIncrement_After(varval, op) {},

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
