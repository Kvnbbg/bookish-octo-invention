# Bookish-Octo-Invention

![Bookish-Octo-Invention Logo](doc/images/logo.png)

[![Play Live 🚀](https://web-production-3e229.up.railway.app/login)](https://web-production-3e229.up.railway.app/login)

**Bookish-Octo-Invention** is a web application designed for recipe sharing tailored to specific dietary needs. Whether you’re looking for gluten-free, vegan, or low-carb options, this platform makes it easy to find and share recipes that suit your dietary preferences.

## 1. Features

- **Personalized Recipe Recommendations**: Get recipe suggestions based on your dietary restrictions and preferences.
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

## 3. Logging In

### Access the application:
1. **Open your web browser.**
2. **Visit the application by navigating to** `http://localhost:3000`.
3. **Sign in** using your credentials, or explore the application as a guest.

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
