USE bamazon;

DROP TABLE IF EXISTS departments; 

CREATE TABLE departments (
	department_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs NUMERIC(20,2) NOT NULL
);

INSERT INTO departments (department_name, over_head_costs)
VALUES 	("Books", 10000),
		("CDs & Vinyl", 10000),
        ("Movies & TV", 10000),
        ("Toys", 10000),
        ("Video Games", 10000)
;

SELECT * FROM bamazon.departments;