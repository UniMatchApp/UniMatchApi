import { Driver, auth } from 'neo4j-driver';
import createDriver from 'neo4j-driver';

// Configura la conexión a Neo4j
const driver: Driver = createDriver.driver(
    'bolt://localhost:7687',
    auth.basic('neo4j', 'password')
);

export default driver;
