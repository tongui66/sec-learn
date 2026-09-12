-- =====================================================
-- PHP 学习站 v2 · 实验数据库初始化
-- 用法：mysql -u root < setup.sql
-- 说明：建 test 库与两个演示表（users / guestbook），供 code 里的示例使用
-- =====================================================

CREATE DATABASE IF NOT EXISTS test DEFAULT CHARACTER SET utf8mb4;
USE test;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS guestbook;

-- 用户表（SQL 注入示例用）
CREATE TABLE users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(64) NOT NULL COMMENT '教学用 MD5，真实项目必须用 bcrypt/Argon2',
  role     VARCHAR(20) NOT NULL DEFAULT 'user',
  email    VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 口令明文对照：admin / 123456 / password / qwerty
INSERT INTO users (username, password, role, email) VALUES
  ('admin',  '21232f297a57a5a743894a0e4a801fc3', 'admin', 'admin@test.local'),
  ('alice',  'e10adc3949ba59abbe56e057f20f883e', 'user',  'alice@test.local'),
  ('bob',    '5f4dcc3b5aa765d61d8327deb882cf99', 'user',  'bob@test.local'),
  ('carol',  'd8578edf8458ce06fbc5bb76a58c5ca4', 'user',  'carol@test.local');

-- 留言表（存储型 XSS 示例用）
CREATE TABLE guestbook (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  content    VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 自测：应该返回 4
SELECT COUNT(*) AS 用户数 FROM users;
