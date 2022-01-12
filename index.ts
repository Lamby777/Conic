// The Conic Language Interpreter
"use strict";

import {readFileSync}			from "fs";
import {get as loget,
		set as loset}			from "lodash";
import ohm						from "ohm-js";
import {ConValue,
		ConNumber,
		ConString,
		ConBoolean,
		ConEmpty,
		ConObject,
		ConTainer,
		ConicRuntimeError}		from "./classes";
import	{question as prompt}	from "readline-sync";

const grammar = ohm.grammar(readFileSync("conic.ohm", "utf-8"));
let code: string;

{ // Read code file into variable
	const mainFile: string = process.argv[2];
	try {
		code = readFileSync(mainFile ?? "main.con", "utf8");
	} catch (err) {
		console.error(
				"There was a problem loading code. Error:\n" +
				err.message);
	}
}

let semantics = grammar.createSemantics().addOperation("run", {
	_iter(...children) {return children.map(val => val.run())},
	_terminal() {return false},

	// Statements
	Statement_Call(varval, _eol) {
		return varval.run();
	},

	Statement_if(_if, boolcheck, ifcode, _elseif, _elif,
				 boolcheck2, elifcode, _else, elsecode) {
		// Debugging arguments
		Array.from(arguments).forEach((val, i) => {
			//console.log(i + ": " + val.sourceString);
			//console.log(val.run());
		});
		
		if (boolcheck.run().value) ifcode.run();
		else if (_elseif && boolcheck2.run().value) elifcode.run();
		else if (_else) elsecode.run();
	},

	// conout = print statements
	Statement_Print(_conout, exp, _eol) {
		console.log(exp.run().value);
	},

	//MVarVal_Call(varval, _open, args, _close) {
		// Function call
	//},

	
	// Declarations
	VariableD(vtype, vname, _equal, newval, _eol) {
		let cont = new ConTainer(vtype.sourceString, newval.run()[0]);
		loset(globalSpace, vname.sourceString, cont);
	},
	
	FunctionD(rtype, fname, _open, params, _close, codeblock, _eol) {
		//
	},

	
	// Literals and value-returners
	numLiteral(_) {
		return new ConNumber(parseFloat(this.sourceString));
	},
	strLiteral(_) {
		const str = this.sourceString.slice(1,-1);
		return new ConString(str);
	},
	true(_) {return new ConBoolean(true)},
	false(_) {return new ConBoolean(false)},
	ArrLiteral(_open, vals, _close) {
		return []
	},
	
	StrInterpolate(_p1, _, _p2) {
		return _.run();
	},

	conin(_) {
		return new ConString(prompt());
	},

	Expression_NestedExpression(_open, exp, _close) {
		return exp.run();
	},

	CodeBlock(_open, statements, _close) {
		//statements.forEach((v: any) => v.run());
		statements.run();
	},

	
	
	// Assignments
	Statement_Assignment(node, _eol) { return node.run(); },
	AssignEqual(varval, _eq, newval) {
		dsetVariable(varval.sourceString, newval.run());
		return getVariable(varval.sourceString).value;
	},
	AssignQequal(varval, mathop, _eq, coefficient) {
		//
	},
	AssignIncrement_Before(op, varval) {
		//
	},
	AssignIncrement_After(varval, op) {
		const old = getVariable(varval.sourceString);
		let opv = op.sourceString;
		const modifier =	(opv === "++") ? 1	:
							(opv === "--") ? -1	: null;

		if (modifier === null)
			throw new ConicRuntimeError("Unknown",
				"No clue how you got here. L bozo, I guess.",
				this.source.getLineAndColumnMessage());
		
		setVariable(varval.sourceString, old + modifier);

		return old + modifier;
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

	console.log("\n\n\nCode complete!\nVariable list: (For debugging)");
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

function dsetVariable(path: string, val: any) {
	let cont: ConTainer = getVariable(path);
	cont.heldValue = val; // assign to copy of reference
	loset(globalSpace, path, cont); // assign copy to real
}

function getVariable(path: string) {
	return loget(globalSpace, path);
}
