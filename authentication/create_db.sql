CREATE TABLE users (
    id varchar(255),
    email varchar(255) NOT NULL,
    hashed_password varchar(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE refresh_token (
    id varchar(255),
    token varchar(255),
    user_id varchar(255),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE roles (
    id varchar(255),
    user_role varchar(255),
    user_id varchar(255),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);