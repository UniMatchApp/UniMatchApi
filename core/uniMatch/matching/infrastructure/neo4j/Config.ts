import { Driver, auth } from 'neo4j-driver';
import * as createDriver from 'neo4j-driver';
import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(__dirname, 'matching.env');
dotenv.config({ path: envFilePath });

const driver: Driver = createDriver.driver(
    process.env.NEO4J_URL || 'neo4j+s://localhost:7687',
    auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
    )
);

console.log("Neo4j driver created");

export default driver;
