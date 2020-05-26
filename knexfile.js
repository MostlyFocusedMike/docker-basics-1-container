const path = require('path');

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DEV_DB_HOST,
            port: process.env.DEV_DB_PORT,
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PSWD,
            database: process.env.DEV_DB_NAME,
        },
        migrations: {
            directory: path.join(__dirname, 'src', 'backend', 'db', 'migrations'),
        },
        seeds: {
            directory: path.join(__dirname, 'src', 'backend', 'db', 'seeds'),
        },
    },
    // Heroku just used an env variable
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: path.join(__dirname, 'src', 'backend', 'db', 'migrations'),
        },
        seeds: {
            directory: path.join(__dirname, 'src', 'backend', 'db', 'seeds'),
        },
        useNullAsDefault: true
    }
};
