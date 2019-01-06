angular.module('taskpro', ['ngMaterial','ngMessages','effortService']).controller('taskproController', ['$scope', '$http', '$location', 'Efforts', function ($scope, $http, $location, Efforts)  {
    console.log("inside module");


    $scope.addtask = function () {
        console.log("inside controller<<<<<<<<<<<<<<<<<<<<<<");
        var taskData = {};
if ($scope.taskid == undefined && $scope.taskname == undefined && $scope.status == undefined) {
                alert("Fields should not be empty");
            }
            else if ($scope.startdate > $scope.enddate) {
                alert("end date should be greater than start date");
            }

            else {
                taskData = {
                    'Task_Id': $scope.taskid, 'Task_Name': $scope.taskname, 'Status': $scope.status,
                    'Task_StartDate': $scope.startdate, 'Task_EndDate': $scope.enddate
                }
                console.log("inside task id<<<<<<<<<<<<<<<<<<<<<<", $scope.startdate);
                // console.log("inside datepicker", taskData);
                console.log("task data>>>>>>>>>>>>>>>>>>>>>>>>>>>", taskData);
                Efforts.addtask(taskData).
                    success(function (data) {
                        console.log('this is the data', data);
                        alert("Task Added Successfully");
                        window.location = '/admin.html';
                    });

            }
        }

        $scope.addproject = function () {
            console.log("inside controller<<<<<<<<<<<<<<<<<<<<<<");
            var projectData = {};
            console.log("inside task id<<<<<<<<<<<<<<<<<<<<<<", $scope.startdate);
            if ($scope.projectid == undefined && $scope.projectname == undefined && $scope.fundee == undefined && $scope.costcentre == undefined && $scope.supplierid == undefined && $scope.expenses == undefined && $scope.tdcontract == undefined && $scope.supplier_contract == undefined &&
                $scope.invoice_number == undefined && $scope.contract_type == undefined && $scope.invoice == undefined &&
                $scope.currency == undefined && $scope.lob == undefined && $scope.project_desc == undefined &&
                $scope.sow == undefined && $scope.tdmanager == undefined &&
                $scope.engagement_type == undefined && $scope.core_flex == undefined && $scope.project_code == undefined &&
                $scope.pm == undefined && $scope.adm == undefined && $scope.suppliername == undefined) {
                alert("Fields should not be empty");
            }
            else if ($scope.startdate > $scope.enddate) {
                alert("end date should be greater than start date");
            }
            else {
                projectData = {
                    'Project_Id': $scope.projectid, 'Project_Name': $scope.projectname, 'Fundee': $scope.fundee, 'Cost_Centre': $scope.costcentre,
                    'Project_StartDate': $scope.startdate, 'Project_EndDate': $scope.enddate, 'SOW': $scope.sow, 'TD_RManager': $scope.tdmanager,
                    'Supplier_Id': $scope.supplierid, 'Expenses': $scope.expenses, 'TD_Contract': $scope.tdcontract, 'Supplier_Contract': $scope.supplier_contract,
                    'Invoice_Number': $scope.invoice_number, 'Contract_Type': $scope.contract_type, 'Invoice': $scope.invoice, 'Currency': $scope.currency,
                    'LOB': $scope.lob, 'Project_Desc': $scope.project_desc, 'Engagement_Type': $scope.engagement_type, 'Core_Flex': $scope.core_flex,
                    'Project_Code': $scope.project_code, 'PM': $scope.pm, 'ADM': $scope.adm, 'Supplier_Name': $scope.suppliername
                };

                Efforts.addproject(projectData).success(function (data) {
                    console.log("Result is ..........", data);
                    alert("Project Added Successfully");
                    window.location = '/admin.html';
                });
            }
        }
        //===================================================================Rajeshwari
        $scope.updateTask = function () {
            console.log("inside controller<<<<<<<<<<<<<<<<<<<<<<");
            var taskData = {};
            if ($scope.formData.task_id == undefined) {
                alert("Task Id should not be empty");
                if ($scope.formData.task_startdate > $scope.formData.task_enddate) {
                    alert("end date should be greater than start date");
                }
            } else {
                taskData = {
                    'Task Id': $scope.formData.task_id, 'Task Name': $scope.formData.task_name, 'Status': $scope.formData.status,
                    'Task Start Date': $scope.formData.task_startdate, 'Task End Date': $scope.formData.task_enddate
                }
                console.log("inside task id<<<<<<<<<<<<<<<<<<<<<<", $scope.formData.task_startdate);
                // console.log("inside datepicker", taskData);
                console.log("task data>>>>>>>>>>>>>>>>>>>>>>>>>>>", taskData);

                Efforts.updateTaskDetails($scope.formData)
                    .success(function (data) {

                        console.log("details " + JSON.stringify(data));
                        alert("Task Updated Successfully");
                        window.location = '/admin.html';
                    });
            }
        };

        //===================================================================Rajeshwari
        $scope.fetchTaskDetails = function () {
            if ($scope.formData.task_id == undefined) {
                alert("Kindly enter Task ID");
            } else {
                Efforts.fetchTasks($scope.formData)
                    .success(function (data) {

                        $scope.formData = data[0];
                        $scope.formData.task_startdate = $scope.formData.task_startdate.substring(0, 10);
                        $scope.formData.task_enddate = $scope.formData.task_enddate.substring(0, 10);
                        console.log("details " + JSON.stringify(data));

                    });
            }
        };

        $scope.deleteproject = function () {
            console.log("inside delete method");

            Efforts.deleteProject($scope.formData.project_id);
            alert("Project Deleted Successfully");
            window.location = '/admin.html';
        };
        /////////////////////////////////////////////////////////////
        $scope.deletetask = function () {
            console.log("inside delete method");
            if ($scope.formData.task_id == undefined) {
                alert("Task Id should not be empty");
            } else {
                Efforts.deleteTask($scope.formData.task_id);
                alert("Task Deleted Successfully");
                window.location = '/admin.html';
            }
        };
        //===========================================================================
        $scope.updateProject = function () {
            if ($scope.formData == undefined) {
                alert("Fields should not be empty")
            }
            else if ($scope.formData.project_startdate > $scope.formData.project_enddate) {
                alert("end date should be greater than start date");

            } else {
                Efforts.updateProjectDetails($scope.formData)
                    .success(function (data) {
                        console.log("divine details " + JSON.stringify(data))
                        //	$scope.loading = false;
                        $scope.formData = {};
                        alert("Project Updated Successfully");
                        window.location = '/admin.html';

    });
}
};

$scope.fetchDetails = function () {
  if ($scope.formData.project_id == undefined) {
    alert("Please enter valid Project_id");
}else{

    $scope.loading = true;

    console.log("projectid1.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.project_id);

    Efforts.fetchProject($scope.formData)

      // if successful creation, call our get function to get all the new efforts
      .success(function (data) {


        console.log('this is the data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + JSON.stringify(data));

                        $scope.formData= data[0];
 $scope.formData.suppliername = $scope.formData.suppliername;
$scope.formData.project_startdate=$scope.formData.project_startdate.substring(0,10);
      $scope.formData.project_enddate=$scope.formData.project_enddate.substring(0,10);



      });
    }
  }

    $scope.addworkorder = function () {
        console.log("inside controller<<<<<<<<<<<<<<<<<<<<<<");
        var workorderData = {};
        console.log("inside work order<<<<<<<<<<<<<<<<<<<<<<", $scope.workorderid);
            if ($scope.workorderid == undefined && $scope.workordername == undefined) {
                alert("Field should not be empty");
            }
            else if ($scope.res_startdate > $scope.res_enddate) {
                alert("end date should be greater than start date");
            }
            else {
                workorderData = {
                    'WorkOrder_Id': $scope.workorderid, 'Resource_StartDate': $scope.res_startdate,
                    'Resource_EndDate': $scope.res_enddate, 'Work_Order': $scope.workordername
                }
                console.log("task data>>>>>>>>>>>>>>>>>>>>>>>>>>>", workorderData);
                Efforts.addworkorder(workorderData)
                    .success(function (data) {
                        console.log("divine details ............" + JSON.stringify(data))
                        alert("WorkOrder Added Successfully");
                        window.location = '/admin.html';

                    });
            }
        }
        //get workorderby by ID


        $scope.getwrkordrbyId = function () {
            console.log("inside getbyid workorder ");
            if ($scope.formData == undefined) {
                alert("workorderid should not be empty");
            } else {
                    Efforts.getWorkorderbyid($scope.formData.work_orderid)
                    .success(function (data) {
                         console.log('this is the data@@@@' + JSON.stringify(data));
                        $scope.loading = false;
                        $scope.formData = data[0]; // clear the form so our user is ready to enter another
                        $scope.formData.res_startdate = $scope.formData.res_startdate.substring(0, 10);
                        $scope.formData.res_enddate = $scope.formData.res_enddate.substring(0, 10);

                        $scope.efforts = data; // assign our new list of efforts
                        console.log('this is the data@@@@' + JSON.stringify(data));
                    });
            }
        }
        //workorder update

        $scope.workorderUpdate = function () {
            if ($scope.formData == undefined && $scope.formData.work_order == undefined) {
                alert("workorderid and name should not be empty");
            } else {
                console.log("inside update  method" + $scope.formData);
                Efforts.workorderupdate($scope.formData).success(function (data) {
                     console.log('this is the data@@@@' + JSON.stringify(data));
                alert("WorkOrder Updated Successfully");
                window.location = '/admin.html';
            });
            }


			}
//delete

$scope.deleteworkorder=function(){
              console.log("inside delete method");
              if ($scope.formData.work_orderid == undefined) {
                alert("Please enter valid Project_id");
            } else {
                Efforts.deleteworkorder($scope.formData.work_orderid)
                    .success(function (data) {
                        console.log("divine details " + JSON.stringify(data))
                        //	$scope.loading = false;
                        $scope.formData = {};
                        alert("WorkOrder Deleted Successfully");
                        window.location = '/admin.html';
                    });
            }

        }
        $scope.unbilledReport = function () {
            console.log("inside unbilled report");
            var unbilledData = {};
            unbilledData = { 'startdate': $scope.startdate, 'enddate': $scope.enddate };
            if ($scope.startdate > $scope.enddate) {
                alert("end date should be greater than start date");
            } else {
                console.log("Data is>>>>>>>>>>>", unbilledData);
                Efforts.unbilledReport(unbilledData).success(function (data) {
                    console.log("This is the report");
                    window.location = '/admin.html';
                })
            }
        }
        $scope.resourceWiseReport = function () {
            console.log("inside project Wise report");
            var reportData = {};
            reportData = { 'team_name': $scope.teamname, 'startdate': $scope.startdate, 'enddate': $scope.enddate };
            if ($scope.startdate > $scope.enddate) {
                alert("end date should be greater than start date");
                window.location = "/admin.html";
            } else {
                console.log("Data is>>>>>>>>>>>", reportData);
                Efforts.resourceWiseReport(reportData).success(function (data) {
                    console.log("This is the report");
                    alert("ResourceWise Report generated Successfully");
                    window.location = '/admin.html';
                })
            }
        }
        $scope.laborReport = function () {
            console.log("inside Labor report");
            console.log("Data is>>>>>>>>>>>");
            var laborData = {};
            laborData = { "startdate": $scope.startdate, "enddate": $scope.enddate };
            console.log("laborData is", laborData);
            Efforts.laborReport(laborData);
            // .success(function (data) {
            //     var blob = new Blob([data],
            //         { type: 'application/vnd.openxmlformat-officedocument.spreadsheetml.sheet;' });
            //     FileSaver.saveAs(blob, fileName);
            //     console.log(data);
            //     alert("Report Generated Successfully");
            //     window.location = '/admin.html';
            // })

        }

        $scope.fetchProDetails = function () {

					// validate the formData to make sure that something is there
					// if form is empty, nothing will happen
					if ($scope.formData.empid != undefined) {
						$scope.loading = true;

						console.log("empid.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.empid);
						// call the create function from our service (returns a promise object)
						Efforts.selectTask()

							// if successful creation, call our get function to get all the new efforts
							.success(function (data) {
		            console.log(data.length);
								console.log('this is the data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + JSON.stringify(data));

								console.log($scope.griddata + 'kjakjakjakj');

								console.log($scope.griddata + ">>>>>>>>>>>")

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].hasOwnProperty('Task_Name')) {/// logic for task id nad task name

		                //task.push(data[i].Task_Name);
		                task.push(data[i].Task_Name);
		                if (data[i].hasOwnProperty('Task_Id')) {

		                  taskId.push(data[i].Task_Id);
		                }
		              }
		              else if (data[i].hasOwnProperty('Project_Name')) {//// logic for project id and projectName

		                project.push(data[i].Project_Name);
										if (data[i].hasOwnProperty('Project_Id')) {

                                    projectId.push(data[i].Project_Id);
                                }
                            }
                            else if (data[i].hasOwnProperty('work_orderid')) {
                                workOrders.push(data[i].work_orderid);
                            }


									// $scope.griddata.hasOwnProperty(Task_Name) && task.push($scope.griddata[Task_Name]);

								}
								console.log(task + 'aa raha hai');
								console.log(project + 'aa raha hai');
								$scope.taskName = task;
								$scope.projectName = project;
								$scope.task_Id = taskId;
								$scope.project_Id = projectId;
								$scope.workOrder_Id = workOrders;
								console.log('These are the taskId>>>>>>>>>>>>>>>>>>>' + taskId);
								console.log('These are the projectID>>>>>>>>>>>>>>>>>>>' + projectId);
								console.log('These are the tasksssss>>>>>>>>>>>>>>>>>>>' + task);
								console.log('These are the project>>>>>>>>>>>>>>>>>>>' + project);
								console.log('These are the work orders>>>>>>>>>>>>>>>>>>>' + workOrder_Id);

							});
					}
				};

        $scope.taskNameselect = function () {
    			console.log('say heloo00000');
    			console.log($scope.formData.taskName);
    			var index = task.indexOf($scope.formData.taskName);
    			console.log(index);
    			console.log(taskId[index]);
    			$scope.t_Id = taskId[index];

        }
        $scope.projectNameselect = function () {
    			console.log('say heloo0000011');
    			console.log($scope.formData.projectName);
    			var index = project.indexOf($scope.formData.projectName);
    			console.log(index + 'index of projectid');
    			console.log(projectId[index]);
    			$scope.p_Id = projectId[index];
        }

        //-----------------------------------------------------Rajeshwari Divine
        $scope.submitDetails = function () {

            console.log("task ID in main.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.empid);
            if ($scope.startdate > $scope.enddate) {
                alert("end date should be greater than start date");
            }
            else {
                if ($scope.formData.empid != undefined || $scope.formData.taskId != undefined ||
                    $scope.formData.projectId != undefined || $scope.formData.startdate != undefined || $scope.formData.enddate != undefined) {
                    $scope.loading = true;
                    console.log("task ID in main.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.taskId);
                    Efforts.addEmpTask($scope.formData)

              .success(function (data) {
                console.log("divine details " + JSON.stringify(data))
                window.alert("Addition Successful!");
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $location.path('/success');
              });
          }
        }
        };
}]);
