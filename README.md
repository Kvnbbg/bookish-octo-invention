# Bookish Octo Invention

A comprehensive text analysis and security platform built with Java and Spring Boot, featuring advanced emoji detection, money symbol extraction, and parallel processing capabilities.

## 🚀 Features

- **🔍 Advanced Text Analysis**: Emoji detection and tagging with parallel processing support
- **💰 Money Symbol Extraction**: Automatic calculation of monetary values from text
- **🛡️ Security Features**: Built-in malware detection and JWT authentication
- **🗄️ Database Integration**: Oracle and H2 database support with HikariCP connection pooling
- **✅ Comprehensive Testing**: 39 unit tests with 100% pass rate
- **🐳 Docker Support**: Multi-stage containerized deployment ready
- **🌐 Web Interface**: Modern Bootstrap-based UI with responsive design
- **📊 Health Monitoring**: Actuator endpoints for application monitoring

## 🛠️ Technology Stack

### Backend
- **Java 17** - Modern LTS Java version
- **Spring Boot 3.2** - Enterprise-grade framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **Thymeleaf** - Server-side template engine
- **Maven** - Build and dependency management

### Database
- **Oracle Database** - Production database
- **H2 Database** - Development and testing
- **HikariCP** - High-performance connection pool

### Frontend
- **Bootstrap 5.3** - Responsive CSS framework
- **Font Awesome 6.0** - Icon library
- **Vanilla JavaScript** - Client-side interactions

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing
- **Maven** - Build automation

### Testing
- **JUnit 5** - Unit testing framework
- **AssertJ** - Fluent assertion library
- **Spring Boot Test** - Integration testing

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Maven 3.6+**
- **Docker** (optional, for containerized deployment)

### 🏃‍♂️ Running the Application

#### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/Kvnbbg/bookish-octo-invention.git
cd bookish-octo-invention

# Build the application
mvn clean package

# Run the application
java -jar target/bookish-octo-invention-1.0.0.jar
```

#### Option 2: Maven Spring Boot Plugin
```bash
# Run directly with Maven
mvn spring-boot:run
```

#### Option 3: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build Docker image manually
docker build -t bookish-octo-invention .
docker run -p 8080:8080 bookish-octo-invention
```

### 🌐 Access Points
- **Web Application**: http://localhost:8080
- **Text Scanner**: http://localhost:8080/scan
- **Health Check**: http://localhost:8080/health
- **H2 Console**: http://localhost:8080/h2-console (dev mode)
- **Actuator Health**: http://localhost:8080/actuator/health

## 📡 API Endpoints

### 🔍 Text Analysis Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/scan` | Text scanner web interface |
| `POST` | `/scan/analyze` | Analyze text (sequential processing) |
| `POST` | `/scan/analyze-parallel` | Analyze text (parallel processing) |
| `GET` | `/scan/demo` | Demo analysis with sample data |

### 🏠 Application Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page |
| `GET` | `/about` | About page with project information |
| `GET` | `/health` | Health check page |
| `GET` | `/actuator/health` | Actuator health endpoint |

### 📝 Example API Usage

**Request:**
```bash
curl -X POST http://localhost:8080/scan/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      "💰100",
      "Text 😊",
      "🔥 Emergency",
      "💰50",
      "Note"
    ]
  }'
```

**Response:**
```json
{
  "tagged": [
    "💰100 🔹Emoji:💰",
    "Text 😊 🔹Emoji:😊",
    "🔥 Emergency 🔹Emoji:🔥",
    "💰50 🔹Emoji:💰",
    "Note"
  ],
  "total": 150
}
```

## ⚙️ Configuration

### 🗄️ Database Configuration

**H2 Configuration (Default - Development)**
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true
```

**Oracle Configuration (Production)**
```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
```

### 🔐 Security Configuration
**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Security Features:**
- JWT token authentication
- Role-based access control
- CSRF protection
- Security headers

### 🐳 Docker Configuration

**Environment Variables:**
```bash
SPRING_PROFILES_ACTIVE=docker
JAVA_OPTS=-Xmx512m -Xms256m
```

**Docker Compose Services:**
- `app`: Main Spring Boot application
- `nginx`: Reverse proxy with SSL termination
- `oracle-db`: Oracle database (optional)

## 🧪 Testing

### Running Tests
```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=ScanResultTest
```

### 📊 Test Coverage
- **39 tests** with **100% pass rate**
- **Comprehensive coverage** including:
  - ✅ Empty input handling
  - ✅ Emoji tagging functionality
  - ✅ Money total calculation
  - ✅ Mixed emoji and money items
  - ✅ Malformed money tags edge cases
  - ✅ Parallel stream execution
  - ✅ Unicode edge cases
  - ✅ Large dataset performance
  - ✅ Immutability verification

## 🔍 Text Analysis Features

### 😀 Emoji Detection
Supports detection and tagging of various emojis:
- 🔥 Fire emoji
- 😊 Smiling face
- 💰 Money bag
- 🎉 Party popper
- ❤️ Heart
- And many more Unicode emojis...

### 💰 Money Calculation
- **Pattern Recognition**: Detects 💰 symbols followed by numbers
- **Decimal Support**: Handles both integer and decimal values
- **Parallel Processing**: Optimized for large datasets
- **Accurate Summation**: Precise monetary calculations

### ⚡ Performance Features
- **Parallel Streams**: Utilizes multi-core processing
- **Memory Efficient**: Optimized for large text datasets
- **Immutable Results**: Thread-safe result objects
- **Caching**: Intelligent caching for repeated operations

## 🏗️ Development

### 📁 Project Structure
```
bookish-octo-invention/
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── BookishOctoInventionApplication.java
│   │   │   ├── controller/
│   │   │   │   ├── HomeController.java
│   │   │   │   └── ScanController.java
│   │   │   ├── san/
│   │   │   │   ├── SAN.java
│   │   │   │   ├── ScanResult.java
│   │   │   │   └── ScanResultGatherer.java
│   │   │   └── security/
│   │   └── resources/
│   │       ├── templates/
│   │       │   ├── index.html
│   │       │   ├── scan.html
│   │       │   ├── about.html
│   │       │   └── health.html
│   │       └── application.properties
│   └── test/
│       └── java/com/example/
│           └── san/
│               └── ScanResultTest.java
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── pom.xml
└── README.md
```

### 🔨 Build Commands
```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Package application
mvn package

# Run Spring Boot application
mvn spring-boot:run

# Build Docker image
docker build -t bookish-octo-invention .

# Run with Docker Compose
docker-compose up -d
```

### 🔧 Development Tools
- **IDE Support**: IntelliJ IDEA, Eclipse, VS Code
- **Hot Reload**: Spring Boot DevTools
- **Live Reload**: Thymeleaf template caching disabled in dev
- **Debug Support**: Remote debugging enabled

## 🐳 Docker & Deployment

### 🏗️ Multi-stage Dockerfile
1. **Build Stage**: Maven with OpenJDK 17 for compilation
2. **Runtime Stage**: Lightweight OpenJDK 17 for execution

### 🔍 Health Checks
```bash
# Docker health check
curl -f http://localhost:8080/actuator/health

# Application health
curl http://localhost:8080/health
```

### 🌐 Production Deployment
```bash
# Production build
mvn clean package -Pprod

# Docker production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Add** tests for new functionality
5. **Ensure** all tests pass (`mvn test`)
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### 📋 Contribution Guidelines
- Follow Java coding standards
- Write comprehensive tests
- Update documentation
- Ensure backward compatibility
- Add meaningful commit messages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 🐛 **Issues**: [Create an issue on GitHub](https://github.com/Kvnbbg/bookish-octo-invention/issues)
- 📖 **Documentation**: Check this README and code comments
- 🧪 **Examples**: Review test cases for usage examples
- 💬 **Discussions**: Use GitHub Discussions for questions

## 📈 Roadmap

### 🔮 Future Features
- [ ] **REST API Documentation**: OpenAPI/Swagger integration
- [ ] **Metrics Dashboard**: Grafana integration
- [ ] **Caching Layer**: Redis integration
- [ ] **Message Queue**: RabbitMQ/Kafka support
- [ ] **Microservices**: Service decomposition
- [ ] **Machine Learning**: Advanced text analysis
- [ ] **Multi-language**: Internationalization support

## 📝 Changelog

### 🎉 Version 1.0.0 (Current)
- ✨ **Initial Release**: Complete Spring Boot web application
- 🔍 **Text Analysis**: Advanced emoji detection and money extraction
- ⚡ **Parallel Processing**: Multi-threaded text processing
- 🐳 **Docker Support**: Multi-stage containerization
- 🧪 **Test Suite**: Comprehensive unit test coverage
- 🌐 **Web Interface**: Modern Bootstrap UI
- 🔐 **Security**: Authentication and authorization
- 🗄️ **Database**: Oracle and H2 integration
- 📊 **Monitoring**: Health checks and actuator endpoints
- 📚 **Documentation**: Complete setup and usage guide

---

**Made with ❤️ by the Bookish Octo Invention Team**