angular.module('datepickerBasicUsage',
    ['ngMaterial', 'ngMessages', 'effortController', 'effortService']).controller('AppCtrl', ['$scope', '$http', '$location', 'Efforts', function ($scope, $http, $location, Efforts) {

        $scope.myDate = new Date();
        $scope.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        $scope.myDate = new Date();
        $scope.leaves = ["Sick_Leaves", "Annual_Leaves", "Comp_Off"];

        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() - 2,
            $scope.myDate.getDate());

        $scope.maxDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() + 2,
            $scope.myDate.getDate());
        console.log($scope.myDate);
        $scope.onlyWeekendsPredicate = function (date) {
            var day = date.getDay();
            return day === 0 || day === 6;

        };
        console.log('------------' + $scope.myDate);


        $scope.apply_leaves = function () {

            var leaveData = { "Employee_Id": $scope.empid, "Leave_Type": $scope.leavetype, "from_date": $scope.myDate + 1, "to_date": $scope.myDate1 + 1 };
            if ($scope.myDate1.getTime() < $scope.myDate.getTime()) {
            alert("end date should be greater than start date");
            }
            else {
                Efforts.leaves(leaveData).success(function (data) {

                    $scope.efforts = data; // assign our new list of efforts
                    console.log('this is the data@@@@' + JSON.stringify($scope.efforts));
                    $location.path('/login');
                });
                var myJSON = JSON.stringify(leaveData);
                console.log(myJSON);
            }
        }


        $scope.generateLeaves_Report = function () {
            var month = $scope.selectMonth;
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>" + month);
            Efforts.leaveGenerate(month).success(function (data) {
                $scope.efforts = data; // assign our new list of efforts
                console.log('this is the data@@@@' + JSON.stringify($scope.efforts));
            });
        }

        $scope.generateIntervalReport = function () {
            var leaveInterval = { "from_date": $scope.myDate + 1, "to_date": $scope.myDate1 + 1 };
            if ($scope.myDate1.getTime() < $scope.myDate.getTime()) {
                alert("end date should be greater than start date");
            }
            else {
                Efforts.intervalReport(leaveInterval).success(function (data) {
                    $scope.efforts = data; // assign our new list of efforts
                    console.log('this is the data@@@@' + JSON.stringify($scope.efforts));
                });
            }
        }
    }]);