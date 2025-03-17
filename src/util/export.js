import * as XLSX from 'xlsx';
import saveAs from 'file-saver';

export const exportExcel = async (response) => {
  try {
    if (!response.headers['content-disposition']) {
      throw new Error('Content-Disposition header not found in the response.');
    }

    let disposition = response.headers['content-disposition'];
    let fileName = decodeURIComponent(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length));

    const dataAsString = new TextDecoder('utf-8').decode(new Uint8Array(response.data));
    const wb = XLSX.read(dataAsString, { type: 'binary' });
    const ws = wb.Sheets[wb.SheetNames[0]];

    // Further process the workbook, e.g., convert it to JSON
    const jsonData = XLSX.utils.sheet_to_json(ws);

    // Process jsonData here, if needed

    // Convert JSON data back to XLSX format
    const processedWorkbook = XLSX.utils.book_new();
    const processedWorksheet = XLSX.utils.json_to_sheet(jsonData);

    XLSX.utils.book_append_sheet(processedWorkbook, processedWorksheet, 'Sheet1', { encoding: 'utf-8' });

    // Use FileSaver.js to save the file
    const binaryString = XLSX.write(processedWorkbook, { bookType: 'xlsx', bookSST: false, type: 'array' });

    const text = new TextDecoder().decode(binaryString);

    const blob = new Blob([binaryString], { type: 'text/csv;charset=utf-8' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }

    // saveAs(blob, fileName, { type: 'application/octet-stream' });

    XLSX.writeFile(processedWorkbook, fileName, { bookType: 'xlsx', bookSST: true, type: 'buffer' });

    console.log('File exported successfully:', fileName);
  } catch (error) {
    console.error('Error exporting Excel file:', error.message);
    // Handle the error appropriately
  }
}
