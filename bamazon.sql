DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS products; 

CREATE TABLE products (
	item_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price NUMERIC(20,2) NOT NULL,
    stock_quantity INT NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 	("Donald in Mathmagic Land", "Movies & TV", 9.99, 38),
		("Handmade Electronic Music: The Art of Hardware Hacking", "Books", 40.28, 30),
        ("At Home on the Street: People, Poverty, and a Hidden Culture of Homelessness", "Books", 23.50, 24),
        ("Wii with Wii Sports Resort - Black", "Video Games", 108.99, 5),
        ("A Century of Eugenics in America: From the Indiana Experiment to the Human Genome Era", "Books", 21.09, 43),
        ("Naked Statistics: Stripping the Dread from the Data", "Books", 11.98, 52),
        ("In An Expression of the Inexpressible", "CDs & Vinyl", 11.99, 40),
        ("Discovering Statistics Using R", "Books", 42.74, 36),
        ("The Signal and the Noise: Why So Many Predictions Fail-But Some Don't", "Books", 16.09, 48),
        ("Predictably Irrational, Revised and Expanded Edition: The Hidden Forces That Shape Our Decisions", "Books", 13.04, 143)
;

-- SELECT * FROM bamazon.products;