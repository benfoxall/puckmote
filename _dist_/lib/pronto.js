export function pronto(d) {
  var a = d.trim().split(" ").map(function(x) {
    return parseInt(x, 16);
  });
  var freq = 4145146 / a[1];
  return a.slice(4).map(function(x) {
    return (1e3 * x / freq).toFixed(1);
  });
}
