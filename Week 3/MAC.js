var fs = require('fs');
var sha256 = require('js-sha256');

var fileName = '6.1.intro.mp4';
var fileName2 = '6.2.birthday.mp4';

function readFile(name) {
    var file = fs.readFileSync(name);
    var resto = file.length % 1024;
    var nBlocks = Math.trunc(file.length / 1024);
    var blocks = [];
    var rest = 1024;
    for (var i = 0; i < nBlocks + 1; i++){
        if (i == nBlocks) {
            rest = resto;
        }
        blocks[i] = file.slice(i * 1024, i * 1024 + rest);
    }
    return blocks;
}

function getHash(blocks) {
    var hash = undefined;
    var array = undefined;
    var buf = undefined;
    for (var i = blocks.length - 1; i >= 0; i--) {
        if (i != 0) {
            hash = Buffer.from(sha256.array(blocks[i]));
            array = Buffer.from(blocks[i - 1]);
            buf = [array, hash];
            blocks[i - 1] = Buffer.concat(buf);
        } else {
            var hashHex = sha256.hex(blocks[i]);
            hash = sha256.array(blocks[i]);
        }
    }
    return hashHex;
}

function getVideo(hash, blocks) {
    var nextHash = hash;
    var newHash = undefined;
    var nextHashBytes = undefined;
    for (var i = 0; i < blocks.length; i++) {
        newHash = sha256.hex(blocks[i]);
        if (newHash == nextHash) {
            if (i == blocks.length - 1) {
                console.log('File integrity ok');
                return 1;
            } else {
                nextHashBytes = Buffer.from(blocks[i]);
                nextHash = fromBytes(nextHashBytes.slice(nextHashBytes.length - 32, nextHashBytes.length));
            }
        } else {
            console.log('File corrupted');
            return 0;
        }
    }
}

function fromBytes(bytes) {
    var Hex = '0123456789abcdef';
    var result = [];
    for (var i = 0; i < bytes.length; i++) {
        var v = bytes[i];
        result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
    }
    return result.join('');
}

var blocks = readFile(fileName);
var hash = getHash(blocks);
var video = getVideo(hash, blocks);
