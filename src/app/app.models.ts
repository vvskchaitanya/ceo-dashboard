
export interface DataResponse {
    year: string,
    month: string,
    sales: number,
    investment: number,
    expenses: number,
    paychecks: number,
    taxes: number
}

export interface MonthlySalesData {
    month: string;
    sales: number;
    profit: number
}

export interface SalesData {
    year: string;
    quarter: string;
    monthlySales: MonthlySalesData[];
}

