CREATE TABLE family_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    location TEXT,
    gender VARCHAR(20),
    date_of_birth DATE,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE relationships (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    related_member_id INTEGER NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_member
        FOREIGN KEY (member_id)
        REFERENCES family_members(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_related_member
        FOREIGN KEY (related_member_id)
        REFERENCES family_members(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_relationship
        UNIQUE(member_id, related_member_id, relationship_type)
);

INSERT INTO family_members
(name, phone, email, location, gender, date_of_birth)
VALUES
('Ramesh Sharma', '+91-9000000001', 'ramesh01@example.com', 'Indore', 'Male', '1950-04-12'),
('Kamla Sharma', '+91-9000000002', 'kamla02@example.com', 'Indore', 'Female', '1953-08-21'),

('Suresh Sharma', '+91-9000000003', 'suresh03@example.com', 'Bhopal', 'Male', '1972-02-15'),
('Sunita Sharma', '+91-9000000004', 'sunita04@example.com', 'Bhopal', 'Female', '1975-06-18'),
('Mahesh Sharma', '+91-9000000005', 'mahesh05@example.com', 'Indore', 'Male', '1974-09-10'),
('Rekha Sharma', '+91-9000000006', 'rekha06@example.com', 'Indore', 'Female', '1977-01-25'),
('Rajesh Sharma', '+91-9000000007', 'rajesh07@example.com', 'Bhopal', 'Male', '1978-03-14'),
('Anita Sharma', '+91-9000000008', 'anita08@example.com', 'Bhopal', 'Female', '1980-11-05'),
('Dinesh Sharma', '+91-9000000009', 'dinesh09@example.com', 'Ujjain', 'Male', '1981-07-22'),
('Pooja Sharma', '+91-9000000010', 'pooja10@example.com', 'Ujjain', 'Female', '1984-12-17'),

('Amit Sharma', '+91-9000000011', 'amit11@example.com', 'Bhopal', 'Male', '1995-01-11'),
('Priya Sharma', '+91-9000000012', 'priya12@example.com', 'Bhopal', 'Female', '1997-05-19'),
('Rohit Sharma', '+91-9000000013', 'rohit13@example.com', 'Bhopal', 'Male', '1999-09-03'),
('Neha Sharma', '+91-9000000014', 'neha14@example.com', 'Bhopal', 'Female', '2001-02-28'),
('Karan Sharma', '+91-9000000015', 'karan15@example.com', 'Indore', 'Male', '1998-06-12'),
('Nisha Sharma', '+91-9000000016', 'nisha16@example.com', 'Indore', 'Female', '2000-10-20'),
('Arjun Sharma', '+91-9000000017', 'arjun17@example.com', 'Indore', 'Male', '2003-03-07'),
('Simran Sharma', '+91-9000000018', 'simran18@example.com', 'Indore', 'Female', '2005-08-16'),

('Vikas Sharma', '+91-9000000019', 'vikas19@example.com', 'Bhopal', 'Male', '1994-04-09'),
('Riya Sharma', '+91-9000000020', 'riya20@example.com', 'Bhopal', 'Female', '1996-07-23'),
('Akash Sharma', '+91-9000000021', 'akash21@example.com', 'Bhopal', 'Male', '2000-01-30'),
('Sneha Sharma', '+91-9000000022', 'sneha22@example.com', 'Bhopal', 'Female', '2002-05-14'),

('Manoj Sharma', '+91-9000000023', 'manoj23@example.com', 'Indore', 'Male', '1997-09-18'),
('Kavita Sharma', '+91-9000000024', 'kavita24@example.com', 'Indore', 'Female', '1999-12-05'),
('Nitin Sharma', '+91-9000000025', 'nitin25@example.com', 'Indore', 'Male', '2001-06-27'),
('Komal Sharma', '+91-9000000026', 'komal26@example.com', 'Indore', 'Female', '2004-11-13'),

('Rahul Sharma', '+91-9000000027', 'rahul27@example.com', 'Ujjain', 'Male', '1999-03-22'),
('Muskan Sharma', '+91-9000000028', 'muskan28@example.com', 'Ujjain', 'Female', '2001-08-09'),
('Varun Sharma', '+91-9000000029', 'varun29@example.com', 'Ujjain', 'Male', '2003-12-19'),
('Tanya Sharma', '+91-9000000030', 'tanya30@example.com', 'Ujjain', 'Female', '2005-04-26'),

('Aditya Sharma', '+91-9000000031', 'aditya31@example.com', 'Bhopal', 'Male', '2004-02-10'),
('Isha Sharma', '+91-9000000032', 'isha32@example.com', 'Bhopal', 'Female', '2006-06-15'),
('Yash Sharma', '+91-9000000033', 'yash33@example.com', 'Bhopal', 'Male', '2007-10-08'),
('Anjali Sharma', '+91-9000000034', 'anjali34@example.com', 'Bhopal', 'Female', '2009-01-21'),

('Vivek Sharma', '+91-9000000035', 'vivek35@example.com', 'Indore', 'Male', '2005-03-13'),
('Aarti Sharma', '+91-9000000036', 'aarti36@example.com', 'Indore', 'Female', '2007-07-29'),
('Dev Sharma', '+91-9000000037', 'dev37@example.com', 'Indore', 'Male', '2009-11-17'),
('Meera Sharma', '+91-9000000038', 'meera38@example.com', 'Indore', 'Female', '2011-05-04'),

('Ravi Sharma', '+91-9000000039', 'ravi39@example.com', 'Bhopal', 'Male', '2006-08-12'),
('Shreya Sharma', '+91-9000000040', 'shreya40@example.com', 'Bhopal', 'Female', '2008-02-24'),
('Harsh Sharma', '+91-9000000041', 'harsh41@example.com', 'Bhopal', 'Male', '2010-09-16'),
('Mahi Sharma', '+91-9000000042', 'mahi42@example.com', 'Bhopal', 'Female', '2012-12-03'),

('Rakesh Sharma', '+91-9000000043', 'rakesh43@example.com', 'Ujjain', 'Male', '1983-05-11'),
('Seema Sharma', '+91-9000000044', 'seema44@example.com', 'Ujjain', 'Female', '1985-09-20'),
('Gaurav Sharma', '+91-9000000045', 'gaurav45@example.com', 'Ujjain', 'Male', '2005-01-08'),
('Garima Sharma', '+91-9000000046', 'garima46@example.com', 'Ujjain', 'Female', '2007-04-18'),
('Mohit Sharma', '+91-9000000047', 'mohit47@example.com', 'Ujjain', 'Male', '2009-08-25'),
('Divya Sharma', '+91-9000000048', 'divya48@example.com', 'Ujjain', 'Female', '2011-10-14'),

('Sanjay Sharma', '+91-9000000049', 'sanjay49@example.com', 'Dewas', 'Male', '1986-03-16'),
('Renu Sharma', '+91-9000000050', 'renu50@example.com', 'Dewas', 'Female', '1988-07-22'),
('Varsha Sharma', '+91-9000000051', 'varsha51@example.com', 'Dewas', 'Female', '2010-02-11'),
('Manav Sharma', '+91-9000000052', 'manav52@example.com', 'Dewas', 'Male', '2012-06-28'),

('Ashok Sharma', '+91-9000000053', 'ashok53@example.com', 'Indore', 'Male', '1985-11-09'),
('Lata Sharma', '+91-9000000054', 'lata54@example.com', 'Indore', 'Female', '1988-03-27'),
('Naveen Sharma', '+91-9000000055', 'naveen55@example.com', 'Indore', 'Male', '2007-05-19'),
('Ritu Sharma', '+91-9000000056', 'ritu56@example.com', 'Indore', 'Female', '2009-09-12'),
('Ayush Sharma', '+91-9000000057', 'ayush57@example.com', 'Indore', 'Male', '2011-12-21'),

('Prakash Sharma', '+91-9000000058', 'prakash58@example.com', 'Bhopal', 'Male', '1988-04-15'),
('Madhuri Sharma', '+91-9000000059', 'madhuri59@example.com', 'Bhopal', 'Female', '1990-08-30'),
('Rajat Sharma', '+91-9000000060', 'rajat60@example.com', 'Bhopal', 'Male', '2010-03-09'),
('Pallavi Sharma', '+91-9000000061', 'pallavi61@example.com', 'Bhopal', 'Female', '2012-07-17'),

('Deepak Sharma', '+91-9000000062', 'deepak62@example.com', 'Indore', 'Male', '1990-02-20'),
('Swati Sharma', '+91-9000000063', 'swati63@example.com', 'Indore', 'Female', '1992-06-13'),
('Sahil Sharma', '+91-9000000064', 'sahil64@example.com', 'Indore', 'Male', '2013-01-25'),
('Sakshi Sharma', '+91-9000000065', 'sakshi65@example.com', 'Indore', 'Female', '2015-05-08'),

('Ramesh Verma', '+91-9000000066', 'rameshverma66@example.com', 'Bhopal', 'Male', '1970-09-14'),
('Shanti Verma', '+91-9000000067', 'shantiverma67@example.com', 'Bhopal', 'Female', '1973-12-02'),
('Pankaj Verma', '+91-9000000068', 'pankaj68@example.com', 'Bhopal', 'Male', '1995-04-16'),
('Preeti Verma', '+91-9000000069', 'preeti69@example.com', 'Bhopal', 'Female', '1997-08-21'),
('Tarun Verma', '+91-9000000070', 'tarun70@example.com', 'Bhopal', 'Male', '2000-11-09'),

('Mohan Sharma', '+91-9000000071', 'mohan71@example.com', 'Indore', 'Male', '1968-05-17'),
('Sarla Sharma', '+91-9000000072', 'sarla72@example.com', 'Indore', 'Female', '1971-09-26'),
('Chirag Sharma', '+91-9000000073', 'chirag73@example.com', 'Indore', 'Male', '1994-01-15'),
('Payal Sharma', '+91-9000000074', 'payal74@example.com', 'Indore', 'Female', '1996-03-28'),
('Naman Sharma', '+91-9000000075', 'naman75@example.com', 'Indore', 'Male', '1999-07-12'),

('Rohit Verma', '+91-9000000076', 'rohitverma76@example.com', 'Dewas', 'Male', '1992-05-18'),
('Shalini Verma', '+91-9000000077', 'shalini77@example.com', 'Dewas', 'Female', '1994-10-06'),
('Aarav Verma', '+91-9000000078', 'aarav78@example.com', 'Dewas', 'Male', '2014-02-15'),
('Anaya Verma', '+91-9000000079', 'anaya79@example.com', 'Dewas', 'Female', '2016-08-24'),

('Suresh Verma', '+91-9000000080', 'sureshverma80@example.com', 'Ujjain', 'Male', '1975-06-12'),
('Meena Verma', '+91-9000000081', 'meena81@example.com', 'Ujjain', 'Female', '1978-11-20'),
('Varun Verma', '+91-9000000082', 'varunverma82@example.com', 'Ujjain', 'Male', '2001-03-17'),
('Priti Verma', '+91-9000000083', 'priti83@example.com', 'Ujjain', 'Female', '2003-09-05'),

('Rajendra Sharma', '+91-9000000084', 'rajendra84@example.com', 'Indore', 'Male', '1945-02-10'),
('Shakuntala Sharma', '+91-9000000085', 'shakuntala85@example.com', 'Indore', 'Female', '1948-07-19'),
('Mahendra Sharma', '+91-9000000086', 'mahendra86@example.com', 'Indore', 'Male', '1970-01-23'),
('Usha Sharma', '+91-9000000087', 'usha87@example.com', 'Indore', 'Female', '1973-05-11'),

('Raghav Sharma', '+91-9000000088', 'raghav88@example.com', 'Bhopal', 'Male', '2014-04-12'),
('Kriti Sharma', '+91-9000000089', 'kriti89@example.com', 'Bhopal', 'Female', '2016-09-18'),
('Dhruv Sharma', '+91-9000000090', 'dhruv90@example.com', 'Bhopal', 'Male', '2018-01-26'),

('Aman Sharma', '+91-9000000091', 'aman91@example.com', 'Indore', 'Male', '2013-06-14'),
('Khushi Sharma', '+91-9000000092', 'khushi92@example.com', 'Indore', 'Female', '2015-10-22'),
('Rudra Sharma', '+91-9000000093', 'rudra93@example.com', 'Indore', 'Male', '2017-03-09'),
('Myra Sharma', '+91-9000000094', 'myra94@example.com', 'Indore', 'Female', '2019-08-17'),

('Kabir Sharma', '+91-9000000095', 'kabir95@example.com', 'Ujjain', 'Male', '2012-12-10'),
('Aanya Sharma', '+91-9000000096', 'aanya96@example.com', 'Ujjain', 'Female', '2014-05-28'),
('Reyansh Sharma', '+91-9000000097', 'reyansh97@example.com', 'Ujjain', 'Male', '2016-11-03'),
('Sara Sharma', '+91-9000000098', 'sara98@example.com', 'Ujjain', 'Female', '2018-07-21'),
('Vihaan Sharma', '+91-9000000099', 'vihaan99@example.com', 'Ujjain', 'Male', '2020-02-14'),
('Navya Sharma', '+91-9000000100', 'navya100@example.com', 'Ujjain', 'Female', '2021-09-06');
