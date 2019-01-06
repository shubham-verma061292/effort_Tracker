var async = require('async');
var mysql_connect = require('../../config/database.js');
var excelbuilder = require('msexcel-builder');

var execute = function(params,cb){

    async.waterfall([
     function(next) {
          var req_startDate = [];
          var req_endDate = [];
          req_startDate = params.startdate.split('-');
          req_endDate = params.enddate.split('-');

          if (req_startDate[1] === "01"){
            req_startDate[1] = 'JAN';
          }
          else if (req_startDate[1] === "02"){
            req_startDate[1] = 'FEB';
          }
          else if (req_startDate[1] === "03"){
            req_startDate[1] = 'MARCH';
          }
            else if (req_startDate[1] === "04"){
            req_startDate[1] = 'APRIL';
          }
            else if (req_startDate[1] === "05"){
            req_startDate[1] = 'MAY';
          }
            else if (req_startDate[1] === "06"){
            req_startDate[1] = 'JUNE';
          }
            else if (req_startDate[1] === "07"){
            req_startDate[1] = 'JULY';
          }
            else if (req_startDate[1] === "08"){
            req_startDate[1] = 'AUG';
          }
            else if (req_startDate[1] === "09"){
            req_startDate[1] = 'SEP';
          }
            else if (req_startDate[1] === "10"){
            req_startDate[1] = 'OCT';
          }
            else if (req_startDate[1] === "11"){
            req_startDate[1] = 'NOV';
          }
            else if (req_startDate[1] === "12"){
            req_startDate[1] = 'DEC';
          }

           if (req_endDate[1] === "01"){
            req_endDate[1] = 'JAN';
          }
          else if (req_endDate[1] === "02"){
            req_endDate[1] = 'FEB';
          }
          else if (req_endDate[1] === "03"){
            req_endDate[1] = 'MARCH';
          }
            else if (req_endDate[1] === "04"){
            req_endDate[1] = 'APRIL';
          }
            else if (req_endDate[1] === "05"){
            req_endDate[1] = 'MAY';
          }
            else if (req_endDate[1] === "06"){
            req_endDate[1] = 'JUNE';
          }
            else if (req_endDate[1] === "07"){
            req_endDate[1] = 'JULY';
          }
            else if (req_endDate[1] === "08"){
            req_endDate[1] = 'AUG';
          }
            else if (req_endDate[1] === "09"){
            req_endDate[1] = 'SEP';
          }
            else if (req_endDate[1] === "10"){
            req_endDate[1] = 'OCT';
          }
            else if (req_endDate[1] === "11"){
            req_endDate[1] = 'NOV';
          }
            else if (req_endDate[1] === "12"){
            req_endDate[1] = 'DEC';
          }
          var param = [];
          var startDate = '%'+req_startDate[1]+'_'+req_startDate[0]+'%';
          var endDate = '%'+req_endDate[1]+'_'+req_endDate[0]+'%';
          var finalRequest = {};
          param.push(startDate);
          param.push(endDate);
          finalRequest.startDate = req_startDate[2].substring(0,2)+req_startDate[1];
          finalRequest.endDate = req_endDate[2].substring(0,2)+req_endDate[1];
          var response = {};
          var query = 'select * from timesheet_month where timesheet_id like ? or timesheet_id like ?';
           mysql_connect.execute(query,param,function(err,data){
            if(err){
            next(err,null);
             }
            else
            {
             response.params = finalRequest;
             response.timesheet_data = data;
             next(null,response);
            }
      })
       },

        function(timesheetData, next) {
          var response = {};
          response.timesheet = timesheetData.timesheet_data;
          response.req = timesheetData.params;
          employee_data(timesheetData, function(err, data){
            if(err){
              next(err,null);
            }
            else{
              response.employeeData = data;
              next(null,response);
            }
          });
        },
       function(res, next) {
            project_data(res,function(err,data){
                if(err){
                   next(err,null);
                }
                else{
                  res.project_details = data;
                  next(null,res);
                }
            })
        },
        function(res, next){
        var response ={};
        var resArray =[];
        var n = 0;
        var m = 0;
        var k = 0;
        var l = 0;
        console.log('this is the response@@@@@@@@@@@@@@@@@@@@@@@@@@@@'+JSON.stringify(res));
        for (n=0; n<res.timesheet.length;n++)
        {
            
            
        var unbilledRes = {};
        unbilledRes.accountName ='TD Bank';
        for (m=0; m<res.project_details.length;m++)
        {
        if (res.timesheet[n].project_id === res.project_details[m].project_id)
        {
          unbilledRes.pm =res.project_details[m].pm;
          unbilledRes.dm =res.project_details[m].adm;
          unbilledRes.lob =res.project_details[m].lob;
          unbilledRes.project_code =res.project_details[m].project_code;
          unbilledRes.project_name =res.project_details[m].project_name;
          unbilledRes.engagementType =res.project_details[m].engagement_type;
          unbilledRes.pmoProjectName =res.project_details[m].project_code;
          unbilledRes.currency = res.project_details[m].currency;
          unbilledRes.coreOrFlex =res.project_details[m].core_flex;

        }
      }
      for (k=0; k<res.employeeData.length; k++)
      {
            if(res.timesheet[n].employee_id === res.employeeData[k].employee_id)
            {
              unbilledRes.employee_id =res.employeeData[k].employee_id;//data[n].employee_id;
              unbilledRes.employeeName =res.employeeData[k].firstname +' '+res.employeeData[k].lastname;
              unbilledRes.sap =res.employeeData[k].sap_loss;
              unbilledRes.onOrOff =res.employeeData[k].location;
              if(res.employeeData[k].location === 'onsite')
              {
              unbilledRes.rateOnsite =res.employeeData[k].rate;;
              }
              if(res.employeeData[k].location === 'offshore')
              {
              unbilledRes.rateOffshore =res.employeeData[k].rate;;
              }
            }
      }
      var leaves1 = [];
            var leaves2 = [];
            var leaves3 = {};
      var x;
      var z =0;
      var y =0;
      var a=0;
      for(l=0; l<res.timesheet.length;l++){
          
        if((res.timesheet[n].timesheet_id === res.timesheet[l].timesheet_id)&&(res.timesheet[n].employee_id === res.timesheet[l].employee_id)&& (res.timesheet[n].project_id === res.timesheet[l].project_id)&&(res.timesheet[n].task_id === res.timesheet[l].task_id)){
            console.log('hi charlie ia mam her witk request &&&&&&&&&&&&&&&'+res.timesheet[l].employee_id+'  '+l+'  '+n);
            var sdate = parseInt(res.req.startDate.substring(0,3));
            var edate = parseInt(res.req.endDate.substring(0,3));
              var smonth = res.req.startDate.substring(2,7);
            var emonth = res.req.endDate.substring(2,7);

            console.log('this is end month condition@@@@@@@@@@@@@@@@@@@@@@@@@',res.timesheet[n].timesheet_id.substring(0,3)===emonth.trim());
            if(res.timesheet[l].timesheet_id.substring(0,3)===smonth.trim()){
                for(var b=sdate;b<=31;b++){
                    console.log('this is the data from start date    '+"day"+b+' : '+res.timesheet[n]["day"+b]);
                    leaves1.push(res.timesheet[l]["day"+b]);
               }
            }
            else if(res.timesheet[l].timesheet_id.substring(0,3)===emonth.trim()){
                 for(var e=edate;e>=1;e--){
                      console.log('this is the data from end date    '+"day"+e+' : '+res.timesheet[n]["day"+e]);
                     leaves2.push(res.timesheet[l]["day"+e]);
                }

            }
            /* for(x=0;x<leaves.length;x++){
                if(leaves[x] === '-1'){
                  y=y+1;
                }
              }
              for(x=0;x<leaves.length;x++){
                if(leaves[x] === '0'){
                  z=z+1;
                }
              }
                for(x=0;x<leaves.length;x++){
                if(leaves[x] != '0'){
                  a=a+1;
                }
              }
          unbilledRes.noOfLeaves = y;
          unbilledRes.actNoOfWorkDays = a;
          unbilledRes.NoofUnbWdaysOnsite = '';
          unbilledRes.NoofUnbWdaysOffshore = a-z;
          unbilledRes.uEffortsOffshore =(parseInt(a)*8.75)-((parseInt(y)*8.75));
          unbilledRes.totalOffUValue =parseInt(unbilledRes.uEffortsOffshore)*parseInt(unbilledRes.rateOffshore);*/
        }  
           
      }
 if(leaves1.length !=0){
             leaves3.startleaves=leaves1;
         }
         else if(leaves2.length !=0) {
             leaves3.endleaves=leaves2;
         } 
              
              unbilledRes.uEffortsOnsite ='';
              unbilledRes.totalOnUValue ='';
              unbilledRes.unbilledOnsiteBMM = '';
              unbilledRes.zcopOnsiteBMM = '';
              unbilledRes.gapOnsiteBMM = '';
              unbilledRes.unbilledOffshoreBMM = '';
              unbilledRes.zcopOffshoreBMM = '';
              unbilledRes.gapOffshoreBMM = '';
              unbilledRes.unbilledMonth = 'dec';
              unbilledRes.additionalRemarks = 'na';
              resArray.push(unbilledRes);
              console.log('This is the leave array@@@@@@'+JSON.stringify(leaves3));
      }
              response.SheetData = resArray;
              response.req = res.req;
              next(null,response);
        },
          function(finalResponse, next) {
              // var month  = [];
               //month = finalResponse.req.enddate.split('_');
               //var unbilledMonth = month[0].toUpperCase();
               var workbook = excelbuilder.createWorkbook('./', 'UnbilledData.xlsx');
               var Invoicesheet = workbook.createSheet('UnbilledData', 100, 120);
                Invoicesheet.set(1, 1, "Account name");
                Invoicesheet.set(2, 1, "Project code");
                Invoicesheet.set(3, 1, "PM");
                Invoicesheet.set(4, 1, "DM");
                Invoicesheet.set(5, 1, "LOB");
                Invoicesheet.set(6, 1, "Project Name");
                Invoicesheet.set(7, 1, "Engagement Type (T&M/FPP)");
                Invoicesheet.set(8, 1, "PMO Projetc Name");
                Invoicesheet.set(9, 1, "Emp ID");
                Invoicesheet.set(10, 1, "Emp Name");
                Invoicesheet.set(11, 1, "Sap Loss/Leave/Contractual Investment");
                Invoicesheet.set(12, 1, "No of Leaves");
                Invoicesheet.set(13, 1, "Onsite/Offshore");
                Invoicesheet.set(14, 1, "Unbilled efforts Onsite");
                Invoicesheet.set(15, 1, "Unbilled efforts Offshore");
                Invoicesheet.set(16, 1, "Onsite rate");
                Invoicesheet.set(17, 1, "Offshore rate");
                Invoicesheet.set(18, 1, "Total Onsite Unbilled Value");
                Invoicesheet.set(19, 1, "Total Offshore Unbilled Value");
                Invoicesheet.set(20, 1, "Unbilled Onsite BMM");
                Invoicesheet.set(21, 1, "Zcop Onsite BMM");
                Invoicesheet.set(22, 1, "GAP-Onsite BMM");
                Invoicesheet.set(23, 1, "Unbilled Offshore  BMM");
                Invoicesheet.set(24, 1, "Zcop Offshore BMM");
                Invoicesheet.set(25, 1, "GAP-Offshore BMM");
                Invoicesheet.set(26, 1, "Currency");
                Invoicesheet.set(27, 1, "No of  unbilled working days Onsite");
                Invoicesheet.set(28, 1, "No of  unbilled working days offshore");
                Invoicesheet.set(29, 1, "Acutal no of working days in "+unbilledMonth);
                Invoicesheet.set(30, 1, "Core,Flex");
                Invoicesheet.set(31, 1, "Unbilled Month");
                Invoicesheet.set(32, 1, "Addition Remarks");
                Invoicesheet.width(1,20);
                Invoicesheet.width(2,20);
                Invoicesheet.width(3,20);
                Invoicesheet.width(5,20);
                Invoicesheet.width(6,30);
                Invoicesheet.width(7,40);
                Invoicesheet.width(8,25);
                Invoicesheet.width(9,20);
                Invoicesheet.width(10,20);
                Invoicesheet.width(11,40);
                Invoicesheet.width(12,15);
                Invoicesheet.width(13,18);
                Invoicesheet.width(14,25);
                Invoicesheet.width(15,25);
                Invoicesheet.width(16,30);
                Invoicesheet.width(17,25);
                Invoicesheet.width(18,35);
                Invoicesheet.width(19,35);
                Invoicesheet.width(20,25);
                Invoicesheet.width(21,40);
                Invoicesheet.width(22,40);
                Invoicesheet.width(23,25);
                Invoicesheet.width(24,25);
                Invoicesheet.width(25,25);
                Invoicesheet.width(26,25);
                Invoicesheet.width(27,40);
                Invoicesheet.width(28,40);
                Invoicesheet.width(29,35);
                Invoicesheet.width(30,15);
                Invoicesheet.width(31,20);
                Invoicesheet.width(32,20);
                Invoicesheet.font(1, 1, {bold:'true'});
                Invoicesheet.font(2, 1, {bold:'true'});
                Invoicesheet.font(3, 1, {bold:'true'});
                Invoicesheet.font(4, 1, {bold:'true'});
                Invoicesheet.font(5, 1, {bold:'true'});
                Invoicesheet.font(6, 1, {bold:'true'});
                Invoicesheet.font(7, 1, {bold:'true'});
                Invoicesheet.font(8, 1, {bold:'true'});
                Invoicesheet.font(9, 1, {bold:'true'});
                Invoicesheet.font(10, 1,{bold:'true'});
                Invoicesheet.font(11, 1, {bold:'true'});
                Invoicesheet.font(12, 1, {bold:'true'});
                Invoicesheet.font(13, 1, {bold:'true'});
                Invoicesheet.font(14, 1, {bold:'true'});
                Invoicesheet.font(15, 1, {bold:'true'});
                Invoicesheet.font(16, 1, {bold:'true'});
                Invoicesheet.font(17, 1, {bold:'true'});
                Invoicesheet.font(18, 1, {bold:'true'});
                Invoicesheet.font(19, 1, {bold:'true'});
                Invoicesheet.font(20, 1, {bold:'true'});
                Invoicesheet.font(21, 1, {bold:'true'});
                Invoicesheet.font(22, 1, {bold:'true'});
                Invoicesheet.font(23, 1, {bold:'true'});
                Invoicesheet.font(24, 1, {bold:'true'});
                Invoicesheet.font(25, 1, {bold:'true'});
                Invoicesheet.font(26, 1, {bold:'true'});
                Invoicesheet.font(27, 1, {bold:'true'});
                Invoicesheet.font(28, 1, {bold:'true'});
                Invoicesheet.font(29, 1, {bold:'true'});
                Invoicesheet.font(30, 1, {bold:'true'});
                Invoicesheet.font(31, 1, {bold:'true'});
                Invoicesheet.font(32, 1, {bold:'true'});
                Invoicesheet.fill(3, 3, {bgColor:'92'});

                var i = 0 ;
                var j = 0 ;
        for( i = 0; i<finalResponse.SheetData.length;i++){

              Invoicesheet.set(1, i+2, finalResponse.SheetData[i].accountName);
              Invoicesheet.set(2, i+2, finalResponse.SheetData[i].project_code);
              Invoicesheet.set(3, i+2, finalResponse.SheetData[i].pm);
              Invoicesheet.set(4, i+2, finalResponse.SheetData[i].dm);
              Invoicesheet.set(5, i+2, finalResponse.SheetData[i].lob);
              Invoicesheet.set(6, i+2, finalResponse.SheetData[i].project_name);
              Invoicesheet.set(7, i+2, finalResponse.SheetData[i].engagementType);
              Invoicesheet.set(8, i+2, finalResponse.SheetData[i].pmoProjectName);
              Invoicesheet.set(9, i+2, finalResponse.SheetData[i].employee_id);
              Invoicesheet.set(10, i+2, finalResponse.SheetData[i].employeeName);
              Invoicesheet.set(11, i+2, finalResponse.SheetData[i].sap);
              Invoicesheet.set(12, i+2, finalResponse.SheetData[i].noOfLeaves);
              Invoicesheet.set(13, i+2, finalResponse.SheetData[i].onOrOff);
              Invoicesheet.set(14, i+2, finalResponse.SheetData[i].uEffortsOnsite);
              Invoicesheet.set(15, i+2, finalResponse.SheetData[i].uEffortsOffshore);
              Invoicesheet.set(16, i+2, finalResponse.SheetData[i].rateOnsite);
              Invoicesheet.set(17, i+2, finalResponse.SheetData[i].rateOffshore);
              Invoicesheet.set(18, i+2, finalResponse.SheetData[i].totalOnUValue);
              Invoicesheet.set(19, i+2, finalResponse.SheetData[i].totalOffUValue);
              Invoicesheet.set(20, i+2, finalResponse.SheetData[i].unbilledOnsiteBMM);
              Invoicesheet.set(21, i+2, finalResponse.SheetData[i].zcopOnsiteBMM);
              Invoicesheet.set(22, i+2, finalResponse.SheetData[i].gapOnsiteBMM);
              Invoicesheet.set(23, i+2, finalResponse.SheetData[i].unbilledOffshoreBMM);
              Invoicesheet.set(24, i+2, finalResponse.SheetData[i].zcopOffshoreBMM);
              Invoicesheet.set(25, i+2, finalResponse.SheetData[i].gapOffshoreBMM);
              Invoicesheet.set(26, i+2, finalResponse.SheetData[i].currency);
              Invoicesheet.set(27, i+2, finalResponse.SheetData[i].NoofUnbWdaysOnsite);
              Invoicesheet.set(28, i+2, finalResponse.SheetData[i].NoofUnbWdaysOffshore);
              Invoicesheet.set(29, i+2, finalResponse.SheetData[i].actNoOfWorkDays);
              Invoicesheet.set(30, i+2, finalResponse.SheetData[i].coreOrFlex);
              Invoicesheet.set(31, i+2, finalResponse.SheetData[i].unbilledMonth);
              Invoicesheet.set(32, i+2, finalResponse.SheetData[i].additionalRemarks);

        }
          workbook.save(function (ok,res) {
        if (ok){
          workbook.cancel();
          next('err',null);
        }
        else{
          next(null,finalResponse);
        }
      });
        }
    ],function(err, response) {
        if (err) {
            cb(err);
        } else {
            cb(null, response);
        }
    });
}

var employee_data = function(timesheetdata,cb){

            var query = 'select employee_id, firstname,lastname,sap_loss,location,work_location,rate from employee_details';
            var params = [];
                mysql_connect.execute(query,function(err,data){
                  if(err){
                          cb(err,null);
                        }
                  else
                       {
                        cb(null,data);
                       }
      });
}

var project_data = function(timesheetdata,cb){
            var query = 'select project_id,project_code,pm,adm,lob,project_name,currency,core_flex,engagement_type from project_details ';
                mysql_connect.execute(query,function(err,data){
                  if(err){
                          cb(err,null);
                          }
                  else
                       {
                        cb(null,data);
                       }
      });
}

exports.execute = execute;