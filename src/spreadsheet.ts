import { google as Google } from 'googleapis'

const API_KEY = process.env.GOOGLE_API_KEY

/**
 * get a 2-dimension array of data from a worksheet.
 * @param {string} spreadsheetId The id of the spreadsheet in which the worksheet is.
 * @param {string} sheetTitle The title of the worksheet.
 * @param {string} range The range desired. It should be in a valid range format, e.g. A3:E5.
 * If not specified, returns the data of the whole worksheet.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getSheetData(
  spreadsheetId: string,
  sheetTitle: string,
  range?: string,
): Promise<any[][]> {
  // Authorize a client with credentials, then call the Google Sheets API.
  return new Promise((resolve, reject) => {
    const sheets = Google.sheets({ version: 'v4', auth: API_KEY })
    sheets.spreadsheets.values.get(
      {
        spreadsheetId,
        range: range ? `${sheetTitle}!${range}` : sheetTitle,
      },
      (err, res) => {
        if (err) return reject('The API returned an error: ' + err)
        if (!res?.data?.values) return reject(`API response value error: ${res}`)
        resolve(res.data.values)
      },
    )
  })
}
