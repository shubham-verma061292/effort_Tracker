angular.module('uigridCtrl', ['ui.grid', 'ui.grid.edit', 'effortController', 'effortService'])
    .controller("uigridEffortCtrl", ['$scope', 'Efforts', function ($scope, Efforts) {
        // var data=$cookieStore.get(data);
        $scope.arrlist = [{
            "userid": 1,
            "name": "JAN"
        }, {
                "userid": 2,
                "name": "FEB"
            }, {
                "userid": 3,
                "name": "MAR"
            }];

        $scope.columnDefines = [];
        $scope.work_order_track = [{"name":"API"},{"name":"Core"},{"name":"P2P8"},{"name":"HELOC"},{"name":"TestNet"},{"name":"RBADT"},{"name":"RICA"}];
        $scope.select_wot = function() {
            console.log('Hell------' +$scope.select_w_o_t);
              var work_order_track = $scope.select_w_o_t;
          }
        $scope.checkselection1 = function () {
            var month = $scope.userSelect1.name;
            var datearr = [];
            Efforts.interval(month).success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    datearr[i] = data[i].Interval_Time;
                }
                $scope.interval = datearr;
                //$location.path('/success');
            });
        }
        $scope.checkselection2 = function () {
            dts = checkselection3($scope.userSelect2);
            $scope.data1 = [];
            var taskdetails = [];
            var Employee_Id;
            Efforts.get_session( ).success(function (data) {
                console.log('Getting the Session ID ' + JSON.stringify(data));
                Employee_Id = data.emp_id;
                console.log("----------------", Employee_Id);
                Efforts.task(Employee_Id).success(function (data) {
                    console.log("-----------inside sesssion-----", Employee_Id);
                console.log('this is the task data' + JSON.stringify(data));
                for (var i = 0; i < data.length; i++) {
                    taskdetails[i] = data[i];
                }
                $scope.data1 = taskdetails;
                console.log("----------------", $scope.data1);

                //$location.path('/success');
            });
            });
            setTimeout(function() {


          }, 60000);
            console.log(">>>>>>>>>>>>>" + dts);
            $scope.columnDefs = [
                { name: 'Task_Id', cellEditableCondition: false },
                { name: 'Task_Name', cellEditableCondition: false },
                { name: 'Project_Id', cellEditableCondition: false },
                { name: 'Project_Name', cellEditableCondition: false },
                { name: dts[0], cellEditableCondition: true },
                { name: dts[1], cellEditableCondition: true },
                { name: dts[2], cellEditableCondition: true },
                { name: dts[3], cellEditableCondition: true },
                { name: dts[4], cellEditableCondition: true },
                { name: dts[5], cellEditableCondition: true },
                { name: dts[6], cellEditableCondition: true }
            ];
        }
        $scope.submit_task=function(){
             var effortData='';
             var headerNames=[];
             effortData=$scope.data1;
             console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+JSON.stringify(effortData));
               for(var i=4;i<$scope.columnDefs.length;i++){
                headerNames.push($scope.columnDefs[i].name)
               }
                validate(effortData,headerNames)
              console.log("this are headers"+headerNames);
             Efforts.fillEfforts(effortData,headerNames).success(function(data){
                 console.log("efforts submitted successfully>>>>>>>>>>>>>>>>>");
             });
          }

          var validate=function(effortData,headerNames){
          var edata = '';
          var totalefforts=0
          var effort_data=[];
          for(var i=0;i<effortData.length;i++)
          {
          if(!effort_data[i])
          effort_data[i] = []
          edata=effortData[i];
          for(var j=0;j<headerNames.length;j++)
          {
          if(edata[headerNames[j]]===undefined)
          edata[headerNames[j]]=0;
          effort_data[i][j] = edata[headerNames[j]];
          }
          }

          var sum=0;
          for(var i=0;i<headerNames.length;i++)
          {
          sum=0;
          for(var j=0;j<effortData.length;j++)
               {
              //  var patt1 = new RegExp("[0-8.75|null|\s|'']");
                if(!effort_data[j][i].toString().match("[a-zA-Z0-9]")){
                  effort_data[j][i] = null;
                }
              var patt = new RegExp("[0-8.75]");
              var res = patt.test(effort_data[j][i]);
              if(effort_data[j][i] === null || typeof effort_data[j][i] === 'undefined' || effort_data[j][i] === 'PTO' || patt.test(effort_data[j][i]))
              {
                  if(effort_data[j][i]==="PTO" ){
                    var counter=0;
                        for(var k=0;k<effort_data.length-j;k++){
                        if((effort_data[k][i]==="0" || effort_data[k][i]===0 || effort_data[k][i]===undefined || effort_data[k][i]==='') || effort_data[k][i]==='PTO')
                        {
                          if(effort_data[k][i]==='PTO'){
                            counter++;
                          }
                          if(counter===2){
                            alert("PTO should not be more than once for one date!!! ");
                            effort_data[k][i]='';
                          }
                          effort_data[j][i]=0;
                          sum =sum + Number(effort_data[j][i]);
                          //  console.log('sum of efforts is:::::: ' + sum+" for date: "+headerNames[i]);
                        }
                        else {
                        alert("efforts should not be there if PTO remove "+effort_data[k][i]);
                        effort_data[k][i]='';
                        }
                      }
                  }
                  else
                  {
                  sum =sum + Number(effort_data[j][i]);
                  if(sum > 8.75)
                  {
                  alert("efforts should not be greater than 8.75");
                  effort_data[j][i]='';
                  }
                  else {
                //  console.log("success");
                  }
                  }
              }
              else
              {
              alert("please enter the efforts in proper format:"+effort_data[j][i]);
              effort_data[j][i]=null;
              }

          }
            console.log('sum of efforts is:::::: ' + sum+" for date: "+headerNames[i]);
          }
          return sum;
          }

          $scope.generate_effort_Report=function(){
              var w_o_t = [{"name" :"IT3.0"}];
              console.log('Generating Report');
              Efforts.gen_eff_sheet(w_o_t).success(function(data){
              console.log("efforts sheet created successfully>>>>>>>>>>>>>>>>>");
              });
          }

    }]);





var showDate = function (stend) {
    var input = [];
    input = stend;
    var datesArray = [];
    var startdate = new Date(input[0]);
    var enddate = new Date(input[1]);
    while (startdate <= enddate) {
        datesArray.push(new Date(startdate).toString().substring(0, 15));
        startdate.setDate(startdate.getDate() + 1);
        console.log('inside while hello');
    }
    console.log(datesArray + 'inside showdate fn');
    return datesArray;
}
var checkselection3 = function (interval1) {
    var dtinterval = [];
    dtinterval = interval1.split("-");
    var results = [];
    results = showDate(dtinterval);
    return results;

}
