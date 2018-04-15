var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

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
var choicesID = [];    

// Create mySQL connection to query all inventory from bamazon.products
// Store response obj "res" as currentProducts
// Format inventory as list with id, name, and price as printProducts
// Store array of item ids for use in shopping inquirer as choicesID
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    var query = connection.query(
        "SELECT * FROM products",
        function(err, res) {
            currentProducts = JSON.parse(JSON.stringify(res));
            printProducts = "";
            for (var i = 0; i < currentProducts.length; i++) {
                printProducts += `${currentProducts[i].item_id}: ${currentProducts[i].product_name} (${currentProducts[i].department_name}) - $${currentProducts[i].price.toFixed(2)}\n`;
                choicesID.push(`${currentProducts[i].item_id}`);
            }
            console.log(printProducts);
            chooseItem(); 
        });              
});

// Prompt user to select an item by its id and enter a quantity to purchase
// If the quantity ordered does not exceed existing stock, output invoice, and update bamazon.products
// If the quantity ordered does exceed existing stock, return an error message and restart prompt
function chooseItem() {
    inquirer.prompt([
        {
            name: "buy_id",
            type: "list",
            message: "Which item would you like to buy?",
            choices: choicesID
        },
        {
            name: "buy_quantity",
            type: "input",
            message: "How many?",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value) >= 0) {
                  return true;
                }
                return false;
            }
        }
        ]).then(function(answer) {

            for (var i = 0; i < currentProducts.length; i++) {
                if (parseInt(answer.buy_id) === parseInt(currentProducts[i].item_id)) {
                    if (parseInt(answer.buy_quantity) <= parseInt(currentProducts[i].stock_quantity)) {
                        var updateQuantity = parseInt(currentProducts[i].stock_quantity) - parseInt(answer.buy_quantity);
                        var invoiceAmt = parseInt(answer.buy_quantity) * parseFloat(currentProducts[i].price);
                        if (parseInt(answer.buy_quantity) === 1) {
                            var copyVerb = "copy";
                        } else {
                            var copyVerb = "copies";
                        };
                        var logMessage = `\n${parseInt(answer.buy_quantity)} ${copyVerb} of ${currentProducts[i].product_name} (${currentProducts[i].department_name})\n`; 
                            logMessage += `\nUnit Price       : $ ${currentProducts[i].price.toFixed(2)}\n`;
                            logMessage += `Quantity Ordered : X ${parseInt(answer.buy_quantity)}\n`;
                            logMessage += `                   ---------\n`;
                            logMessage += `Invoice Total    : $ ${invoiceAmt.toFixed(2)}\n`;
                        console.log(logMessage);
                        depleteStock(updateQuantity, answer.buy_id);
                    }   else {
                        var logMessage = `${parseInt(answer.buy_quantity)} copies of ${currentProducts[i].product_name} (${currentProducts[i].department_name})\n`; 
                            logMessage += "Insufficient stock! Please try again...\n"
                        console.log(logMessage);
                        chooseItem();
                    }
                }
            }
        });
}

// Executes mySQL query to update bamazon.products of ordered item with new stock_quantity
// End mySQL connection
function depleteStock(newStock, itemID) {
        connection.query(
            `UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${itemID}`,
            function(err, res) {
                if (err) throw err;
                console.log(`Order Placed! Thank you for choosing Bamazon!\n`);
            }
        );
        connection.end();
}