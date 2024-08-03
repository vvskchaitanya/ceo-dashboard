import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import * as d3 from 'd3';
import { SalesData } from '../app.models';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,NgFor,NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  salesData?: SalesData;

  quarters=["Q1","Q2","Q3","Q4"];
  years = ["2021","2022","2023"];

  selectedYear: string = "2023";
  selectedQuarter: string = 'Q1'; // Default selected quarter
  currentSales: number = 0;
  currentProfit: number = 0;
  private svg: any;
  private margin = { top: 20, right: 30, bottom: 40, left: 50 };
  private width = 600 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private x: any;
  private y: any;

  constructor(private dataService: DataService) {
    this.dataService.getData().subscribe(res=>{
      this.updateMetrics();
    });
  }

  ngOnInit(): void {
    this.initChart();
  }

  updateMetrics(): void {
    this.salesData = this.dataService.getSalesData(this.selectedYear,this.selectedQuarter);
    const currentData = this.salesData;
    if (currentData) {
      // Sum up the sales and calculate profit (dummy calculation here)
      this.currentSales = currentData.monthlySales.reduce(
        (sum, month) => sum + month.sales,
        0
      );
      this.currentProfit = currentData.monthlySales.reduce(
        (sum, month) => sum + month.profit,
        0
      );
      this.updateChart(); // Update the chart with new data
    }
  }

  initChart(): void {
    this.svg = d3
      .select('figure#bar-chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // X-axis: Scale
    this.x = d3.scaleBand().range([0, this.width]).padding(0.2);

    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .attr('class', 'x-axis')
      .selectAll('text')
      .style('text-anchor', 'middle');

    // Y-axis: Scale
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.svg.append('g').attr('class', 'y-axis');
  }

  updateChart(): void {
    const currentData = this.salesData;

    if (!currentData) return;

    const months = currentData.monthlySales.map((d:any) => d.month);
    const sales = currentData.monthlySales.map((d:any) => d.sales);

    // Update X and Y domains
    this.x.domain(months);
    this.y.domain([0, d3.max(sales) || 0]);

    // Update X-axis
    this.svg.select('.x-axis').call(d3.axisBottom(this.x));

    // Update Y-axis
    this.svg.select('.y-axis').call(d3.axisLeft(this.y));

    // Bind data
    const bars = this.svg.selectAll('.bar').data(currentData.monthlySales);

    // Enter new bars
    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d:any) => this.x(d.month)!)
      .attr('width', this.x.bandwidth())
      .attr('fill', 'steelblue')
      .merge(bars) // Update existing bars
      .transition()
      .duration(750)
      .attr('y', (d:any) => this.y(d.sales))
      .attr('height', (d:any) => this.height - this.y(d.sales));

    // Remove old bars
    bars.exit().remove();
  }
}