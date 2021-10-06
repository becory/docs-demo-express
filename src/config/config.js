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
    "use_env_variable": "DATABASE_URL",
    "salt": process.env.SALT
  }
}
