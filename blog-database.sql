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
select * from bloglikes;

show tables;

CREATE TABLE bloglikes (
    username VARCHAR(50),
    blogid INT,
    FOREIGN KEY (username)
        REFERENCES users (username),
    FOREIGN KEY (blogid)
        REFERENCES blogs (blogid),
    PRIMARY KEY (username , blogid)
);

CREATE TABLE comments(
	cid INT PRIMARY KEY AUTO_INCREMENT,
    body TEXT,
    username VARCHAR(50),
    blogid INT,
    FOREIGN KEY (username)
        REFERENCES users (username),
    FOREIGN KEY (blogid)
        REFERENCES blogs (blogid)
);

CREATE TABLE notifications (
    nid INT PRIMARY KEY AUTO_INCREMENT,
    body TEXT,
    username VARCHAR(50),
    author VARCHAR(50),
    pic VARCHAR(200),
    blogid INT,
    isRead BOOLEAN DEFAULT FALSE,
    created_at datetime,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (author) REFERENCES users(username),
    FOREIGN KEY (blogid) REFERENCES blogs(blogid)
);

drop table notifications;

SELECT 
    b.username,
    b.blogid,
    b.blogname,
    b.blogcontent,
    b.image,
    b.postdate,
    b.commentpermi,
    b.likes,
    MAX(CASE WHEN l.username = 'kx_art4' THEN l.username ELSE NULL END) AS liker 
FROM 
    blogs b 
LEFT OUTER JOIN 
    bloglikes l ON b.blogid = l.blogid
GROUP BY 
    b.blogid;
    
SELECT 
    username
FROM
    users
WHERE
    username LIKE '%ya%' 
UNION SELECT 
    name
FROM
    users
WHERE
    name LIKE '%ya%' 
UNION SELECT 
    blogname
FROM
    blogs
WHERE
    blogname LIKE '%o%';
    
SELECT * FROM users;
SELECT * FROM notifications;
SELECT * from blogs;
INSERT INTO notifications VALUES(nid,?,?,?,?,isRead,current_timestamp())