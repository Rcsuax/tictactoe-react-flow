// @flow

function foo(x: ?number): string {
  if (x) {
    return "";
  }
  return "default string";
}
