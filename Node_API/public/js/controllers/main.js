angular.module('effortController', ['effortService'])
	// inject the Effort service factory into our controller
	.controller('mainController', ['$scope', '$http', '$location', 'Efforts', function ($scope, $http, $location, Efforts) {
		$scope.formData = {};
		$scope.loading = true;
		// $location.path('/signup');
		// $location.path('/login');
		// 	$location.path('/addProject');
		var task = [];
		var project = [];
		var projectId = [];
		var taskId = [];
		var workOrders = [];
		$scope.role = ["admin", "employee"];
		$scope.team = ["API", "CORE", "P2P8", ".Net"];
		$scope.rolegrouping = ["Development", "Management"];
		$scope.skillpremium = ["Yes", "No"];

		$scope.login = function () {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.empid != undefined && $scope.formData.password != undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Efforts.create($scope.formData)

					// if successful creation, call our get function to get all the new efforts
					.success(function (data) {
						console.log('this is the data' + data);
						var result = data;
						console.log(">>>>>>>>>>", result + ">>>>>>>>>>>>>>", typeof (result), JSON.stringify(result));
						if (result === "invalid") {
							alert("Invalid User");
							$location.path('/login');
						} else {
							Efforts.session_create(data).success(function (data) {
								console.log("res>>>>>>>>>>>>>>>>", data.role);
								if (data.role === 'admin')
									window.location = '/admin.html';
								else
									$location.path('/success');

							});
						}
					});
			}
		};
		$scope.signup = function () {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen


			if ($scope.formData == undefined) {
				alert("Please fill valid details");
			} else {
				console.log("empid.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.lastname);
				console.log("formdata.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData);
				// call the create function from our service (returns a promise object)
				Efforts.sign($scope.formData)

					// if successful creation, call our get function to get all the new efforts
					.success(function (data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.efforts = data; // assign our new list of efforts
						console.log('this is the data@@@@' + JSON.stringify($scope.efforts));
						alert("Employee added Successfully");
						window.location = "/admin.html";
					});
			}
		};

		$scope.getTechPro = function () {
			var skillprofile = $scope.formData.skillprofile;
			console.log(skillprofile, "value of skillprofile");
			Efforts.getTechProj($scope.formData.skillprofile).
				success(function (data) {
					console.log("result id ", data);
					//	console.log("result profile skill id 1", data[0].Profile_Key_Skills_Mix);
					var tech = JSON.stringify(data.Technology)
					var Technology = tech.replace(/\"/g, "");
					$scope.formData.technology = Technology;
					var proj = JSON.stringify(data.Profile_Key_Skills_Mix);
					var project_key = proj.replace(/\"/g, "");
					console.log("result profile skill id 1", project_key);
					$scope.formData.profileskills = project_key;
				});
		}

		$scope.fetchDetails = function () {

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
		$scope.submitDetails = function () {
			var emp_details = {};
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			console.log("task ID in main.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.empid);

			if ($scope.formData.empid != undefined || $scope.formData.taskId != undefined ||
				$scope.formData.projectId != undefined) {
				$scope.loading = true;
				console.log("task ID in main.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.taskId);
				Efforts.addEmpTask($scope.formData)

					// if successful creation, call our get function to get all the new efforts
					.success(function (data) {
						console.log("divine details " + JSON.stringify(data))
						//	$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$location.path('/success');
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
		// $scope.addtask = function () {
		//         console.log("inside controller<<<<<<<<<<<<<<<<<<<<<<");
		//         var taskData = {};
		//          console.log("inside task id<<<<<<<<<<<<<<<<<<<<<<",$scope.taskid);
		//         taskData = { 'Task Id': $scope.taskid, 'Task Name': $scope.taskname, 'Status': $scope.status, 'Cost Centre': $scope.costcentre }
		//         console.log("task data>>>>>>>>>>>>>>>>>>>>>>>>>>>", taskData);
		//     }

		$scope.deletebyId = function () {
			if ($scope.formData.employee_id == undefined) {
				alert("Invalid Employee ID");
			} else {

				console.log("inside delete method" + $scope.formData.employee_id);
				Efforts.deleteEmp($scope.formData.employee_id).success(function (data) {
					console.log('this is the data@@@@' + JSON.stringify(data));
					$scope.pageData = JSON.stringify(data)

					alert("Employee deleted successfully");
					window.location = "/admin.html";
				});

			}

		}

		//Employee update
		$scope.finalupdate = function () {
			if ($scope.formData.employee_id == undefined) {
				alert("Invalid Employee ID");
			} else {

				console.log("inside update  method" + $scope.formData.employee_id);
				Efforts.empUpdate($scope.formData);

				alert("Employee updated successfully");
				window.location = "/admin.html";
			}

		}

		//Team wise invoicing avishek......
		$scope.resource = function () {
			console.log('inside new mwhtod');
			Efforts.resourceReport($scope.WorkOrder)

				// if successful creation, call our get function to get all the new efforts
				.success(function (data) {
					$scope.loading = false;
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.efforts = data; // assign our new list of efforts
					console.log('this is the data@@@@' + JSON.stringify($scope.data));
					$scope.pageData = JSON.stringify(data)
				});
		};

		$scope.getDetailsbyId = function () {
			if ($scope.formData.employee_id == undefined) {
				alert("Invalid Employee ID");
			} else {
				console.log('inside get details by id' + $scope.formData.employee_id);
				Efforts.detailsbyId($scope.formData.employee_id)
					.success(function (data) {
						$scope.loading = false;
						// clear the form so our user is ready to enter another
						$scope.efforts = data; // assign our new list of efforts
						console.log('this is the data@@@@' + JSON.stringify(data));
						$scope.pageData = JSON.stringify(data)
						$scope.formData = data[0];
					});
			}
		}

		$scope.fetchAssociation = function () {

			var ass_task = [];
			var ass_work = [];
			var ass_project = [];

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.empid != undefined) {
				$scope.loading = true;

				console.log("empid.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.empid);
				// call the create function from our service (returns a promise object)
				Efforts.selectAssociation($scope.formData)

					// if successful creation, call our get function to get all the new efforts
					.success(function (data) {
						console.log(data.length);
						console.log('this is the data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + JSON.stringify(data));

						for (var i = 0; i < data.length; i++) {
							console.log('=================1');
							if (data[i].hasOwnProperty('task_id')) {
								console.log('=================2');
								ass_task.push(data[i].task_id);
								console.log('tasks.................' + ass_task);
								if (data[i].hasOwnProperty('project_id')) {
									console.log('=================3');

									ass_project.push(data[i].project_id);

									if (data[i].hasOwnProperty('workorder_id')) {
										console.log('=================4');
										ass_work.push(data[i].workorder_id);

										if (data[i].hasOwnProperty('start_date')) {
											$scope.formData.startdate = JSON.stringify(data[i].start_date).substring(1, 11);
											console.log('*******************after startdate');
											if (data[i].hasOwnProperty('end_date')) {
												console.log('*******************inside enddate');
												$scope.formData.enddate = JSON.stringify(data[i].end_date).substring(1, 11);
											}
										}

									}
								}
							}



							// $scope.griddata.hasOwnProperty(Task_Name) && task.push($scope.griddata[Task_Name]);

						}
						$scope.ass_task_Id = ass_task;
						$scope.ass_project_Id = ass_project;
						$scope.ass_workOrder_Id = ass_work;
						console.log('These are the taskId>>>>>>>>>>>>>>>>>>>' + ass_task);
						console.log('These are the projectID>>>>>>>>>>>>>>>>>>>' + ass_project);
						console.log('These are the work orders>>>>>>>>>>>>>>>>>>>' + ass_work);


					});
			}
		};


		//-----------------------------------------------------Rajeshwari
		$scope.DeleteAssociation = function () {
			var emp_details = {};
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			console.log("form data emp id.......>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + $scope.formData.empid);

			if ($scope.formData.empid != undefined || $scope.formData.workOrderId != undefined ||
				$scope.formData.taskId != undefined || $scope.formData.projectId != undefined) {
				$scope.loading = true;

				Efforts.deleteEmpAssociation($scope.formData)

					.success(function (data) {
						console.log("details " + JSON.stringify(data));
						window.alert("Deletion Successful!");
						$scope.formData = {}; // clear the form so our user is ready to enter another
					});
			}
		};

	}]);
