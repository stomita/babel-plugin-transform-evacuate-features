/**
 *
 */
export function stripLocationFromNode(n) {
  if (n == null || typeof n !== 'object') {
    return n;
  }
  if (Array.isArray(n)) {
    return n.map(an => stripLocationFromNode(an));
  }
  const { start, end, loc, ...node } = n;
  return Object.keys(node).reduce(
    (nd, name) => ({
      ...nd,
      [name]: stripLocationFromNode(node[name])
    }),
    {}
  );
}
