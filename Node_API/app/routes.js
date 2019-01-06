var Effort = require('./models/effort');
var SubmitEffort = require('./models/submit_efforts');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var path = require('path');
var sess;


function getEfforts(res) {
    Effort.find(function (err, efforts) {
        console.log('---------Inside get Efforts');
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            console.log('---------');
            res.send(err);
        }
        console.log('Output efforts' + JSON.stringify(efforts));
        res.json(efforts); // return all efforts in JSON format
    });

    //res.json("Hi");
};

module.exports = function (app) {
    app.use(cookieParser());
    app.use(session({ secret: 'mysecretkey' }));
    // api ---------------------------------------------------------------------
    // get all efforts
    app.get('/api/efforts', function (req, res) {
        // use mysql to get all efforts in the database
        getEfforts(res);
    });


    // create effort and send back all efforts after creation
    app.post('/api/efforts', function (req, res) {

        // create a effort, information comes from AJAX request from Angular
        Effort.create({
            text: req.body.text,
            done: false
        }, function (err, effort) {
            if (err)
                res.send(err);

            // get and return all the efforts after you create another
            getEfforts(res);
        });

    });
    //For submitting effort data
        app.post('/api/effort', function (req, res) {
          console.log("my function is called");
          var request = req.body;
            // create a effort, information comes from AJAX request from Angular
            Effort.submit_effort(request, function (err, effort) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("Efforts updated successfully");
                }
                // get and return all the efforts after you create another
                //getEfforts(res);
            });
        });
    //For registration
    app.post('/api/registration', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        console.log("inside sign up");
        Effort.registration(req, function (err, effort) {
            if (err) {
                console.log("errrororororo");
                res.send(err);
            }
            else {
                console.log("success");
                res.send("data updated successfully");
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });

    // For login
    app.post('/api/login', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        Effort.login(request, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });
    });


    //For selecting month
    app.post('/api/select_month', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        console.log("------------", req.body);
        Effort.select_month(req, function (err, effort) {
            if (err) {
                console.log("--------------", req);
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });
    });
    // For get_project
    app.post('/api/get_project', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        Effort.get_project(req, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    // For generating effort sheet
    app.post('/api/generate_effort_report', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        Effort.gen_effort_sheet(req, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    // For generating effort sheet
    app.post('/api/generate_effort_report', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        Effort.gen_effort_sheet(req, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    // For creating session
    app.post('/api/createsession', function (req, res) {
        var request = req.body;
        console.log('Inside Create Session of Route', JSON.stringify(request));
        req.session.emp_id = request.emp_id;
        req.session.role = request.role;
        res.send(req.session);
    });
    // For getting session
    app.get('/api/get_session', function (req, res) {
        var request = req.body;
        if (req.session.id) {
            console.log('Session id is' + req.session.emp_id + ' session role ' + req.session.role);
        }
        res.send(req.session);
    });

    //For Add Project
    app.post('/api/add_project', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        //  console.log(request,">>>>>>>>>>>>>>>>>>>>>>>>>>>",request);
        Effort.add_project(request, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                console.log("updated successfully");
                res.send(result);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    //For Add Task
    app.post('/api/add_task', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        console.log('this is the request@@@@@' + JSON.stringify(request));
        Effort.add_task(request, function (err, result) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully");
                res.send(result);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });

    // For leaves
    app.post('/api/leaves', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        var from_date = req.body.from_date;
        console.log(">>>>>>>>>>>>>>>>>>>>" + from_date);
        Effort.leaves(request, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                console.log("leaves updated successfully>>>>>>>>");
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });


    app.post('/api/leaveGenerate', function (req, res) {
        console.log(">>>>>>>>>>>>>>>>>>>>???????????" + JSON.stringify(req.body));
        Effort.showleave(req, function (err, effort) {
            if (err) {
                console.log(">>>>>>>>>>>>>>>>>>>>error in leave generation");
                res.send(err);
            }
            else {
                console.log("leaves generated successfully>>>>>>>>" + JSON.stringify(effort));
                res.send(effort);
            }
        });

    });


    app.post('/api/leaveReport', function (req, res) {
        console.log(">>>>>>>>>>>>>>>>>>>>???????????" + JSON.stringify(req.body));
        var request = req.body;

        Effort.generateReport(request, function (err, effort) {
            if (err) {
                console.log(">>>>>>>>>>>>>>>>>>>>error in leave generation");
                res.send(err);
            }
            else {
                console.log("leaves generated successfully>>>>>>>>" + JSON.stringify(effort));
                res.send(effort);
            }
        });

    });
    // delete a effort
    app.delete('/api/efforts/:effort_id', function (req, res) {
        Effort.remove({
            _id: req.params.effort_id
        }, function (err, effort) {
            if (err)
                res.send(err);

            getEfforts(res);
        });
    });

    app.post('/api/excelreport', function (req, res) {
        Effort.report(req, function (err, result) {
            if (err) {
                console.log(">>>>>>>>>>>>>>>..........", err);
                res.send(err);
            } else {
                console.log("sucesssssssssssssssssssssssss");
                res.send(result);
            }
        })
    });

    app.get('/api/select_projecttasks', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        Effort.select_projecttasks(req, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });


    app.post('/api/add_projectTasks', function (req, res) {
        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(req.body));
        Effort.add_projectTasks(request, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully");
                 res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });

    //For logout
    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log('this is the error' + err);
            }
            else {
                console.log('you have successfully logged out@@@@@@@@@@@@@');
            }
            //res.redirect('/');
        })
    });
    //===================================================================Rajeshwari
    app.post('/api/updateTasks', function (req, res) {
        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(req.body));
        Effort.updateTaskDetail(request, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully");
                res.send(effort);
            }
        });
    });
    //===================================================================Rajeshwari
    app.post('/api/fetchTask', function (req, res) {
        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(req.body));
        Effort.selectTaskDetails(request, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("fetched!!!!////////////////////////////" + JSON.stringify(effort));
                res.send(effort);
            }
        });
    });

    // For delete Project
    app.post('/api/deleteproject', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        console.log("inside routes of dlete project" + JSON.stringify(req.body));
        Effort.project_delete(request, function (err, effort) {
            if (err) {
                console.log("--------------", req);
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    //delete task
    app.post('/api/deletetask', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        console.log("inside routes of delete task" + JSON.stringify(req.body));
        Effort.task_delete(request, function (err, effort) {
            if (err) {
                console.log("--------------", req);
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    // getby id Employee
    app.post('/api/getbyid', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body.empid;
        console.log("inside update employee of routes" + request);
        Effort.getbyID(request, function (err, effort) {
            if (err) {
                console.log("--------------", req);
                res.send(err);
            }
            else {
                res.send(effort);
                console.log(JSON.stringify(effort) + 'rouuuuuuuutes')
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    // for employee update
    app.post('/api/updateemp', function (req, res) {
        console.log('inside routes update employee');
        // create a effort, information comes from AJAX request from Angular
        Effort.updateEmp(req, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("data updated successfully");
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });
    });
    //delete by empid
    app.post('/api/deleteemp', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        console.log('this is the request@@@@@' + JSON.stringify(request));
        Effort.deleteEmp(request, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully");
                res.send("updated successfully");
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    //for resource wise report
    app.post('/api/resourceWise', function (req, res) {
        console.log('inside routes of resource' + JSON.stringify(req.body));
        Effort.resource_report(req, function (err, effort) {
            if (err) {
                console.log(">>>>>>>>>>>>>>>>>>>>error in report generation");
                res.send(err);
            }
            else {
                console.log("report generated successfully>>>>>>>>" + JSON.stringify(effort));
                res.send(effort);
            }
        });
    });
    //============================================================Divine
    app.post('/api/fetch_projecttasks', function (req, res) {
        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(req.body));
        // create a effort, information comes from AJAX request from Angular
        Effort.select_project(request, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });

    //---------------------divine
    app.post('/api/updateProjects', function (req, res) {
        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(req.body));
        Effort.updateProjectDetails(request, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully");
                res.send(effort);
            }
        });
    });

    app.post('/api/add_workOrder', function (req, res) {
        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(req.body));
        Effort.add_workOrder(request, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully");
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });

    //==============================================================
    app.post('/api/get_association', function (req, res) {

        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(req.body));
        Effort.getAssociation(request, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                console.log('Fetching' + effort);
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });

    // for workorderby id

    app.post('/api/getbyidworkorder', function (req, res) {
        Effort.getWorkorderbyId(req, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully" + JSON.stringify(effort));
                res.send(effort);
            }


        });


    });



    // update workorderupdate
    app.post('/api/workorderupdate', function (req, res) {
        Effort.updateWorkOrder(req, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                console.log("updated successfully" + JSON.stringify(effort));
                res.send(effort);
            }
        });
    });


    // For delete WorkOrder
    app.post('/api/deleteworkorder', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        var request = req.body;
        console.log("inside routes of dlete workorder" + JSON.stringify(req.body));
        Effort.workorder_delete(request, function (err, effort) {
            if (err) {
                console.log('hi charlie i am inside the error');
                res.send(err);
            }
            else {
                res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
 

    app.post('/api/resourceWiseReport', function (req, res) {
        console.log('inside report generation', JSON.stringify(req.body));
        var request = req.body;
        Effort.resourceReport(request, function (err, result) {
            if (err) {
                console.log(">>>>>>>>>>>>>>>..........", err);
                res.send(err);
            } else {
                console.log("sucesssssssssssssssssssssssss");
             res.sendFile('C:\\Users\\sh329785\\Desktop\\Node_API\\Invoicesheet.xlsx');
            }
        })
    });

    //To get unbilled report
    app.post('/api/unbilledReport', function (req, res) {
        var request = req.body;
        console.log('this is the request______________________________________' + JSON.stringify(request));
        Effort.get_UnbilledData(request, function (err, effort) {
            if (err) {
                res.send(err);
                console.log("error in unbilled report inside routes.............. ")
            }
            else {
                res.sendFile('C:\\Users\\sh329785\\Desktop\\Node_API\\UnbilledData.xlsx');
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });
    

       ///////// Labor Report........
    app.post('/api/generateLaborReport', function (req, res) {
        // create a effort, information comes from AJAX request from Angular
        Effort.generateLaborReport(req, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                // console.log(effort);
                // res.send(effort);
                res.sendFile('C:\\Users\\sh329785\\Desktop\\Node_API\\WebServicesLaborReport.xlsx');

            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });

    //==============================================================================Delete Association
    app.post('/api/deleteAssociation', function (req, res) {

        var request = req.body;
        Effort.deleteTaskAssociation(request, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            } s
        });
    });


    //================================================skills
     app.post('/api/skill_profile', function (req, res) {
        var req = req.body;
        console.log(req);
        Effort.get_skills(req, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
               res.send(effort);
            }
            // get and return all the efforts after you create another
            //getEfforts(res);
        });

    });


        app.post('/api/test', function (req, res) {

        var request = req.body;
        console.log('hi charlie this is the first call@@@@@'+JSON.stringify(request));
        Effort.deleteTaskAssociation1(request, function (err, effort) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(effort);
            }
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
