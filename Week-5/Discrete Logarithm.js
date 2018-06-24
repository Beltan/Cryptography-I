var BigNumber = require('bignumber.js');

var p = new BigNumber('13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084171');
var g = new BigNumber('11717829880366207009516117596335367088558084999998952205599979459063929499736583746670572176471460312928594829675428279466566527115212748467589894601965568');
var h = new BigNumber('3239475104050450443565264378728065788649097520952449527834792452971981976143292558073856937958553180532878928001494706097394108577585732452307673444020333');
var N = 20;

/* This is used to test the code with smaller numbers
var p = new BigNumber('1073676287');
var g = new BigNumber('1010343267');
var h = new BigNumber('857348958');
var N = 10;
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

function computeTable(p, g, h, N) {
    var B = new BigNumber('2').pow(N);
    var table = [];
    table[0] = h.toString();
    var invg = Euclid_inv(g, p);
    for (var i = 1; i < B; i++) {
        table[i] = invg.times(table[i - 1]).mod(p).toString();
    }
    return table;
}

function checkTable(table, g, p, N) {
    var B = new BigNumber('2').pow(N);
    var previous = g;

    for (var i = 0; i < N; i++) {
        var exp = previous.times(previous).mod(p);
        previous = exp;
    }

    var newexp = BigNumber('1');
    var lookUp = '';
    // For some reason this for loop is very inefficient
    for (var i = 1; i < B; i++) { 
        if (table.includes(lookUp)) {
            for (var j = 0; j < B; j++) {
                if(table[j] == newexp.toString()) {
                    var result = B.times(i - 1).plus(j).mod(p);
                    console.log(result.toString()); // Output: 375374217830
                    return result;
                }
            }
        }
        newexp = newexp.times(exp).mod(p);
        lookUp = newexp.toString();
    }
}

var table = computeTable(p, g, h, N);
checkTable(table, g, p, N);