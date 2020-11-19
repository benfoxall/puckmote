/* Copyright (c) 2017 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission. */
/* Pronto Hex decoder - http://www.espruino.com/pronto */
export function pronto(d: string) {
    var a = d
        .trim()
        .split(" ")
        .map(function (x: string) {
            return parseInt(x, 16);
        });
    var freq = 4145146 / a[1];
    return a.slice(4).map(function (x) {
        return ((1000 * x) / freq).toFixed(1);
    });
}
