\echo 'deleting production database if it exists';
DROP DATABASE IF EXISTS rollmein_prod;
\echo 'creating production database'
CREATE DATABASE rollmein_prod;