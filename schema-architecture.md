## Section 1: Architecture Summary

This Spring Boot application utilizes a hybrid architectural approach, combining both MVC and REST controllers to handle different client needs. The Admin and Doctor dashboards are served via Thymeleaf templates, providing a seamless server-side rendering experience for internal management tasks. All other modules are exposed through REST APIs, allowing for decoupled communication and potential integration with various front-end frameworks or mobile clients.

The application employs a polyglot persistence strategy to handle different data requirements efficiently. Relational data, including patient information, doctor details, appointments, and administrative records, is managed within a MySQL database using JPA entities. To accommodate the more flexible and document-oriented nature of medical scripts, prescriptions are stored in MongoDB. A common service layer sits between the controllers and the data access layer, orchestrating the flow of information and delegating tasks to the appropriate MySQL or MongoDB repositories.

---

## Section 2: Numbered flow of data and control

1. The user initiates a request by accessing the Admin/Doctor dashboards or performing an action on the Appointment pages.
2. The request is intercepted by the Spring DispatcherServlet and routed to either a Thymeleaf Controller (for UI rendering) or a REST Controller (for API data).
3. The controller processes the input and calls the corresponding method in the Service Layer.
4. The Service Layer applies business logic and determines whether the data resides in the relational or document store.
5. The service communicates with the Repository Layer, utilizing Spring Data JPA for MySQL transactions or Spring Data MongoDB for prescription documents.
6. The Repository Layer interacts with the respective database (MySQL or MongoDB) to retrieve or persist data.
7. The resulting data is passed back through the service layer to the controller, which either populates a Thymeleaf model for an HTML view or serializes a JSON response for the REST client.