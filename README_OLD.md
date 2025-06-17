# Bookish-Octo-Invention

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#) [![License](https://img.shields.io/badge/license-MIT-green.svg)](#)

A web application that leverages generative AI to provide personalized healthy recipe recommendations and foster a collaborative community around dietary preferences.

## Table of Contents

* [About](#about)
* [Features](#features)
* [Architecture & Tech Stack](#architecture--tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Configuration](#configuration)
  * [Running the Application](#running-the-application)
* [Usage](#usage)
* [Testing](#testing)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

[![Play Live 🚀](https://kvnbbg.github.io/bookish-octo-invention/)

---

## About

Bookish-Octo-Invention is a gamified recipe-management platform with built‑in AI assistance, designed to help users discover, share, and customize healthy recipes based on dietary needs (e.g., gluten-free, vegan, low-carb). By integrating Amazon Bedrock’s generative AI, the application offers real‑time nutritional advice and collaborative team features to support community-driven food planning.

## Features

* **Personalized Recommendations**: AI-driven recipe suggestions tailored to user preferences and dietary restrictions.
* **Interactive Chat Assistant**: Real‑time Q\&A powered by Amazon Bedrock for meal planning and nutritional guidance.
* **User Submissions**: Create, edit, and share recipes with the community.
* **Advanced Search & Filters**: Filter by ingredients, dietary type, cuisine, and more.
* **Nutritional Insights**: Detailed macro- and micronutrient breakdowns for every recipe.
* **Gamification Layer**: Earn XP and achievements as you explore and contribute.

## Architecture & Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Frontend       | HTML5, CSS3, JavaScript (ES6+), WebSocket    |
| Backend        | Node.js, Express                             |
| AI Integration | Amazon Bedrock (LLM Agents, Knowledge Bases) |
| Database       | PostgreSQL (or Siebel Oracle)                |
| ML Framework   | TensorFlow 2.12+                             |
| Build & CI/CD  | Maven, npm, GitHub Actions                   |
| Security       | JWT, HTTPS, OWASP best practices             |

## Getting Started

### Prerequisites

* **Node.js** (v16+) and **npm**
* **Java** (v17+) and **Maven** (for backend build)
* **Docker** (optional for local database)
* AWS account with Bedrock access

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kvnbbg/bookish-octo-invention.git
   cd bookish-octo-invention
   ```

2. **Install dependencies**

   ```bash
   cd frontend  # if separate
   npm install
   cd ../backend
   mvn install
   ```

### Configuration

Create a `.env` file in the project root (copy from `.env.example`) and configure the following variables:

```env
# AWS & Bedrock
AWS_REGION=us-west-2
BEDROCK_API_KEY=your_api_key

# Server
PORT=3000
SESSION_SECRET=your_session_secret

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=app_user
DB_PASS=secure_password
DB_NAME=recipes_db
```

### Running the Application

* **Frontend**

  ```bash
  cd frontend
  npm start
  ```

  Access the UI at `http://localhost:3000`.

* **Backend**

  ```bash
  cd backend
  mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
  ```

  API served at `http://localhost:8080/api`.

## Usage

1. **Sign Up** for a new account or **Log In** if you already have one.
2. **Browse** or **Search** for recipes using the filter panel.
3. **Interact** with the AI Assistant via the chat widget for meal suggestions.
4. **Submit** your own recipes and earn XP points.

## Testing

* **Unit & Integration**

  ```bash
  # Backend tests
  cd backend
  mvn test

  # Frontend tests
  cd frontend
  npm test
  ```

* **End-to-End (Cypress)**

  ```bash
  npm run cypress:open
  ```

## Deployment

1. **Build**

   ```bash
   # Frontend
   cd frontend
   npm run build

   # Backend
   cd ../backend
   mvn clean package
   ```

2. **Docker** (optional)

   ```bash
   docker-compose up --build
   ```

3. **Production**

   * Upload the backend JAR to your server or use AWS ECS.
   * Serve static frontend via S3 + CloudFront or a CDN.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes with clear messages
4. Push to your fork and open a Pull Request
5. Ensure all tests pass and documentation is updated

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

**Maintainer:** Kevin Marville ([code@kvnbbg.fr](mailto:code@kvnbbg.fr))

---

*Elevate your culinary journey with AI-driven healthy recipes!*

**Author:** Kevin Marville  
**Contact:** [code@kvnbbg.fr](mailto:code@kvnbbg.fr)

## OAuth 2.0 Authentication
This application now supports OAuth 2.0 authentication with GitHub and Google. Users can log in using their existing accounts for a seamless experience.
