const fs = require("fs");
const ohm = require("ohm-js");
const ohmfile = fs.readFileSync('grammar.ohm', 'utf-8');
const grammar = ohm.grammar(ohmfile);
let code;

try {
	code = fs.readFileSync('code.con', 'utf8');
} catch (err) {
	console.error("There was a problem loading code.");
	console.error(err);
}

lexer(code);

/* Steps:
* First, take all literals and put them in an array
* Before running, search the code for forbidden lexer phrases
* such as _ or *
* Replace the literals in the original string with the reserved phrase "lit"
* Then, evaluate the missing things and replace the originals with the new stuff.
*/

function lexer() {
	//
	if (code.contains("_") || code.contains("*"))
		throw Error("Lexer phrases must be removed from code");
	let final = [];
	return final;
}
