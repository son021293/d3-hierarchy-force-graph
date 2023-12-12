import * as d3 from "d3";

export const flattenNode = (root: any) => {
  const nodes = d3.hierarchy(root, (d) => d.children);
  const links = nodes.links();

  const leaves = nodes.descendants().map((l) => l);
  const _nodes = leaves.map((l, index) => ({...l, index}));

  const connections = links.map((link) => ({
    source: _nodes.findIndex((n) => n.data.id === link.source.data.id),
    target: _nodes.findIndex((n) => n.data.id === link.target.data.id),
  }));

  return {
    nodes: _nodes,
    links: connections
  }
};

