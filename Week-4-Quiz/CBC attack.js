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

// Converts UNICODE to binary
function tobinary(letters) {
	var binarylist = [];
	for (var letter in letters) {
		var code = letters.charCodeAt(letter).toString(2);
		binarylist.push(('0000000' + code).substr(-8));
	}
	return binarylist.join('');
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


var cipher = '20814804c1767293b99f1d9cab3bc3e7ac1e37bfb15599e5f40eef805488281d';
var message = 'Pay Bob 100$';
var newMessage = 'Pay Bob 500$';

var IV = cipher.substring(0, 32);
var ciphertext = cipher.substring(32, 64);

var binaryIV = convertString(IV);
var binarymessage = tobinary(message) + '00000100000001000000010000000100';
var mod = tobinary(newMessage) + '00000100000001000000010000000100';
var binaryResult = xor(mod, binarymessage);
var result = xor(binaryResult, binaryIV);
var hexResult = binaryToHex(result) + ciphertext;
console.log(hexResult);

