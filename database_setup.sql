-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--  SkillBridge: Production-Grade Database Setup (Modernized)
--  Architecture: Normalized, Indexed, Secure, and Scalable
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE DATABASE IF NOT EXISTS skillbridge;
USE skillbridge;

-- 1. Roles (RBAC)
CREATE TABLE IF NOT EXISTS `roles` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL UNIQUE,
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Skills Taxonomy
CREATE TABLE IF NOT EXISTS `skills` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL UNIQUE,
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Users Table (Normalized)
CREATE TABLE IF NOT EXISTS `users` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `bio` text,
    `profile_picture` longtext,
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    -- Legacy fields kept for zero-downtime transition
    `role` varchar(50) DEFAULT 'USER',
    `skills_learn` text,
    `skills_teach` text,
    PRIMARY KEY (`id`),
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. User-Roles Junction
CREATE TABLE IF NOT EXISTS `user_roles` (
    `user_id` bigint NOT NULL,
    `role_id` bigint NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. User-Skills Junctions
CREATE TABLE IF NOT EXISTS `user_skills_learn` (
    `user_id` bigint NOT NULL,
    `skill_id` bigint NOT NULL,
    PRIMARY KEY (`user_id`, `skill_id`),
    CONSTRAINT `fk_usl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_usl_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_skills_teach` (
    `user_id` bigint NOT NULL,
    `skill_id` bigint NOT NULL,
    PRIMARY KEY (`user_id`, `skill_id`),
    CONSTRAINT `fk_ust_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_ust_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Course Categories
CREATE TABLE IF NOT EXISTS `course_categories` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL UNIQUE,
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_cat_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Courses
CREATE TABLE IF NOT EXISTS `courses` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` text,
    `image_url` varchar(500),
    `price` decimal(10,2) NOT NULL DEFAULT 0.00,
    `rating` decimal(3,2) DEFAULT 0.00,
    `author_id` bigint,
    `category_id` bigint,
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_course_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_course_cat` FOREIGN KEY (`category_id`) REFERENCES `course_categories` (`id`),
    INDEX `idx_course_title` (`title`),
    INDEX `idx_course_author` (`author_id`),
    INDEX `idx_course_cat` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Conversations (Chat)
CREATE TABLE IF NOT EXISTS `conversations` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `last_message` text,
    `last_message_at` datetime(6),
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Chat Messages
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `conversation_id` bigint,
    `sender_id` bigint NOT NULL,
    `content` text NOT NULL,
    `read_at` datetime(6),
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    -- Legacy field for transition
    `recipient_id` bigint,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_chat_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`),
    CONSTRAINT `fk_chat_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
    INDEX `idx_chat_conv` (`conversation_id`),
    INDEX `idx_chat_sender` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Enrollments
CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `course_id` bigint NOT NULL,
    `status` enum('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    `progress` decimal(5,2) DEFAULT 0.00,
    `enrolled_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `completed_at` datetime(6),
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
    CONSTRAINT `fk_enroll_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_enroll_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
    INDEX `idx_enroll_user_course` (`user_id`, `course_id`),
    INDEX `idx_enroll_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Reviews
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `course_id` bigint NOT NULL,
    `user_id` bigint NOT NULL,
    `rating` int NOT NULL,
    `comment` text,
    `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_review_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
    CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `chk_rating_range` CHECK (`rating` BETWEEN 1 AND 5),
    INDEX `idx_review_course` (`course_id`),
    INDEX `idx_review_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- INITIAL SEED DATA (PRODUCTION BASELINE)
-- ─────────────────────────────────────────────────────────────

-- Baseline Roles
INSERT IGNORE INTO `roles` (`name`) VALUES ('ROLE_USER'), ('ROLE_ADMIN'), ('ROLE_INSTRUCTOR');

-- Baseline Skill Taxonomy
INSERT IGNORE INTO `skills` (`name`) VALUES ('Java'), ('Spring Boot'), ('React'), ('Python'), ('UI/UX Design'), ('SQL');

-- Initial Admin Node (Password: 'Shivam2706' BCrypt)
INSERT IGNORE INTO `users` (`name`, `email`, `password`, `role`, `bio`) 
VALUES ('SkillBridge Admin', 'skillbridgeadmin@gmail.com', '$2a$10$9v3XlQO.8YjI.K.4.2.2.OeO8V0S8lY8lY8lY8lY8lY8lY8lY8lY8', 'ADMIN', 'Core Platform Administrator');

-- Connect Admin User to ROLE_ADMIN and ROLE_USER
SET @admin_id = (SELECT id FROM users WHERE email = 'skillbridgeadmin@gmail.com');
SET @role_admin = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN');
SET @role_user = (SELECT id FROM roles WHERE name = 'ROLE_USER');
INSERT IGNORE INTO `user_roles` (`user_id`, `role_id`) VALUES (@admin_id, @role_admin), (@admin_id, @role_user);

-- Initial Categories
INSERT IGNORE INTO `course_categories` (`name`) VALUES ('General'), ('Web Development'), ('Data Science'), ('Business'), ('Design');
