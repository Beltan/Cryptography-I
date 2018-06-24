var BigNumber = require('bignumber.js');

var N1 = new BigNumber('179769313486231590772930519078902473361797697894230657273430081157732675805505620686985379449212982959585501387537164015710139858647833778606925583497541085196591615128057575940752635007475935288710823649949940771895617054361149474865046711015101563940680527540071584560878577663743040086340742855278549092581');
var N2 = new BigNumber('648455842808071669662824265346772278726343720706976263060439070378797308618081116462714015276061417569195587321840254520655424906719892428844841839353281972988531310511738648965962582821502504990264452100885281673303711142296421027840289307657458645233683357077834689715838646088239640236866252211790085787877');
var N3 = new BigNumber('720062263747350425279564435525583738338084451473999841826653057981916355690188337790423408664187663938485175264994017897083524079135686877441155132015188279331812309091996246361896836573643119174094961348524639707885238799396839230364676670221627018353299443241192173812729276147530748597302192751375739387929');
var cipher = new BigNumber('22096451867410381776306561134883418017410069787892831071731839143676135600120538004282329650473509424343946219751512256465839967942889460764542040581564748988013734864120452325229320176487916666402997509188729971690526083222067771600019329260870009579993724077458967773697817571267229951148662959627934791540');
var e = new BigNumber('65537');

/* This code is comented because the rounding needed is the equivalent of Math.ceil()
    and for the rest of the code the rounding needed is the equivalent of Math.trunc()
    So after running the first part and obtaining the primes with one type of settings we
    can run the second part with different settings.
    To change this setting the code is located in line 103 of bignumber.js

// Case 1 |p - q| < 2 * N^0.25
function getPrimeFactors(N) {
    var A = new BigNumber(N.sqrt().toFixed(0));
    var x = A.times(A).minus(N).sqrt();
    var p = A.minus(x);
    var q = A.plus(x);
    console.log(p.toFixed());
    console.log(q.toFixed());
    return {p, q};
}

// Case 2. More general case where |p - q| < 2^11 * N^0.25
function getPrimeFactors(N) {
    var B = Math.pow(2, 20);
    var Ns = N.sqrt();
    var A = new BigNumber(Ns.toFixed(0));
    for (var i = 0; i < B; i++) {
        var x = A.times(A).minus(N).sqrt().toFixed();
        if (x.indexOf('.') == -1) {
            var p = A.minus(x);
            var q = A.plus(x);
            if (p.times(q).isEqualTo(N)) {
                console.log(p.toFixed());
                console.log(q.toFixed());
                return 0;
            }
        }
        A = A.plus('1');
    }
    var x = A.times(A).minus(N).sqrt();
}

// Case 3. |3p - 2q| < N^0.25 - Very similar to case 1
function getPrimeFactors(N) {
    var A = new BigNumber(N.times('6').sqrt().times('2').toFixed(0));
    var x = A.times(A).minus(N.times('24')).sqrt();
    if (x.toFixed().indexOf('.') == -1) {
        var newA = A.div('2');
        var newx = x.div('2');
        var p1 = newA.minus(newx).div('3');
        var q1 = newA.plus(newx).div('2');
        if(p1.times(q1).isEqualTo(N)) {
            console.log(p1.toFixed());
            console.log(q1.toFixed());
        } else {
            var p1 = newA.plus(newx).div('3');
            var q1 = newA.minus(newx).div('2');
            if(p1.times(q1).isEqualTo(N)) {
                console.log(p1.toFixed());
                console.log(q1.toFixed());
            }
        }
    }
}
*/

function Euclid_inv(a, b) {
    var x = new BigNumber('0');
    var y = new BigNumber('1');
    var u = new BigNumber('1');
    var v = new BigNumber('0');
    var q = new BigNumber('0');
    var r = new BigNumber('0');
    var m = new BigNumber('0');
    var n = new BigNumber('0');
    var na = a;
    var nb = b;
    while (!a.isEqualTo(0)) {
        q = new BigNumber((b.div(a)).toFixed(0));
        r = b.mod(a);
        m = x.minus(u.times(q));
        n = y.minus(v.times(q));
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return x.plus(nb).mod(nb);
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

function decrypt(cipher, e, primes, N) {
    var phi = N.minus(primes.p).minus(primes.q).plus('1');
    var d = Euclid_inv(e, phi).toString(2);
    var table = [];
    var PKSC = new BigNumber('1');
    for (var i = 0; i < d.length; i++) {
        if (i == 0) {
            table[0] = cipher
        } else {
            table[i] = table[i - 1].pow('2').mod(N);
        }
        if (d.charAt(d.length - 1 - i) == '1') {
            PKSC = PKSC.times(table[i]).mod(N);
        }
    }
    var hexEncoded = PKSC.toString(16);
    var index = hexEncoded.indexOf('00');
    var message = hexEncoded.substring(index + 2);
    console.log(frombinary(convertString(message)));
}

// These are the results of the commented code at the beggining
var p = new BigNumber('13407807929942597099574024998205846127479365820592393377723561443721764030073662768891111614362326998675040546094339320838419523375986027530441562135724301');
var q = new BigNumber('13407807929942597099574024998205846127479365820592393377723561443721764030073778560980348930557750569660049234002192590823085163940025485114449475265364281');
var primes = {p, q};

decrypt(cipher, e, primes, N1);