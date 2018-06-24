var aesjs = require('aes-js');

var spaceregex = /\s/g;

var CTRkey = '36f18357be4dbd77f050515c73fcf9f2';
var CTRcipher = '770b80259ec33beb2561358a9f2dc617e46218c0a53cbeca695ae45faa8952aa0e311bde9d4e01726d3184c34451';

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

function bintoHex(string) {
    var result = '';
    for (var j = 0; j < string.length; j = j + 8) {
        var number = string.substring(j, j + 8);
        number = parseInt(number, 2).toString(16);
        while (number.length < 2) {
            number = '0' + number;
        }
        result = result + number;
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
	var purebinary = binarystring.replace(spaceregex, '');
	var lettercount = Math.floor(purebinary.length / 8);
	for (var l = 0; l < lettercount; l++) {
		letters.push(parseInt(purebinary.substr(l << 3, 8), 2));
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

function setCharAt(string, index, char) {
    if(index > string.length - 1) return string;
    return string.substr(0, index) + char + string.substr(index + 1, string.length);
}

function nextIV(binIV) {
    var i = binIV.length - 1;
    while (binIV.charAt(i) == 1) {
        binIV = setCharAt(binIV, i, 0);
        i--;
    }
    binIV = setCharAt(binIV, i, 1);
    return binIV;
}

function encrypt(message, IV) {
    var binMessage = tobinary(message);
    var binIV = convertString(IV);
    var segment = [];
    var IVs = [];
    var encryptedIV = [];
    var xored = [];
    for (var i = 0; i < binMessage.length; i = i + 128) {
        segment[i/128] = binMessage.substring(i, i + 128);
        IVs[i/128] = binIV;
        binIV = nextIV(binIV);
        encryptedIV[i/128] = encryptStep(IVs[i/128]);
        xored[i/128] = xor(encryptedIV[i/128], segment[i/128]);
    }
    var cipher = xored.join('');
    var hexCipher = bintoHex(cipher);
    var fullCipher = IV + hexCipher;
    console.log(fullCipher);
}

function encryptStep(IV) {
    hexIV = bintoHex(IV);
    bytes = aesjs.utils.hex.toBytes(hexIV);
    encryptedIV = aes.encrypt(bytes);
    hexEncryptedIV = aesjs.utils.hex.fromBytes(encryptedIV);
    return convertString(hexEncryptedIV);
}

function decrypt(cipher) {
    var binCipher = convertString(cipher);
    var binIV = binCipher.substring(0, 128);
    var segment = [];
    var IVs = [];
    var decryptedIV = [];
    var xored = [];
    for (var i = 128; i < binCipher.length; i = i + 128) {
        segment[i/128 - 1] = binCipher.substring(i, i + 128);
        IVs[i/128 - 1] = binIV;
        binIV = nextIV(binIV);
        decryptedIV[i/128 - 1] = encryptStep(IVs[i/128 - 1]);
        xored[i/128 - 1] = xor(decryptedIV[i/128 - 1], segment[i/128 - 1]);
    }
    var binMessage = xored.join('');
    var message = frombinary(binMessage);
    console.log(message);
}

var key = aesjs.utils.hex.toBytes(CTRkey);
var aes = new aesjs.AES(key);

//var IV = '69dda8455c7dd4254bf353b773304eec';
//var message = 'Always avoid the two time pad!';

decrypt(CTRcipher);
//encrypt(message, IV);
