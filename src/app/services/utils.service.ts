import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// import { Buffer } from 'buffer';
// import { get } from 'https';
// import fetc} from 'node-fetch';

import { Product, ProductExcel, ProductsExcel } from '../interfaces/product';
import { HEADERS_MATCHER_ARR } from '../constants/excel';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private currencyPipe: CurrencyPipe) {}

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
    // console.log(response);

    const buffer = await response.arrayBuffer();

    return buffer;
  }

  async exportExcel(data: Product[], validDate: string, fileName: string) {
    // Create a workbook
    const workbook = new ExcelJS.Workbook();
    // Create a sheet
    const worksheet = workbook.addWorksheet('gebra-products');
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

    // console.log('categoryGroup: ');
    // console.log(categoryGroup);

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
      E6Cell.value = moment(validDate).format('DD/MM/yyyy');
      this.centerCell(E6Cell);
      this.fontCell(E6Cell, 12, false);
      this.borderCell(E6Cell);

      /*************************    Header  *************************/
      const headers = HEADERS_MATCHER_ARR.map((item) => item.sheetHeader);
      // console.log(headers);
      const rowIdx = worksheet.rowCount + 1;
      const columnsArr = ['A', 'B', 'C', 'D', 'F'];
      headers.forEach((header, index) => {
        // console.log(`${columnsArr[index]}${rowIdx}`);
        // console.log(header);
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
      for (const [category, productExcels] of Object.entries(categoryGroup)) {
        // console.log('category: ', category);
        // console.log('productExcel: ', productExcels);

        // Insert category
        worksheet.addRow([category]);
        const rowIdx = worksheet.rowCount;
        const row = worksheet.getRow(rowIdx);
        row.height = 52;
        worksheet.mergeCells(`A${rowIdx}:F${rowIdx}`);
        const cell = worksheet.getCell(`A${rowIdx}`);
        this.centerCell(cell);
        this.fontCell(cell, 20);
        this.borderCell(cell);
        this.fillCell(cell);

        // Insert Product
        for (let i = 0; i < productExcels.length; i++) {
          let productStartIdx = worksheet.rowCount + 1;
          const productExcel = productExcels[i];
          const { modelNumber, items } = productExcel;
          const productEndIdx = productStartIdx + items.length - 1;
          const pictureUrl =
            productExcel.items.find((obj) => obj.pictureUrl != null)
              ?.pictureUrl || '';

          const buffer = await this.getImageBuffer(pictureUrl);
          // const base64: any = await this.getBase64ImageFromUrl(pictureUrl);
          const productImageId = workbook.addImage({
            buffer,
            // base64: base64,
            extension: 'jpeg',
          });

          // const imageResp = await axios.get(pictureUrl);
          // console.log(imageResp.data);
          // const imageBuffer = '';

          items.forEach((item, itemIdx) => {
            const usdPriceObj = item.prices.find(
              (price) => price.currency.toLowerCase() === 'usd'
            );
            const rmbPriceObj = item.prices.find(
              (price) => price.currency.toLowerCase() === 'cny'
            );

            const capacityText = item.capacity.replaceAll('\\n', '\t\n');
            console.log('capacityText: ', capacityText);

            worksheet.addRow([
              items.length === 1 || itemIdx === 0 ? '' : '',
              items.length === 1 || itemIdx === 0 ? modelNumber : '',

              item.capacity.replaceAll('\\n', '\t\n'),
              rmbPriceObj
                ? this.currencyPipe
                    .transform(
                      rmbPriceObj.price,
                      rmbPriceObj.currency.toUpperCase(),
                      'symbol',
                      '1.2-2'
                    )
                    ?.replace('CN', '')
                : '',
              usdPriceObj
                ? this.currencyPipe.transform(
                    usdPriceObj.price,
                    usdPriceObj.currency.toUpperCase(),
                    'symbol',
                    '1.2-2'
                  )
                : '',
              item.description.replaceAll('\\n', '\t\n'),
            ]);
          });

          // Style cells
          // Picture Url
          // console.log('productStartIdx: ', productStartIdx);
          // console.log('productEndIdx: ', productEndIdx);

          if (items.length > 1) {
            worksheet.mergeCells(`A${productStartIdx}:A${productEndIdx}`);
          }

          if (items.length === 1) {
            worksheet.addImage(
              productImageId,
              {
                tl: {
                  col: 0.999,
                  row: productStartIdx - 1 + 0.999,
                },
                ext: { width: 130, height: 150 },
              }
              // `A${productStartIdx}:A${productStartIdx}`
            );
          } else if (items.length > 1) {
            worksheet.addImage(
              productImageId,
              {
                tl: { col: 0, row: productStartIdx - 1 },
                ext: { width: 130, height: 150 },
              }
              // `A${productStartIdx}:A${productStartIdx}`
            );
          }

          const pictureCell = worksheet.getCell(`A${productStartIdx}`);

          // console.log('pictureCell.$col$row: ', pictureCell.$col$row);

          this.centerCell(pictureCell);
          this.borderCell(pictureCell);

          // Model Url
          if (items.length > 1) {
            worksheet.mergeCells(`B${productStartIdx}:B${productEndIdx}`);
          }
          const modelNumberCell = worksheet.getCell(`B${productStartIdx}`);
          // console.log(modelNumberCell.value);
          this.centerCell(modelNumberCell);
          this.fontCell(modelNumberCell, 12, false);
          this.borderCell(modelNumberCell);

          // Capacity, Price and Description
          for (let i = productStartIdx; i <= productEndIdx; i++) {
            const columnsArr = ['C', 'D', 'E', 'F'];
            columnsArr.forEach((letter) => {
              const cell = worksheet.getCell(`${letter}${i}`);
              this.centerCell(cell);
              this.fontCell(cell, 12, letter !== 'F');
              this.borderCell(cell);
            });
          }

          // TODO: increase row height
          // const currentRow = worksheet.getRow(worksheet.rowCount);
          // console.log('currentRow: ', currentRow);
          // console.log('rowHeight: ', currentRow.height);
          // currentRow.height = currentRow.height + 200;
          // console.log('rowHeight: ', currentRow.height);
        }
      }
    }

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
      fgColor: { argb: 'FFEEEEEE' },
    };
  }

  // urlToBuffer(imageUrl: string) {
  //   fetch(imageUrl)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(
  //           `Failed to fetch the image. Status code: ${response.status}`
  //         );
  //       }
  //       return response.buffer();
  //     })
  //     .then((imageBuffer) => {
  //       // The 'imageBuffer' now contains the binary data of the image.
  //       console.log('Image data buffered successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching the image:', error);
  //     });
  // }

  async getBase64ImageFromUrl(imageUrl: string) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
}
