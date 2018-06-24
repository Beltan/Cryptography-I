var aesjs = require('aes-js');

var spaceregex = /\s/g;

var CBCkey = '140b41b22a29beb4061bda66b6747e14';
var CBCcipher = '5b68629feb8606f9a6667670b75b38a5b4832d0f26e1ab7da33249de7d4afc48e713ac646ace36e872ad5fb8a512428a6e21364b0c374df45503473c5242a253';

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

// Converts binary to UNICODE
function frombinary(binarystring) {
	var letters = [];
	var lettercount = Math.floor(binarystring.length / 8);
	for (var l = 0; l < lettercount; l++) {
		letters.push(parseInt(binarystring.substr(l << 3, 8), 2));
	}
	return String.fromCharCode.apply(String, letters);
}

// Converts Bytes in decimal format to binary
function fromBytes(array) {
    var number = '';
    var result = '';
    for (var j = 0; j < array.length; j++) {
        number = (array[j]).toString(2);
        while (number.length < 8) {
            number = '0' + number;
        }
        result = result + number;
    }
    return result;
}

// Does 1 decryption step in the CBC mode
function decryptStep(input, segment) {
    var cipher = aesjs.utils.hex.toBytes(segment);
    var decryptedBytes = aes.decrypt(cipher);
    var binPlaintext = fromBytes(decryptedBytes);
    var previous = convertString(input);
    var output = xor(previous, binPlaintext);
    return output;
}

// Does 1 encryption step in the CBC mode
function encryptStep(message, cipher) {
    var hex = aesjs.utils.hex.fromBytes(cipher);
    var bin = convertString(hex);
    var xored = xor(bin, message);
    var toEncrypt = [];
    for (var j = 0; j < xored.length; j = j + 8) {
        toEncrypt[j/8] = xored.substring(j, j + 8);
        toEncrypt[j/8] = parseInt(toEncrypt[j/8], 2);
    }
    var encryptedBytes = aes.encrypt(toEncrypt);
    return encryptedBytes;
}

// Deletes the pad number during decryption
function deletePad(message) {
    var length = message.length;
    var number = message.substring(length - 8, length);
    var digit = parseInt(number, 2);
    var final = message.substring(0, length - digit * 8);
    return final;
}

// Creates pad during encryption
function createPad(message) {
    var pad = (message.length % 128) / 8;
    if (pad != 0) {
        var rest = 16 - pad;
        var add = rest.toString(2);
        while (add.length < 8) {
            add = '0' + add;
        }
        for (var j = 0; j < rest; j++) {
            message = message + add;
        }
    } else {
        var add = '00001111';
        for (var j = 0; j < 16; j++) {
            message = message + add;
        }
    }
    return message;
}

function decrypt(cipher) {
    var segment = [];
    var message = [];
    for (var i = 0; i < cipher.length; i = i + 32) {
        segment[i/32] = cipher.substring(i, i + 32);
    }
    for (var i = 0; i < segment.length - 1; i++) {
        message[i] = decryptStep(segment[i], segment[i + 1]);
    }
    var completeMessage = message.join('');
    var noPad = deletePad(completeMessage);
    var finalMessage = frombinary(noPad);
    console.log(finalMessage);
}

function encrypt(message, IV) {
    var segment = [];
    var cipher = [];
    var ciphertext = [];
    message = tobinary(message);
    message = createPad(message);    
    var bytesIV = aesjs.utils.hex.toBytes(IV);
    for (var i = 0; i < message.length; i = i + 128) {
        segment[i/128] = message.substring(i, i + 128);
    }
    for (var i = 0; i < segment.length; i++) {
        if (i != 0) {
            cipher[i] = encryptStep(segment[i], cipher[i - 1]);
        } else {
            cipher[i] = encryptStep(segment[i], bytesIV);
        }
    }
    for (var i = 0; i < cipher.length; i++) {
        ciphertext[i] = aesjs.utils.hex.fromBytes(cipher[i]);
    }
    var finalCipher = IV + ciphertext.join('');
    console.log(finalCipher);
}

var key = aesjs.utils.hex.toBytes(CBCkey);
var aes = new aesjs.AES(key);

var IV = '4ca00ff4c898d61e1edbf1800618fb28';
var message = 'Basic CBC mode encryption needs padding.';

decrypt(CBCcipher);
//encrypt(message, IV);
