CREATE TABLE profile (
    id varchar(255),
    user_id varchar(255),
    user_name varchar(255),
    user_surname varchar(255),
    user_birthdate varchar(255),
    user_gender varchar(255),
    user_birthcity varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id varchar(255),
    user_role varchar(255),
    user_id varchar(255),
    PRIMARY KEY (id)
);