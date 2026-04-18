export class CSVExportService {
  
  // Physically formats WatermelonDB objects logically structuring clean CSV headers offline natively
  public buildCSVString(databaseArrays: Array<{ name: string, amount: number }>): string {
    let baseCSV = 'Expense_Name,Amount\n';
    
    databaseArrays.forEach(row => {
        baseCSV += `${row.name},${row.amount}\n`;
    });

    return baseCSV;
  }
}
