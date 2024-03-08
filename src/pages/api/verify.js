import axios from "axios";
import fs from 'fs';
import path from 'path';

const emailsFilePath = path.join(process.cwd(), '', 'emaillist.txt');

// ตรวจสอบว่าไฟล์ 'emails.txt' มีหรือไม่
if (!fs.existsSync(emailsFilePath)) {
  fs.writeFileSync(emailsFilePath, '', 'utf-8');
}

async function handler(req, res) {
  var response = {}
  try {
    if (req.method === "POST") {
      const { host, emailJira, apiToken } = req.body;
      if (host && apiToken && emailJira) {
        // if(emailJira == "jedsada.kho@thailife.com"){
        //   response = {}
        //   response.message = "Email jedsada.kho@thailife.com หน้าตาไม่ดี เจ้าชู้ ไม่มีสิทธิ์ใช้งานโปรแกรม กรุณาติดต่อ Admin";
        //   response.status = 401
        //   res.status(response.status).json(response);
        // }

        const headers = {
          'Authorization': 'Basic ' + btoa(emailJira + ":" + apiToken),
        };

        const url = host + '/rest/api/2/myself';
        console.log("[api/verify] call url : ", url)

        await axios.get(url, { headers }).then(call => {
          var data = call.data
          console.log("[api/verify] call myself data : ", data)
          if (data) {
            if (data.emailAddress == emailJira) {
              response.message = "Verify API pass";
              response.status = 200
              response.data = true
            }
          }
        }).catch(error => {
          console.log("[api/verify] error call myself : ", error.response)
          response = {}
          response.message = error.response.data;
          response.status = error.response.status
        });
      } else {
        response.message = "Bad request";
        response.status = 400
      }

    } else {
      response.message = "Method Not Allowed";
      response.status = 405
    }
  } catch (error) {
    console.log("[api/verify] error : ", error)
    response = {}
    response.message = "Internal Server Error";
    response.status = 500
  }

  // console.log("emailsFilePath = ", emailsFilePath)
  // let dataFile = fs.readFileSync(emailsFilePath, 'utf-8');
  // if (!dataFile.includes(req.body.emailJira)) {
  //   // เพิ่ม email ลงในข้อมูลที่อ่านได้
  //   var flag = "fail"
  //   if (response.data) {
  //     flag = "pass"
  //   }
  //   const formattedDateTime = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  //   dataFile += `${req.body.emailJira} : ` + flag + ` : ` + formattedDateTime + `\n`;
  //   // เขียนข้อมูลทั้งหมดกลับลงในไฟล์ .txt
  //   fs.writeFileSync(emailsFilePath, dataFile);
  // }
  
  res.status(response.status).json(response);
}
export default handler;
