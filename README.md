# Bookish-Octo-Invention

![Bookish-Octo-Invention Logo](doc/images/logo.png)

# Welcome to Bookish-Octo-Invention!

This project was designed for someone I appreciate a lot for her encouragements and dedication. That's why I put a lot of energy into this, making it a personalized platform. 

Our goal is to leverage the latest AI capabilities, specifically Amazon Bedrock's generative AI, to build a digital assistant that enhances user experience in the realm of healthy foodies, while also laying the foundation for a collaborative team environment.

[![Play Live 🚀](https://web-production-3e229.up.railway.app/login)](https://web-production-3e229.up.railway.app/login)

**Bookish-Octo-Invention** is a web application designed for recipe sharing tailored to specific dietary needs. Whether you’re looking for gluten-free, vegan, or low-carb options, this platform makes it easy to find and share recipes that suit your dietary preferences.

## Choosing Amazon Bedrock over Google Gemini

While we have the option to use [Google Gemini](https://ai.google.dev/gemini-api/docs/quickstart?authuser=2&hl=fr&lang=node) in the future, including its integration with Google Cloud Run, we are currently focusing on testing AWS's capabilities through [Amazon Bedrock](https://aws.amazon.com/bedrock/). This decision is based on our current infrastructure setup with AWS, which allows us to utilize Bedrock's native functionalities, such as Agents, Knowledge Bases, and pre-integrated AI tools.

Using Amazon Bedrock enables us to develop our LLM-powered digital assistant for building teams and answering queries related to healthy foods efficiently. Our aim is to take advantage of Bedrock's strengths in AI without immediately resorting to the complexities of Google's LLM options. 

### Why AWS Over Google Gemini:
- **Simpler Integration**: AWS Bedrock is well-suited for seamless integration with other AWS services, which we already use extensively.
- **Focus on Cost Efficiency**: LLM models can get expensive, and AWS allows us to start small and scale as necessary without overcommitting resources.
- **Flexible Testing Environment**: We plan to test AWS's AI capabilities first, allowing us to explore Google Gemini as a secondary option in the future.

## Project Requirements
- **Build a LLM-powered digital assistant**: The project will include a chat interface that allows users to interact with our AI-powered digital assistant using Amazon Bedrock’s native capabilities.
- **Data-driven Insights**: Use data from community-approved sources, possibly integrating data from Google, to create a knowledge base that supports healthy eating discussions.
- **Node.js as the Primary Language**: The project will be developed using Node.js to ensure efficient processing and data handling.

## 1. Features

- **Personalized Recipe Recommendations**: Get recipe suggestions based on your dietary restrictions and preferences.
- **AI-Powered Chat Interface**: Interact with a digital assistant to get real-time advice on dietary options and build healthy food plans.
- **User-Generated Content**: Share your own recipes and discover those shared by others.
- **Search & Filter**: Easily search for recipes using advanced filters like ingredients, dietary type, and meal category.
- **Nutritional Information**: Access detailed nutritional data for each recipe.

## 2. Getting Started

### 2.1 System Requirements

Ensure your system meets the following requirements:

- A compatible web browser (e.g., Chrome, Firefox, Safari).
- An active internet connection.
- Node.js and npm installed on your system.

### 2.2 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kvnbbg/bookish-octo-invention.git
   cd bookish-octo-invention
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configuration:**
   - **Environment Variables**: Set up environment variables by creating a `.env` file in the root directory:
     ```bash
     cp .env.example .env
     ```
     Fill in the `.env` file with your configuration settings (e.g., session secrets, API keys).

   - **Session Management**: Configure session management and ensure your `SESSION_SECRET` is secure.

4. **Run the Application:**
   ```bash
   npm start
   ```

   The application will typically run on `http://localhost:3000`. Visit this URL in your web browser to access the application.

## 3. Collaboration

We're looking for motivated team members to join us in this project! If you're interested, we invite you to contribute by pushing some code to the repository. We can also have discussions here since many current team members do not use Jira or Slack. Please leave your email address privately or on GitHub, and we'll add you to the project.

## 4. Contributing

We welcome contributions! To contribute:

1. **Fork the repository** on GitHub.
2. **Create a new branch** for your feature or bug fix.
3. **Make your changes** and commit them with descriptive messages.
4. **Submit a pull request** to the `main` branch.

Please read our [Contribution Guidelines](CONTRIBUTING.md) for more details.

## 5. License

This project is licensed under the [License](LICENSE).

## 6. Expanded Documentation

For more detailed information, refer to the following documents:

- [User Manual](doc/userManual.md)
- [Technical Documentation](doc/technicalDoc.md)
- [Design Assets Document](doc/designAssets.md)

---

**Author:** Kevin Marville  
**Contact:** [code@kvnbbg.fr](mailto:code@kvnbbg.fr)