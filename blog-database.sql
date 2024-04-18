use youandme;
show tables;
select * from users;
CREATE TABLE users (
    email VARCHAR(100),
    password VARCHAR(20),
    username VARCHAR(50) primary key,
    name VARCHAR(50),
    phoneno NUMERIC(10),
    pic VARCHAR(200),
    dos DATE
);

drop table blogs;

CREATE TABLE blogs (
    username VARCHAR(50),
    blogid INT PRIMARY KEY AUTO_INCREMENT,
    blogname VARCHAR(200),
    blogcontent text,
    image VARCHAR(200),
    postdate DATE,
    commentpermi VARCHAR(20),
    likes int default(0),
    FOREIGN KEY (username)
        REFERENCES users (username)
);
select * from blogs;