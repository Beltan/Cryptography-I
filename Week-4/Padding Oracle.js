// Converts numbers from one base to another
function convertNumber(n, fromBase, toBase) {
    return parseInt(n.toString(), fromBase).toString(toBase);
}

// Converts hexadecimal to binary
function convertString(string) {
    var result = '';
    for (var i = 0; i < string.length; i++) {
        var number = convertNumber(string.charAt(i), 16, 2);
        while (number.length < 4) {
            number = '0' + number;
        }
        var result = result + number;
    }
    return result;
}

// Does the operation XOR between two binary strings using the length of the shortest of them
function xor(string1, string2) {
    var result = '';
    var length = string1.length;
    if (length > string2.length) {
        length = string2.length;
    }
    for (i = 0; i < length; i++) {
        var number = string1.charAt(i) ^ string2.charAt(i);
        var result = result + number;
    }
    return result;
}

// Converts binary to UNICODE
function frombinary(binarystring) {
	var letters = [];
	var lettercount = Math.floor(binarystring.length / 8);
	for (var l = 0; l < lettercount; l++) {
		letters.push(parseInt(binarystring.substr(l << 3, 8), 2));
	}
	return String.fromCharCode.apply(String, letters);
}

// Converts binary to hex
function binaryToHex(string) {
    var Hex = '0123456789abcdef';
    var result = '';
    for (var i = 0; i < string.length; i = i + 4) {
        var number = (string.substring(i, i + 4));
        var digit = parseInt(number, 2);
        result = result + Hex.charAt(digit);
    }
    return result;
}

// Converts byte to binary
function fromBytes(string) {
    var number = '';
    var result = '';
    number = (string.toString(2));
    while (number.length < 8) {
        number = '0' + number;
    }
    result = result + number;
    return result;
}

function replace(string, addition, position) {
    return string.substring(0, position) + addition;
}

var request = require('request-promise');
var cipher = 'f20bdba6ff29eed7b046d1df9fb7000058b1ffb4210a580f748b4ac714c001bd4a61044426fb515dad3f21f18aa577c0bdf302936266926ff37dbf7035d5eeb4';
var binaryCipher = convertString(cipher);
var binaryArray = [];
var binaryServer = [];
for (var i = 0; i < binaryCipher.length; i += 128) {
    binaryArray[i/128] = binaryCipher.substring(0, i + 128);
    binaryServer[i/128] = binaryCipher.substring(i, i + 128);
}
var web = 'http://crypto-class.appspot.com/po?er=';

async function query(binaryArray, binaryServer, web) {
    var preCompute = [];
    for (var i = 0; i < 256; i++) {
        preCompute[i] = fromBytes(i);
    }
    var intermediate0 = [];
    var intermediate1 = [];
    var intermediate2 = [];
    var mod = '';
    var newCipher = '';
    var target = '';
    var hexCipher = '';
    for (var k = 0; k < binaryArray.length - 1; k++) {
        var currentCipher = binaryArray[k];
        var vector = 'intermediate' + k;
        for (var j = 0; j < 16; j++) {
            for (var i = 0; i < 256; i++) {
                mod = preCompute[i];
                newCipher = replace(currentCipher, mod, currentCipher.length - ((j + 1) * 8));
                for (var l = 0; l < eval(vector).length; l++) {
                    newCipher += xor(preCompute[j + 1], fromBytes(eval(vector)[l]));
                }
                hexCipher = binaryToHex(newCipher + binaryServer[k + 1]);
                target = web + hexCipher;
                try {
                    var result = await request(target);
                    if (k == 2 && j == 8) {
                        eval(vector).unshift(xor(preCompute[i], preCompute[j + 1]));
                        i = 256;
                    }
                    } catch (err) {
                    if (err.statusCode != 403) {
                        eval(vector).unshift(xor(preCompute[i], preCompute[j + 1]));
                        i = 256;
                    }
                }
            }
        }
    }
    var result = xor(intermediate0.concat(intermediate1.concat(intermediate2)).join(''), binaryArray[binaryArray.length - 2]);
    console.log(frombinary(result));
}

query(binaryArray, binaryServer, web);