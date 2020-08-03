/**
 * Removes babel-produced metadata properties on rendered hyperscript.
 *
 * In the future, this could be replaced with a better environment setup. It seems
 * to be caused by: https://babeljs.io/docs/en/babel-plugin-transform-react-jsx-self
 *
 * See also: https://babeljs.io/docs/en/babel-preset-react
 */
export default function removeMeta(obj: {
  [key: string]: unknown;
}): { [key: string]: unknown } {
  const test = JSON.parse(
    JSON.stringify(obj, (k, v) =>
      k === '__self' || k === '__source' ? undefined : v
    )
  );

  return test;
}
