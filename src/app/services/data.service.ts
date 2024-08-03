import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SalesData, DataResponse } from './../app.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data.json';

  private data: DataResponse[] = [];

  private quarters:any = {
    "Q1": ["January", "February", "March"],
    "Q2": ["April", "May", "June"],
    "Q3": ["July", "August", "September"],
    "Q4": ["October", "November", "December"]
  };

  constructor(private http: HttpClient) {
    this.getData();
  }

  getData(): Observable<DataResponse[]> {
    return this.http.get<DataResponse[]>(this.dataUrl).pipe(
      map(response => {this.data=response;return this.data;})
    );
  }

  getSalesData(year:string, quarter:string):SalesData{
    var sales:SalesData = { year: year, quarter: quarter, monthlySales:[]};
    this.data.forEach(d=>{
      if(""+d.year==year && this.quarters[quarter].includes(d.month)){
        sales.monthlySales.push({month:d.month,sales:d.sales,profit:d.sales-d.expenses});
      }
    })

    return sales;
  }

}
