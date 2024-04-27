import { Injectable } from '@angular/core';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { Product, ProductExcel, ProductsExcel } from '../interfaces/product';
import { HEADERS_MATCHER_ARR } from '../constants/excel';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  formatStrToHtml(str: string) {
    return str.replaceAll('\\n', '<br>');
  }

  exportExcel(data: Product[], fileName: string) {
    console.log(data);

    // Create a workbook
    const workbook = new ExcelJS.Workbook();
    // Create a sheet
    const worksheet = workbook.addWorksheet('products');

    // Refactor data to group them in category. object with the same
    // models should be grouped together
    const categoryGroup: ProductsExcel | null = getProductExcel(data);

    console.log('categoryGroup: ');
    console.log(categoryGroup);

    if (categoryGroup) {
    }

    // Add

    // // Add headers
    // const headers = HEADERS_MATCHER_ARR.map((item) => item.sheetHeader);
    // console.log(headers);
    // worksheet.addRow(headers);

    // // Add data
    // data.forEach((item) => {
    //   const row: any = [];
    //   headers.forEach((header) => {
    //     const fieldName =
    //       HEADERS_MATCHER_ARR.find(
    //         (headerObj) => headerObj.sheetHeader === header
    //       )?.fieldName || '';

    //     row.push(item[fieldName]);
    //   });
    //   worksheet.addRow(row);
    // });

    // // Save the workbook to a blob
    // workbook.xlsx.writeBuffer().then((buffer) => {
    //   const blob = new Blob([buffer], {
    //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   });
    //   saveAs(blob, `${fileName}.xlsx`);
    // });
  }
}

function getProductExcel(data: Product[]) {
  let categoryGroup: ProductsExcel = {};

  if (data && data.length > 0) {
    data.forEach((item) => {
      const { modelNumber, ...parts } = item;

      if (categoryGroup[item.category]) {
        const existingProductExcel = categoryGroup[item.category].find(
          (productExcel) => productExcel.modelNumber === item.modelNumber
        );

        if (existingProductExcel) {
          existingProductExcel.items.push({
            ...parts,
          });
        } else {
          categoryGroup[item.category].push({
            modelNumber,
            items: [{ ...parts }],
          });
        }
      } else {
        categoryGroup[item.category] = [
          {
            modelNumber,
            items: [{ ...parts }],
          },
        ];
      }
    });
  }

  return Object.keys(categoryGroup).length > 0 ? categoryGroup : null;
}
