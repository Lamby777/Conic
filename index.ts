// The Conic Language Interpreter
"use strict";

import fs	from "fs";
import ohm	from "ohm-js";

const ohmfile = fs.readFileSync('grammar.ohm', 'utf-8');
const grammar = ohm.grammar(ohmfile);

let code: string;

try {
	code = fs.readFileSync('code.con', 'utf8');
} catch (err) {
	console.error("There was a problem loading code.");
	console.error(err);
}

lexer(code);

function lexer(code: string) {
	// forget that BS, gonna be using Ohm :)
}