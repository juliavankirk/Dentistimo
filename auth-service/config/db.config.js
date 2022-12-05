// module.exports = {
//     HOST: "temuujin.e-nomads.com",
//     USER: "altansukh_dbuser",
//     PASSWORD: "FwIC51PuiKLz",
//     DB: "altansukh_dental",
//     PORT: 5432,
//     dialect: "postgres",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };

module.exports = {
    HOST: 'localhost',
    USER: 'postgres',
    PASSWORD: 'postgres',
    DB: 'postgres',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};