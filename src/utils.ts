import * as d3 from "d3";
import data from "./data.json";

export const flattenNode = (root: any) => {
  const nodes = d3.hierarchy(root, (d) => d.children);
  const links = nodes.links();

  const leaves = nodes.descendants().map((l) => l);
  const _nodes = leaves.map((l, index) => ({...l, index}));

  // return {
  //   nodes: nodes.descendants(),
  //   links
  // };

  const connections = links.map((link) => ({
    source: _nodes.findIndex((n) => n.data.id === link.source.data.id),
    target: _nodes.findIndex((n) => n.data.id === link.target.data.id),
  }));

  return {
    nodes: _nodes,
    links: connections
  }

  // const rootNode = nodes.find((n) => n.parent == null);

  // return {
  //   links: connections,
  //   nodes: nodeFlatten.map((n) => ({
  //     ...n,
  //     // parentViewerId: n.parent?.id,
  //   })),
  //   // rootUserId: rootNode.id,
  //   // rootId: guid() + rootNode.purl,
  //   // groupId: guid(),
  // };
};

console.log(flattenNode(data))
