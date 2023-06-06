module.exports = {
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
        user: process.env.DB_USER, // e.g. 'my-db-user'
        password: process.env.DB_PASS, // e.g. 'my-db-password'
        database: process.env.DB_NAME, // e.g. 'my-database'
        host: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'
        // Specify additional properties here.
        logging: false,
        "dialect": "postgres",
        "protocol": "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // <<<<<< YOU NEED THIS
            }
        },
        "salt": process.env.SALT
    }
}
