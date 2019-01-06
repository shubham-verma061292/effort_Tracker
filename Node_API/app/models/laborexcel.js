var execute = function (req, callback) {
    var excelbuilder = require('msexcel-builder');
    var workbook = excelbuilder.createWorkbook('./', 'WebServicesLaborReport.xlsx');
    var laborsheet = workbook.createSheet('WebServicesLaborReport', 100, 100);
    laborsheet.set(1, 1, "SupplierID");
    laborsheet.set(2, 1, "TDLOB");
    laborsheet.set(3, 1, "Project Name");
    laborsheet.set(4, 1, "Project Description");
    laborsheet.set(5, 1, "SOW Apporval POC");
    laborsheet.set(6, 1, "TD Reporting Manager");
    laborsheet.set(7, 1, "Supplier Reporting Manager");
    laborsheet.set(8, 1, "Resource First Name");
    laborsheet.set(9, 1, "Resource Last Name");
    laborsheet.set(10, 1, "ACF2ID");
    laborsheet.set(11, 1, "Resource Start Date");
    laborsheet.set(12, 1, "Resource End Date");
    laborsheet.set(13, 1, "Role");
    laborsheet.set(14, 1, "Role Grouping");
    laborsheet.set(15, 1, "Skill Premium(Y/N)");
    laborsheet.set(16, 1, "Skill Profile");
    laborsheet.set(17, 1, "Technology");
    laborsheet.set(18, 1, "Profile key Skills Mix");
    laborsheet.set(19, 1, "Location Group");
    laborsheet.set(20, 1, "Work Location");
    laborsheet.set(21, 1, "Work Permit Category");
    laborsheet.set(22, 1, "Billed Hours");
    laborsheet.set(23, 1, "ADM Tower Hourly Rate");
    laborsheet.set(24, 1, "Shift Adders, etc");
    laborsheet.set(25, 1, "Contract Type");
    laborsheet.set(26, 1, "Engagement Type");
    laborsheet.set(27, 1, "TD Contract ");
    laborsheet.set(28, 1, "Supplier Contract");
    laborsheet.set(29, 1, "Invoice No");
    laborsheet.set(30, 1, "Currency of Payment");
    laborsheet.set(31, 1, "FTE");
    laborsheet.set(32, 1, "Invoice_amount");
    laborsheet.set(33, 1, "Expenses");
    laborsheet.set(34, 1, "TD_SOW Name");
    laborsheet.set(35, 1, "PO");
    laborsheet.set(36, 1, "Invoice Expense");
    var i = 1, j, res;

    for (j = 0; j < req.length; j++) {
        res = req[j];
        i=1;
        for (var key in res) {
            if (res.hasOwnProperty(key)) {
                    laborsheet.set(i, j + 2, res[key]);
            }
            i++;
        }
         laborsheet.set(i++, j + 2, "FTE");
            laborsheet.set(i++, j + 2, "Invoice_amount");
            laborsheet.set(i++, j + 2, "Expenses");
            laborsheet.set(i++, j + 2, "TD_SOW Name");
            laborsheet.set(i++, j + 2, "PO");
            laborsheet.set(i++, j + 2, "Invoice Expense");
    }
    workbook.save(function (ok) {
        if (!ok)
            workbook.cancel();
        else
            console.log('congratulations, your workbook created');
    });
    callback(null, "thus the response aye");
}

exports.execute = execute;