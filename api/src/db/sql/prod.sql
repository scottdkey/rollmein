\echo 'deleting production database if it exists';
DROP DATABASE IF EXISTS rollmein_api;
\echo 'creating production database'
CREATE DATABASE rollmein_api;