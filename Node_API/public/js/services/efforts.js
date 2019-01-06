var app=angular.module('effortService', [])

	// super simple service
	// each function returns a promise object
var saveAs = saveAs || function (e) { "use strict"; if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) { return } var t = e.document, n = function () { return e.URL || e.webkitURL || e }, r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"), o = "download" in r, a = function (e) { var t = new MouseEvent("click"); e.dispatchEvent(t) }, i = /constructor/i.test(e.HTMLElement) || e.safari, f = /CriOS\/[\d]+/.test(navigator.userAgent), u = function (t) { (e.setImmediate || e.setTimeout)(function () { throw t }, 0) }, s = "application/octet-stream", d = 1e3 * 40, c = function (e) { var t = function () { if (typeof e === "string") { n().revokeObjectURL(e) } else { e.remove() } }; setTimeout(t, d) }, l = function (e, t, n) { t = [].concat(t); var r = t.length; while (r--) { var o = e["on" + t[r]]; if (typeof o === "function") { try { o.call(e, n || e) } catch (a) { u(a) } } } }, p = function (e) { if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) { return new Blob([String.fromCharCode(65279), e], { type: e.type }) } return e }, v = function (t, u, d) { if (!d) { t = p(t) } var v = this, w = t.type, m = w === s, y, h = function () { l(v, "writestart progress write writeend".split(" ")) }, S = function () { if ((f || m && i) && e.FileReader) { var r = new FileReader; r.onloadend = function () { var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;"); var n = e.open(t, "_blank"); if (!n) e.location.href = t; t = undefined; v.readyState = v.DONE; h() }; r.readAsDataURL(t); v.readyState = v.INIT; return } if (!y) { y = n().createObjectURL(t) } if (m) { e.location.href = y } else { var o = e.open(y, "_blank"); if (!o) { e.location.href = y } } v.readyState = v.DONE; h(); c(y) }; v.readyState = v.INIT; if (o) { y = n().createObjectURL(t); setTimeout(function () { r.href = y; r.download = u; a(r); h(); c(y); v.readyState = v.DONE }); return } S() }, w = v.prototype, m = function (e, t, n) { return new v(e, t || e.name || "download", n) }; if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) { return function (e, t, n) { t = t || e.name || "download"; if (!n) { e = p(e) } return navigator.msSaveOrOpenBlob(e, t) } } w.abort = function () { }; w.readyState = w.INIT = 0; w.WRITING = 1; w.DONE = 2; w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null; return m } (typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content); if (typeof module !== "undefined" && module.exports) { module.exports.saveAs = saveAs } else if (typeof define !== "undefined" && define !== null && define.amd !== null) { define("FileSaver.js", function () { return saveAs }) };
	app.factory('Efforts', ['$http', function ($http) {
		return {
			// get : function() {
			// 	console.log('-----------inside Get Method-----------');
			// 	return $http.get('/api/efforts');
			// },
			create: function (effortData) {
				return $http.post('/api/login', effortData);
			},
			sign: function (effortData) {
				console.log('----------inside signup method------' + effortData);
				return $http.post('/api/registration', effortData);
			},
			session_create :function(session_data){
				console.log('----------inside Session create method------'+ JSON.stringify(session_data));
				return $http.post('/api/createsession', session_data);
			},
			get_session:function( ){
				console.log('----------inside Session Get method------');
				return $http.get('/api/get_session');
			},
			fillEfforts : function(effortData,headerNames) {
				effortData[0].headerNames=headerNames;
				console.log('----------inside fill efforts method------'+ JSON.stringify(effortData));
				return $http.post('/api/effort', effortData);
			},
			gen_eff_sheet: function(work_order_track) {
				console.log('----------inside generate effort sheet method------' + work_order_track);
				return $http.post('/api/generate_effort_report', work_order_track);
			},
			interval: function (month) {
				var mont = {};
				mont.month = month;
				return $http.post('/api/select_month', mont);
			},
			task: function (Employee_Id) {
				var emId = {};
				emId.Employee_Id = Employee_Id;
				return $http.post('/api/get_project', emId);
			},
			selectTask: function () {
				console.log('---------------------------inside select project/task method-----------------------');
				return $http.get('/api/select_projecttasks');
			},
			addEmpTask: function (effortData) {
				console.log('---------------------------inside select project/task method-----------------------' + JSON.stringify(effortData));
				return $http.post('/api/add_projectTasks', effortData);
			},
			leaves: function (leaveData) {
				console.log('----------inside leaves method------' + leaveData);
				return $http.post('/api/leaves', leaveData);
			},
			leaveGenerate: function (month) {
				console.log('----------inside leaveGenerate method------' + month);
				var mont = {};
				mont.month = month;
				return $http.post('/api/leaveGenerate', mont);
			},
			intervalReport: function (leaveInterval) {
				console.log('----------inside leaveInterval method------' + JSON.stringify(leaveInterval));
				return $http.post('/api/leaveReport', leaveInterval);
			},
			addtask: function (taskData) {
				console.log('----------inside taskData method------' + JSON.stringify(taskData));
				return $http.post('/api/add_task', taskData);
			},
			addproject: function (projectData) {
				console.log('----------inside projectData method------' + JSON.stringify(projectData));
				return $http.post('/api/add_project', projectData);
			},
			updateTaskDetails: function (taskData) {
				console.log('----------inside updateTaskDetails method------' + JSON.stringify(taskData));
				return $http.post('/api/updateTasks', taskData);
			},
			fetchTasks: function (taskData) {
				console.log('----------inside updateTaskDetails method------' + JSON.stringify(taskData));
				return $http.post('/api/fetchTask', taskData);
			},
			deleteProject: function (projectId) {
				console.log('inside efforts of delete project' + projectId);
				var projctid = {};
				projctid.projectId = projectId;
				return $http.post('/api/deleteproject', projctid);
			},
			deleteTask: function (taskId) {
				console.log('inside efforts of delete project' + taskId);
				var taskiid = {};
				taskiid.taskId = taskId;
				return $http.post('/api/deletetask', taskiid);
			},
			detailsbyId: function (empid) {
				console.log('inside details by id of efforts' + empid);
				var empiid = {};
				empiid.empid = empid;
				return $http.post('/api/getbyid', empiid);
			},
			//////////////////////////////////Avishek
			resourceReport: function (WorkOrder) {
				console.log('inside efforts.js file report function' + WorkOrder);
				var IID = {};
				IID.WorkOrder = WorkOrder;
				return $http.post('/api/resourceWise', IID);
			},
			empUpdate: function (formdata) {
				console.log('inside final update  efforts' + formdata);


				return $http.post('/api/updateemp', formdata);
			},
			deleteEmp: function (formdata) {
				var empiid = {};
				empiid.empid = formdata;
				console.log('inside final update  efforts' + formdata);
				return $http.post('/api/deleteemp', empiid);
			},
			updateProjectDetails: function (projectData) {
				console.log('----------inside updateTaskDetails method------' + JSON.stringify(projectData));
				return $http.post('/api/updateProjects', projectData);
			},
			fetchProject: function (project_id) {
				console.log('---------------------------inside select fetchDetails method-----------------------' + JSON.stringify(project_id));
				return $http.post('/api/fetch_projecttasks', project_id);
			},
			addworkorder: function (workOrderData) {
				console.log('----------inside projectData method------' + JSON.stringify(workOrderData));
				return $http.post('/api/add_workOrder', workOrderData);
			},
			selectAssociation: function (associationData) {
				console.log('----------inside projectData method------' + JSON.stringify(associationData));
				return $http.post('/api/get_association', associationData);
			},
			getWorkorderbyid: function (formdata) {
				var empiid = {};
				empiid.empid = formdata;
				console.log('inside efforts of getworkorder');
				return $http.post('/api/getbyidworkorder', empiid);
			},
			workorderupdate: function (formdata) {
				return $http.post('/api/workorderupdate', formdata);
			},
			deleteworkorder: function (workorderId) {
				console.log('inside efforts of delete project' + workorderId);
				var workorderid = {};
				workorderid.workorderId = workorderId;
				return $http.post('/api/deleteworkorder', workorderid);
			},
	laborReport: function (laborData) {
			console.log('----------inside labor method------', laborData);
			//return $http.post('/api/generateLaboreport', laborData).then(function (response) {
			return $http({
				url: '/api/generateLaborReport',
				method: 'POST',
				responseType: 'arraybuffer',
				data: laborData, //this is your json data string
				headers: {
					'Content-type': 'application/json',
					'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				}
			}).success(function (data) {
				var blob = new Blob([data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				});
				saveAs(blob, 'WebServicesLaborReport' + '.xlsx');
			}).error(function () {
				console.log('error');
			});

		},
			resourceWiseReport:function(reportData){
			console.log('----------inside resourceWiseReport method------'+JSON.stringify(reportData));
	return $http({
				url: '/api/resourceWiseReport',
				method: 'POST',
				responseType: 'arraybuffer',
				data: reportData, //this is your json data string
				headers: {
					'Content-type': 'application/json',
					'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				}
			}).success(function (data) {
				var blob = new Blob([data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				});
				saveAs(blob, 'resourceWiseReport' + '.xlsx');
			}).error(function () {
				console.log('error');
			});
		},

			unbilledReport: function (unbilledData) {
				console.log('----------inside unbilledReport method------' + JSON.stringify(unbilledData));
	return $http({
				url: '/api/unbilledReport',
				method: 'POST',
				responseType: 'arraybuffer',
				data: unbilledData, //this is your json data string
				headers: {
					'Content-type': 'application/json',
					'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				}
			}).success(function (data) {
				var blob = new Blob([data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				});
				saveAs(blob, 'unbilledReport' + '.xlsx');
			}).error(function () {
				console.log('error');
			});
		},
			deleteEmpAssociation:function(assocData){
					console.log('----------inside projectData method------'+JSON.stringify(assocData));
					return $http.post('/api/deleteAssociation',assocData);
			},
			getTechProj: function(skillprofile) {
				console.log(skillprofile,"value");
				var id={};
				id.skillprofile=skillprofile;
				console.log(id.skillprofile,"value id");
				return $http.post('/api/skill_profile',id);
			}


			// delete : function(id) {
			// 	return $http.delete('/api/efforts/' + id);
			// }
		}
	}]);
