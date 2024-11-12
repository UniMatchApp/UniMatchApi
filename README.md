# UniMatch API Documentation

The UniMatch API is designed to facilitate interactions between users, events, messages, and notifications within the UniMatch platform. The codebase is organized into several directories and files, each serving a specific purpose in the overall architecture of the API.

## Code Organization

### 1. `apps/RestApi`
This directory contains the main application logic for the REST API.

- **`AppConfig.ts`**: Configures the Express application, including middleware and routes.
- **`Dependencies.ts`**: Sets up dependencies like the event bus and WebSocket controller.
- **`Main.ts`**: The entry point for the application, starting the server.
- **`routes/`**: Contains route definitions for different API endpoints (e.g., users, events, messages).
- **`uniMatch/`**: Contains controllers for handling specific functionalities like user management, event management, and messaging.

### 2. `core/`
This directory contains the core business logic and domain models.

- **`shared/`**: Contains shared utilities, domain models, and interfaces used across different modules.
- **`uniMatch/`**: Contains domain-specific logic for different features like user profiles, events, messages, and notifications.

### 3. `static/`
Contains static files like HTML, CSS, and JavaScript that are served by the API.

### 4. `config/`
Contains configuration files for different services like databases and message brokers.

## Key Components

- **Controllers**: Handle incoming HTTP requests and delegate tasks to the appropriate services or commands.
    - **Example**: `UserController`, `EventController`, `MessageController`.

- **Commands**: Encapsulate the business logic for specific actions.
    - **Example**: `CreateNewUserCommand`, `DeleteEventCommand`.

- **Repositories**: Provide an abstraction layer for data access, allowing the application to interact with different data sources.
    - **Example**: `TypeORMUserRepository`, `Neo4JMatchingRepository`.

- **Event Bus**: Facilitates communication between different parts of the application using events.
    - **Example**: `InMemoryEventBus`.

- **WebSocket Controller**: Manages WebSocket connections for real-time communication.
    - **Example**: `WebSocketController`.

## Running the Project

To set up and run the project, you can use the following commands:

### 1. Install Dependencies:

```bash
npm i
```

This command installs all the dependencies listed in the `package.json` file, creating a `node_modules` directory where all the required libraries and frameworks are stored.

### 2. Start the Application:

```bash
npm start
```

This command starts the application by executing the script defined under "start" in the `package.json` file. It typically runs the main entry point of the API, such as `Main.ts`, which initializes the server and begins listening for incoming requests on a specified port (e.g., port 3000).

### 3. Run Tests:

```bash
npx jest
```

This command runs the test suite using Jest, executing all the test files and providing a report of the test results.

By following these steps, you can set up the development environment and run the UniMatch API, allowing clients to interact with the various endpoints provided by the API.
