-- =======================================================
-- DigiFin Quest — Database Schema for MySQL / MariaDB
-- Digunakan untuk deployment ke hosting PHP (cPanel / phpMyAdmin)
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `simulation_results`;
DROP TABLE IF EXISTS `sim_events`;
DROP TABLE IF EXISTS `scenario_results`;
DROP TABLE IF EXISTS `scenarios`;
DROP TABLE IF EXISTS `claimed_challenges`;
DROP TABLE IF EXISTS `user_badges`;
DROP TABLE IF EXISTS `quiz_scores`;
DROP TABLE IF EXISTS `completed_lessons`;
DROP TABLE IF EXISTS `quizzes`;
DROP TABLE IF EXISTS `modules`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabel Users
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `points` INT NOT NULL DEFAULT 0,
  `streak` INT NOT NULL DEFAULT 1,
  `lastLoginDay` VARCHAR(50) DEFAULT NULL,
  `todayLessons` INT NOT NULL DEFAULT 0,
  `joinedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Modules
CREATE TABLE `modules` (
  `id` VARCHAR(36) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `topics` LONGTEXT NOT NULL,
  `order_num` INT NOT NULL DEFAULT 0,
  `lesson` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_modules_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Quizzes
CREATE TABLE `quizzes` (
  `id` VARCHAR(36) NOT NULL,
  `moduleId` VARCHAR(36) NOT NULL,
  `question` TEXT NOT NULL,
  `options` LONGTEXT NOT NULL,
  `answer` INT NOT NULL,
  `explanation` TEXT NOT NULL,
  `difficulty` VARCHAR(50) NOT NULL DEFAULT 'sedang',
  `order_num` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_quizzes_moduleId` (`moduleId`),
  CONSTRAINT `fk_quizzes_module` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Completed Lessons
CREATE TABLE `completed_lessons` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `moduleId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_module` (`userId`, `moduleId`),
  KEY `idx_cl_moduleId` (`moduleId`),
  CONSTRAINT `fk_cl_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cl_module` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Quiz Scores
CREATE TABLE `quiz_scores` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `moduleId` VARCHAR(36) NOT NULL,
  `correct` INT NOT NULL,
  `total` INT NOT NULL,
  `pct` INT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_quiz` (`userId`, `moduleId`),
  KEY `idx_qs_moduleId` (`moduleId`),
  CONSTRAINT `fk_qs_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_qs_module` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel User Badges
CREATE TABLE `user_badges` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `badgeId` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_badge` (`userId`, `badgeId`),
  CONSTRAINT `fk_ub_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Claimed Challenges
CREATE TABLE `claimed_challenges` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `challengeId` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_challenge` (`userId`, `challengeId`),
  CONSTRAINT `fk_cc_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Scenarios
CREATE TABLE `scenarios` (
  `id` VARCHAR(36) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `theme` VARCHAR(100) NOT NULL,
  `situation` TEXT NOT NULL,
  `choices` LONGTEXT NOT NULL,
  `order_num` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_scenarios_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel Scenario Results
CREATE TABLE `scenario_results` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `scenarioId` VARCHAR(36) NOT NULL,
  `choiceIndex` INT NOT NULL,
  `quality` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_scenario` (`userId`, `scenarioId`),
  KEY `idx_sr_scenarioId` (`scenarioId`),
  CONSTRAINT `fk_sr_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sr_scenario` FOREIGN KEY (`scenarioId`) REFERENCES `scenarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabel Sim Events
CREATE TABLE `sim_events` (
  `id` VARCHAR(36) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `theme` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `text` TEXT NOT NULL,
  `choices` LONGTEXT NOT NULL,
  `order_num` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_sim_events_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tabel Simulation Results
CREATE TABLE `simulation_results` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `balance` INT NOT NULL,
  `saving` INT NOT NULL,
  `avgQuality` FLOAT NOT NULL,
  `pct` INT NOT NULL,
  `passed` TINYINT(1) NOT NULL DEFAULT 0,
  `choicesLog` LONGTEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_sr_userId` (`userId`),
  CONSTRAINT `fk_sim_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
