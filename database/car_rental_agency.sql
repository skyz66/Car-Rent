-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 07, 2026 at 12:37 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_rental_agency`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` bigint UNSIGNED NOT NULL,
  `plate_number` varchar(30) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` smallint NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `gearbox` enum('manual','automatic') NOT NULL,
  `fuel` enum('petrol','diesel','hybrid','electric') NOT NULL,
  `seats` tinyint UNSIGNED NOT NULL,
  `daily_price` decimal(10,2) NOT NULL,
  `status` enum('available','maintenance','unavailable') NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `plate_number`, `brand`, `model`, `year`, `category`, `gearbox`, `fuel`, `seats`, `daily_price`, `status`, `created_at`) VALUES
(1, 'CAR-101', 'Renault', 'Model E', 2021, 'suv', 'manual', 'hybrid', 4, 140.00, 'available', '2026-03-05 21:02:11'),
(2, 'CAR-102', 'Renault', 'Model C', 2020, 'luxury', 'automatic', 'diesel', 5, 46.00, 'available', '2026-03-05 21:02:11'),
(3, 'CAR-103', 'Mercedes', 'Model E', 2017, 'suv', 'manual', 'electric', 4, 48.00, 'available', '2026-03-05 21:02:11'),
(4, 'CAR-104', 'Toyota', 'Model E', 2016, 'suv', 'manual', 'petrol', 5, 141.00, 'available', '2026-03-05 21:02:11'),
(5, 'CAR-105', 'Renault', 'Model B', 2018, 'luxury', 'automatic', 'diesel', 5, 49.00, 'available', '2026-03-05 21:02:11'),
(6, 'CAR-106', 'Toyota', 'Model E', 2020, 'economy', 'automatic', 'hybrid', 4, 80.00, 'available', '2026-03-05 21:02:11'),
(7, 'CAR-107', 'Mercedes', 'Model A', 2023, 'luxury', 'automatic', 'electric', 4, 107.00, 'available', '2026-03-05 21:02:11'),
(8, 'CAR-108', 'Mercedes', 'Model E', 2020, 'suv', 'automatic', 'petrol', 6, 140.00, 'available', '2026-03-05 21:02:11'),
(9, 'CAR-109', 'Mercedes', 'Model D', 2019, 'economy', 'manual', 'petrol', 5, 102.00, 'available', '2026-03-05 21:02:11'),
(10, 'CAR-110', 'Mercedes', 'Model B', 2021, 'suv', 'automatic', 'hybrid', 5, 43.00, 'available', '2026-03-05 21:02:11'),
(11, 'CAR-111', 'Toyota', 'Model A', 2021, 'economy', 'manual', 'electric', 5, 75.00, 'available', '2026-03-05 21:02:11'),
(12, 'CAR-112', 'Audi', 'Model C', 2016, 'luxury', 'manual', 'diesel', 6, 155.00, 'available', '2026-03-05 21:02:11'),
(13, 'CAR-113', 'Renault', 'Model E', 2018, 'economy', 'manual', 'electric', 6, 54.00, 'available', '2026-03-05 21:02:11'),
(14, 'CAR-114', 'Mercedes', 'Model E', 2018, 'luxury', 'automatic', 'petrol', 5, 116.00, 'available', '2026-03-05 21:02:11'),
(15, 'CAR-115', 'Audi', 'Model B', 2017, 'economy', 'automatic', 'diesel', 5, 157.00, 'available', '2026-03-05 21:02:11'),
(16, 'CAR-116', 'Toyota', 'Model E', 2023, 'economy', 'manual', 'petrol', 4, 71.00, 'available', '2026-03-05 21:02:11'),
(17, 'CAR-117', 'Audi', 'Model C', 2022, 'luxury', 'manual', 'electric', 4, 118.00, 'available', '2026-03-05 21:02:11'),
(18, 'CAR-118', 'Toyota', 'Model B', 2021, 'suv', 'automatic', 'hybrid', 4, 52.00, 'available', '2026-03-05 21:02:11'),
(19, 'CAR-119', 'Renault', 'Model C', 2019, 'luxury', 'automatic', 'diesel', 6, 93.00, 'available', '2026-03-05 21:02:11'),
(21, 'aa', 'aa', 'aa', 1, 'economy', 'manual', 'petrol', 5, 1.00, 'available', '2026-03-06 23:50:38');

-- --------------------------------------------------------

--
-- Table structure for table `car_images`
--

CREATE TABLE `car_images` (
  `id` bigint UNSIGNED NOT NULL,
  `car_id` bigint UNSIGNED NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint UNSIGNED NOT NULL,
  `rental_id` bigint UNSIGNED NOT NULL,
  `doc_type` enum('invoice','contract') NOT NULL,
  `doc_number` varchar(100) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `signature_status` enum('blank','signed') NOT NULL DEFAULT 'blank',
  `signed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reclamations`
--

CREATE TABLE `reclamations` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `rental_id` bigint UNSIGNED DEFAULT NULL,
  `car_id` bigint UNSIGNED DEFAULT NULL,
  `subject` varchar(190) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','rejected') NOT NULL DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reclamations`
--

INSERT INTO `reclamations` (`id`, `user_id`, `rental_id`, `car_id`, `subject`, `description`, `status`, `created_at`, `resolved_at`) VALUES
(1, 2, NULL, NULL, 'aaaaa', 'aaa', 'open', '2026-03-06 04:36:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `car_id` bigint UNSIGNED NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('pending','confirmed','ongoing','completed','cancelled') NOT NULL DEFAULT 'pending',
  `daily_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(190) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `licence_number` varchar(100) DEFAULT NULL,
  `licence_issue_date` date DEFAULT NULL,
  `licence_expiry_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `licence_number`, `licence_issue_date`, `licence_expiry_date`, `created_at`) VALUES
(1, 'admin', 'System', 'Admin', 'admin@carrental.local', '0000000000', '$2y$10$fU2K6xy.55af07bL/2oYE.3OwNy/iRmSCngR6atXQhljlc2QWFWWW', 'ADM-001', '2018-01-01', '2035-01-01', '2026-03-05 18:11:44'),
(2, 'customer', 'User1', 'Lastname1', 'user1@mail.com', '0600000001', '$2y$12$a5QuM5.FiJ.xkQ5W.0wEve4W64jW95yo/3XXPYRPdar61ldTr2LVS', 'LIC-1001', '2016-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(3, 'customer', 'User2', 'Lastname2', 'user2@mail.com', '0600000002', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1002', '2018-03-05', '2030-03-05', '2026-03-05 21:02:11'),
(4, 'customer', 'User3', 'Lastname3', 'user3@mail.com', '0600000003', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1003', '2022-03-05', '2032-03-05', '2026-03-05 21:02:11'),
(5, 'customer', 'User4', 'Lastname4', 'user4@mail.com', '0600000004', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1004', '2015-03-05', '2028-03-05', '2026-03-05 21:02:11'),
(6, 'customer', 'User5', 'Lastname5', 'user5@mail.com', '0600000005', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1005', '2024-03-05', '2030-03-05', '2026-03-05 21:02:11'),
(7, 'customer', 'User6', 'Lastname6', 'user6@mail.com', '0600000006', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1006', '2017-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(8, 'customer', 'User7', 'Lastname7', 'user7@mail.com', '0600000007', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1007', '2023-03-05', '2030-03-05', '2026-03-05 21:02:11'),
(9, 'customer', 'User8', 'Lastname8', 'user8@mail.com', '0600000008', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1008', '2022-03-05', '2030-03-05', '2026-03-05 21:02:11'),
(10, 'customer', 'User9', 'Lastname9', 'user9@mail.com', '0600000009', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1009', '2024-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(11, 'customer', 'User10', 'Lastname10', 'user10@mail.com', '0600000010', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1010', '2015-03-05', '2032-03-05', '2026-03-05 21:02:11'),
(12, 'customer', 'User11', 'Lastname11', 'user11@mail.com', '0600000011', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1011', '2017-03-05', '2028-03-05', '2026-03-05 21:02:11'),
(13, 'customer', 'User12', 'Lastname12', 'user12@mail.com', '0600000012', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1012', '2020-03-05', '2032-03-05', '2026-03-05 21:02:11'),
(14, 'customer', 'User13', 'Lastname13', 'user13@mail.com', '0600000013', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1013', '2017-03-05', '2028-03-05', '2026-03-05 21:02:11'),
(15, 'customer', 'User14', 'Lastname14', 'user14@mail.com', '0600000014', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1014', '2021-03-05', '2030-03-05', '2026-03-05 21:02:11'),
(16, 'customer', 'User15', 'Lastname15', 'user15@mail.com', '0600000015', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1015', '2017-03-05', '2032-03-05', '2026-03-05 21:02:11'),
(17, 'customer', 'User16', 'Lastname16', 'user16@mail.com', '0600000016', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1016', '2017-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(18, 'customer', 'User17', 'Lastname17', 'user17@mail.com', '0600000017', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1017', '2020-03-05', '2029-03-05', '2026-03-05 21:02:11'),
(19, 'customer', 'User18', 'Lastname18', 'user18@mail.com', '0600000018', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1018', '2018-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(20, 'customer', 'User19', 'Lastname19', 'user19@mail.com', '0600000019', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1019', '2024-03-05', '2030-03-05', '2026-03-05 21:02:11'),
(21, 'customer', 'User20', 'Lastname20', 'user20@mail.com', '0600000020', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1020', '2022-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(22, 'customer', 'User21', 'Lastname21', 'user21@mail.com', '0600000021', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1021', '2023-03-05', '2029-03-05', '2026-03-05 21:02:11'),
(23, 'customer', 'User22', 'Lastname22', 'user22@mail.com', '0600000022', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1022', '2024-03-05', '2030-03-05', '2026-03-05 21:02:11'),
(24, 'customer', 'User23', 'Lastname23', 'user23@mail.com', '0600000023', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1023', '2019-03-05', '2028-03-05', '2026-03-05 21:02:11'),
(25, 'customer', 'User24', 'Lastname24', 'user24@mail.com', '0600000024', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1024', '2017-03-05', '2029-03-05', '2026-03-05 21:02:11'),
(26, 'customer', 'User25', 'Lastname25', 'user25@mail.com', '0600000025', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1025', '2019-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(27, 'customer', 'User26', 'Lastname26', 'user26@mail.com', '0600000026', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1026', '2016-03-05', '2029-03-05', '2026-03-05 21:02:11'),
(28, 'customer', 'User27', 'Lastname27', 'user27@mail.com', '0600000027', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1027', '2018-03-05', '2031-03-05', '2026-03-05 21:02:11'),
(29, 'customer', 'User28', 'Lastname28', 'user28@mail.com', '0600000028', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1028', '2020-03-05', '2028-03-05', '2026-03-05 21:02:11'),
(30, 'customer', 'User29', 'Lastname29', 'user29@mail.com', '0600000029', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1029', '2016-03-05', '2029-03-05', '2026-03-05 21:02:11'),
(31, 'customer', 'User30', 'Lastname30', 'user30@mail.com', '0600000030', '$2y$10$BrltQij9R1hZoPt4i1pQQOv.zm0vl6F3U/tR/h0zYwpo.Ri6sRbCG', 'LIC-1030', '2020-03-05', '2032-03-05', '2026-03-05 21:02:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`);

--
-- Indexes for table `car_images`
--
ALTER TABLE `car_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_car_images_car` (`car_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doc_number` (`doc_number`),
  ADD KEY `fk_documents_rental` (`rental_id`);

--
-- Indexes for table `reclamations`
--
ALTER TABLE `reclamations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reclamations_user` (`user_id`),
  ADD KEY `fk_reclamations_rental` (`rental_id`),
  ADD KEY `fk_reclamations_car` (`car_id`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rentals_car_dates` (`car_id`,`start_date`,`end_date`),
  ADD KEY `idx_rentals_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `car_images`
--
ALTER TABLE `car_images`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reclamations`
--
ALTER TABLE `reclamations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `car_images`
--
ALTER TABLE `car_images`
  ADD CONSTRAINT `fk_car_images_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `fk_documents_rental` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reclamations`
--
ALTER TABLE `reclamations`
  ADD CONSTRAINT `fk_reclamations_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_reclamations_rental` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_reclamations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `fk_rentals_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rentals_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
