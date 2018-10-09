/*
Navicat MySQL Data Transfer

Source Server         : 120
Source Server Version : 50641
Source Host           : localhost:3306
Source Database       : TravelAssDatabase

Target Server Type    : MYSQL
Target Server Version : 50641
File Encoding         : 65001

Date: 2018-10-09 10:22:36
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ta_resource
-- ----------------------------
DROP TABLE IF EXISTS `ta_resource`;
CREATE TABLE `ta_resource` (
  `r_id` int(12) NOT NULL AUTO_INCREMENT,
  `route_id` int(12) NOT NULL,
  `user_id` int(12) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(15) NOT NULL,
  `file_location` varchar(255) NOT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for ta_route
-- ----------------------------
DROP TABLE IF EXISTS `ta_route`;
CREATE TABLE `ta_route` (
  `route_id` int(112) NOT NULL AUTO_INCREMENT COMMENT '自增路线ID',
  `user_id` int(112) NOT NULL DEFAULT '0' COMMENT '用户ID',
  `start_time` int(12) NOT NULL DEFAULT '0' COMMENT '行程创建时间',
  `end_time` int(12) NOT NULL DEFAULT '0' COMMENT '行程结束时间',
  `start_lat` varchar(15) NOT NULL DEFAULT '0' COMMENT '开始纬度',
  `start_lng` varchar(15) NOT NULL DEFAULT '0' COMMENT '开始经度',
  `start_location` varchar(255) NOT NULL COMMENT '开始位置',
  `end_location` varchar(255) NOT NULL COMMENT '结束位置',
  `end_lat` varchar(15) NOT NULL DEFAULT '0' COMMENT '结束纬度',
  `end_lng` varchar(15) NOT NULL DEFAULT '0' COMMENT '结束经度',
  `actual_end_lat` varchar(15) NOT NULL DEFAULT '0' COMMENT '实际结束纬度',
  `actual_end_lng` varchar(15) NOT NULL DEFAULT '0' COMMENT '实际结束经度',
  `actual_end_location` varchar(255) NOT NULL COMMENT '实际结束位置',
  `is_close` int(255) NOT NULL DEFAULT '1' COMMENT '行程是否结束 1:进行中0:已结束',
  `is_del` int(1) NOT NULL DEFAULT '1' COMMENT '1正常2删除',
  PRIMARY KEY (`route_id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for ta_route_record
-- ----------------------------
DROP TABLE IF EXISTS `ta_route_record`;
CREATE TABLE `ta_route_record` (
  `record_id` int(12) NOT NULL AUTO_INCREMENT,
  `route_id` int(12) NOT NULL DEFAULT '0' COMMENT '路线ID',
  `user_id` int(12) NOT NULL DEFAULT '0' COMMENT '用户id',
  `rec_lat` varchar(25) NOT NULL DEFAULT '0' COMMENT '记录纬度',
  `rec_lng` varchar(25) NOT NULL DEFAULT '0' COMMENT '记录经度',
  `rec_time` int(12) NOT NULL DEFAULT '0' COMMENT '记录时间',
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5358 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for ta_user
-- ----------------------------
DROP TABLE IF EXISTS `ta_user`;
CREATE TABLE `ta_user` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(60) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `gender` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `birthday` int(11) unsigned NOT NULL DEFAULT '0',
  `register_time` int(11) unsigned NOT NULL DEFAULT '0',
  `last_login_time` int(11) unsigned NOT NULL DEFAULT '0',
  `last_login_ip` varchar(15) NOT NULL DEFAULT '',
  `user_level_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `nickname` varchar(60) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `register_ip` varchar(45) NOT NULL DEFAULT '',
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `weixin_openid` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`username`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;
