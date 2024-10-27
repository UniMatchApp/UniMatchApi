import { Driver, auth } from 'neo4j-driver';
import * as createDriver from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config({ path: 'matching.env' });

const driver: Driver = createDriver.driver(
    process.env.NEO4J_URL || 'neo4j+s://localhost:7687',
    auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
    )
);

export default driver;
