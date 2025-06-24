import * as d3 from "d3";
import { RefObject } from "react";
import { ChartData } from "./carouselHelpers";
import { VitalChartConfig } from "./vitalSignsConfig";

interface DrawChartParams {
  svgRef: RefObject<SVGSVGElement | null>;
  data: ChartData[];
  config: VitalChartConfig;
  width: number;
  height: number;
  isExpanded?: boolean;
}

export const drawVitalChart = ({
  svgRef,
  data,
  config,
  width,
  height,
  isExpanded = false,
}: DrawChartParams) => {
  if (!svgRef.current || !data.length) return;

  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();

  const margin = isExpanded
    ? { top: 40, right: 40, bottom: 60, left: 80 }
    : { top: 15, right: 15, bottom: 30, left: 40 };

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.day))
    .range([0, chartWidth])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.value) as [number, number])
    .nice()
    .range([chartHeight, 0]);

  const line = d3
    .line<ChartData>()
    .x((d) => xScale(d.day)! + xScale.bandwidth() / 2)
    .y((d) => yScale(d.value))
    .curve(d3.curveMonotoneX);

  if (isExpanded) {
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - chartHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(config.yAxisLabel);
  } else {
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d, i) => (i % 2 === 0 ? d.toString().slice(0, 3) : ""))
      )
      .selectAll("text")
      .style("font-size", "9px");

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(3))
      .selectAll("text")
      .style("font-size", "9px");
  }

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", config.color)
    .attr("stroke-width", isExpanded ? 3 : 2)
    .attr("d", line);

  g.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.day)! + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale(d.value))
    .attr("r", isExpanded ? 6 : 3)
    .attr("fill", config.color)
    .style("cursor", "pointer");

  if (isExpanded) {
    g.selectAll(".dot")
      .on("mouseover", function (event, d) {
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "d3-tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "1000");

        tooltip
          .html(`${(d as ChartData).day}: ${(d as ChartData).originalValue}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function () {
        d3.selectAll(".d3-tooltip").remove();
      });
  }
};
