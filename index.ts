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
	console.error("There was a problem loading code. Error:");
	console.error(err.message);
}

lexer(code);

function lexer(code: string) {
	// forget that BS, gonna be using Ohm :)
}