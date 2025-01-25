import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Chart dimensions
    const width = 500;
    const height = 500;
    const margin = { top: 80, right: 20, bottom: 50, left: 200 }; // Adjusted for horizontal layout

    const svg = d3.select(chartRef.current).attr('width', width).attr('height', height);

    // Scales for horizontal bar chart
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.TodaysCount, d.ExpectedCount))])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.DeptName))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    // Clear previous elements
    svg.selectAll('*').remove();

    // Add chart title with extra space below it
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px') // Increased font size
      .style('font-weight', 'bold')
      .text('Department Counts - Horizontal');

    // Add space after the title
    const legendYOffset = margin.top - 20; // Increased space between title and legend

    // Add legend
    const legend = svg.append('g').attr('transform', `translate(${margin.left}, ${legendYOffset})`);

    // Today's Count Legend
    legend
      .append('rect')
      .attr('x', 0)
      .attr('width', 10) // Reduced size of the legend square
      .attr('height', 10) // Reduced size of the legend square
      .attr('fill', '#76c7c0');
    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 8) // Adjusted to align with the smaller square
      .style('font-size', '7px') // Reduced font size
      .text("Today's Count");

    // Expected Count Legend
    legend
      .append('rect')
      .attr('x', 100)
      .attr('width', 10) // Reduced size of the legend square
      .attr('height', 10) // Reduced size of the legend square
      .attr('fill', '#ff7f0e');
    legend
      .append('text')
      .attr('x', 120)
      .attr('y', 8) // Adjusted to align with the smaller square
      .style('font-size', '7px') // Reduced font size
      .text('Expected Count');

    // X Axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .style('font-size', '7px');

    // Y Axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '7px');

    // Bars for Today's Count
    svg
      .selectAll('.bar-today')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-today')
      .attr('y', (d) => yScale(d.DeptName))
      .attr('x', margin.left)
      .attr('width', (d) => xScale(d.TodaysCount) - margin.left)
      .attr('height', yScale.bandwidth() / 2)
      .attr('fill', '#76c7c0');

    // Bars for Expected Count
    svg
      .selectAll('.bar-expected')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-expected')
      .attr('y', (d) => yScale(d.DeptName) + yScale.bandwidth() / 2)
      .attr('x', margin.left)
      .attr('width', (d) => xScale(d.ExpectedCount) - margin.left)
      .attr('height', yScale.bandwidth() / 2)
      .attr('fill', '#ff7f0e');

    // Add department labels
    svg
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => xScale(d.TodaysCount) + 5) // Position to the right of the bar
      .attr('y', (d) => yScale(d.DeptName) + yScale.bandwidth() / 4)
      .attr('text-anchor', 'start')
      .style('font-size', '6px')
      .style('fill', '#000')
      .text((d) => d.TodaysCount);

    svg
      .selectAll('.bar-label-expected')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label-expected')
      .attr('x', (d) => xScale(d.ExpectedCount) + 5) // Position to the right of the bar
      .attr('y', (d) => yScale(d.DeptName) + (3 * yScale.bandwidth()) / 4)
      .attr('text-anchor', 'start')
      .style('font-size', '6px')
      .style('fill', '#000')
      .text((d) => d.ExpectedCount);
  }, [data]);

  return <svg ref={chartRef}></svg>;
};

export default BarChart;
