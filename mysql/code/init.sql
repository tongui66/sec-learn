-- =====================================================
-- MySQL 网安学习站 v2 · 练习库初始化
-- 用法：  mysql -u root < init.sql
-- 建好后：mysql -u root  →  USE shop;  →  开始练习
-- 说明：  脚本可重复执行（会先删掉本课程的练习表再重建）
--         只操作 shop 库里的这几张练习表，不动你的其他数据
-- =====================================================

CREATE DATABASE IF NOT EXISTS shop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE shop;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS admin_log;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS demo2;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- 用户表：课程里绝大多数查询和注入示例都用它
-- 注意 email 列在这里就建好 —— 课文第 5、8、9 章的示例都会用到
-- -----------------------------------------------------
CREATE TABLE user (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL COMMENT '教学用 MD5；真实项目必须用 bcrypt/Argon2',
  email      VARCHAR(100) UNIQUE,
  role       VARCHAR(20)  NOT NULL DEFAULT 'user',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ck_user_role CHECK (role IN ('user','admin','auditor'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 商品表
-- -----------------------------------------------------
CREATE TABLE product (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100)  NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  stock        INT           NOT NULL DEFAULT 0,
  CONSTRAINT ck_product_price CHECK (price >= 0),
  CONSTRAINT ck_product_stock CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 订单表：product_id 在这里就建好 —— 课文第 8 章的三表 JOIN 要用
-- -----------------------------------------------------
CREATE TABLE orders (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT           NOT NULL,
  product_id INT           NOT NULL,
  amount     DECIMAL(10,2) NOT NULL,
  status     VARCHAR(20)   NOT NULL DEFAULT 'pending',
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user    FOREIGN KEY (user_id)    REFERENCES user(id),
  CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT ck_orders_status  CHECK (status IN ('pending','paid','refunded','cancelled')),
  INDEX idx_orders_user    (user_id),
  INDEX idx_orders_status  (status),
  INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 专门给教学演示用的小表：只有 2 列
-- 课文第 6、14 章讲「ORDER BY 探列数」时用它演示，不与 user 表的列数冲突
-- -----------------------------------------------------
CREATE TABLE demo2 (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 审计日志表：第 11 章的触发器实验会往这里写记录
-- -----------------------------------------------------
CREATE TABLE admin_log (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  action     VARCHAR(255) NOT NULL,
  operator   VARCHAR(100) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 测试数据
-- 口令哈希说明（教学用，明文都是常见弱口令）：
--   admin  → md5('admin')     = 21232f297a57a5a743894a0e4a801fc3
--   alice  → md5('123456')    = e10adc3949ba59abbe56e057f20f883e
--   bob    → md5('123456789') = 25f9e794323b453885f5181f1b624d0b
--   carol  → md5('password')  = 5f4dcc3b5aa765d61d8327deb882cf99
-- 可以用这条 SQL 逐个验证：
--   SELECT MD5('admin'), MD5('123456'), MD5('123456789'), MD5('password');
-- 这里用 MD5 只是让「弱口令 + 哈希」的教学演示更直观。
-- 真实项目绝不能用 MD5 存口令，要用 bcrypt / Argon2（PHP 用 password_hash）。
-- =====================================================
INSERT INTO user (username, password, email, role) VALUES
  ('admin', '21232f297a57a5a743894a0e4a801fc3', 'admin@shop.local', 'admin'),
  ('alice', 'e10adc3949ba59abbe56e057f20f883e', 'alice@shop.local', 'user'),
  ('bob',   '25f9e794323b453885f5181f1b624d0b', 'bob@shop.local',   'user'),
  ('carol', '5f4dcc3b5aa765d61d8327deb882cf99', 'carol@shop.local', 'auditor');

INSERT INTO product (product_name, price, stock) VALUES
  ('笔记本电脑', 4999.00, 20),
  ('无线鼠标',     99.00, 200),
  ('机械键盘',    199.00, 150),
  ('显示器',     1299.00,  30),
  ('移动硬盘',    599.00,  60);

-- 注意：carol 故意没有任何订单
-- 这样第 8 章讲「用 LEFT JOIN 找没下过单的用户」时能直接查出结果
INSERT INTO orders (user_id, product_id, amount, status) VALUES
  (1, 1, 4999.00, 'paid'),
  (1, 2,   99.00, 'paid'),
  (2, 3,  199.00, 'paid'),
  (2, 5,  599.00, 'pending'),
  (3, 1, 4999.00, 'paid'),
  (3, 4, 1299.00, 'refunded'),
  (1, 5,  599.00, 'cancelled'),
  (3, 2,   99.00, 'paid');

INSERT INTO demo2 (name) VALUES ('alpha'), ('beta'), ('gamma'), ('delta'), ('epsilon');

-- =====================================================
-- 自测：下面每一条都应该能跑通
-- =====================================================
-- SELECT COUNT(*) FROM user;                                  -- 4
-- SELECT COUNT(*) FROM orders;                                -- 8
-- SELECT u.username, p.product_name, o.amount FROM orders o
--   JOIN user u ON o.user_id = u.id
--   JOIN product p ON o.product_id = p.id ORDER BY o.id;      -- 三表 JOIN（第 8 章）
-- SELECT u.username FROM user u LEFT JOIN orders o ON o.user_id = u.id
--   WHERE o.id IS NULL;                                       -- 结果应为 carol（第 8 章）
-- SELECT role, COUNT(*) FROM user GROUP BY role;              -- 分组统计（第 7 章）
-- SELECT * FROM demo2 ORDER BY 2;                             -- 正常
-- SELECT * FROM demo2 ORDER BY 3;                             -- 报错：只有 2 列（第 6、14 章）

SELECT VERSION() AS 版本, DATABASE() AS 当前库, USER() AS 当前账号;
