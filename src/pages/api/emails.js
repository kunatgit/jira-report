import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'emaillist.txt');

    const data = await fs.readFile(filePath, 'utf-8');
    
    var emailList = []
    if(data){
      const lines = data.split('\n');
      lines.forEach((line, index) => {
        console.log(`Line ${index + 1}: ${line}`);
        if(line){
          emailList.push(line)
        }
      });
    }
    

    res.status(200).json({ success: true, data:emailList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาดในการอ่านไฟล์' });
  }
}