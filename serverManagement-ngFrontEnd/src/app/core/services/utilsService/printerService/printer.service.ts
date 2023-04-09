import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import * as xlsx from 'xlsx';



@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor() { }

  printToPDF(data: any, fileName: string) {
    /* create a pdf with format options : can be customized LATER */
    let pdf = new jsPDF('l', "pt", 'a3');
    pdf.html(data, { callback: (pdf) => { pdf.save(fileName) }, });
  }

  printToEXCEL(data: any, fileName: string) {
    /* generate a workSheet and populate it with table data */
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(data);

    /* generate a workbook and add the worksheet to it */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName)
  }


}
