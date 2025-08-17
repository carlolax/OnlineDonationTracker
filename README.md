# Online Donation Tracker

A full-stack web application for organizations to manage fundraising campaigns and accept online donations. Built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Stripe for payment processing.

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

### Quick Start Guide for Beginners

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OnlineDonationTracker
   ```

2. **Install dependencies and start servers**
   ```bash
   # Install all dependencies (backend and frontend)
   npm install
   
   # Start both servers with a single command
   npm start
   ```

3. **Access the application**
   - Open your browser and go to http://localhost:3000
   - You should see the login/register page

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

## Deployment Guide for EC2

### 1. Setting Up an EC2 Instance

1. **Launch an EC2 instance**:
   - Log in to AWS Console and navigate to EC2
   - Click "Launch Instance"
   - Choose Amazon Linux 2 or Ubuntu Server 20.04 LTS
   - Select t2.micro (free tier eligible) or larger based on needs
   - Configure security groups (open ports 22, 80, 443, 5001)
   - Create or select an existing key pair (.pem file)
   - Launch the instance

2. **Connect to your instance**:
   ```bash
   chmod 400 your-key-pair.pem
   ssh -i your-key-pair.pem ec2-user@your-instance-public-dns
   ```
   *Note: Use `ubuntu` instead of `ec2-user` for Ubuntu instances*

### 2. Set Up the Environment

1. **Update package lists and install dependencies**:
   ```bash
   # For Amazon Linux
   sudo yum update -y
   sudo yum install git -y
   
   # For Ubuntu
   sudo apt update
   sudo apt install git -y
   ```

2. **Install Node.js**:
   ```bash
   # Install NVM (Node Version Manager)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   source ~/.bashrc
   
   # Install Node.js v16
   nvm install 16
   nvm use 16
   ```

3. **Install MongoDB** (or use MongoDB Atlas):
   ```bash
   # For MongoDB Atlas: Use your connection string
   
   # For local MongoDB on Ubuntu:
   sudo apt install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

### 3. Deploy the Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/OnlineDonationTracker.git
   cd OnlineDonationTracker
   ```

2. **Set up environment variables**:
   ```bash
   # For backend
   cd backend
   nano .env
   # Add your environment variables and save (Ctrl+X, Y, Enter)
   ```
   
   Include the following in your .env file:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5001
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

3. **Install dependencies**:
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Build the frontend**:
   ```bash
   npm run build
   ```

5. **Install PM2 to manage Node.js processes**:
   ```bash
   npm install pm2 -g
   ```

6. **Start the backend server**:
   ```bash
   cd ../backend
   pm2 start server.js --name "donation-tracker-backend"
   ```

7. **Serve the frontend using NGINX**:
   ```bash
   # Install NGINX
   sudo yum install nginx -y  # For Amazon Linux
   # OR
   sudo apt install nginx -y  # For Ubuntu
   
   # Start NGINX
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

8. **Configure NGINX**:
   ```bash
   sudo nano /etc/nginx/sites-available/donation-tracker
   ```
   
   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       # Frontend
       location / {
           root /home/ec2-user/OnlineDonationTracker/frontend/build;
           try_files $uri /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable the site**:
   ```bash
   # For Ubuntu
   sudo ln -s /etc/nginx/sites-available/donation-tracker /etc/nginx/sites-enabled/
   
   # For Amazon Linux
   sudo mkdir -p /etc/nginx/sites-enabled
   sudo ln -s /etc/nginx/sites-available/donation-tracker /etc/nginx/sites-enabled/
   ```

10. **Test and reload NGINX**:
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```

### 4. Set Up Domain and SSL

1. **Configure your domain**:
   - Go to your domain registrar
   - Create an A record pointing to your EC2 instance's public IP

2. **Install Certbot for free SSL certificate**:
   ```bash
   # For Ubuntu
   sudo apt install certbot python3-certbot-nginx -y
   
   # For Amazon Linux
   sudo amazon-linux-extras install epel -y
   sudo yum install certbot python-certbot-nginx -y
   ```

3. **Get SSL certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### 5. Set Up CI/CD with GitHub Actions

1. **Create a deploy key**:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"
   # Save to ~/.ssh/github-actions-deploy
   # No passphrase
   ```

2. **Add the public key to authorized keys**:
   ```bash
   cat ~/.ssh/github-actions-deploy.pub >> ~/.ssh/authorized_keys
   ```

3. **Get the private key**:
   ```bash
   cat ~/.ssh/github-actions-deploy
   ```
   Copy this for the GitHub secrets

4. **In your GitHub repository**:
   - Go to Settings > Secrets and Variables > Actions
   - Add secrets:
     - `EC2_SSH_KEY`: The private key content
     - `EC2_HOST`: Your EC2 public DNS or IP
     - `EC2_USERNAME`: ec2-user or ubuntu

5. **Create GitHub Actions workflow**:
   Create `.github/workflows/deploy.yml` in your repository:
   ```yaml
   name: Deploy to EC2
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
             
         - name: Install frontend dependencies
           run: |
             cd frontend
             npm ci
             
         - name: Build frontend
           run: |
             cd frontend
             npm run build
             
         - name: Deploy to EC2
           uses: appleboy/scp-action@master
           with:
             host: ${{ secrets.EC2_HOST }}
             username: ${{ secrets.EC2_USERNAME }}
             key: ${{ secrets.EC2_SSH_KEY }}
             source: "./"
             target: "/home/${{ secrets.EC2_USERNAME }}/OnlineDonationTracker"
             
         - name: Execute remote commands
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.EC2_HOST }}
             username: ${{ secrets.EC2_USERNAME }}
             key: ${{ secrets.EC2_SSH_KEY }}
             script: |
               cd /home/${{ secrets.EC2_USERNAME }}/OnlineDonationTracker
               cd backend
               npm ci
               pm2 restart donation-tracker-backend || pm2 start server.js --name "donation-tracker-backend"
   ```

## Public URL Information

You can access our deployed application at the following URL:

- **Production URL**: [https://donation-tracker.example.com](https://donation-tracker.example.com)
- **JIRA Board URL**: [https://online-donation-tracker.atlassian.net/jira/software/projects/ODT/boards/1](https://online-donation-tracker.atlassian.net/jira/software/projects/ODT/boards/1)

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
