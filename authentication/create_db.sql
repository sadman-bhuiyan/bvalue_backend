CREATE TABLE users (
    id varchar(255),
    email varchar(255),
    hashed_password varchar(255),
    user_role varchar(255),
    PRIMARY KEY(id)
);

CREATE TABLE refresh_token (
    id varchar(255),
    refresh_token int NOT NULL,
    user_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);