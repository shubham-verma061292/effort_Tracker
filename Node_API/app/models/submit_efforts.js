var mysql_connect = require('../../config/database.js');
var dateformat = require('dateformat');
var async = require('async');
var generate_timesheet_id = function(param,date1,cb){
		
      var emp_id={};
      emp_id=param;
      console.log(emp_id);
      var id={};
	  console.log('date1-------------------------'+JSON.stringify(date1));
      for(var i=0;i<date1.length ;i++)
      {
		  
		  
          var date2 =  date1[i].split(" ");
          id[i] = date2[1]+"_"+date2[3]+"_"+emp_id;
      }
	  console.log('this is id @@@@@@@@@@@@@@@@'+JSON.stringify(id));
      cb(null,id);
    }

var check_timesheet = function(id, date2, cb){
    
async.waterfall([
 function(next){
	console.log('inside check timesheet...................')
	mysql_connect.get_connection(id, function(err, connection){
		if(err)
			
			{
				console.log('Error occured...'+err);
				next(err, null);
			}
			else{
				console.log('Getting connection.......*******************************************************************.');
				next(null, connection);
			}
      
 })},

 function(connection,next){
	 console.log('entering this section**********************************')
	  query = 'select Timesheet_Id  from effort_tracker.timesheet_employee where Timesheet_Id like ? or Timesheet_Id like ?';
	var params=[];
	params.push(id[0]);
	params.push(id[1]);
	var response ={};
	console.log('params'+JSON.stringify(params));
				 mysql_connect.execute_query(connection,query,params,function(err,data)
				{
					if(err)
					{
						console.log('error..'+err);
						next(err,null);
					}
					else{
					console.log('coming here-----------------------------'+JSON.stringify(data));
					response.connection = connection;
					response.data = data;
					next(null,response);
					}
				})
 }  ,
  function(response,next){
	  var data1=response.data.length;
	  
	//query = 'select Timesheet_Id  from effort_tracker.timesheet_employee where Timesheet_Id like ? or Timesheet_Id like ?';
	console.log('First codition@@@@@@@@@@@@@@@@@'+(data1===1));
	if(data1===1)
	{
		console.log('second codition@@@@@@@@@@@@@@@@@'+(date2[0]!==date2[6]));
		if(date2[0]!==date2[6])
		{
			console.log('third codition@@@@@@@@@@@@@@@@@'+(date2[0]!==response.data[0]));
			if(date2[0]!==response.data[0]){
				var params=[];
				var fields = date2[6].split('_');
				params.push(date2[6]);
				params.push(fields[2]);
				params.push(fields[0]);
				params.push(fields[1]);
				query='insert into effort_tracker.timesheet_employee values(?,?,?,?)'
				mysql_connect.execute_query(response.connection,query,params,function(err,data)
				{
					if(err)
					{
						console.log('error..'+err);
						next(err,null);
					}
					else{
					console.log('Success here-----------------------------'+JSON.stringify(data));
					next(null,data);
					}
				})
				
			}
		}
		next(null,'success');
	}
	else if(data1==0)
	{
		console.log('entering this condition-----------------------')
		if(date2[0]===date2[6])
		{
	var params=[];
				var fields = date2[0].split('_');
				params.push(date2[0]);
				params.push(fields[2]);
				params.push(fields[0]);
				params.push(fields[1]);	
				query='insert into effort_tracker.timesheet_employee values(?,?,?,?)'
				mysql_connect.execute_query(response.connection,query,params,function(err,data)
				{
					if(err)
					{
						console.log('error..'+err);
						next(err,null);
					}
					else{
					console.log('Success here-----------------------------'+JSON.stringify(data));
					next(null,data);
					}
				})
		}	
else{
	for(var i=0;i<7;i=i+6)
	{
				var params=[];
				var fields = date2[i].split('_');
				params.push(date2[i]);
				params.push(fields[2]);
				params.push(fields[0]);
				params.push(fields[1]);	
				query='insert into effort_tracker.timesheet_employee values(?,?,?,?)'
				mysql_connect.execute_query(response.connection,query,params,function(err,data)
				{
					if(err)
					{
						console.log('error..'+err);
						next(err,null);
					}
					else{
					console.log('Success here-----------------------------'+JSON.stringify(data));
					next(null,data);
					}
				})
}
}	

	}
	
else{
	next(null,'2');
}
 } 
],function(err, result){
			if(err){
				console.log('Error while executing async waterfall,', err);
				cb(err);
			}else{
				console.log('Success here-----------------------------'+JSON.stringify(result));
				cb(null,result);
			}
		})

    /*mysql_connect.execute(query, id, function (err, result) {
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
		  else if(result[0]!==result[6])
          else{
            cb(null, "successful");
          }

        }
  });*/
}

 exports.submit_effort = function(params,cb){
	 
	
 
	
	console.log('Theses are the params@@@@@@@@@@'+JSON.stringify(params));
	var date1=(params[0].headerNames);
	var res={};
	
  var emp_id=params[0].Employee_Id;
  async.waterfall([
     function(next){
		mysql_connect.get_connection(res, function(err, connection){
		if(err)
			{
				console.log('Error occured...'+err);
				next(err, null);
			}
			else{
				console.log('Getting connection........');
					res.connection=connection;
					//res.data=data;
					next(null,res);
					}
		});
	},
		function(res,next)
		{
	 prepareRequest(params,function(err,effortData){
		 if(err){
			 
		 }
		 else{
			 res.effortData=effortData;
			 console.log('this is the response@@@@@@@@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%555'+JSON.stringify(effortData.values[0]));
			 next(null,res);
			 
		 }
	 })
	},
  
    function(res,next){
		console.log('result is---------------------'+JSON.stringify(res.effortData.values[0]));
      generate_timesheet_id(emp_id,date1,function(err,result){
      if(err)
      {
        console.log("error");
        return next(err, null);
      }
      else{
		
			 res.result=result;
              next(null, res);
            }
      })
    },
    function(res,next){
		console.log('this is the response@@@@@@@'+JSON.stringify(res.result));
		var params = [];
		params.push(res.result[0]);
		params.push(res.result[6]);
		console.log('this is the param@@@@@@@'+JSON.stringify(params));
		 check_timesheet(params,res.result,function(err,data){
			 if(err)
			 {
				 console.log('error.....'+err);
				 next(err,null);
			 }
			 else{
				 res.data=data;
				 console.log('successful insertion');
				 next(null,res);
			 }
		 })
    },
	    /*function(res,next){
		console.log('common select query-----------------------------------------'+JSON.stringify(res.result));
		var params=[];
		params.push(res['result'][0]);
		params.push(res['result'][6]);
		query='select Timesheet_Id  from effort_tracker.timesheet_month where Timesheet_Id like ? or Timesheet_Id like ?';
				mysql_connect.execute_query(res.connection,query,params,function(err,data)
				{
					if(err)
					{
						console.log('error..'+err);
						next(err,null);
					}
					else{
					console.log('Success here-----------------------------99999999999'+JSON.stringify(data));
					var length=data.length;
					res.length=length;
					next(null,res);
					}
				})
		
    },*/
	   function(res,next){
		   var query='';
		console.log('this is the response@@@@@@@'    );
		var params1=[];
		//params1.push(res['result'][0]);
		//params1.push(res['result'][6]);
		params1.push(res['result'][0]);
		params1.push(res['result'][6]);
		query='select Timesheet_Id  from effort_tracker.timesheet_month where Timesheet_Id like ? or Timesheet_Id like ?';
		
		mysql_connect.execute_query(res.connection,query,params1,function(err,data)
				{
					if(err){
						next(err,null);
					}
					else{
						console.log('the query is------------------'+query);
					console.log('data count ========================'+JSON.stringify(data));
					//console.log('data count ========================'+JSON.stringify(data[0].count2));
					res.data = data;
					next(null,res)
					}
    });
	
	   },
	function(res,next){
		var params1=[];
		var query='';
		params1.push(res['result'][0]);
		params1.push(res['result'][6]);
		var count1=false;
		var count2=false;
		//console.log('hell true...............'+res.data[0].Timesheet_Id===params1[0]);
		for(var i=0;i<res.data.length;i++)
		{
		if(res.data[i].Timesheet_Id===params1[0])
		{
			//console.log('hell true...............'+res.data[i].Timesheet_Id==="res['result'][0]");
			count1=true;
		}
		if(res.data[i].Timesheet_Id===params1[1])
		{
			count2=true;
		}			
		}
		console.log('count1---------------------'+count1);
	console.log('count2---------------------'+count2);
		console.log('data coming here..................'+JSON.stringify(res.data));
		console.log(params1[0]===params1[1]);
		console.log(res.data.length===3);
		if((params1[0]===params1[1]) &&	count1==false && count2==false){
			console.log('entering here');
			for(var i=0;i<params.length;i++){
				console.log('params================'+res.count);
				var insertion = []
				query1='insert into effort_tracker.timesheet_month (timesheet_id,employee_id , project_id ,task_id) values (?,?,?,?)';	
				insertion.push(res['result'][0]);
				insertion.push(params[i].Employee_Id);
				insertion.push(params[i].Project_Id);
				insertion.push(params[i].Task_Id);
					mysql_connect.execute_query(res.connection,query1,insertion,function(err,data)
				{
					if(err){
						next(err,null);
					}
					else{
						
					console.log('response reaching here---------------------'+JSON.stringify(res.effortData.values.length));
					console.log('response reaching here---------------------'+JSON.stringify(res.effortData.days.length));
						for(var j=0;j<res.effortData.values.length;j++)
						{
							for(var k=0;k<res.effortData.days.length;k++)
							{
								var update=[];
								query='update effort_tracker.timesheet_month set day"res.effortData.days[k]" =?  where timesheet_id like ? and project_id like ? and task_id like ?'
								update.push(res.effortData.values[j]);
								update.push(res['result'][0]);
								update.push(params[i].Project_Id);
								update.push(params[i].Task_Id);
								mysql_connect.execute_query(res.connection,query,update,function(err,data)
				{
					if(err){
						next(err,null);
					}
					else{
						console.log('success--------------------------------');
					}
				});
							}
						}
					console.log('data========================'+JSON.stringify(data));
					next(null,res)
					
					}
    });
	
				
				
			}
			
		}else if((params1[0]===params1[1])&& count1==true && count1==true)
		{
			console.log('entering here1111111111111111111');
			
			
		}
		
		//console.log('coming at last function@@@@@@@@@@@@@@@@'+JSON.stringify(res));
	},
		
	/*	var query='';
         var query1='';
		for(var i=0;i<params.length;i++){	
		for(var j=0;j<7;j++)
		{				
		 var headers=[];
		// var act_date_id=resultData[j].split('_');
          //      var temp_act_date_id=resultData[0].split('_');  //jan   generate id
                var act_date = date1[j].split(' ');     //jan   browser ......
                var temp_param=params[i];
                var tact_date = act_date[0] +' '+ act_date[1] +' '+ act_date[2] +' '+ act_date[3];
		 for(var k=0;k<params[i].headerNames.length;k++)
		 {
			headers.push(params[i].headerNames[k]);
		 }
		 
	
		 var days=[];
		 for(var p=0;p<7;p++)
		 {
		 var part=headers[p];
		 //console.log('part---------------------'+JSON.stringify(part));
		 var splits=part.split(" ");
		// console.log('helloooooooooooooooooooo'+splits);
		 //console.log('helloooooooooooooooooooo11111111111111111'+splits[0]);
		 for(var r=0;r<splits.length;r++)
		 {
			 var month=splits[1];
			 var day=splits[2];
			
		 
		 // console.log('months................................'+month);
		 //console.log('day................................'+day);
		 switch(month)
		 {
			 case "Jan":
			 month=0;
			 break;
			 case "Feb":
			 month=1;
			 break;
			 case "Mar":
			 month=2;
			 break;
			 case "Apr":
			 month=3;
			 break;
			 case "May":
			 month=4;
			 break;
			 case "Jun":
			 month=5;
			 break;
			 case "Jul":
			 month=6;
			 break;
			 case "Aug":
			 month=7;
			 break;
			 case "Sep":
			 month=8;
			 break;
			 case "Oct":
			 month=9;
			 break;
			 case "Nov":
			 month=10;
			 break;
			 case "Dec":
			 month=11;	 
		 }
		 switch(day)
		 {
			 case "01":
			 day=0;
			 break;
			 case "02":
			 day=1;
			 break;
			 case "03":
			 day=2;
			 break;
			 case "04":
			 day=3;
			 break;
			 case "05":
			 day=4;
			 break;
			 case "06":
			 day=5;
			 break;
			 case "07":
			 day=6;
			 break;
			 case "08":
			 day=7;
			 break;
			 case "09":
			 day=8;	 
		 }
		 //console.log('switch month-----------------------'+month);
		 //console.log('switch day-----------------------'+day);
		for(var m=0;m<12;m++){	
		 for(var d=0;d<31;d++){
			if(month==m && day==d)
			{
				//console.log('entering here--------------');
				//console.log('params************************************'+JSON.stringify(params));
				query='insert into effort_tracker.timesheet_month (timesheet_id , employee_id , project_id ,task_id) values ("'+resultData[j]+'", "'+params[i].Employee_Id+'","'+params[i].Project_Id+'","'+params[i].Task_Id+'" )';
				//console.log('params[i].Employee_Id...............................'+JSON.stringify(resultData[j]))
				//console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
				mysql_connect.execute(query, params, function (err, result) {
					//console.log('hell.....................................')
                      if (err) {
                      //console.log("inside excute query error>>>>>>>>> ",err);
                      next(err);
                    }else{
                      
                    }
                });
			}
		 }
		}
		 }
		 }	

		}
		}
		//console.log('headers....................'+params[k][headers[0]]);
	}*/
	
	],function(err, result){
			if(err){
				console.log('Error while executing async waterfall,', err);
				cb(err);
			}else{
				cb(null,"successful");
			}
		})
	
 };
 
 
prepareRequest = function(req,cb){
	
	var day  =[];
	var res = [];
	var data = {};
	
	for (var i=0; i<req[0].headerNames.length;i++){
		var date = req[0].headerNames[i].split(' ');
		day.push(date[2]);	
	}
	
	console.log('these are the dates@@@@@@@@@@@@@'+JSON.stringify(day));
	for (var i=0;i<req.length;i++){
			var data = {};
		data.value1 = req[i][req[0].headerNames[0]];
		data.value2 = req[i][req[0].headerNames[1]];
		data.value3 = req[i][req[0].headerNames[2]];
		data.value4 = req[i][req[0].headerNames[3]];
		data.value5 = req[i][req[0].headerNames[4]];
		data.value6 = req[i][req[0].headerNames[5]];
		data.value7 = req[i][req[0].headerNames[6]];
			
		res.push(data);
		
	}
	data.days = day;
	data.values = res;
	console.log('this is the response days'+JSON.stringify(data.days));
	console.log('this is the response'+JSON.stringify(data.values[0]));
	cb(null,data);	
} 

updateEfforts=function(req,cb)
{
	console.log('req**********************'+JSON.stringify(req));
	
}