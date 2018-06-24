var ciphers = [];
var binary = [];
var xors = [];

// Encrypted messages: The objective is to decrypt the last one.
ciphers[0] = '315c4eeaa8b5f8aaf9174145bf43e1784b8fa00dc71d885a804e5ee9fa40b16349c146fb778cdf2d3aff021dfff5b403b510d0d0455468aeb98622b137dae857553ccd8883a7bc37520e06e515d22c954eba5025b8cc57ee59418ce7dc6bc41556bdb36bbca3e8774301fbcaa3b83b220809560987815f65286764703de0f3d524400a19b159610b11ef3e';
ciphers[1] = '234c02ecbbfbafa3ed18510abd11fa724fcda2018a1a8342cf064bbde548b12b07df44ba7191d9606ef4081ffde5ad46a5069d9f7f543bedb9c861bf29c7e205132eda9382b0bc2c5c4b45f919cf3a9f1cb74151f6d551f4480c82b2cb24cc5b028aa76eb7b4ab24171ab3cdadb8356f';
ciphers[2] = '32510ba9a7b2bba9b8005d43a304b5714cc0bb0c8a34884dd91304b8ad40b62b07df44ba6e9d8a2368e51d04e0e7b207b70b9b8261112bacb6c866a232dfe257527dc29398f5f3251a0d47e503c66e935de81230b59b7afb5f41afa8d661cb';
ciphers[3] = '32510ba9aab2a8a4fd06414fb517b5605cc0aa0dc91a8908c2064ba8ad5ea06a029056f47a8ad3306ef5021eafe1ac01a81197847a5c68a1b78769a37bc8f4575432c198ccb4ef63590256e305cd3a9544ee4160ead45aef520489e7da7d835402bca670bda8eb775200b8dabbba246b130f040d8ec6447e2c767f3d30ed81ea2e4c1404e1315a1010e7229be6636aaa';
ciphers[4] = '3f561ba9adb4b6ebec54424ba317b564418fac0dd35f8c08d31a1fe9e24fe56808c213f17c81d9607cee021dafe1e001b21ade877a5e68bea88d61b93ac5ee0d562e8e9582f5ef375f0a4ae20ed86e935de81230b59b73fb4302cd95d770c65b40aaa065f2a5e33a5a0bb5dcaba43722130f042f8ec85b7c2070';
ciphers[5] = '32510bfbacfbb9befd54415da243e1695ecabd58c519cd4bd2061bbde24eb76a19d84aba34d8de287be84d07e7e9a30ee714979c7e1123a8bd9822a33ecaf512472e8e8f8db3f9635c1949e640c621854eba0d79eccf52ff111284b4cc61d11902aebc66f2b2e436434eacc0aba938220b084800c2ca4e693522643573b2c4ce35050b0cf774201f0fe52ac9f26d71b6cf61a711cc229f77ace7aa88a2f19983122b11be87a59c355d25f8e4';
ciphers[6] = '32510bfbacfbb9befd54415da243e1695ecabd58c519cd4bd90f1fa6ea5ba47b01c909ba7696cf606ef40c04afe1ac0aa8148dd066592ded9f8774b529c7ea125d298e8883f5e9305f4b44f915cb2bd05af51373fd9b4af511039fa2d96f83414aaaf261bda2e97b170fb5cce2a53e675c154c0d9681596934777e2275b381ce2e40582afe67650b13e72287ff2270abcf73bb028932836fbdecfecee0a3b894473c1bbeb6b4913a536ce4f9b13f1efff71ea313c8661dd9a4ce';
ciphers[7] = '315c4eeaa8b5f8bffd11155ea506b56041c6a00c8a08854dd21a4bbde54ce56801d943ba708b8a3574f40c00fff9e00fa1439fd0654327a3bfc860b92f89ee04132ecb9298f5fd2d5e4b45e40ecc3b9d59e9417df7c95bba410e9aa2ca24c5474da2f276baa3ac325918b2daada43d6712150441c2e04f6565517f317da9d3';
ciphers[8] = '271946f9bbb2aeadec111841a81abc300ecaa01bd8069d5cc91005e9fe4aad6e04d513e96d99de2569bc5e50eeeca709b50a8a987f4264edb6896fb537d0a716132ddc938fb0f836480e06ed0fcd6e9759f40462f9cf57f4564186a2c1778f1543efa270bda5e933421cbe88a4a52222190f471e9bd15f652b653b7071aec59a2705081ffe72651d08f822c9ed6d76e48b63ab15d0208573a7eef027';
ciphers[9] = '466d06ece998b7a2fb1d464fed2ced7641ddaa3cc31c9941cf110abbf409ed39598005b3399ccfafb61d0315fca0a314be138a9f32503bedac8067f03adbf3575c3b8edc9ba7f537530541ab0f9f3cd04ff50d66f1d559ba520e89a2cb2a83';
ciphers[10] = '32510ba9babebbbefd001547a810e67149caee11d945cd7fc81a05e9f85aac650e9052ba6a8cd8257bf14d13e6f0a803b54fde9e77472dbff89d71b57bddef121336cb85ccb8f3315f4b52e301d16e9f52f904';

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

for (j = 0; j < ciphers.length; j++) {
    binary[j] = convertString(ciphers[j]);
}

for (j = 0; j < ciphers.length - 1; j++) {
    xors[j] = xor(binary[j], binary[j + 1]);
}

/* CODE USED TO CRIB TO REACH THE SOLUTION

var guess = 'There are two types of cyptography: one that allows the Government to use brute force to break the code, and one that requires the Government to use brute force to break you';
var guessBin = tobinary(guess);
var crib = [];
var index = 6;

for (k = 0; k < xors[index].length - guess.length * 8; k = k + 8) {
    j = k + guess.length * 8;
    crib.push(frombinary(xor(guessBin, xors[index].substring(k, j))));
}

var key = xor(guessBin, binary[6].substring(0, guess.length * 8));
*/

// Key obtained while decrypting the messages
var key = "0110011000111001011011101000100111001001110110111101100011001100100110000111010000110101001010101100110101100011100101010001000000101110101011111100111001111000101010100111111111101101001010001010000001111111011010111100100110001101001010011100010100001011011010011011000000110011100110100001100111111000101010100100000000011010100111000110110101110000100011111000000011000000011001101100011101100011111111101111000000010010001100010100100011001101110110001110100000000010110100000101101110101001100001110111011100110011010111011010111011111100111011001101010110011100010000110011101001101011001001101000101101100000101111110100111011110000001111001001101001100001000100001001100010111011001111101001101000110001011000011110110111000111101110000000010010100011001101010010001011001111110100100000001011010010110001101000110001010111001101110110111011011011101010001100001011001010010100000000001001111100011000010010010001101100111000101010000100101011000011000100010100000010000101110101000000010000110000001010000110111010010001100010010101111000011011011001000100010001000000000111100101111101100010100100011111101001100010110000001000000100110001001110111100000110110010000110011110101001010100001111000100011010110010011000100111011110101010001000111111010001110110111111000101100111010010000111010010011110110101001100011011110100010110110011100001001100100111011001011011000100";

for (j = 0; j < binary.length; j++) {
    console.log (frombinary(xor(key, binary[j])));
}

/*
Output: 
We can factor the number 15 with quantum computers. We can also factor the number 15 with a dog trained to bark three times - Robert Harley
Euler would probably enjoy that now his theorem becomes a corner stone of crypto - Annonymous on Euler's theorem
The nice thing about Keeyloq is now we cryptographers can drive a lot of fancy cars - Dan Boneh
The ciphertext produced by a weak encryption algorithm looks as good as ciphertext produced by a strong encryption algorithm - Philip Zimmermann
You don't want to buy a set of car keys from a guy who specializes in stealing cars - Marc Rotenberg commenting on Clipper
There are two types of cryptography - that which will keep secrets safe from your little sister, and that which will keep secrets safe from your government - Bruce Schneier
There are two types of cyptography: one that allows the Government to use brute force to break the code, and one that requires the Government to use brute force to break you
We can see the point where the chip is unhappy if a wrong bit is sent and consumes more power from the environment - Adi Shamir
A (private-key)  encryption scheme states 3 algorithms, namely a procedure for generating keys, a procedure for encrypting, and a procedure for decrypting.
 The Concise OxfordDictionary (2006) deï¬nes crypto as the art of  writing o r solving codes. 
The secret message is: When using a stream cipher, never use the key more than once
*/
