import ExcelJS from 'exceljs';

export default async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.addRow(['หัวข้อ 1', 'หัวข้อ 2']);
  worksheet.addRow(['ข้อมูล 1', 'ข้อมูล 2']);

  const buffer = await workbook.xlsx.writeBuffer();

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
  res.send(buffer);
};
