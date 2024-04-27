import { Injectable } from '@angular/core';
import moment from 'moment';

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

  getProductExcel(data: Product[]) {
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

  async getImageBuffer(path: string) {
    const imgSrc = path;
    const response = await fetch(imgSrc);
    const buffer = await response.arrayBuffer();

    return buffer;
  }

  async exportExcel(data: Product[], fileName: string) {
    console.log(data);

    // Create a workbook
    const workbook = new ExcelJS.Workbook();
    // Create a sheet
    const worksheet = workbook.addWorksheet('products');
    // set column width
    this.setColumnWidth(worksheet, 'A', 25.63);
    this.setColumnWidth(worksheet, 'B', 11.63);
    this.setColumnWidth(worksheet, 'C', 11.63);
    this.setColumnWidth(worksheet, 'D', 9.13);
    this.setColumnWidth(worksheet, 'E', 6.38);
    this.setColumnWidth(worksheet, 'F', 44.88);

    // Refactor data to group them in category. object with the same
    // models should be grouped together
    const categoryGroup: ProductsExcel | null = this.getProductExcel(data);

    console.log('categoryGroup: ');
    console.log(categoryGroup);

    if (categoryGroup) {
      /*************************    Header  *************************/
      // Build quotation list with image
      let newRow = worksheet.addRow(['Quotation List']);
      let cell = newRow.getCell(1);
      // set row height
      newRow.height = 48;
      // format cell
      this.centerCell(cell);
      this.fontCell(cell, 28);

      // merge cell
      let currentRowIdx = worksheet.rowCount;
      const endColumnIdx = 6;
      worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
      // add logo
      const buffer = await this.getImageBuffer('assets/excel-logo.png');
      const logoImageId = workbook.addImage({
        buffer,
        extension: 'png',
      });
      worksheet.addImage(logoImageId, {
        tl: { col: 0.1125, row: 0.25 },
        ext: { width: 80, height: 40 },
      });

      /*************************    Contact  *************************/

      worksheet.mergeCells('A2', 'F5');
      const contactCell = worksheet.getCell('A2');
      const row = worksheet.lastRow;
      row ? (row.height = 33.75) : null;
      contactCell.value = {
        richText: [
          {
            font: {
              size: 16,
              name: 'Times New Roman',
              bold: true,
            },
            text: 'Shenzhen Exmight Digital Electronic Co.,Ltd\r\n',
          },
          {
            font: {
              size: 11,
              name: 'Times New Roman',
              bold: false,
            },
            text: "Add.:A1317, Tang shang, Bao'an District, Shenzhen, Guangdong, China\r\n",
          },
          {
            font: {
              size: 11,
              name: 'Times New Roman',
              bold: false,
            },
            text: 'Attn:Eva Zheng ; Mob/Whatsapp/Wechat:+86 15818715789;\r\n',
          },
          {
            font: {
              size: 11,
              name: 'Times New Roman',
              bold: false,
            },
            text: 'E-mail:  sales2@cnexmight.com ;  Web: https://cnexmight.en.alibaba.com',
          },
        ],
      };
      this.centerCell(contactCell);
      this.borderCell(contactCell);

      /*************************    Valid Date  *************************/
      const A6Cell = worksheet.getCell('A6');
      worksheet.mergeCells('A6', 'D6');
      A6Cell.value = 'Valid Date';
      this.centerCell(A6Cell);
      this.fontCell(A6Cell, 12, false);
      this.borderCell(A6Cell);
      const E6Cell = worksheet.getCell('E6');
      worksheet.mergeCells('E6', 'F6');
      E6Cell.value = moment().format('DD/MM/yyyy');
      this.centerCell(E6Cell);
      this.fontCell(E6Cell, 12, false);
      this.borderCell(E6Cell);
    }

    /*************************    Header  *************************/
    const headers = HEADERS_MATCHER_ARR.map((item) => item.sheetHeader);
    console.log(headers);
    const rowIdx = 7;
    const columnsArr = ['A', 'B', 'C', 'D', 'F'];
    headers.forEach((header, index) => {
      console.log(`${columnsArr[index]}${rowIdx}`);
      console.log(header);
      if (index === 3) {
        worksheet.mergeCells(`${columnsArr[index]}${rowIdx}`, `E${rowIdx}`);
      }
      const cell = worksheet.getCell(`${columnsArr[index]}${rowIdx}`);
      cell.value = header;
      this.centerCell(cell);
      this.fontCell(cell, 12, false);
      this.borderCell(cell);
      this.fillCell(cell);
    });

    /*************************    Products  *************************/

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

    // Save the workbook to a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  setColumnWidth(worksheet: ExcelJS.Worksheet, name: string, width: number) {
    const column = worksheet.getColumn(name);
    column.width = width;
    return column;
  }

  centerCell(cell: ExcelJS.Cell) {
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  }

  fontCell(
    cell: ExcelJS.Cell,
    size: number,
    bold = true,
    name = 'Times New Roman'
  ) {
    cell.font = {
      size,
      name,
      bold,
    };
  }

  borderCell(cell: ExcelJS.Cell) {
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
  }

  fillCell(cell: ExcelJS.Cell) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'FFFFFF00' },
    };
  }
}
