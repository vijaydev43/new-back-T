const XLSX = require('xlsx');

module.exports = {
    excelExport: async (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const base64String = Buffer.from(excelFile).toString('base64');
        return base64String;
    }
}