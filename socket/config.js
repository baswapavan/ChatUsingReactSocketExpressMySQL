const mysql = require('mysql')


const con = mysql.createConnection({...dbConnectionProps, database:'chat'});
const conOffice24by7 = mysql.createConnection({...dbConnectionProps, database:'officechat'});

con.connect((err)=>{
    if(err){
        console.log(`Error in connection:${err}`)
    }
})

const slow_queries_file_path = "D:\\xampp\\htdocs\\node_api_demo\\db_slow-20-06-2023.log";

module.exports = {con, slow_queries_file_path, fullRegEx};