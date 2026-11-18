# E-Commerce Application

A full-stack e-commerce application I built with **Spring Boot 4, Angular 22, MySQL, and Spring AI**. It covers the core shopping flow end to end: product browsing, cart, secure checkout, Stripe payments, and order history. It also includes an AI shopping assistant that runs on a local Qwen3 model.

I built this to show how I design and build a complete application, not just individual features. That includes securing the API properly, keeping business logic in well-separated layers, and adding AI in a controlled way that doesn't compromise the rest of the system.

## Highlights

- **Secure by design:** Auth0 sign-in (OAuth2 Authorization Code Flow with PKCE) on the frontend, with Spring Security validating JWTs independently as an OAuth2 Resource Server on the backend.
- **Ownership enforced on the server:** Customers are identified by the JWT `sub` claim, never by an ID sent from the browser, so users can only see their own orders.
- **Real payments:** Stripe Payment Intents created on the backend, with Stripe Elements on the frontend.
- **AI that calls my code, not my database:** The assistant uses Spring AI tool calling to reach existing Java services. The model interprets the request. Java does the work.
- **Runs locally:** The LLM runs through Ollama, so there are no paid cloud LLM APIs.

## Tech Stack

| Area | Technologies |
|---|---|
| Backend | Java, Spring Boot 4, Spring MVC |
| Security | Spring Security, OAuth2, JWT, Auth0 |
| Database | MySQL |
| Persistence | Spring Data JPA, Hibernate |
| Frontend | Angular 22, TypeScript, RxJS, Angular Signals |
| Payments | Stripe |
| AI | Spring AI, Ollama, Qwen3 |
| Build Tools | Maven, npm |
| API Testing | Postman |

## Application Features

### Product Catalog

Users can browse products, filter by category, search by name, and view product details. The backend exposes REST APIs, and Spring Data JPA handles the database access.

I implemented server-side pagination so the app loads products in small sets instead of pulling the whole catalog at once. On the Angular side, components and services manage listings, search, pagination, and navigation.

### Shopping Cart and Checkout

Users can add products, change quantities, remove items, and check out. An Angular service holds the cart state and calculates quantities and totals.

Checkout uses Angular reactive forms with custom validation for customer, shipping, and billing information. For payment, the backend creates a Stripe Payment Intent, and the frontend uses Stripe Elements to collect card details and confirm the payment.

### Authentication and Authorization

Sign-in is handled by Auth0 using the OAuth2 Authorization Code Flow with PKCE. After login, Angular gets an access token and sends it with requests to protected endpoints.

On the backend, I configured Spring Security as an OAuth2 Resource Server so every protected request has its JWT validated before it reaches my code. The checkout and order endpoints require authentication.

For customer identification I use the `sub` claim from the validated JWT rather than accepting a customer ID from the frontend. The same rule applies when retrieving orders, so a customer can only access their own.

### Order Management

Order processing is built with Spring Boot services, Spring Data JPA, and Hibernate. When an order is placed, the backend:

1. Reads the authenticated user's identity from the JWT.
2. Finds the customer by Auth0 user identifier, or creates a customer record.
3. Creates the order and links the purchased items.
4. Generates a unique order tracking number.
5. Saves everything to MySQL.

Orders track status, total amount, quantity, and creation and modification timestamps. Customers can review past orders on the order history page.

Main entities: `Product`, `ProductCategory`, `Customer`, `Order`, `OrderItem`, and `Address`.

## AI Shopping Assistant

The assistant lets customers work with the catalog and their orders using natural language. It is built with Spring AI, Ollama, and Qwen3.

I didn't let the model touch the database. I used Spring AI tool calling to connect it to my existing backend services. Business logic stays in Java, and the model is only used to understand the request and decide which tool to call.

### Product Search

The assistant can search by name, price, and availability. For example:

- "Show me coffee mugs under $20."
- "Do you have any books in stock?"
- "Find mousepads below $15."

Spring AI passes the search parameters to a Java tool, which calls the product service. Tool responses use DTOs rather than JPA entities. That limits what the model can see and avoids dragging entity relationships into the response.

### Order Inquiries

I added backend tools for order lookup. The assistant can fetch an order by tracking number or list the customer's five most recent orders.

Lookups are tied to the authenticated user's Auth0 identifier, so the assistant cannot retrieve someone else's order. If a request needs a tracking number, the assistant is instructed to ask for it instead of guessing which order the customer means.

### Conversation Memory

I used Spring AI's `MessageWindowChatMemory` and `MessageChatMemoryAdvisor` to keep conversation context. Each conversation has a unique ID, and the message window is capped so I'm not sending an oversized history to the model on every request.

### Conversation Lifecycle Management

Conversations also need to end cleanly, so I handled inactivity on both sides.

- **Backend:** An activity tracker records each conversation's last activity time, and a scheduled task clears the memory of expired conversations. I used `ConcurrentHashMap` for tracking and `ReentrantLock` to coordinate cleanup with active requests, so cleanup can't wipe a conversation while a message is being processed.
- **Frontend:** RxJS detects inactivity. After the configured timeout, Angular resets the conversation ID and clears the chat history.

### Local LLM Integration

The assistant runs Qwen3 through Ollama. I chose local execution so the AI features work without paid cloud LLM APIs. The model handles language understanding and tool selection. Spring Boot services handle product search, order retrieval, and database operations.

## System Architecture

The application is layered: frontend components, REST controllers, business services, and persistence.

> Architecture diagram to be added.

| Component | Responsibility |
|---|---|
| Angular | UI, routing, forms, cart management, auth integration, chat interface |
| Spring Security | JWT validation and access control for protected endpoints |
| REST Controllers | Handle frontend requests and return API responses |
| Service Layer | Product, checkout, customer, order, and chat business logic |
| Repository Layer | Spring Data JPA access to MySQL |
| Stripe | Payment processing |
| Auth0 | Authentication and access tokens |
| Spring AI | Language model integration, conversation memory, and backend tools |
| Ollama | Runs the Qwen3 model locally |

## Design Decisions

A few parts of this project needed more thought than standard product and checkout work.

**Customer identification.** I first considered identifying customers by email. I switched to the Auth0 user identifier because emails can change and shouldn't be the primary identity for an account. The JWT `sub` claim gives a stable link between the authenticated user and their customer record.

**API security.** I kept frontend authentication and backend authorization separate. Angular handles the Auth0 login flow, and Spring Security independently validates tokens on every protected request. The backend also checks ownership when returning order data instead of trusting identifiers from the client.

**AI tool integration.** I kept the AI layer separate from the core services. The tools are a thin interface between the model and existing Java code, so there is no duplicated query or business logic. The product and order services work on their own without the assistant.

**Conversation cleanup and concurrency.** Scheduled cleanup and live chat requests can touch the same conversation, so I added conversation-level locking. The inactivity timeout is configurable, and expired conversations are removed by a scheduled job.


## Screenshots

### Product Catalog
<img width="1510" height="881" alt="Screenshot 2026-11-18 at 10 57 02 AM" src="https://github.com/user-attachments/assets/f2856c97-2c30-4155-a87f-cf4c0df58903" />

### Shopping Cart and Checkout
<img width="1493" height="721" alt="Screenshot 2026-11-18 at 11 00 30 AM" src="https://github.com/user-attachments/assets/4ffe6d03-2867-48ff-9aaa-46b13b414c9d" />

### Order History
<img width="1503" height="853" alt="Screenshot 2026-11-18 at 11 01 52 AM" src="https://github.com/user-attachments/assets/b55804b9-2ff6-48de-8bf3-9fc373d018b0" />

### AI Shopping Assistant
<img width="1487" height="841" alt="Screenshot 2026-11-18 at 11 03 26 AM" src="https://github.com/user-attachments/assets/a22b87e5-2557-49ba-8e7f-47599bd8b2bd" />

## Running Locally

### Prerequisites

- Java and Maven
- Node.js and npm
- MySQL
- An Auth0 application and API configured
- Stripe test API credentials
- Ollama with Qwen3

### Backend

Set the MySQL connection, Auth0 issuer and audience, Stripe credentials, and Ollama settings in the backend application configuration. Then start it:

```bash
./mvnw spring-boot:run
```

### Frontend

```bash
npm install
npm start
```

### AI Model

```bash
ollama pull qwen3:4b
ollama serve   # only if Ollama isn't already running
```

The backend connects to the local Ollama service. Credentials and environment-specific settings are kept out of version control.


