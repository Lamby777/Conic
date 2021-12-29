"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ohm_js_1 = __importDefault(require("ohm-js"));
const ohmfile = fs_1.default.readFileSync('grammar.ohm', 'utf-8');
const grammar = ohm_js_1.default.grammar(ohmfile);
let code;
try {
    code = fs_1.default.readFileSync('code.con', 'utf8');
}
catch (err) {
    console.error("There was a problem loading code.");
    console.error(err);
}
lexer(code);
function lexer(code) {
}
