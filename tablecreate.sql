CREATE TABLE items ( 
    item_id BIGSERIAL NOT NULL PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL,
    price NUMERIC(5, 2) NOT NULL,
    item_quant INT NOT NULL,
    item_spec VARCHAR(50) NOT NULL,
    item_loc VARCHAR(50) NOT NULL,
    dept_name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    purchase_date DATE NOT NULL,
    item_brand VARCHAR(50) NOT NULL,
    item_memo TEXT
);

CREATE TABLE department
(
    dept_id BIGSERIAL NOT NULL PRIMARY KEY,
    sub_dept_id INT NOT NULL,
    name_dept VARCHAR(50) NOT NULL
);

CREATE TABLE dept_member(
    dept_id BIGSERIAL NOT NULL PRIMARY KEY,
    position_id INT NOT NULL,
    member_id BIGSERIAL NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    comment TEXT
);

CREATE TABLE member_pos(
    position_id INT NOT NULL,
    name_pos VARCHAR(50) NOT NULL,
    perms VARCHAR(50) NOT NULL
);

CREATE TABLE item_dispose ( 
    item_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    price NUMERIC(5, 2) NOT NULL,
    item_quant INT NOT NULL,
    item_spec VARCHAR(50) NOT NULL,
    item_loc VARCHAR(50) NOT NULL,
    dept_name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    purchase_date DATE NOT NULL,
    item_brand VARCHAR(50) NOT NULL,
    item_memo TEXT,
    update_id INT NOT NULL
);

CREATE TABLE item_quantity_updates ( 
    update_id INT NOT NULL,
    updating_member_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    old_quant INT NOT NULL,
    updated_quant INT NOT NULL,
    report_date DATE NOT NULL,
    comment TEXT,
    update_type VARCHAR(20) NOT NULL
);

CREATE TABLE member(
    member_id BIGSERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    member_date DATE NOT NULL,
    active BOOLEAN NOT NULL,
    street_name VARCHAR(50) NOT NULL
    street_number INT NOT NULL,
    apt_number INT,
    city VARCHAR(50) NOT NULL,
    member_state VARCHAR(2),
    passw VARCHAR(150) NOT NULL
);

CREATE TABLE inventory_total(
    total_value NUMERIC(9 ,2) NOT NULL,
    last_update_id INT NOT NULL
);

CREATE TABLE items_by_category(
    category VARCHAR(50) NOT NULL,
    items INT NOT NULL,
    last_update_id INT NOT NULL
);