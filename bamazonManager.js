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

var currentProducts = [];
var printProducts = "";
var query = "";

// Menu allows the user to access different functions to view and add inventory to bamazon.products
// Each selection returns to this menu until "Exit" is selected
function menu() {
    inquirer.prompt([
        {
            name: "managerAction",
            type: "list",
            message: "Please choose an option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]        
        }
    ]).then(function(answer) {
        // console.log(answer.managerAction);
        if (answer.managerAction === "View Products for Sale") {
            query = "SELECT * FROM products";
            view(query);
        } else if (answer.managerAction === "View Low Inventory") {
            query = "SELECT * FROM products WHERE stock_quantity < 5";
            view(query);
        } else if (answer.managerAction === "Add to Inventory") {
            query = "SELECT * FROM products";
            addStock(query);
        } else if (answer.managerAction === "Add New Product") {
            addItem();
        } else if (answer.managerAction === "Exit") {
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

// Function to view inventory, either in its entirity or only low stock items
function view(query) {
    isConnected();
        connection.query(
            query,
            function(err, res) {
                currentProducts = JSON.parse(JSON.stringify(res));
                printProducts = "\n";
                for (var i = 0; i < currentProducts.length; i++) {
                    printProducts += `${currentProducts[i].item_id}: ${currentProducts[i].product_name} (${currentProducts[i].department_name}) - $${currentProducts[i].price.toFixed(2)} (${currentProducts[i].stock_quantity} available)\n`;
                }
                console.log(printProducts); 
                menu();
        });              
};

// Function to add stock to an existing item in bamazon.products
function addStock(query) {
    isConnected();
        connection.query(
            query,
            function(err, res) {
                currentProducts = JSON.parse(JSON.stringify(res));
                printProducts = [];
                for (var i = 0; i < currentProducts.length; i++) {
                    printProducts.push(`${currentProducts[i].item_id}: ${currentProducts[i].product_name} (${currentProducts[i].department_name}) - $${currentProducts[i].price.toFixed(2)} (${currentProducts[i].stock_quantity} available)`);
                }
                inquirer.prompt([
                    {
                        name: "products",
                        type: "list",
                        message: "Please choose an item:",
                        choices: printProducts       
                    },
                    {
                        name: "addInventory",
                        type: "input",
                        message: "How much inventory would you like to add?",
                        validate: function(value) {
                            if (isNaN(value) === false && parseInt(value) >= 0) {
                              return true;
                            }
                            return false;
                        }
                    }
                ]).then(function(answer) {
                    console.log(`${answer.products}\n${answer.addInventory}`);
                    var newStockID = answer.products.split(":");
                    newStockID = newStockID[0];
                    query = `UPDATE products SET stock_quantity = stock_quantity + ${answer.addInventory} WHERE item_id = ${newStockID}`;
                    connection.query(
                        query,
                        function(err, res) {
                            console.log("\nStock Updated!\n");
                            menu();
                    });
                });
            });              
};

// Function to add a new item to bamazon.products
function addItem() {
    inquirer.prompt([
        {
            name: "newName",
            type: "input",
            message: "Product name:"     
        },
        {
            name: "newDepartment",
            type: "input",
            message: "Department name:"     
        },
        {
            name: "newPrice",
            type: "input",
            message: "Price:",
            validate: function(value) {
                if (isNaN(value) === false && parseFloat(value) >= 0) {
                  return true;
                }
                return false;
            }     
        },
        {
            name: "newQuantity",
            type: "input",
            message: "Quantity:",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value) >= 0) {
                  return true;
                }
                return false;
            }
        }
    ]).then(function(answer) {
        query = `INSERT INTO products (product_name, department_name, price, stock_quantity)`;
        query += `VALUES ("${answer.newName}", "${answer.newDepartment}", ${answer.newPrice}, ${answer.newQuantity});`
        isConnected();
            connection.query(
                query,
                function(err, res) {
                    console.log("\nNew Item Added!\n");
                    menu();
            });              
    });
};

// Opens the menu function when the user enters "npm install" and "node .\bamazonManager.js" into the terminal
menu();