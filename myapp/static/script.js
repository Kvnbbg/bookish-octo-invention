// Constants
const LOGIN_ANIMATION_TIMEOUT = 2000;
const OPENAI_API_URL = 'https://api.openai.com/v1/translate';

// Function to fetch OpenAI API key
async function fetchOpenAIKey() {
    try {
        const response = await fetch('/api/get_openai_key');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching OpenAI API key:', error);
        throw error;
    }
}

// Function to initialize i18next
function initializeI18next(openaiApiKey) {
    i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            backend: {
                loadPath: OPENAI_API_URL,
                requestOptions: {
                    headers: {
                        'Authorization': `Bearer ${openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            },
            fallbackLng: '{{ current_language }}',
        }, function (err, t) {
            updateTranslations();
        });
}

// Function to update translations
function updateTranslations() {
    // Use i18next.t('key') to translate strings dynamically in your JavaScript
    // Example: console.log(i18next.t('hello'));
}

// <!-- Password Visibility Toggle Script -->
    function togglePasswordVisibility() {
        const password = document.getElementById("password");
        const icon = document.querySelector('.fa-eye');
        if (password.type === "password") {
            password.type = "text";
            icon.classList.add('fa-eye-slash');
            icon.classList.remove('fa-eye');
        } else {
            password.type = "password";
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

// Function to show login animation
function showLoginAnimation(username) {
    const loginMessage = document.getElementById("login-message");

    if (!loginMessage) {
        console.error("Login message element not found.");
        return;
    }

    loginMessage.textContent = `${username}, you're logging in...`;
    loginMessage.style.display = "block";

    setTimeout(() => {
        loginMessage.style.display = "none";
    }, LOGIN_ANIMATION_TIMEOUT);
}

// Function to handle login
async function handleLogin() {
    try {
        disableForm();

        const username = document.getElementById("username").value;
        showLoginAnimation(username);

        const data = await fetchOpenAIKey();
        initializeI18next(data.openai_api_key);

        setTimeout(function () {
            redirectToProfile();
        }, LOGIN_ANIMATION_TIMEOUT);

        // Add a message to the dashboard
        addMessageToDashboard(`User ${username} logged in.`);

        return false;
    } catch (error) {
        console.error("An error occurred in handleLogin:", error);
        return false;
    }
}

// Function to add a message to the dashboard
function addMessageToDashboard(message) {
    const dashboard = document.getElementById("dashboard");

    if (!dashboard) {
        console.error("Dashboard element not found.");
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.textContent = message;

    dashboard.appendChild(messageElement);
}

// Event listener for toggling card
document.querySelectorAll(".card").forEach((card) => {
    const toggleButton = card.querySelector(".toggleButton");

    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            card.classList.toggle("active");
        });
    }
});

// Fetch OpenAI API key from backend on page load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await fetchOpenAIKey();
        initializeI18next(data.openai_api_key);
    } catch (error) {
        console.error("Error initializing OpenAI and i18next:", error);
    }
});

    function submitPatientNeeds() {
        const description = document.getElementById("patient-needs-description").value;
        const username = "{{ current_user.username }}";
        const email = "{{ current_user.email }}";

        // Assuming you have a function to send data to the server or update UI
        // You can use AJAX, fetch, or other methods here
        // For simplicity, let's log the data to the console
        console.log("Patient Needs Submitted:", { description, username, email });
    }