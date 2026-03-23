-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 09, 2026 at 01:01 PM
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
(1, 'CAR-101', 'Renault', 'Model E', 2021, 'suv', 'manual', 'hybrid', 4, 140.00, 'available', '2026-03-09 04:32:39'),
(12, 'CAR-112', 'Audi', 'Model C', 2016, 'luxury', 'manual', 'diesel', 6, 155.00, 'available', '2026-03-09 04:32:39');

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
(6, 1, NULL, NULL, 'Problème mécanique du véhicule', 'Lors de ma location, le véhicule a commencé à faire un bruit anormal au niveau du moteur. Je souhaiterais que ce problème soit vérifié.', 'open', '2026-03-09 04:58:58', NULL),
(7, 1, NULL, NULL, 'Insatisfaction concernant le service', 'Je souhaite signaler une insatisfaction concernant la qualité du service lors de ma location. Merci de bien vouloir examiner ma demande.', 'open', '2026-03-09 04:59:28', NULL);

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

--
-- Dumping data for table `rentals`
--

INSERT INTO `rentals` (`id`, `user_id`, `car_id`, `start_date`, `end_date`, `status`, `daily_price`, `total_price`, `created_at`) VALUES
(7, 1, 1, '2026-03-09 05:46:00', '2026-03-18 05:46:00', 'pending', 140.00, 1260.00, '2026-03-09 04:46:57'),
(8, 1, 12, '2026-03-13 05:47:00', '2026-03-28 05:47:00', 'confirmed', 155.00, 2325.00, '2026-03-09 04:47:17');

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
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `first_name`, `last_name`, `email`, `phone`, `password_hash`) VALUES
(1, 'admin', 'System', 'Admin', 'admin@carrental.local', '0000000000', '$2y$10$fU2K6xy.55af07bL/2oYE.3OwNy/iRmSCngR6atXQhljlc2QWFWWW'),
(34, 'customer', 'Ahmed Amine', 'LAHBIB', 'ahmedskyzit@gmail.com', NULL, '$2y$12$yXM3azEjxgZnXzmzLNXvIO.oOU.xqb8/RcU5SuiqMtF/THEXv7aw2');

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
-- AUTO_INCREMENT for table `reclamations`
--
ALTER TABLE `reclamations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `car_images`
--
ALTER TABLE `car_images`
  ADD CONSTRAINT `fk_car_images_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;

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
