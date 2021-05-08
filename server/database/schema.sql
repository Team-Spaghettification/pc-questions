DROP DATABASE IF EXISTS questions;
CREATE DATABASE questions;

USE questions;

CREATE TABLE questions (
id INT AUTO_INCREMENT,
product_id INT,
body VARCHAR(1000) NOT NULL,
date_written datetime,
asker_name VARCHAR(60),
asker_email VARCHAR(60),
reported BOOLEAN,
helpful INT,
Primary KEY(id)
);

CREATE TABLE answers (
id INT AUTO_INCREMENT,
question_id INT,
body VARCHAR(1000) NOT NULL,
date_written datetime,
answerer_name VARCHAR(60),
answerer_email VARCHAR(60),
reported BOOLEAN,
helpful INT,
Primary KEY(id),
Foreign KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE answers_photos (
id INT AUTO_INCREMENT,
answer_id INT NOT NULL,
url text,
Primary KEY(id),
Foreign KEY (answer_id) REFERENCES answers(id)
);