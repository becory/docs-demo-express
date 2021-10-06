module.exports =  {
  "development": {
    "username": "ssuyuanhuang",
    "password": "",
    "database": "docs-demo",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "salt": "a"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "salt": process.env.SALT
  }
}
