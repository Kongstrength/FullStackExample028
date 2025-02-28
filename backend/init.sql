CREATE DATABASE taskmanagement;
USE taskmanagement;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('Pending', 'InProgress', 'Completed') NOT NULL DEFAULT 'Pending',
    due_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
