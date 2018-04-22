var Table = require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  //   Your username
    user: "root",
  //   password: ,
    database: "bamazon"
  });

function menu() {
    inquirer.prompt([
        {
            name: "supervisorAction",
            type: "list",
            message: "Please choose an option:",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]        
        }
    ]).then(function(answer) {
        if (answer.supervisorAction === "View Product Sales by Department") {
            var query = 
                `SELECT a.*
                , IFNULL(b.product_sales, 0.00) product_sales
                , IFNULL(b.product_sales, 0.00) - a.over_head_costs AS total_profit
                FROM bamazon.departments a
                LEFT JOIN (
                    SELECT a.department_name, SUM(a.product_sales) product_sales
                    FROM bamazon.products a
                    GROUP BY a.department_name
                ) b on a.department_name = b.department_name`;
            salesReport(query);
        } else if (answer.supervisorAction === "Create New Department") {
            addDepartment();
        } else if (answer.supervisorAction === "Exit") {
            connection.end();
            console.log("\nGoodbye!\n");
        }
    });
};

// Check if mySQL is connected, and if not, create a connection
function isConnected() {
    if (connection.state === "disconnected") {
        connection.connect(function(err) {
            if (err) throw err;
            // console.log("connected as id " + connection.threadId + "\n");
        });
    }
}

function salesReport(query) {
    isConnected();
        connection.query(
            query,
            function(err, res) {
                salesData = JSON.parse(JSON.stringify(res));
                var table = new Table({
                    head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit']
                  , colWidths: [20, 20, 20, 20, 20]
                });
                for (var i = 0; i < salesData.length; i++) {
                    var row = [];
                    row.push(salesData[i].department_id);
                    row.push(salesData[i].department_name);
                    row.push(salesData[i].over_head_costs);
                    row.push(salesData[i].product_sales);
                    row.push(salesData[i].total_profit);
                    table.push(row);
                }         
                console.log(table.toString());
                menu();
        });              
};

function addDepartment() {
    inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "Department Name:"     
        },
        {
            name: "newOverHeadCosts",
            type: "input",
            message: "Over Head Cost:",
            validate: function(value) {
                if (isNaN(value) === false && parseFloat(value) >= 0) {
                  return true;
                }
                return false;
            }     
        }
    ]).then(function(answer) {
        query = `INSERT INTO departments (department_name, over_head_costs)`;
        query += `VALUES ("${answer.newDepartment}", ${answer.newOverHeadCosts});`
        isConnected();
            connection.query(
                query,
                function(err, res) {
                    console.log("\nNew Department Added!\n");
                    menu();
            });              
    });
};

menu();