import axios from "axios";
import ExcelJS from 'exceljs';

function findTime(timmstring) {
  var time = parseInt(timmstring);
  var hours = Math.floor(time / 3600);
  var minutes = Math.floor((time % 3600) / 60);
  var seconds = time % 60;
  return hours + "ชม. " + minutes + "น. " + seconds + "วินาที"
}

async function handler(req, res) {
  var response = {}
  try {
    if (req.method === "POST") {
      const { host, apiToken, emailJira, startDate, endDate } = req.body;
      if (host && apiToken && emailJira && startDate && endDate) {
        const headers = {
          'Authorization': 'Basic ' + btoa(emailJira + ":" + apiToken),
        };

        var subtaskList = [];
        var worklogList = [];
        var url = host + '/rest/api/2/search?jql=worklogAuthor="' + emailJira + '" AND worklogDate >= "' + startDate + '" AND worklogDate <= "' + endDate + '"';
        await axios.get(url, { headers }).then(response => {
          console.log("[api/serach] call search data", response.data)
          var issues = response.data.issues
          console.log(issues)
          for (var i in issues) {
            subtaskList.push(issues[i].key)
          }
        }).catch(error => {
          console.log("[api/search] error call search : ", error)
          response = {}
          response.message = error.response.data;
          response.status = error.response.status
          res.status(response.status).json(response);
        });

        for (var i in subtaskList) {
          const url = host + "/rest/api/2/issue/" + subtaskList[i] + "/worklog";
          await axios.get(url, { headers }).then(response => {
            var worklogs = response.data.worklogs
            for (var j in worklogs) {
              var dateObj = new Date(worklogs[j]['started'])
              console.log("worklogs started ==> ",worklogs[j]['started'])
              console.log("date object ==> ",dateObj);

              var timeOptions = {timeZone: 'Asia/Bangkok',hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
              var timeStart = dateObj.toLocaleTimeString('th-TH', timeOptions);

              var date = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1).toString().padStart(2, '0') + '-' + dateObj.getDate().toString().padStart(2, '0');
              var obj = {
                "title": worklogs[j]['comment'] ? worklogs[j]['comment'] : "",
                "timeSpentSeconds": worklogs[j]['timeSpentSeconds'],
                "date": date,
                "useTime": findTime(worklogs[j]['timeSpentSeconds']),
                "subTaskID": subtaskList[i],
                "workLogID": worklogs[j]['id'],
                "timeStart": timeStart,
                "started": worklogs[j]['started'],
              }
              console.log("obj ==> ",obj)
              var start = new Date(startDate)
              var end = new Date(endDate)
              var da = new Date(date)
              if(da >= start && da <= end && emailJira == worklogs[j]['author']['emailAddress']){
                worklogList.push(obj)
              }
            }
          }).catch(error => {
            console.log("[api/issue] error call issue : ", error.response)
            response = {}
            response.message = error.response.data;
            response.status = error.response.status
            res.status(response.status).json(response);
          });
        }
        worklogList.sort((a, b) => new Date(a.started) - new Date(b.started));
        
        const dailySumMap = {};
        worklogList.forEach(item => {
          if (!dailySumMap[item.date]) {
            dailySumMap[item.date] = { useTime: 0, datas: [] };
          }
          dailySumMap[item.date].datas.push(item);
          dailySumMap[item.date].useTime += item.timeSpentSeconds;

        })

        var sumAll = 0
        var results = Object.keys(dailySumMap).map((date) => {
          sumAll = sumAll + dailySumMap[date].useTime
          return {
            date: date,
            useTime: dailySumMap[date].useTime,
            datas: dailySumMap[date].datas,
          }
        }).sort((a, b) => new Date(a.date) - new Date(b.date));


        // เขียนไฟล์
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        worksheet.addRow([
          'ลำดับ',
          'วันที่',
          'เวลาที่เริ่มทำ',
          'Sub Task',
          'เวลาที่ใช้',
          'เวลาที่ใช้ (วินาที)',
          'รายละเอียด',
          'ลิงค์'
        ]).font = { bold: true };

        for (let rowIndex = 0; rowIndex < worklogList.length; rowIndex++) {
          const element = worklogList[rowIndex];
          const linkWork = `${host}/browse/${element.subTaskID}?focusedWorklogId=${element.workLogID}`;

          const row = worksheet.addRow([
            rowIndex + 1,
            element.date,
            element.timeStart,
            element.subTaskID,
            element.useTime,
            element.timeSpentSeconds,
            element.title,
            { text: linkWork, hyperlink: linkWork },
          ]);
        }

        worksheet.eachRow((row, rowIndex) => {
          row.eachCell((cell, colIndex) => {
            if (rowIndex > 1 && (colIndex == 7 || colIndex == 8)) {
              cell.alignment = { wrapText: true, horizontal: 'left', vertical: 'middle' };
            } else {
              cell.alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
            }

            if (colIndex == 7) {
              console.log("1.8 * 80 = ", 1.8 * 80)
              console.log("cell.value = ", cell.value)
              console.log("cell.length = ", cell.value.length)
              var cellHeight = (cell.value.toString().split('\n').length || 1)
              console.log("cellHeight1 = ", cellHeight)
              if (cellHeight == 1) {
                cellHeight = cell.value.length
                if (cell.value.length < 30) {
                  cellHeight = 30
                }
              } else {
                cellHeight = cellHeight * 30
                cellHeight = cellHeight + 10
              }
              console.log("cellHeight2 = ", cellHeight)
              row.height = cellHeight
            }
          });

          // if(rowIndex != 1){
          //   row.height = 1.8 * 80
          // }
        });
        const columnWidths = [0.83, 1.26,1.26, 1.25, 1.66, 1.46, 3.18, 3.18];
        columnWidths.forEach((width, index) => {
          worksheet.getColumn(index + 1).width = width * 10; // คูณด้วย 10 เพื่อปรับให้เป็นหน่วย character width
        });

        worksheet.views = [
          { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2' },
        ];
        
        const buffer = await workbook.xlsx.writeBuffer();
        const base64File = buffer.toString('base64')
        
        response.message = "Verify API pass";
        response.status = 200
        response.data = results
        response.file = base64File
        response.sumAll = sumAll
      } else {
        response.message = "Bad request";
        response.status = 400
      }
    } else {
      response.message = "Method Not Allowed";
      response.status = 405
    }
  } catch (error) {
    console.log("[api/data] error : ", error)
    response = {}
    response.message = "Internal Server Error";
    response.status = 500
  }
  res.status(response.status).json(response);
}
export default handler;
