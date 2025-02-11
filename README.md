# Simple Node.js App

A web application to search and retrieve information about people using the Wikipedia API. This project demonstrates a modern Node.js application with Express.js, EJS for templating, and a robust CI/CD pipeline using Docker and GitHub Actions.

---

## Features

- **Search Functionality**: Query the Wikipedia API to retrieve information about people.
- **EJS Templating**: Render search results using Embedded JavaScript (EJS) templates.
- **Dockerized**: Easily deployable using Docker containers.
- **CI/CD Pipeline**: Automated linting, testing, and deployment using GitHub Actions.
- **Testing**: Comprehensive test coverage with Jest and Supertest.
- **Linting and Formatting**: Consistent code style enforced by ESLint and Prettier.
- **Git Hooks**: Automated pre-commit and pre-push checks using Husky.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates)
- **API**: [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions, Docker
- **Linting/Formatting**: ESLint, Prettier
- **Git Hooks**: Husky
- **Version Control**: Git, GitHub

---

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tihiswasavailable/ci-cd-project.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd ci-cd-project
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up Husky Git hooks**:

   ```bash
   npm run prepare
   ```

   This sets up Husky to run linting, formatting, and testing checks before each commit and push.

5. **Start the development server**:
   ```bash
   npm start
   ```
6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## Running Tests

The project includes a comprehensive test suite to ensure functionality and reliability.

- **Run all tests**:
  ```bash
  npm test
  ```
- **Run tests in watch mode**:
  ```bash
  npm run test:watch
  ```
- **Generate a coverage report**:
  The test suite includes coverage reporting. After running tests, check the coverage directory for detailed reports.

---

## Jest Configuration

The project uses Jest for testing, configured in `jest.config.mjs` with the following features:

- **Test Environment**: Node.js (for backend testing)
- **Test Matching**: All test files must be located in the `__tests__` directory and follow the naming pattern `*.test.js`.
- **Coverage Reporting**:
  - Collects coverage for all `.js` files.
  - Excludes configuration files, `node_modules`, and the coverage directory.
  - Sets a coverage threshold of 70% for branches, functions, lines, and statements.

Example `jest.config.mjs`:

```javascript
export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\.{1,2}/.*)\.js$": "$1",
  },
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov", "clover"],
  verbose: true,
  collectCoverageFrom: [
    "**/*.js",
    "!jest.config.mjs",
    "!coverage/**",
    "!node_modules/**",
    "!**/*.config.js",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## ESLint Configuration

The project uses ESLint for linting and Prettier for code formatting. The configuration is defined in `eslint.config.mjs`.

Example `eslint.config.mjs`:

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        ...globals.es2022,
      },
      sourceType: "module",
    },
    files: ["**/*.js"],
    ignores: ["node_modules/**", "coverage/**", "dist/**"],
  },
  pluginJs.configs.recommended,
];
```

---

## Git Hooks with Husky

Husky is used to automate pre-commit and pre-push checks, ensuring code quality before commits and pushes are made.

### **Pre-Commit:**

- Runs ESLint to enforce code style.
- Runs Prettier to ensure consistent code formatting.
- Runs Jest to ensure all tests pass.

### **Pre-Push:**

- Runs the full test suite to ensure no breaking changes are pushed.

Husky is configured in `package.json`:

```json
"lint-staged": {
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write",
    "node --experimental-vm-modules node_modules/jest/bin/jest.js \"**/__tests__/**/*.test.js\" --coverage"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

To set up Husky:

```bash
npx husky add .husky/pre-commit "npm run lint-staged"
```

To set up Husky, run:

```bash
npm run prepare
```

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline includes:

1. **Linting and Testing**:
   - Runs ESLint to enforce code style.
   - Executes the test suite using Jest.
2. **Build and Push Docker Image**:
   - Builds a Docker image for the application.
   - Pushes the image to Docker Hub with the appropriate tag.
3. **Deploy to EC2**:
   - Connects to the EC2 instance via SSH.
   - Pulls the latest Docker image and runs it.

---

## Deployment

The application is deployed using Docker.

- **Build the Docker image**:
  ```bash
  docker build -t medisimo/cicd-pipeline:latest .
  ```
- **Run the Docker container**:
  ```bash
  docker run -d --name cicd-container -p 3000:3000 medisimo/cicd-pipeline:latest
  ```
- **Access the application**:
  Open your browser and navigate to `http://<ec2-public-ip>:3000`.

---

## Environment Variables

- `PORT`: The port on which the application runs (default: 3000).

---

# Continuous Delivery Checkliste

## Einführung und Grundlagen

- [x] Verständnis von Continuous Delivery und dessen Bedeutung
- [x] Unterschiede zwischen Continuous Integration, Continuous Delivery und Continuous Deployment
- [ ] CI-Anti Pattern identifizieren

## Projekt Setup (20%)

- [x] Initialisierung des Repository (Git) -> (Blank Project + Project Name = nachname)
- [x] Checkliste kopieren und in neues geklontes Repository/project einfügen
- [ ] Checkliste versionieren
- [x] README anfertigen mit Verlinkungen, Hinweisen, etc. zum Inhalt des Repository
- [ ] Zweites Repository für Übungen, Ausprobieren, etc. inkl. README sowie Verlinkungen und Übersicht zu den Übungen
- [x] .gitignore angepasst: Stelle sicher, dass unnötige Dateien nicht im Repository landen

## Automatisierung (10%)

- [x] Automatisierte Builds eingerichtet
- [x] Automatisierte Tests implementiert
- [x] Automatisierte Deployments konfiguriert
- [ ] Automatisierte Code-Qualitätsanalyse mit statischen Code-Analyse-Tools

## Testing (10%)

- [x] (Unit) Tests geschrieben und automatisiert
- [ ] Integrationstests implementiert (optional)
- [ ] End-to-End Tests eingerichtet (optional)

## Deployment-Strategien

- [x] Deployment-Strategien identifizieren
- [x] Rollback-Strategien (optional)

## Containerisierung (10%)

- [x] Docker oder ähnliche Technologien eingesetzt
- [x] Integration in eine Build-Pipeline

## Infrastruktur- und Konfigurationsmanagement (20%)

- [ ] Template Konfigurationsdateien versioniert und zentralisiert
- [x] Konfigurationsdateien ausgenommen
- [x] Verwendung in einer Build-Pipeline
- [ ] Infrastructure as Code (IaC) mit Tools wie Terraform oder Ansible implementiert

## Sicherheit (10%)

- [x] Zugangsdaten sicher hinterlegt
- [ ] Sicherheitsüberprüfungen mit automatisierten Sicherheitstests (z.B. OWASP ZAP)

## Datenbanken

- [ ] Datenbank-Migrationen automatisiert
- [ ] Datenbank-Backups und Recovery-Pläne implementiert

## Abschluss und Dokumentation (20%)

- [x] Projekt-Dokumentation vervollständigt
- [x] Branching-Strategie dokumentiert (z.B. GitFlow)
- [x] Pipeline-Dokumentation mit allen verwendeten Tools, Skripten und Konfigurationen erstellt
- [x] Build Pipeline spezifiziert mit allen Test-, Build- und Deployment-Schritten

---

_Hinweis: Die Prozentangaben in den Überschriften repräsentieren die Gewichtung der jeweiligen Abschnitte im Gesamtprojekt._
