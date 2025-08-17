# Online Donation Tracker

A full-stack web application for NGOs to manage fundraising campaigns and accept online donations. Built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Stripe for payment processing.

Assignment: **Software requirements analysis and design (Full-Stack CRUD Application Development with DevOps Practices)** - (Total Marks **20**)

---

**Objective**

You have been provided with a starter project that includes user authentication using Node.js, React.js, and MongoDB. Your task is to extend this application by implementing CRUD (Create, Read, Update, Delete) operations of different featuresfor a real-world application of your choice, while following industry best practices such as: 

* **Project Management with JIRA**
* **Requirement Diagram**, **Block Definition Diagram (**BDD), Parametric Diagram using**SysML**
* **Version Control using GitHub**
* **CI/CD Integration for Automated Deployment**

---

**GitHub link of the starter project: **[https://github.com/rajuiit/sdlapps](https://github.com/rajuiit/sdlapps)

---

**Requirement**

1. **Choose a Real-World Application**

We will send you an email to choose a Real-World project. If you face any difficulties in choosing your project, please contact your tutor.

2. **Project Design with SysML and Project Management with JIRA**

* Draw a requirements diagram, Block Definition Diagram (BDD), and Parametric Diagram based on your project (Connect all functional features).
* Create a JIRA project and define:
  * Epic
  * User Stories (features required in your app)
  * Child issues or Subtasks (breaking down development work)
  * Sprint Implementation (organizing work into milestones)
* Provide your JIRA board URL in the project README.

**3. Backend Development (Node.js + Express + MongoDB)**

* Set up and configure the MongoDB database connection.
* Implement various backend functions for handling application data.Ensure that all functions are compatible with an Application Programming Interface (API) structure(Follow existing patterns used in the Task Manager App where applicable).
* Implement CRUD operations forcreating, reading, updating, and deleting records for each functionality.

4. **Frontend Development (React.js)**

* Create a user-friendly interface to interact with your API endpoint (Follow task manager app).
* Implement different forms for adding, updating, and deleting records.
* Display data using tables, cards, or lists (Follow how we showed data in task manager app, try to implement better visualization for the frontend.)

**5. Authentication & Authorization** (Prerequisite Task)

* Ensure only authenticated users can access and perform CRUD operations. (Already developed in your project)
* Use JWT (JSON Web Tokens) for user authentication (Use the task manager one from .env file).

**6. GitHub Version Control & Branching Strategy**

* Use GitHub for version control and maintain:
* main branch (stable production-ready code)
* Feature branches for each new feature
* Follow proper commit messages and pull request (PR) for code reviews.

**7. CI/CD Pipeline Setup**

* Implement a CI/CD pipeline using GitHub Actions to:
* Automatically run tests on every commit/pull request (Optional).
* Deploy the backend to AWS. (Use the QUT provided EC2 instance)
* Deploy the frontend to AWS.
* Document your CI/CD workflow in the README.

---

**Submission Requirements**

**A report **contains** the following (Provide screenshots as evidence for each implemented task. **The screenshot should **contain** your username** from JIRA, GITHUB, and AWS**):

* **JIRA Project **Management**(Provide screenshots in the **report o**f at least two epics**, **including user story, sub**t**a**sks**. **Please **don’t** provide **the **U**ser Authentication** epic**.**Provide your JIRA Board URL in the report and README file as well.**Through the JIRA Board, we will systematically review the completeness of the project features, organised under Epics, User Stories, and Sub-tasks.**
* Requirement diagram, Block Definition Diagram (BDD), Parametric Diagram (Using project features).
* **GitHub Repository (backend/ and frontend/)** link. We will **review** your code implementation, which you followed from the task description. We will also **review** your commits, main branch, feature branches, and pull requests. **(**Please note that the authorisation** (Log In, Registration)** is the prerequisite for backend development.**)**
* CI/CD pipeline details step by step screenshot.
* README.md with:
* Project setup instructions.
* Public URL of your project.
* Provide a project-specific username and password if we need to access your dashboard.

---

**Assessment Criteria:**

* Clarity and completeness of Jira board and SysML models.
* Adherence to Git best practices and practical contributions.
* Successful implementation, deploymentand CI/CD pipeline.
* Problem-solving skills and the ability to go beyond basic requirements.

---

## Project Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe account for payment processing

### Environment Variables

Create `.env` files in both the backend and frontend directories:

#### Backend `.env`

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

#### Frontend `.env`

```
REACT_APP_API_URL=http://localhost:5001
```

### Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd OnlineDonationTracker
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Start the development servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

### Stripe Integration Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com) if you don't have one.

2. **Get your API keys** from the Stripe Dashboard:
   - Publishable key: Dashboard → Developers → API Keys → Publishable key
   - Secret key: Dashboard → Developers → API Keys → Secret key

3. **Set up webhook endpoint**:
   - In the Stripe Dashboard, go to Developers → Webhooks → Add endpoint
   - Use your application URL + `/api/payment/webhook` as the endpoint URL
   - Add the following events to listen for:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

4. **Get webhook signing secret**:
   - After creating the webhook, reveal and copy the signing secret
   - Add this to your backend `.env` file as STRIPE_WEBHOOK_SECRET

5. **Test the integration**:
   - Use Stripe's test card numbers for testing:
     - Success: 4242 4242 4242 4242
     - Failure: 4000 0000 0000 0002
   - Expiry date can be any future date, CVC can be any 3-digit number
   - Use any name and valid email address

### User Credentials for Testing

You can register new users through the application, or use the following test account:

- **Email**: test@example.com
- **Password**: password123

## Features

- User authentication (login, register, profile management)
- Create and manage fundraising causes
- Browse active fundraising campaigns
- Make online donations using Stripe
- View donation history and receipts
- Track fundraising progress

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Processing**: Stripe API
- **CI/CD**: GitHub Actions
