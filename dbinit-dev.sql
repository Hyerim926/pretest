CREATE DATABASE IF NOT EXISTS `inflab_dev` default CHARACTER SET UTF8;

USE `inflab_dev`;

CREATE TABLE IF NOT EXISTS `teacher` (
    `id` int(11) not null auto_increment,
    `name` varchar(20) not null,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `lecture` (
    `id` int(11) not null auto_increment,
    `name` varchar(20) not null,
    `category` varchar(10) not null,
    `teacher_id` int(11) not null,
    `introduction` text not null,
    `fee` int(11) not null,
    `s_open` char not null default 'N',
    `s_delete` char not null default 'N',
    `created_at` datetime not null default now(),
    `updated_at` datetime,
    PRIMARY KEY primary_lecture_id (`id`),
    FOREIGN KEY foreign_lecture_teacherId (`teacher_id`) REFERENCES teacher(`id`),
    UNIQUE KEY unique_lecture_name (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `student` (
    `id` int(11) not null auto_increment,
    `nickname` varchar(20) not null,
    `email` varchar(50) not null,
    `s_withdraw` char not null default 'N',
    `created_at` datetime not null default now(),
    `updated_at` datetime,
    PRIMARY KEY primary_student_id (`id`),
    UNIQUE KEY unique_student_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `enrolment` (
    `id` int(11) not null auto_increment,
    `lecture_id` int(11) not null,
    `student_id` int(11) not null,
    `s_delete` char not null default 'N',
    `created_at` datetime not null default now(),
    `updated_at` datetime,
    PRIMARY KEY primary_enrolment_id (`id`),
    FOREIGN KEY foreign_enrolment_lectureId (`lecture_id`) REFERENCES lecture(`id`),
    FOREIGN KEY foreign_enrolment_studentId (`student_id`) REFERENCES student(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO TEACHER (NAME) SELECT '김도영' FROM dual WHERE NOT EXISTS(
    SELECT * FROM TEACHER WHERE NAME = '김도영'
    );
INSERT INTO TEACHER (NAME) SELECT '정재현' FROM dual WHERE NOT EXISTS(
    SELECT * FROM TEACHER WHERE NAME = '정재현'
    );
INSERT INTO TEACHER (NAME) SELECT '김정우' FROM dual WHERE NOT EXISTS(
    SELECT * FROM TEACHER WHERE NAME = '김정우'
    );
