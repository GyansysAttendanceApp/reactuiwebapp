import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AttendancePieChart = ({ todaysCount, expectedCount }) => {
  const svgRef = useRef();

  useEffect(() => {
    const totalPercentage = ((todaysCount / expectedCount) * 100).toFixed(2);
    const data = [
      { label: 'Present', value: todaysCount },
      { label: 'Absent', value: expectedCount - todaysCount },
    ];

    // Dimensions
    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create pie generator
    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius); // Donut chart

    // Color scale (shades of green)
    const colors = d3.scaleOrdinal(['#a8d08d', '#38761d']);

    // Draw the pie
    svg
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => colors(d.data.label))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels on arcs
    svg
      .selectAll('text.arc-label')
      .data(pie(data))
      .join('text')
      .attr('class', 'arc-label')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#000')
      .text((d) => d.data.label);

    // Add percentage in the center
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text(`${totalPercentage}%`);

    // Add descriptive label below the percentage
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 30)
      .attr('font-size', '11px')
      .text('Total Present Percentage');
  }, [todaysCount, expectedCount]);

  return <svg ref={svgRef}></svg>;
};

export default AttendancePieChart;
