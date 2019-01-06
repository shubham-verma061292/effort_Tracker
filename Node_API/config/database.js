
var mysql_constants = require('./mysql_constants.json');
var mysql = require('mysql');

var execute = function (query,request,callback) {
    var pool = mysql.createPool(mysql_constants);
    pool.getConnection(function (err, connection) {
		if(err){
			console.log('connection unsuccessful');
		}
        // Use the connection
		else{
			console.log('connection successful'+JSON.stringify(request));
        connection.query(query,request, function (err, rows) {
            // And done with the connection.
            if(err){
                connection.release();
                console.log('not updated '+err);
				callback(err,null);
            }
            else{
                connection.release();
				callback(null,rows);
                
            }
            
			// Don't use the connection here, it has been returned to the pool.
        });
		}
    });
};

var get_connection = function(param,cb){
    var pool = mysql.createPool(mysql_constants);
     pool.getConnection(function (err, connection) {
         if(err){
             console.log('inside the error of connection method@@@@@@@@');
             cb(err,null)
         }
         else{
             console.log('inside the success of connection method@@@@@@@@');
             cb(null,connection);
         }
     })
}

var execute_query = function(connection,query,params,cb){

        connection.query(query,params, function (err, rows) {
                if(err){
                    console.log('inside the error of query method@@@@@@@@');
                    cb(err,null);
                }
                else{
                    console.log('inside the success of query method@@@@@@@@');
                    cb(null,rows);
                }

        })

}

exports.get_connection = get_connection;
exports.execute = execute;
exports.execute_query = execute_query;
