const {
  PGPORT,
  PGHOST,
  PGPASS,
  PGUSER,
  DEV_DB,
  TEST_DB,
  PROD_DB,
} = process.env;

export default { PGPORT, PGHOST, PGPASS, PGUSER, DEV_DB, TEST_DB, PROD_DB };
