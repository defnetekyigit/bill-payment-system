Bill Payment System – SE4458 Midterm Project

Student: Defne Tekyiğit
Student Number: 22070006021

1. Project Overview
This project implements a Bill Payment System API that supports theses operations:
Mobile Provider App → Query bill
Banking App → Query unpaid bills & payments
Web Admin Panel → Add bills & batch CSV upload

All APIs are fully RESTful, versioned (/api/v1), documented with Swagger, and deployed on Azure App Service.
The system uses JWT authentication, rate limiting, paging, and request/response logging as required.

*AI Agent & Chat Gateway (Assignment 3)*
As part of SE4458 Assignment 3, an AI Agent layer has been added on top of the existing
Bill Payment APIs.
This AI Agent enables users to interact with the system via natural language chat,
instead of calling REST APIs manually.

Architecture:
- A Chat API endpoint (/api/v1/chat) acts as an API Gateway
- Each user message is sent to an LLM (OpenAI GPT-4o-mini)
- The LLM parses the intent and parameters (month, amount, etc.)
- Parsed intent is mapped to existing Midterm APIs:
  - Query Bill
  - Query Bill Detailed
  - Pay Bill
- API responses are formatted and returned as chat messages

Supported Intents:
- QUERY_BILL
- QUERY_BILL_DETAILED
- PAY_BILL

Assumptions:
- The user is assumed to be authenticated
- A constant subscriber number (123456) is used for demo purposes
- This assumption is allowed per assignment instructions

The AI Agent does not replace existing APIs; it orchestrates them via a chat interface.

-> Source Code:
https://github.com/defnetekyigit/bill-payment-system

-> Source Code for mobil:
https://github.com/defnetekyigit/bill-payment-system-ui

-> Live API Base URL:
https://billpayment-api-v2.azurewebsites.net

-> Swagger UI:
https://billpayment-api-v2.azurewebsites.net/swagger

-> Demo video link:
https://drive.google.com/file/d/1ICHnVtPZa1DjM1LaUUxHJ6EDXI49o5ZT/view?usp=sharing

2. System Architecture
The system follows a clean modular architecture:
Express.js for routing
Controllers for business logic
Middleware for auth, rate limiting, and logging
Service layer for DB queries
Swagger for API documentation
Azure PostgreSQL as database
Azure Web App (Linux) for deployment

3. Technologies Used
Backend	Node.js + Express + TypeScript
Database	Azure PostgreSQL Flexible Server
Deployment	Azure App Service (Linux)
CI/CD	GitHub -> Deployment Center
Auth	JWT Authentication
Docs	Swagger (swagger-jsdoc + swagger-ui-express)
Logging	Custom middleware ->  file logs + Azure Log Stream

4. Project Structure
src/
 ├── controllers/
 ├── routes/
 ├── middleware/
 ├── services/
 ├── swagger/
 ├── utils/
 ├── app.ts
 └── server.ts
dist/  
logs/
package.json
tsconfig.json

5. Deployment URLs
Base URL
https://billpayment-api-cnh8fubqbegrf5cm.francecentral-01.azurewebsites.net
Note: The base domain returns “Cannot GET /” because the API doesnt have a response for base url.

API Root
/api/v1
Swagger Documentation
https://billpayment-api-cnh8fubqbegrf5cm.francecentral-01.azurewebsites.net/swagger

6. Authentication
JWT is required for:
Mobile Provider Bill Query
Detailed Bill Query
Banking App Queries
Admin endpoints

You should generate Token with:
POST /api/v1/auth/token
Example response:
{ "token": "the-token" }
Use "Authorize" button in Swagger and enter the token.

7. API Endpoints
Auth
POST	/api/v1/auth/token	Generate JWT token
Mobile Provider App
GET	/api/v1/bill	Query bill	Auth + Rate Limit (3/day)
GET	/api/v1/bill/detailed	Query detailed bill info	Auth + Paging
Banking App
GET	/api/v1/bank/bill	Query unpaid bills
POST	/api/v1/pay	Pay bill
Admin Panel
POST	/api/v1/admin/bill	Add bill
POST	/api/v1/admin/bill/batch	Upload CSV and insert multiple bills

8. Logging
Custom middleware logs both requests and responses.
Log Files
/home/site/wwwroot/dist/logs/requests.log
/home/site/wwwroot/dist/logs/responses.log
Sample Request Log
{
  "time": "2025-11-29T18:40:00Z",
  "method": "GET",
  "url": "/api/v1/bill?subscriber_no=123",
  "ip": "xx.xx.xx.xx"
}
Sample Response Log
{
  "time": "2025-11-29T18:40:00Z",
  "statusCode": 200,
  "latencyMs": 42
}

How to Access Logs in Azure
First way – Kudu Console
Azure Portal → App Service → Advanced Tools → Debug Console → Bash
Then:
cd /home/site/wwwroot/dist/logs
cat requests.log
cat responses.log

Second way – Live Log Stream
Azure Portal → App Service → Log Stream
(All console.log messages appear live.)

9. Data Model (ER Diagram)
   bills
   id(Private key)
   subscriber_no
   month
   bill_total
   paid_amount
   remaining_amount
   status(paid/unpaid)

10. Assumptions
Subscriber_no + month combination is unique
Mobile provider rate limit is 3 calls/day per subscriber
Paging applies only to detailed bill endpoint
Note:just to inform you in azure i accidentally named the resouce group se_4453 not se_4458 but azure doesnt allow changing the resource group name :(

11. Deployment Steps

Created Azure PostgreSQL instance
Created Azure Web App (Node 22, Linux)
Added environment variables:
DB_HOST
DB_PORT
DB_USER
DB_PASS
DB_NAME
JWT_SECRET

Connected GitHub repo via Deployment Center
Pushed code → CI/CD pipeline deployed automatically
Checked logs + verified endpoints via Swagger

12. How to Run Locally
   1. Clone repository:
 git clone https://github.com/defnetekyigit/bill-payment-system
 cd bill-payment-system

   2. Create .env file:
 DB_HOST=xxx.xxx.xxx.xxx
 DB_PORT=5432
 DB_USER=xxxxx
 DB_PASS=xxxxx
 DB_NAME=billpaymentdb
 JWT_SECRET=MY_SECRET_KEY

   3. Install & run:
 npm install
 npm run dev
 Local URL
 http://localhost:3000/api/v1
