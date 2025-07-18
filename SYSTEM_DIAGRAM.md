# System Design

This document outlines the system design, including the database model and features of the backend and frontend applications.

## Database Model

The database consists of the following tables:

-   **users**: Stores user information, including authentication details and roles (customer, sales).
    -   `id` (UUID, PK)
    -   `name` (String)
    -   `email` (String, Unique)
    -   `password` (String)
    -   `role` (Enum: 'customer', 'sales')
-   **products**: Stores product information.
    -   `id` (UUID, PK)
    -   `name` (String)
    -   `description` (String)
    -   `sku` (String)
    -   `price` (Integer)
    -   `stock` (Integer)
-   **quotations**: Stores quotation details.
    -   `id` (UUID, PK)
    -   `customerId` (UUID, FK to users.id)
    -   `status` (String, Enum: 'pending', 'approved', 'processed', 'rejected')
    -   `totalAmount` (Integer)
-   **quotation_items**: Stores the items within a quotation.
    -   `id` (UUID, PK)
    -   `quotationId` (UUID, FK to quotations.id)
    -   `productId` (UUID, FK to products.id)
    -   `quantity` (Integer)
    -   `unitPrice` (Integer)
    -   `subTotal` (Integer)
-   **sales_orders**: Stores sales order information, created from an approved quotation.
    -   `id` (UUID, PK)
    -   `quotationId` (UUID, FK to quotations.id, Unique)
    -   `customerId` (UUID, FK to users.id)
    -   `status` (String, Enum: 'invoiced', 'shipped', 'completed', 'canceled')
    -   `totalAmount` (Integer)

## Backend Features

The backend is a Node.js application with the following features:

-   **User Management**
    -   `POST /register`: Register a new user.
    -   `POST /login`: Log in a user and get a JWT token.
    -   `GET /my-profile`: Get the profile of the currently logged-in user.
-   **Product Management**
    -   `GET /`: Get a list of all products.
    -   `GET /:id`: Get details of a specific product.
-   **Quotation Management**
    -   `POST /`: Create a new quotation (customer role required).
    -   `GET /`: Get a list of quotations.
    -   `PUT /:id/approve`: Approve a quotation (sales role required).
-   **Sales Order Management**
    -   `POST /`: Create a new sales order from an approved quotation.
    -   `GET /`: Get a list of sales orders.

## Frontend Features

The frontend is a React application with the following features:

-   **Authentication**
    -   Login page.
    -   Registration page.
-   **Product**
    -   List all products.
-   **Quotation**
    -   Create a new quotation.
    -   List all quotations.
-   **Sales Order**
    -   List all sales orders.
    -   View sales order details.
-   **General**
    -   Sidebar for navigation.
    -   Theme toggle (dark/light mode).
    -   Pagination for lists.