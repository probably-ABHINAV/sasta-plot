-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2025 at 01:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crm`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `otp` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `is_disabled` tinyint(1) NOT NULL DEFAULT 0,
  `owned_by_admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `phone_number`, `password_hash`, `otp`, `otp_expiry`, `role_id`, `is_disabled`, `owned_by_admin_id`) VALUES
(1, 'Drrealtor', 'drrealtorindia@gmail.com\n\n', NULL, '$2y$10$z6VOe5AUkukxTfmb/tdAounkde6O2cL5EQyOv1jPoXD/kqtHS5oCG', '196873', '2025-10-30 09:49:41', 1, 0, NULL),
(2, 'rsrajput844507@gmail.com', 'rsrajput844507@gmail.com', NULL, '$2y$10$i.YUOMh94SELcjLYjH2t8OPBaMMPxQI.qgVLO933aHVijQVyLrPim', NULL, NULL, 2, 0, NULL),
(7, 'Rani Singh', 'pakigig527@merotx.com', '8084602068', '$2y$10$pO.WCOFO5tSQPvJ3M9WDq.fXhrIPUGPf6OfZJqQ8ypBqAOIuKrATu', NULL, NULL, 2, 0, NULL),
(8, 'tech@drrealtor.co.in', 'tech@drrealtor.co.in', '9229988000', '$2y$10$wiuOqBfJYDWSMI5K/0QjeOogtJc8G9/HVwGo6YDyWSBWqx7.cOFlC', NULL, NULL, 1, 0, NULL),
(10, 'SuperAdmin', 'aayushraj331289@gmail.com', NULL, '$2y$10$D8leybTECciU4A92UGRck.VdzjCbL1iCySL4CEqQAdJbTyrbBk2EC', NULL, NULL, 4, 0, NULL),
(14, 'Raunak', 'raunakraj844507@gmail.com', '06205048463', '$2y$10$S99.G8AgW4cq1fam7Zma7.RXDRoRTbr.plnVpIWQ4ok0hQJe4nSHC', NULL, NULL, 2, 0, 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `owned_by_admin_id` (`owned_by_admin_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_owner_admin` FOREIGN KEY (`owned_by_admin_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
