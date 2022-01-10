// The Conic Language Interpreter
"use strict";

import {readFileSync}	from "fs";
import ohm				from "ohm-js";

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

	// Statements
	Statement_Call(varval, _eol) {
		return varval.run();
	},

	Statement_if(_if, boolcheck, ifblock, _elseif, _elif,
				 boolcheck2, elifblock, _else, elseblock) {
		//console.log(_if.sourceString);
		//console.log(boolcheck.sourceString);
		//console.log(ifblock.sourceString);
		//console.log(_elseif.sourceString);
		//console.log(_elif.sourceString);
		//console.log(boolcheck2.sourceString);
		//console.log(elifblock.sourceString);
		//console.log(_else.sourceString);
		//console.log(elseblock.sourceString);
	},

	Statement_Print(_conout, exp, _eol) {
		console.log(exp.run());
	},


	// VarVal stuff
	//VarVal(val) {
	//	return val.run();
	//},

	MVarVal_Call(varval, _open, args, _close) {
		// Function call
	},

	
	// Declarations
	VariableD(vtype, vname, _equal, newval, _eol) {
		//
	},
	
	FunctionD(rtype, fname, _open, params, _close, codeblock, _eol) {
		//
	},

	
	// Literals
	numLiteral(_) {return parseFloat(this.sourceString)},
	strLiteral(_) {return String(this.sourceString.slice(1,-1))},
	StrInterpolate(_p1, _, _p2) {
		return this.run(this.sourceString.slice(2,-2));
	},
	comment(_) {},
});

execute(code);



function execute(code: string) {
	let matched = grammar.match(code);
	
	if (matched.failed())
		throw SyntaxError("Compiler error: " + matched);
	else
		semantics(matched).run();
}
