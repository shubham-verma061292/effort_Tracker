'use strict';
var mysql_connect = require('../../config/database.js');
var dateformat = require('dateformat');
var excelbuilder = require('msexcel-builder');
var moment= require('moment');
var laborexcel=require('./laborexcel');
var unbilledexcel=require('./unbilledexcel');
var async = require('async');
var query = '';
var req = {};
var find = function (cb) {
  console.log('Inside.....effort');
  var effort = {
    text: "sunday"
  }
  var efforts = [];
  efforts.push(effort);
  cb(null, efforts)
}

var create = function (params, cb) {
  console.log('........111111' + JSON.stringify(params));
  cb(null, params);
}

var login = function (params, cb) {
  var param = {};
  param.Employee_Id = params.empid;
  param.Password = params.password;
  var query = 'select Password,Status,Role from employee_details where Employee_Id = "' + param.Employee_Id + '" and Password = "' + param.Password + '"';
  console.log("...........",query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("cannot connect to mysql ", err);
      cb(err);
    }
    else {
      console.log(result);
      if (result.length > 0) {
        var response = {};
        response.emp_id = param.Employee_Id;
        response.role = result[0].Role;
        console.log(result[0].Role);
        cb(null, response);
      }
      else {
        var response="invalid";
        cb(null, response);
      }
    }
  });
}
//Leaves Apply
var leaves = function (params, cb) {
  var id = JSON.stringify(params.Employee_Id);
  var type = JSON.stringify(params.Leave_Type);
  var from_date = JSON.stringify(params.from_date);
  var convert_start = dateformat(from_date, "isoDate");
  var start = convert_start.toString();

  var to_date = JSON.stringify(params.to_date);
  var convert_end = dateformat(to_date, "isoDate");
  var end = convert_end.toString();
  console.log(">>>>>>>>>>>>>>>>>>" + end);
  console.log(">>>>>>>>>>>>>>>>>>" + start);
  //query = 'insert into leaves values("an337690","planned sick leave","2017-5-12","2017-6-5")';
  query = 'insert into effort_tracker.leaves values(' + id + ',' + type + ',"' + start + '","' + end + '")';
  console.log("------", query);
  params = {}
  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      console.log("inside excute query error>>>>>>>>> ", err);
      cb(err);
    }
    else {
      cb(null, "successful");
    }
  })
}
//generate reprt by month
var showleave = function (params, cb) {
  var param = {};
  var month = params.body.month;
  var Months = { "JAN": 1, "FEB": 2, "MAR": 3, "APR": 4, "MAY": 5, "JUN": 6, "JUL": 7, "AUG": 8, "SEP": 9, "OCT": 10, "NOV": 11, "DEC": 12 };
  var cmonth = Months[month];
  var query = 'select * from effort_tracker.leaves where MONTH(Start_Date)="' + cmonth + '"';
  console.log("0000000000", query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing leaves generation query", err);
    } else {
      var workbook = excelbuilder.createWorkbook('./', 'LeaveReport.xlsx');
      var Leavesheet = workbook.createSheet('Leavesheet', 10, 12);
      Leavesheet.set(1, 1, "Employee_Id");
      Leavesheet.set(2, 1, "Leave_Type");
      Leavesheet.set(3, 1, "Start_date");
      Leavesheet.set(4, 1, "End_date");
      var i = 1, j, res;
      for (j = 0; j < result.length; j++) {
        res = result[j];
        i = 1;
        for (var key in res) {
          if (res.hasOwnProperty(key)) {
            if (key == 'Start_Date' || key == 'End_Date')
              res[key] = dateformat(res[key], "isoDate");

            Leavesheet.set(i, j + 2, res[key]);
          }
          i++;
        }
      }
      workbook.save(function (ok) {
        if (!ok)
          workbook.cancel();
        else
          console.log('congratulations, your workbook created');
      });
      cb(null, result);
    }
  });
}
var generate_timesheet_id = function(param,date1,cb){

      var emp_id={};
      emp_id=param;
      console.log(emp_id);
      var id={};
      for(var i=0;i<date1.length ;i++)
      {
          var date2 =  date1[i].split(" ");
          id[i] = date2[1]+"_"+date2[3]+"_"+emp_id;
      }
      console.log(">>>>>>>>>>>>>>>>>>>>>>>ID issssssss"+JSON.stringify(id));
      cb(null,id);
    }

var check_timesheet = function(id, date2, cb){
    console.log("--------inside check timesheet method----->");
    query = 'select count(*) as count from effort_tracker.timesheet_employee where Timesheet_Id like "'+id+'"';
    console.log(query);
    mysql_connect.execute(query, id, function (err, result) {
          if (err) {
              console.log("inside excute query error>>>>>>>>> ",err);
              cb(err,null);
          }
          else{
            console.log('going to next query');
              var par = id.split("_");
              console.log('Result is'+ JSON.stringify(result));
              if(result[0].count<1)
              {
              query = 'insert into effort_tracker.timesheet_employee values("'+id+'","'+par[2]+'","'+par[0]+'","'+par[1]+'")';
              console.log(query);
              par ={}
              mysql_connect.execute(query, par, function (err, result) {
              if (err) {
                cb(err);
              }
              else {
                cb(null, "successful");
              }
              })
              cb(null, "successful");
          }
          else{
            cb(null, "successful");
          }

        }
  });
}
//Submittig efforts --ned
 exports.submit_effort = function(params,cb){
  var date1=(params[0].headerNames);
  var emp_id=params[0].Employee_Id;
  var unmatch_id={};
  var count=1;
  var k=1;
  async.waterfall([
    function(next){
      generate_timesheet_id(emp_id,date1,function(err,result){
      if(err)
      {
        console.log("error");
        return next(err, null);
      }
      else{
              next(null, result);
            }
      })
    },
    function(result,next){
      async.waterfall([
        function(next){
      check_timesheet(result[0], date1, function(err, response){
        console.log("Value Of Resp is ... ***** "+JSON.stringify(response));
                     if(err){
                             console.log("Error");
                     }
                     else{
                       console.log("In NEt");
                       next(null, result);
                     }
               })
             },
             function(result,next){
                          var flag = false;
                                  if(result[0]!==result[6]) {
                                      console.log('Value is 6' );
                                        check_timesheet(result[6], date1, function(err, response){
                                              console.log("Value Of Resp is ... ***** "+JSON.stringify(response));
                                              if(err){
                                                      console.log("Error");
                                              }
                                              else{
                                                    console.log('Inside Flag initiate ******');
                                                    flag = true;
                                                    console.log(flag);
                                                    console.log('Value is  6 ');
                                                    next(null, result);
                                              }
                                        })
                                  }else{
                                     next(null, result);
                                  }
                                }
                              ], function(err, result){
                            			if(err){
                            				console.log('Error while executing async waterfall,', err);
                            				cb(err);
                            			}else{
                            				next(null, result);
                            			}
                            		})
    },
    function(resultData,next){
      for(var i=0;i<params.length;i++)
       {
         query='';
         var day1=0,day2=0,day3=0,day4=0,day5=0,day6=0,day7=0;
         var query1='select * from effort_tracker.timesheet_month';
           for(var j=0;j<7;j++)
            {
              (function(params,i,resultData,j){
                async.waterfall([
                function(next){
                var prev_date = resultData[j].split('_');
                var act_date_id=resultData[j].split('_');
                var temp_act_date_id=resultData[0].split('_');  //jan   generate id
                var act_date = date1[j].split(' ');   //jan   browser ......
                console.log('Timeshhet id-------' + resultData[j]);
                if(j>1)
                {
                  prev_date =  resultData[j-1].split('_');
                }
                console.log(' Act data id ' + act_date_id[0]);
                console.log(' Act data ' + act_date[1]);
                console.log(' Temp data ' + temp_act_date_id[0]);
                if(j===1 || (act_date_id[0]===act_date[1] && prev_date[0]!==act_date_id[0]))
                {
                  console.log('Timeshhet id' + resultData[j]);
              var count_query='select count(*) as count from effort_tracker.timesheet_month where timesheet_id like "' +resultData[j]+'" and project_id like "' +params[i].Project_Id+'" and task_id like "' +params[i].Task_Id+'"';
              mysql_connect.execute(count_query, params, function (err, res1) {
                if (err) {
                console.log("inside excute query error>>>>>>>>> ",err);

                }
                else {
                  console.log('Result date is ' + JSON.stringify(resultData) + ' ' +j);
                    console.log('New date '+res1[0].count  + ' ' + JSON.stringify(res1) +' ' + j);
                    count = res1[0].count;
                    console.log('Console data is -------count --' +count);
                    next(null, count);
                }
              })
            }else{
              var count_query='select count(*) as count from effort_tracker.timesheet_month where timesheet_id like "' +resultData[j]+'" and project_id like "' +params[i].Project_Id+'" and task_id like "' +params[i].Task_Id+'"';
              mysql_connect.execute(count_query, params, function (err, res1) {
                if (err) {
                console.log("inside excute query error>>>>>>>>> ",err);

                }
                else {
                  console.log('Result date is ' + JSON.stringify(resultData) + ' ' +j);
                    console.log('New date '+res1[0].count  + ' ' + JSON.stringify(res1) +' ' + j);
                    count = 1;
                    console.log('Console data is -------count --' +count);
                    next(null, count);
                }
              })
            }
          },
          function(count,next)
          {
              var act_date_id=resultData[j].split('_');
              var temp_act_date_id=resultData[0].split('_');  //jan   generate id
              var act_date = date1[j].split(' ');     //jan   browser ......
              var temp_param=params[i];
              console.log(count);
              var tact_date = act_date[0] +' '+ act_date[1] +' '+ act_date[2] +' '+ act_date[3];
              (function(act_date,temp_param,params,i,resultData,j,tact_date,count){
                  if(count < 1)
                  {
                     console.log('count-------------------------------------------------------->>>>>>>>>>> '+count);
                      console.log('New date '+tact_date);
                      query = 'insert into effort_tracker.timesheet_month (timesheet_id , employee_id , project_id ,task_id) values ("'+resultData[j]+'", "'+params[i].Employee_Id+'","'+params[i].Project_Id+'","'+params[i].Task_Id+'" )';
                      console.log(query);
                      mysql_connect.execute(query, params, function (err, result) {
                      if (err) {
                        console.log('Hi there ------------------000000000000000');
                      console.log("inside excute query error>>>>>>>>> ",err);
                      cb(err);
                      }
                      else {
                          console.log('Hi there ------------------11111111111111');
                            query1 ="update effort_tracker.timesheet_month set day"+act_date[2]+"="+ temp_param[tact_date] +" where timesheet_id like '" +resultData[j]+"' and project_id like '"+params[i].Project_Id +"' and task_id like '"+params[i].Task_Id +"'";
                            console.log(query1);
                            mysql_connect.execute(query1, params, function (err, result) {
                            if (err) {
                            console.log("inside excute query error>>>>>>>>> ",err);

                          }else{
                            console.log('Success in update');
                          }
                      });
                    }
                  });
                  }else{
                    if(temp_param[tact_date] != undefined){
                      var dummy_query = "select * from effort_tracker.timesheet_month";
                      mysql_connect.execute(dummy_query, params, function (err, result) {
                        if (err) {
                        console.log("inside excute query error>>>>>>>>> ",err);
                        cb(err);
                        }else{
                          query1 ="update effort_tracker.timesheet_month set day"+act_date[2]+"="+ temp_param[tact_date] +" where timesheet_id like '" +resultData[j]+"' and project_id like '"+params[i].Project_Id +"' and task_id like '"+params[i].Task_Id +"'";
                          console.log(query1);
                          mysql_connect.execute(query1, params, function (err, result) {
                            if (err) {
                            console.log("inside excute query error>>>>>>>>> ",err);

                            }else{
                              console.log('Success in update');
                            }
                          });
                        }
                      });

                  }
                  }
          })(act_date,temp_param,params,i,resultData,j,tact_date,count);
            }
          ], function(err, result){
              if(err){
                console.log('Error while executing async waterfall,', err);

              }else{
                next(null, result);
              }
            })
                })(params,i,resultData,j);


            }
                              // console.log("ProjectName Value is --- "+freshparamtemp.Project_Name);
                              //   query = 'insert into effort_tracker.timesheet (Timesheet_Id, employee_id , Project_Name, Task_Id, , , , , , , ) values("'+id[i]+'",'+JSON.stringify(freshdate2)+',"'+freshparamtemp.Project_Name+'","'+freshparamtemp.Task_Id+'","'+freshparamtemp[freshdate2]+'")';
                              //   console.log("query Is         ------   "+query);
                              //    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<inside submit efforts>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                              //       params ={}
                              //       mysql_connect.execute(query, params, function (err, result) {
                              //       if (err) {
                              //       console.log("inside excute query error>>>>>>>>> ",err);
                              //       cb(err);
                              //       }
                              //       else {
                              //       cb(null,"successful");
                              //       }
                              //       });
       }
    }
  ], function(err, result){
			if(err){
				console.log('Error while executing async waterfall,', err);
				cb(err);
			}else{
				cb(null,"successful");
			}
		})
}
 exports.gen_effort_sheet = function (params, cb) {
  var param = {};
//   SELECT COUNT(*) as stat_count
// FROM `table`
// WHERE YEAR(date_field) = 2012
//   AND MONTH(date_field) = 3
 var month = params.body.month;
 var Months ={"JAN":1,"FEB":2,"MAR":3,"APR":4,"MAY":5,"JUN":6,"JUL":7,"AUG":8,"SEP":9,"OCT":10,"NOV":11,"DEC":12};
 var  cmonth = Months[month];
 var main_result;
 async.waterfall([
   function(next){
     var query ='select employee_id from employee_details';
     mysql_connect.execute(query, param, function (err, result) {
       if (err) {
         console.log("error executing leaves generation query", err);
         return cb(err, null);
       }else {
            console.log(JSON.stringify(result));
             next(null, result);
    }
  })
   },
    function(result,next){
      var query ='select a.firstname, a.lastname,a.team, b.day1,b.day2,b.day3,b.day4,b.day5,b.day5,b.day6,b.day7,b.day8,b.day9,b.day10,b.day11,b.day12,b.day13,b.day14,b.day15,b.day16,b.day17,b.day18,b.day19,b.day21,b.day22,b.day23,b.day24,b.day25,b.day26,b.day27,b.day28,b.day29,b.day30,b.day31, c.project_name, c.project_id, c.fundee, c.cost_center, d.task_id, d.task_name from employee_details a, timesheet_month b,project_details c, task_details d where b.project_id=c.project_id and b.task_id=d.task_id;';
                 mysql_connect.execute(query, param, function (err, result) {
                   if (err) {
                     console.log("error executing leaves generation query", err);
                     return cb(err, null);
                   } else {
                     var workbook = excelbuilder.createWorkbook('./', 'EffortTracker.xlsx');
                     var Effortsheet = workbook.createSheet('IT3.0', 1000, 1000);
                     console.log("---Executing 1---------");
                     var i = 1,j,res, name;
                     Effortsheet.set(1, 1, "Resource Name");
                     Effortsheet.set(2, 1, "Work Order Track");
                     Effortsheet.set(3, 1, "Project Name");
                     Effortsheet.set(4, 1, "Project ID");
                     Effortsheet.set(5, 1, "Task Name");
                     Effortsheet.set(6, 1, "Task ID");
                     Effortsheet.set(7, 1, "Funded");
                     Effortsheet.set(8, 1, "Cost Centre");
                     Effortsheet.set(9, 1, "Total");
                     for(j=1;j<10;j++)
                     Effortsheet.font(j, 1, {sz:'11',bold:'true'});
                     for(var k=1;k<32;k++)
                     {
                       var date =  k + "Jan";
                       console.log(date);
                     Effortsheet.set(9 + k, 1, date);
                   }
                     for(j=0;j<result.length;j++){

                     //Effortsheet.fill(j+1,1, {type:'solid',fgColor:'8',bgColor:'64'});
                     res = result[j];
                     console.log(res);
                     name = res['firstname'] + ' ' +res['lastname'] ;
                     Effortsheet.set(1, 2+ j, name);
                     console.log(name);
                     Effortsheet.set(2, 2+j, res['team']);
                     Effortsheet.set(3, 2+j, res['project_name']);
                     Effortsheet.set(4, 2+j, res['project_id']);
                     Effortsheet.set(5, 2+j, res['task_name']);
                     Effortsheet.set(6, 2+j, res['task_id']);
                     Effortsheet.set(7, 2+j, res['fundee']);
                     Effortsheet.set(8, 2+j, res['cost_center']);
                     i=10;
                     for (var key=1;key<32;key++) {
                       var new_key = 'day'  + key;
                       Effortsheet.set(i,2+j, res[new_key]);
                     i++;
                   }
                   }
                   workbook.save(function (ok) {
                     if (!ok)
                       workbook.cancel();
                     else
                       console.log('congratulations, your workbook created');
                   });
                   cb(null, result);

                   }
                 })
    }
 ], function(err, result){
     if(err){
       console.log('Error while executing async waterfall,', err);
       cb(err);
     }else{
       cb(null,"successful");
     }
   })
}


var select_month = function (params, cb) {
  var param = {};
  params = params.body;
  var query = 'select Interval_Time from timesheet_interval where Month = "' + params.month + '"';
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing find month query", err);
    }
    else {
      cb(null, result);
    }
  })
}

var get_project = function (params, cb) {
  var param = {};
  params = params.body.Employee_Id;
  var query = 'select a.Employee_Id, a.Project_Id,a.Task_Id, b.Project_Name, c.Task_Name from employee_task_project_relation a, project_details b,task_details c where a.Employee_Id="' + params + '" and a.Project_Id=b.Project_Id and a.Task_Id=c.Task_Id;'
  console.log(query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing get project_details query", err);
    }
    else {
      cb(null, result);
    }
  })
}

var registration = function (params, cb) {
console.log(JSON.stringify(params.body)+'inside effort of db');
  var param = {};
  param.Employee_Id = params.body.empid;
  param.Firstname = params.body.firstname;
  param.Lastname = params.body.lastname;
  param.Designation = params.body.designation;
  param.Password = params.body.password;
  param.Status = params.body.status;
  param.Role = params.body.role;
  param.team=params.body.team;
  param.rate=params.body.rate;
  param.acf2id=params.body.acf2id;
  param.res_startdate=params.body.startdate;
  param.res_enddate=params.body.enddate;
  param.role_grouping=params.body.rolegrouping;
  param.skill_premium=params.body.skillpremium;
  param.skill_profile=params.body.skillprofile;
  param.technology=params.body.technology;
  param.profile_skills=params.body.profileskills;
  param.location=params.body.location;
  param.work_location=params.body.worklocation;
  param.work_permit_category=params.body.work_permit_category;
  param.shift_addrs=params.body.shift_addrs;
  param.wipro_mailid=params.body.wipro_mailid;
  param.td_mailid=params.body.td_mailid;
  param.departure_date=dateformat((params.body.departure_date).toString(), "isoDate");

  query = 'insert into employee_details SET ?';
  console.log("at right position@@@@@@" + JSON.stringify(param));
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to post data");
    }
    else {
      console.log("Data Posted successfully");
    }
    cb(null, params);
  })

}


//Add Task
var add_task = function (params, cb) {
  console.log("inside add task.........");
  var id = JSON.stringify(params.Task_Id);
  var name = JSON.stringify(params.Task_Name);
    var startdate=[];
    startdate=JSON.stringify(params.Task_StartDate).split('T');
    var sdate=startdate[0]+'"';
    console.log("start date inside...", sdate);
    var enddate=[];
    enddate = JSON.stringify(params.Task_EndDate).split('T');
    var edate=enddate[0]+'"';
  console.log('last call..............'+edate);
  var date = [];
  //var enddate = dateformat(to_date, "isoDate");
  console.log("date..................",sdate);
  console.log("enddate..................",edate);
  var status = JSON.stringify(params.Status);
  console.log("status.......................",status);
  // query = 'insert into task_Details values("sf","fsfs","fsfsfsfs","2017-04-03","2017-05-02")';
  query = 'insert into Task_Details values(' + id + ',' + name + ',' + status + ',' + sdate + ',' + edate + ')';
  console.log("----", query);
  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
      cb(null, result);
    }
  })
}


//generate report by interval
// var generateReport = function (params, cb) {
//   var param = {};
//   var from_date = JSON.stringify(params.from_date);
//   var start = dateformat(from_date, "isoDate");
//   var to_date = JSON.stringify(params.to_date);
//   var end = dateformat(to_date, "isoDate");
//   console.log(">>>>>>>>>>>>>>>>>>date",end)
//   var query = 'select * from effort_tracker.leaves where Start_Date>="' + start + '" AND End_Date<="' + end + '";'
//   mysql_connect.execute(query, param, function (err, result) {
//     if (err) {
//       console.log("error executing leaves generation query", err);
//     } else {
//       var workbook = excelbuilder.createWorkbook('./', 'midReport.xlsx');
//       var Leavesheet = workbook.createSheet('Leavesheet', 10, 12);
//       Leavesheet.set(1, 1, "Employee_Id");
//       Leavesheet.set(2, 1, "Leave_Type");
//       Leavesheet.set(3, 1, "Start_date");
//       Leavesheet.set(4, 1, "End_date");
//       var i = 1, j, res;
//       for (j = 0; j < result.length; j++) {
//         res = result[j];
//         i = 1;
//         for (var key in res) {
//           if (res.hasOwnProperty(key)) {
//             if (key == 'Start_Date' || key == 'End_Date')
//               res[key] = dateformat(res[key], "isoDate");

//             Leavesheet.set(i, j + 2, res[key]);
//           }
//           i++;
//         }
//       }
//       workbook.save(function (ok) {
//         if (!ok)
//           workbook.cancel();
//         else
//           console.log('congratulations, your workbook created');
//       });
//       cb(null, result);
//     }
//   });
// }

var report=function(params,cb){
  var param={};
  var totalhours;
  var teamname="CORE";
  var teamname2="API";
  var query='select * from effort_tracker.report where report.team_name="'+teamname+'";'
    var query2='select * from effort_tracker.report where report.team_name="'+teamname2+'";'
 var query1='SELECT SUM(hours) AS TotalHours FROM effort_tracker.report;'
  mysql_connect.execute(query1, param, function (err, result1) {
    if (err) {
      console.log("error while generating the sum of hours", err);
    } else {
      console.log("SUM........",typeof result1,result1[0]);
      totalhours = result1[0].TotalHours;

  }});
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing report generation query", err);
    } else {
      //Core
      var item=result.length;
      var workbook = excelbuilder.createWorkbook('./', 'Invoicesheet.xlsx');
      var Invoicesheet = workbook.createSheet('Invoicesheet', 100, 120);
      Invoicesheet.set(1, 1, "Employee_Id");
      Invoicesheet.set(2, 1, "Hours");
      Invoicesheet.set(3, 1, "Rate");
      Invoicesheet.set(4, 1, "Team");
      Invoicesheet.set(5, 1, "Amounts");
      Invoicesheet.width(1,30);
      Invoicesheet.width(2,30);
      Invoicesheet.width(3,30);
      Invoicesheet.width(4,30);
      var i, j,k=2, res,hrssum=0;
      var sumefforts=[];
      for (j = 0; j < item; j++) {
           res = result[j];
        var value1=parseInt(res["hours"]);
        var value2=parseInt(res["rate"]);
        res.Amount=value1*value2;
        sumefforts.push(res.Amount);
        i = 1;
        for (var key in res) {
          if (res.hasOwnProperty(key)) {
            Invoicesheet.set(i, j + 2, res[key]);
          //  var coln=Invoicesheet.getColumn('Amounts');
           // console.log("sum..........")
          }
          i++;
        }
        k++;
      }
      var sum =0;
      console.log(">>>>>>>>>>>>>>>",sumefforts);
      for(i=0;i<sumefforts.length;i++){
          sum = sum+sumefforts[i];
      }

      console.log("<<<<<<<<<<<<<<<<<<<<<<"+sum);
      if(k>=item){
         Invoicesheet.set(1, item+3, "Core Team Total Efforts");
      Invoicesheet.set(2, item+3,totalhours);
      Invoicesheet.set(3, item+3);
      Invoicesheet.set(5, item+3, sum);
      }
      workbook.save(function (ok) {
        if (!ok)
          workbook.cancel();
        else
          console.log('congratulations, your workbook created');
      });
      cb(null, result);
    }
  });

}

var select_projecttasks = function (params, cb) {

  var query = "SELECT Project_Id, Project_Name FROM project_details";
  var query2 = "SELECT Task_Id, Task_Name FROM task_details";
  var query3 = "SELECT work_orderid FROM work_orders";
  var params = {};
  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
       var response = result;
       console.log('=====================query2'+query2);
       mysql_connect.execute(query2,params,function(err,result){
         console.log('=====================query3'+query3);
         if(err){
           cb(err);
         }
         else {
             response = result.concat(response);
            mysql_connect.execute(query3,params,function(err,result)
            {
              if(err)
              {
                cb(err);
              }
              else
              {
                response = result.concat(response);
                console.log(response);
                cb(null,response);
              }
            });
         }
       });
    }
  });
  //for adding project and task against  ----------------------------------Rajeshwari Divine
}

var add_projectTasks = function (params, cb) {
  var param = {};
  param.Employee_Id = params.empid;
  param.workOrder_Id = params.workOrderId;
  param.task_Id = params.taskId;
  console.log('effort WO.......................................'+param.workOrder_Id);
//  var  EmployeeId = JSON.stringify(params.Form_Data.id);
  param.project_Id = params.projectId;
  param.start_date = params.startdate.substring(0,10);
  param.end_date =params.enddate.substring(0,10);
  console.log('*********************************'+ param.start_date);
  console.log('*********************************'+ params.startdate);
  var  AllocationDefault = "Thili";
console.log("Param divine"+JSON.stringify(params))
  // query = 'insert into Project_Details values("sf","fsfs","2017-04-03","2017-05-02")';
  query = 'insert into employee_task_project_relation values("'+ param.Employee_Id +'","'+ param.workOrder_Id +'","'+ param.task_Id + '","' + param.project_Id + '",' + '"Thili","' + param.start_date + '","' + param.end_date + '")' ;
  console.log("----", query);

  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
      cb(null, params);
    }
  })
}

//====================================================================Rajeshwari

var selectTaskDetails = function (params, cb) {

  console.log('**************************************'+JSON.stringify(params));
  var param = {};
  param = params.task_id;
  console.log(param+'*********************************************');
  var query = 'select * from task_details where task_id="' + param+'"';
  console.log(query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing get task_details query", err);
    }
    else {
      cb(null, result);
    }
  })
}

//====================================================================Rajeshwari

var updateTaskDetail = function (params, cb) {
  console.log('*********************************************'+params);
  var id = JSON.stringify(params.task_id);
  var name = JSON.stringify(params.task_name);
  var startdate = JSON.stringify(params.task_startdate);
  var enddate = JSON.stringify(params.task_enddate);
  var status = JSON.stringify(params.status);

  query = 'update Task_Details set task_name='+ name + ',' +' status='+ status + ',' +' task_startdate='+ startdate + ',' +' task_enddate='+ enddate +' where task_id='+ id;
  console.log("----", query);
  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
      cb(null, result);
    }
  })
}

//update employee_details
var updateEmp = function (params, cb) {
console.log(JSON.stringify(params.body)+'inside effort of db');
  var param = {};
  param.Employee_Id = params.body.employee_id;
  param.Firstname = params.body.firstname;
  param.Lastname = params.body.lastname;
  param.Designation = params.body.designation;
  param.Password = params.body.password;
 param.Status = params.body.status;

 param.Role = params.body.role;
  param.team=params.body.team;
  param.rate=params.body.rate;
  param.acf2id=params.body.acf2id;
  param.res_startdate=params.body.res_startdate;
  param.res_enddate=params.body.res_enddate;
  param.role_grouping=params.body.role_grouping;
  param.skill_premium=params.body.skill_premium;
  param.skill_profile=params.body.skill_profile;
  param.technology=params.body.technology;
  param.profile_skills=params.body.profile_skills;
  param.location=params.body.location;
  param.work_location=params.body.work_location;
  param.work_permit_category=params.body.work_permit_category;
  
  param.shift_addrs=params.body.shift_addrs;
  
  param.wipro_mailid=params.body.wipro_mailid;
  param.td_mailid=params.body.td_mailid;
  
  param.departure_date=dateformat((params.body.departure_date).toString(), "isoDate");
  

  query ='UPDATE employee_details SET ? WHERE employee_id = "'+param.Employee_Id +'"';
  console.log("at right position@@@@@@" + JSON.stringify(param));
  console.log(query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to post data");
    }
    else {
      console.log("Data Posted successfully");
    }
    cb(null, result);
  })

}

var add_project = function (params, cb) {
  console.log(params,"????????????????????????????");
  var param = {};
  param.project_id = params.Project_Id;
  param.project_name = params.Project_Name;
  param.project_startdate = params.Project_StartDate;
  console.log("start date >>>>>>>>>>>>>>>>>",param.project_startdate);
  var date=[];
  date=param.project_startdate.split('T');
  var sdate=date[0];
  console.log(date,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",sdate);
  param.project_enddate = params.Project_EndDate;
    var date1=[];
    date1=param.project_enddate.split('T');
    var edate=date1[0];
  param.fundee = params.Fundee;
  param.cost_center=params.Cost_Centre;
  param.supplier_contract = params.Supplier_Contract;
        param.supplier_id = params.Supplier_Id;
        param.expenses = params.Expenses;
        param.td_contract = params.TD_Contract;
        param.supplier_id = params.Supplier_Id;
  param.invoice_number = params.Invoice_Number;
 param.expenses = params.Expenses;
        
        param.contract_type = params.Contract_Type;
  param.invoice = params.Invoice;
  param.currency = params.Currency;
  param.lob = params.LOB;
  param.project_desc = params.Project_Desc;
  param.sow = params.SOW;
  param.td_rmanager = params.TD_RManager;
  param.engagement_type = params.Engagement_Type;
  param.core_flex = params.Core_Flex;
  param.project_code = params.Project_Code;
  param.pm = params.PM;
  param.adm = params.ADM;
  param.supplier_name=params.Supplier_Name;
  console.log('project.......................................'+param);
//  var  EmployeeId = JSON.stringify(params.Form_Data.id);

console.log("Param divine"+JSON.stringify(param))
  // query = 'insert into Project_Details values("sf","fsfs","2017-04-03","2017-05-02")';
  query = 'insert into project_details values("' + param.project_id + '","' +   param.project_name + '","'
  + sdate + '","' + edate+ '","'+param.fundee +'","'+param.cost_center +'","'+
  param.supplier_id+'","'+  param.expenses+'","'+param.td_contract + '","' + param.supplier_contract + '","'+param.invoice_number +'","'+param.contract_type +'","'+
  param.invoice+'","'+  param.currency+'","'+param.lob + '","' + param.project_desc + '","'+param.sow +'","'+param.td_rmanager +'","'+
  param.engagement_type+'","'+  param.core_flex+'","'+  param.project_code+'","'+param.pm + '","' + param.adm+'","'+param.supplier_name+'")';
  console.log("----", query);

  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
 console.log("error in exceuting add project query");
      cb(err);
    }
    else {
      cb(null, result);
    }
  })
}

var project_delete=function(params,cb){
  var param={};
  param = params.projectId;
  query = 'DELETE FROM project_details WHERE project_id="' + param + '"';
console.log("here is the query"+query);


  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to post data");
    }
    else {
      console.log("Data Posted successfully");
    }
    cb(null, result);
  })

}
//delete task
var task_delete=function(params,cb){

console.log('Inside effort.js/////////////////'+params.taskId);
  var param={};
  param = params.taskId;

  query = 'DELETE FROM task_details WHERE task_id="' + param + '"';
console.log("here is the query"+query);

  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to post data");
    }
    else {
      console.log("Data Deleted successfully");
    }
    cb(null, result);
  })

}
//delete employee
var deleteEmp=function(params,cb){
console.log(JSON.stringify(params));
  var eid=params.empid;
  query = 'DELETE FROM employee_details WHERE employee_id="' + eid + '"';
console.log("here is the query"+query);

  var param={};
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to post data");
    }
    else {
      console.log("Data Posted successfully");
    }
    cb(null, result);
  })

}
//get details of emp by id
var getbyID=function(params,cb){
  console.log('inside model efforts '+params)
var query='SELECT * FROM employee_details where employee_id = "' + params+ '"';
console.log("here is the query"+query);
var param={};
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to post data");
    }
    else {
      console.log("Data Posted successfully"+JSON.stringify(result));
    }
    cb(null, result);
})
}

//Resource wise report
var resource_report=function(params,cb){
  var reportData;
  var param={};
var WorkOrder=JSON.stringify(params.body.WorkOrder);

//req, function (err, effort)
var query = 'select * from employee_task_project_relation where WorkOrder = '+ WorkOrder +' ORDER BY resource ASC' ;
console.log("report????????",query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
  var excelbuilder = require('msexcel-builder');
var workbook = excelbuilder.createWorkbook('./', 'ResourceWise.xlsx')

//   // Create a new worksheet with 10 columns and 12 rows
var Resourcesheet = workbook.createSheet('Resourcesheet', 10, 12);

// Fill some data

Resourcesheet.set(1, 1, "Resource");
Resourcesheet.set(2, 1, "WorkOrder");
Resourcesheet.set(3, 1, "projectName");
Resourcesheet.set(4, 1, "projectcode");
Resourcesheet.set(5, 1, "ActivityName");
Resourcesheet.set(6, 1, "ActivityId");
Resourcesheet.set(7, 1, "project");
Resourcesheet.set(8, 1, "hoursworked");
Resourcesheet.set(9, 1, "rateapplied");
Resourcesheet.set(10,1,"Amount");
console.log(result.length+'here is the result');
var empdata;
var empdata2;
var index2=2;
var value1;
var value2;
//var name= result[0]["Resource"];
for(var i=0;i<result.length;i++){
empdata=result[i];
empdata2=result[i+1];
value1=empdata["hoursworked"];
value2=empdata["rateapplied"];
empdata.Amount=parseInt(value1)*parseInt(value2);
var index1=1;

for(var property in empdata){
  Resourcesheet.set(index1,index2,empdata[property]);
// if(index1==8){
//   value1=empdata[property]
// }
// if(index2==9){
//   value2=empdata[property]
// }
// Resourcesheet.set(index)
 // if(name != empdata["Resource"]){
 //     name = empdata["Resource"];
 //    //
 //    console.log('name chaged at index' +index1+'>>>>>'+index2);
 //    Resourcesheet.set()
 // }
 index1++;
}
// if(empdata["Resource"]!=empdata2["Resource"]){
//   console.log('resource not same');

// }
console.log(empdata["WorkOrder"]);
 index2++;

}



// Save it
workbook.save(function (ok) {
    if (!ok)
        workbook.cancel();
    else
        console.log('congratulations, your workbook created');
});
cb(null,result);
}
});
}

var select_project = function (params, cb) {
var param=params.project_id;
console.log("param is"+param);
  var query = 'SELECT * FROM project_details where project_id="'+param+'"';

  var params = {};
  console.log("----", query);
  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
      console.log("sjhdfjhd"+JSON.stringify(result));
      cb(null, result);
    }
  })
  }
//-------------------------Divine
//update task details

var updateProjectDetails = function (params, cb) {
console.log(JSON.stringify(params.body)+'inside effort of db');
   var param = {};
   param.project_id = params.project_id;
   param.project_name = params.project_name;
   param.project_startdate=params.project_startdate;
   param.project_enddate=params.project_enddate;
   param.fundee = params.fundee;
   param.cost_center=params.cost_center;
   param.supplier_contract = params.supplier_contract;
         param.expenses = params.expenses;
         param.supplierid = params.supplierid;
   param.invoice_number = params.invoice_number;
  param.expenses = params.expenses;
         param.td_contract = params.td_contract;
         param.contract_type = params.contract_type;
   param.invoice = params.invoice;
   param.currency = params.currency;
   param.lob = params.lob;
   param.project_desc = params.project_desc;
   param.sow = params.sow;
   param.td_rmanager = params.td_rmanager;
   param.engagement_type = params.engagement_type;
   param.core_flex = params.core_flex;
   param.project_code = params.project_code;
   param.pm = params.pm;
   param.adm = params.adm;
  param.suppliername = params.suppliername;
console.log("sjahds"+param.project_name)
 console.log("Param divine"+JSON.stringify(params))

 query ='UPDATE project_details SET ? WHERE project_id = "'+param.project_id +'"';

 console.log("at right position@@@@@@" + JSON.stringify(param));
 console.log(query);
 mysql_connect.execute(query, param, function (err, result) {
   if (err) {
     console.log("unable to post data");
   }
   else {
     console.log("Data Posted successfully");
   }
   cb(null, result);
 })
}

var add_workOrder = function (params, cb) {
  console.log("inside add work order.........");
  var id = JSON.stringify(params.WorkOrder_Id);
  var name = JSON.stringify(params.Work_Order);
  var startdate = [];
  startdate = JSON.stringify(params.Resource_StartDate).split('T');
  var sdate = startdate[0] + '"';
  console.log("start date inside...", sdate);
  var enddate = [];
  enddate = JSON.stringify(params.Resource_EndDate).split('T');
  var edate = enddate[0] + '"';
  console.log('last call..............' + edate);
  var date = [];
  //var enddate = dateformat(to_date, "isoDate");
  console.log("date..................", sdate);
  console.log("enddate..................", edate);
  query = 'insert into work_orders values(' + id + ',' + sdate + ',' + edate + ',' + name + ')';
  console.log("----", query);
  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
      cb(null, result);
    }
  })
}

var getAssociation = function (params, cb) {
  console.log(params);
var param=JSON.stringify(params.empid);
console.log("param>>>>>>>>>>>>>>>>>>>>",param);
  var query = 'SELECT workorder_id, task_id, project_id, start_date, end_date from employee_task_project_relation where employee_id='+param+';'

  console.log('query======================='+query);
  mysql_connect.execute(query, params, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
       var response = result;
       console.log(response);
       cb(null,response);
    }
  });
}

//get by id WorkOrder
var getWorkorderbyId=function(params,cb){
  console.log(JSON.stringify(params.body.empid));
  var empid=params.body.empid;
  var param={};
var query = 'select * from work_orders where work_orderid="'+empid+'"'
  console.log(query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing get project_details query", err);
    }
    else {
      cb(null, result);
    }
  })


}
//update WorkOrder
var updateWorkOrder=function(params,cb){
  console.log(JSON.stringify(params.body.work_orderid));

  var param={};
  param.work_orderid=params.body.work_orderid;
  param.res_startdate=dateformat((params.body.res_startdate).toString(), "isoDate");
  param.res_enddate=dateformat((params.body.res_enddate).toString(), "isoDate");
  param.work_order=params.body.work_order;
var query = 'Update work_orders SET ? where work_orderid="' +param.work_orderid+'"';
  console.log(query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing get project_details query", err);
    }
    else {
      cb(null, result);
    }
  })


}

//--------------------deleteworkorder
var workorder_delete=function(params,cb){
     console.log("id>>>>>>>>>>>>>>>>",params);
   var param = {};
   var param=JSON.stringify(params.workorderId);
   console.log("id>>>>>>>>>>>>>>>>",param);

  query = 'DELETE FROM work_orders WHERE work_orderid=' + param + ';'
console.log("here is the query"+query);


  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to post data");
    }
    else {
      console.log("Data Posted successfully");
    }
    cb(null, params);
  })

}

//get unbilled report
var get_UnbilledData = function(params,cb){
  console.log('Hi charlie i am inside the getUnbilled data method this is the first call@@@@@@@@@@@@@');

unbilledexcel.execute(params,function(err,res){
if(err){
console.log(err,"error in unbilled report.................");
  cb(err,null);
}
else{
  console.log('Hi charlie mission accomplished@@@@@@@@@@@@@@@@@@@@ $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  cb(null,res);
}


})

}

var resourceReport = function (params, cb) {
  var teamname = (params.team_name).toUpperCase();
  var date = [];
  date = params.startdate.split('T');
  var sdate = date[0];
  var date1 = [];
  date1 = params.enddate.split('T');
  var edate = date1[0];
  console.log(">>>>>>>>>>>>>>>>>>date", edate)
  var param = {};
  var totalhours="123";
  console.log("team name....................", teamname);
  /////////////////////////////////////////password
  var query = 'select firstname,location,password,rate from effort_tracker.employee_details where employee_details.team="' + teamname + '";'
  console.log("query is..........", query);
  //var query1 = 'SELECT SUM(billed_hours) AS TotalHours FROM effort_tracker.employee_details  where employee_details.team="' + teamname + '";'
  var query2 = "SELECT ed.firstname,pd.project_name,ep.project_id,ep.task_id,td.task_name ,ed.status,ed.rate FROM effort_tracker.employee_task_project_relation ep, effort_tracker.task_details td,effort_tracker.project_details pd ,effort_tracker.employee_details ed where ep.task_id=td.task_id && ep.project_id=pd.project_id && ep.employee_id=ed.employee_id;"
  var query3 = "SELECT pd.project_name,tm.project_id,td.task_name,tm.task_id,ed.firstname,ed.status,ed.rate FROM effort_tracker.timesheet_month tm, effort_tracker.task_details td,effort_tracker.project_details pd ,effort_tracker.employee_details ed where tm.task_id=td.task_id && tm.project_id=pd.project_id && tm.employee_id=ed.employee_id;"
  // mysql_connect.execute(query1, param, function (err, result1) {
  //   if (err) {
  //     console.log("error while generating the sum of hours", err);
  //   } else {
  //     totalhours = result1[0].TotalHours;
  //     console.log("totalhours...............", totalhours);
  //   }
  // });
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing report generation query", err);
    } else {

      mysql_connect.execute(query2, param, function (err, result1) {
        if (err) {
          console.log("error executing report generation query", err);
        } else {
            mysql_connect.execute(query3, param, function (err, result3) {
            if (err) {
              console.log("error while executing the query 3");
            } else {
          console.log("result of query 2,3 is........", result1);
          var content = result1.length;
          console.log("length of content of query 2 is....", content);
          //Core
          var item = result.length;
          var workbook = excelbuilder.createWorkbook('./', 'Invoicesheet.xlsx');
          var ResourcetoProject = workbook.createSheet('Resource Invoicing Report', 100, 120);
          var Invoicesheet = workbook.createSheet('Invoicesheet', 100, 120);
          var ProjecttoResource = workbook.createSheet('ProjecttoResource', 100, 120);
          Invoicesheet.width(1, 15);
          Invoicesheet.width(2, 30);
          Invoicesheet.width(3, 20);
          Invoicesheet.width(4, 25);
          Invoicesheet.width(5, 32);
          Invoicesheet.width(6, 35);
          Invoicesheet.width(7, 30);
          Invoicesheet.width(8, 30);
          ResourcetoProject.width(1, 15);
          ResourcetoProject.width(2, 20);
          ResourcetoProject.width(3, 18);
          ResourcetoProject.width(4, 15);
          ResourcetoProject.width(5, 15);
          ResourcetoProject.width(6, 10);
          ResourcetoProject.width(7, 20);
          ResourcetoProject.width(8, 25);
          ResourcetoProject.width(9, 35);
          ProjecttoResource.width(1, 15);
          ProjecttoResource.width(2, 20);
          ProjecttoResource.width(3, 18);
          ProjecttoResource.width(4, 15);
          ProjecttoResource.width(5, 15);
          ProjecttoResource.width(6, 10);
          ProjecttoResource.width(7, 20);
          ProjecttoResource.width(8, 25);
          ProjecttoResource.width(9, 35);
          Invoicesheet.merge({ col: 2, row: 1 }, { col: 10, row: 1 });
          Invoicesheet.merge({ col: 2, row: 2 }, { col: 10, row: 2 });
          Invoicesheet.align(2, 1, 'center');
          Invoicesheet.align(2, 2, 'center');
          Invoicesheet.fill(2, 1, { fgColor: '8', bgColor: '#FFFF00' });
          Invoicesheet.fill(2, 2, { fgColor: 'cyan', bgColor: 'grey' });
          Invoicesheet.set(2, 1, "Services Rendered By Wipro's Team  from  " + sdate + "  TO  " + edate);
          Invoicesheet.set(2, 2, teamname + " Team - Summary Efforts Sheet ");
          //Headers
          Invoicesheet.set(2, 3, "Description/Name");
          Invoicesheet.align(2, 3, 'center');
          Invoicesheet.set(3, 3, "Location");
          Invoicesheet.align(3, 3, 'center');
          Invoicesheet.set(4, 3, "Hours Worked");
          Invoicesheet.align(4, 3, 'center');
          Invoicesheet.set(5, 3, "Blended Rate(For Reference only)");
          Invoicesheet.align(5, 3, 'center');
          Invoicesheet.set(6, 3, "Amount(USD)-for Reference only");
          Invoicesheet.align(6, 3, 'center');
          Invoicesheet.set(7, 3, "Remarks");
          Invoicesheet.align(7, 3, 'center');
          Invoicesheet.set(2, 5, "Project:WebServices ADM");
          Invoicesheet.set(1, 6, teamname);//result.team);

          //setting headers for ResourcetoProject
          ResourcetoProject.set(1, 1, "Resource");
          ResourcetoProject.align(1, 1, 'center');
          ResourcetoProject.set(2, 1, "PROJECT NAME");
          ResourcetoProject.align(2, 1, 'center');
          ResourcetoProject.set(3, 1, "Project Code");
          ResourcetoProject.align(3, 1, 'center');
          ResourcetoProject.set(4, 1, "Activity Name");
          ResourcetoProject.align(4, 1, 'center');
          ResourcetoProject.set(5, 1, "Activity ID");
          ResourcetoProject.align(5, 1, 'center');
          ResourcetoProject.set(6, 1, "Funded?");
          ResourcetoProject.align(6, 1, 'center');
          ResourcetoProject.set(8, 1, "15_Nov-14_Dec");
          ResourcetoProject.set(7, 1, "BLENDED RATE(for reference)");
          ResourcetoProject.set(9, 1, "AMOUNT USD ( for referenc ONLY)");


          //Header for ProjecttoResource Report
          ProjecttoResource.set(1, 1, "PROJECT NAME");
          ProjecttoResource.align(1, 1, 'center');
          ProjecttoResource.set(2, 1, "Project Code");
          ProjecttoResource.align(2, 1, 'center');
          ProjecttoResource.set(3, 1, "Activity Name");
          ProjecttoResource.align(3, 1, 'center');
          ProjecttoResource.set(4, 1, "Activity ID");
          ProjecttoResource.align(4, 1, 'center');
          ProjecttoResource.set(5, 1, "Funded?");
          ProjecttoResource.align(5, 1, 'center');
          ProjecttoResource.set(6, 1, "Resource");
          ProjecttoResource.align(6, 1, 'center');
          ProjecttoResource.set(8, 1, "15_Nov-14_Dec");
          ProjecttoResource.set(7, 1, "BLENDED RATE(for reference)");
          ProjecttoResource.set(9, 1, "AMOUNT USD ( for referenc ONLY)");
          var i, j, k = 2, res, hrssum = 0;
          var sumefforts = [];
          for (j = 0; j < item; j++) {
            res = result[j];
            var value1 = parseInt(res["billed_hours"]);
            var value2 = parseInt(res["rate"]);
            res.Amount = value1 * value2;
            sumefforts.push(res.Amount);
            i = 2;
            for (var key in res) {
              if (res.hasOwnProperty(key)) {
                Invoicesheet.set(i, j + 6, res[key]);
              }
              i++;
            }
            k++;
          }
          var sum = 0;
          console.log(">>>>>>>>>>>>>>>", sumefforts);
          for (i = 0; i < sumefforts.length; i++) {
            sum = sum + sumefforts[i];
          }

          console.log("totalhours...............1", totalhours);
          if (k >= item) {
            console.log("totalhours...............2", totalhours);
            Invoicesheet.set(2, item + 7, teamname + " Team Total Efforts");
            Invoicesheet.set(4, item + 7, totalhours);
            Invoicesheet.set(3, item + 7);
            Invoicesheet.set(6, item + 7, sum);
          }


          //setting the values of resourceReport
           var resName = "Sandip", l = 2;
          for (j = 0; j < content; j++) {
            res = result1[j];
            i = 1;
            if (res.firstname !== resName) {

              ResourcetoProject.set(1, l, "Sub Total");
              console.log("l value is  ", l);
              resName = res.firstname;
              l++;
            }
            for (var key in res) {
              if (res.hasOwnProperty(key)) {
                ResourcetoProject.set(i, l, res[key]);
              }
              i++;
            }
            k++; l++;
          }
          ResourcetoProject.set(1, l, "Sub Total");
          console.log("l value is  ", l);
          resName = res.firstname;

            //Setting Value for ProjecttoResource Report
          var proName = "etreasury", l = 2;
          var length3=result3.length;
          console.log("Result of query 3 is....",result3);
                    //setting the values of resourceReport
                    for (j = 0; j < length3; j++) {
                      res = result3[j];
                      i = 1;
                      if (res.project_name !== proName) {
                        ProjecttoResource.set(1, l, " ");
                        console.log("l value is  ", l);
                        proName = res.project_name;
                        l++;
                      }
                      for (var key in res) {
                        if (res.hasOwnProperty(key)) {
                          ProjecttoResource.set(i, l, res[key]);
                        }
                        i++;
                      }
                      k++; l++;
                    }
                   ProjecttoResource.set(1, l, "Sub Total");
                    console.log("l value is  ", l);
                    proName = res.project_name;

          workbook.save(function (ok) {
            if (!ok)
              workbook.cancel();
            else
              console.log('congratulations, your workbook created');
          });
          cb(null, result);
        }

      });

    }
  });
}
});}

var generateLaborReport = function (params, cb) {
  var param = {};
  console.log(params.body);
  var estart = params.body.startdate.split('T');
  var start=estart[0];
console.log(start,"..............");
  var eend = params.body.enddate.split('T');
  var end=eend[0];
console.log(end,"..............");
  var query = "select a.supplierid,a.lob,a.project_name,a.project_desc,a.sow,a.td_rmanager,a.supplier_contract,b.firstname,b.lastname,b.acf2id,b.res_startdate," +
    "b.res_enddate,b.role,b.role_grouping,b.skill_premium,b.skill_profile,b.technology,b.profile_skills,b.location,b.work_location,b.work_permit_category," +
    "a.adm,b.shift_addrs,a.contract_type,a.engagement_type,a.sow,a.td_contract,a.supplier_contract,a.invoice_number,a.currency from project_details a, employee_details b, employee_task_project_relation c where a.project_id = c.project_id and  c.employee_id = b.employee_id and b.res_startdate ='" + start + "'and b.res_enddate ='" + end + "'";
  console.log("----", query);
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      cb(err);
    }
    else {
      laborexcel.execute(result, function (err, res) {
        if (err) {
          cb(err);
        }
        else {
          cb(null, res);
        }
      });
    }
  })
}


var generateReport = function (params, cb) {
  var param = {};
var start=JSON.stringify(params.from_date);
var end=JSON.stringify(params.to_date);
 var Months ={1:"jan",2:"feb",3:"mar",4:"apr",5:"may",6:"jun",7:"jul",8:"aug",9:"sep",10:"oct",11:"nov",12:"dec"};
var startDate = moment(start).format("M-D-YYYY");
var endDate = moment(end).format("M-D-YYYY");

var startDate1=new Date(startDate);
var endDate1=new Date(endDate);


var i1 = startDate.indexOf('-');
var part1 = startDate.slice(0, i1).trim();

var h1 = endDate.indexOf('-');
var parth1 =endDate.slice(0, h1).trim();

var part2 = startDate.slice(i1 + 1, startDate.length).trim();

var i2=part2.indexOf('-');
var part3 = part2.slice(0, i2).trim(); //day

 var  cmonth = Months[part1];
var  emonth = Months[parth1];
console.log('AAAAAAAAAAAAAAAAAAAAA',emonth);
var query= 'select * from effort_tracker.timesheet_month tm,effort_tracker.employee_details ed where ed.employee_id=tm.employee_id' ;
//var query= 'select * from effort_tracker.timesheet_month';
  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("error executing leaves generation query", err);
    } else {

      console.log('-----------------------------',result);
      var workbook = excelbuilder.createWorkbook('./', 'LeaveReport.xlsx');
      var Leavesheet = workbook.createSheet('Leavesheet', 100, 120);
      Leavesheet.set(1, 1, "FirstName");
      Leavesheet.set(2, 1, "LastName");
      Leavesheet.set(3, 1, "Total no of leaves");
      for(var p=0;startDate1<=endDate1;p++){
        var s=new Date(startDate1).toString().substring(0, 15);
       Leavesheet.set(p+4, 1, s);
       startDate1.setDate(startDate1.getDate() + 1);
      }




     var i = 1,j,res;
     var q=2;
     for(j=0;j<result.length;j++){
        res = result[j];
        var count=0;
        i=1;
        console.log("value of q is......",q);
          var time=result[j].timesheet_id;
            var g1 = time.indexOf('_');
            var party1 = time.slice(0, g1).trim();
            var temp=time.slice(g1+1, time.length).trim();
            var g2 = temp.indexOf('_');
             var party2 = temp.slice(0, g2).trim();


              var days={1:'day1',2:'day2',3:'day3',4:'day4',5:'day5',6:'day6',7:'day7',8:'day8',9:'day9',10:'day10',11:'day11',
          12:'day12',13:'day13',14:'day14',15:'day15',16:'day16',17:'day17',18:'day18',19:'day19',20:'day20',21:'day21',22:'day22',23:'day23',24:'day24',25:'day25',26:'day26',27:'day27',28:'day28',29:'day29',30:'day30',31:'day31'};


           var startDate2 = new Date(startDate);
            for(var k=0;startDate2 <= endDate1;k++){

              var st = moment(startDate2).format("M-D-YYYY");

              var yu = st.indexOf('-');
              var part12 = st.slice(0, yu).trim();
              var  cmonthy = Months[part12];
              var yu2 = st.slice(yu + 1, st.length).trim();

              var in2=yu2.indexOf('-');
              var yun1 = yu2.slice(0, in2).trim(); //day

               var c=days[yun1];
                if(party1.toLowerCase()==cmonthy){
            Leavesheet.set(1, q, result[j].firstname);
            Leavesheet.set(2, q, result[j].lastname);

             }
                   if(party1.toLowerCase()==cmonthy && result[j][c]== -1)
                   {
                     count=count+1;
                     console.log('IIIIIIIIIII AAAAAAAAAAAAA<MMMMMMMMMMMMMMMM HEREEEEEEEEEEEEEE');
                     console.log('ssssssssssssssssssssssss',startDate2);
                     console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkk',result[j].firstname);
                     console.log('qqqqqqqqqqqqqqqqq',q);
                     Leavesheet.set(k+4, q, "PTO");

                   }
           startDate2.setDate(startDate2.getDate() + 1);

          }
          console.log('ddddddddddddddddddd',party1.toLowerCase());
          console.log('eeeeeeeeeeeeeeeeeee',emonth);
          if(party1.toLowerCase()==cmonth || party1.toLowerCase()==emonth){
            console.log('LLLLLLLLLLLLLLLLL');
          Leavesheet.set(3, q, count);
            q++;
          }

          }
        }
        i++;
   workbook.save(function (ok) {
        if (!ok)
          workbook.cancel();
        else
          console.log('congratulations, your workbook created');
      });
 cb(null, result);
    }
  );
}

//=======================================================Delete Employee Task associationData
var deleteTaskAssociation=function(params,cb)
{
  var param={};
  console.log('Inside effort.js/////////////////'+params.taskId);
  param.employee_id = params.empid;
  param.workorder_id = params.workOrderId;
  param.task_id = params.taskId;
  param.project_id = params.projectId;

  query = 'DELETE FROM employee_task_project_relation WHERE employee_id="' + param.employee_id + '" and workorder_id="' + param.workorder_id + '" and task_id="' + param.task_id + '" and project_id="' + param.project_id +'";';
  console.log("Query====================================="+query);


  mysql_connect.execute(query, param, function (err, result) {
    if (err) {
      console.log("unable to delete data");
    }
    else {
      console.log("Data Deleted successfully");
    }
    cb(null, params);
  })

}
	var get_skills = function (params, cb) {
  var param = {};
  console.log("value of params",JSON.stringify(params));
  param = params.skillprofile;
  console.log(param)
  var xlstojson = require("xlsx-to-json-lc");
  xlstojson({
    input: "webservices_laborReport_latest.xlsx",
    output: null,
    sheet: "Skill Profile"
  }, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      for(var i=0;i<res.length;i++){
          if(res[i]["Profile#"]==param){
            console.log(res[i]);
            break;
          }
      }
      cb(res[i]);
    }
  });
}



var deleteTaskAssociation1=function(params,cb)
{
console.log('hi charlie this is the second call @@@@@@@@@@@'+JSON.stringify(params));
mysql_connect.get_connection(params,function(err,connection){
  if(err){
    cb(err,null);
  }
  else{
    var query = 'select * from employee_details';
    mysql_connect.execute_query(connection,query,function(err,res){
      if(err){
        cb(err,null)
      }
      else{
        console.log('hi charlie mission accomplished@@@@@@@@@@'+JSON.stringify(res));
        cb(null,res);
      }
    })
  }
})

}

exports.get_skills=get_skills;
exports.deleteTaskAssociation1=deleteTaskAssociation1;
exports.deleteTaskAssociation=deleteTaskAssociation;
exports.generateLaborReport=generateLaborReport;
exports.getWorkorderbyId=getWorkorderbyId;
exports.updateWorkOrder=updateWorkOrder;
exports.workorder_delete=workorder_delete;
exports.getAssociation=getAssociation;
exports.add_workOrder=add_workOrder;
exports.select_project=select_project;
exports.updateProjectDetails=updateProjectDetails
exports.project_delete=project_delete;
exports.task_delete=task_delete;
exports.getbyID=getbyID;
exports.updateEmp=updateEmp;
exports.deleteEmp=deleteEmp;
exports.resource_report=resource_report;
exports.selectTaskDetails=selectTaskDetails;
exports.updateTaskDetail=updateTaskDetail;
exports.report=report;
exports.find = find;
exports.create = create;
exports.registration = registration;
exports.login = login;
exports.add_task = add_task;
exports.add_project = add_project;
exports.select_month = select_month;
exports.get_project = get_project;
exports.leaves = leaves;
exports.showleave = showleave;
exports.generateReport = generateReport;
exports.add_projectTasks = add_projectTasks;
exports.select_projecttasks = select_projecttasks;
exports.get_UnbilledData = get_UnbilledData;
exports.resourceReport=resourceReport;
