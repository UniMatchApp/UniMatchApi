import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    "type": "mongodb",
    "host": "localhost",
    "port": 27017,
    "database": "mydatabase",
    "synchronize": true,
    "logging": true,
    "useUnifiedTopology": true,
  });

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

export default AppDataSource;
