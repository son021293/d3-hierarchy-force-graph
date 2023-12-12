import {useEffect, useRef} from "react";
import {flattenNode} from "../utils.ts";
import data from "./data.json";
import * as d3 from "d3"
import {SimulationNodeDatum} from "d3"

export const HierarchyForceGraph = () => {
  const containerRef = useRef(null)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    let _destroy = null;
    if(containerRef.current) {
      const {destroy} = runGraph({container: containerRef.current})
      _destroy = destroy
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return () => _destroy?.()
  }, []);
  return <div ref={containerRef} style={{height: 500, width: 600}}/>
}

const NODE_RADIUS = 25

const runGraph = ({container}: {
  container: HTMLElement
}) => {
  const rect = container.getBoundingClientRect();
  const {width, height} = rect;
  const svg = d3.select(container).append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", `0 0 ${width} ${height}`)

  const simulation = d3
    .forceSimulation()
    .force(
      "collide",
      d3
        .forceCollide()
        .radius(() => 50)
        .strength(0.2)
    )
    .force(
      "x",
      d3.forceX().x(() => width / 2)
    )
    .force("charge", d3.forceManyBody().strength(100));

  const drawLinks = (links: any) => {
    svg.append("g").attr("class", "links");
    let link = svg
      .select(".links")
      .selectAll(".link")
      .data(links, (d) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return d.index as number;
      });
    link.exit().remove();

    const linkEnter = link
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#9D9D9D")
      .attr("stroke-dasharray", () => "4, 6")
      .attr("stroke-width", () => "0.85px");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    link = linkEnter.merge(link);
  };

  const drawNodes = (nodes: any) => {
    svg.append("g").attr("class", "nodes");
    let nodeContainer = svg
      .select(".nodes")
      .selectAll(".node")
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .data(nodes, (d) => d.index as number);
    nodeContainer.exit().remove();

    const nodeEnter = nodeContainer
      .enter()
      .append("g").attr("class", "node")
      ;

    nodeEnter
      .append("circle")
      .attr("r", () => NODE_RADIUS)
      .attr("fill", "#E9E9E9");

    nodeEnter
      .append("text")
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text((d: any) => {
        return d.data.influencer_name
            ?.split(" ")
            .slice(0, 2)
            .map((str: string) => str.charAt(0))
            .join("")
            .toUpperCase();
      });

    // prevent link overlap title
    nodeEnter
      .append("text")
      .attr("y", () => NODE_RADIUS * 1.5 + 3.5)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", "11px")
      .text((d: any) => {
        return d.data.influencer_name;
      });

    nodeEnter
      .append("text")
      .attr("y", () => NODE_RADIUS * 1.5)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .text((d: any) => d.data.influencer_name);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    nodeContainer = nodeEnter.merge(nodeContainer);
  };

  const restartSimulation = () => {
    const {links, nodes} = flattenNode(data);
    simulation.stop();
    simulation.nodes(nodes);
    const link = d3
      .forceLink()
      .id((d) => {
        return d.index as number;
      })
      .distance(120);

    link.links(links);
    simulation.force(
      "link", link
    );

    drawLinks(links);
    drawNodes(nodes);
    //
    simulation.on("tick", () => {
      const linkElems = svg.select(".links").selectAll(".link");
      const nodeElems = svg.select(".nodes").selectAll(".node");

      nodes.forEach((d: SimulationNodeDatum & {depth: number}) => {
        d.y = d.depth < 0 ? -80 : (d.depth) * 120 + 60;
      });

      nodeElems.attr("transform", (d: any) => {
        return `translate(${d.x}, ${d.y})`;
      });

      linkElems
        .attr("x1", (d: any) => {
          return d.source.x
        })
        .attr("y1", (d: any) => {
          return d.source.y + NODE_RADIUS + 10;
        })
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
    });
    simulation.restart().alpha(1).alphaTarget(0);
  };
  restartSimulation()
  return {
    destroy: () => simulation.stop()
  };
}

