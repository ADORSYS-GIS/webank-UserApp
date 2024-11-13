# GitHub Workflow Documentation for UserApp

This document describes the `analyses` workflow used in the UserApp project. The workflow is triggered by changes to the `main` branch, ensuring code quality, consistency, and successful builds.

## Workflow Trigger

The workflow is set to run on:
- **Push events**: Direct commits to the `main` branch.
- **Pull requests**: PRs targeting the `main` branch.

## Workflow Jobs and Steps

### 1. **Install Dependencies and Cache node_modules**

- **Job Name**: `install`
- **Purpose**: Sets up the development environment by installing project dependencies and caching them for future jobs.

**Steps**:
  - **Checkout Code**: Uses `actions/checkout@v2` to pull the latest code from the repository.
  - **Install Dependencies**: Runs `npm ci` to install dependencies with a clean slate.
  - **Cache node_modules**: Caches `node_modules` for faster builds in subsequent jobs. The cache key uses `${{ github.sha }}`, ensuring cache validity for each unique commit.

---

### 2. **Build Application**

- **Job Name**: `build`
- **Depends on**: `install`
- **Purpose**: Builds the project to ensure code compiles correctly and prepares it for deployment or further testing.

**Steps**:
  - **Checkout Code**: Pulls the latest code.
  - **Use Cached node_modules**: Uses the cached `node_modules` for a faster setup.
  - **Run Build Command**: Executes `npm run build` to compile the application.

---

### 3. **Lint Checks with ESLint**

- **Job Name**: `lint`
- **Depends on**: `install`
- **Purpose**: Checks code quality using ESLint to detect syntax or stylistic issues.

**Steps**:
  - **Checkout Code**: Pulls the latest code.
  - **Use Cached node_modules**: Uses the cached `node_modules` for faster installation.
  - **Run ESLint**: Runs `npm run lint:check` to verify code quality and catch common coding issues.

---

### 4. **Code Formatting with Prettier**

- **Job Name**: `prettier`
- **Depends on**: `install`
- **Purpose**: Ensures consistent code formatting using Prettier.

**Steps**:
  - **Checkout Code**: Pulls the latest code.
  - **Use Cached node_modules**: Uses the cached `node_modules`.
  - **Run Prettier**: Executes `npm run prettier:check` to validate code formatting.

---

### 5. **TypeScript Type Checks**

- **Job Name**: `typescript`
- **Depends on**: `install`
- **Purpose**: Ensures there are no type errors by running TypeScript checks.

**Steps**:
  - **Checkout Code**: Pulls the latest code.
  - **Use Cached node_modules**: Utilizes the cached dependencies.
  - **Run TypeScript Check**: Runs `npm run ts:check` to verify there are no TypeScript type errors.

---

### 6. **Unit Testing**

- **Job Name**: `unit_tests`
- **Depends on**: `install`
- **Purpose**: Runs unit tests to validate the correctness of code logic.

**Steps**:
  - **Checkout Code**: Pulls the latest code.
  - **Use Cached node_modules**: Utilizes cached dependencies.
  - **Run Unit Tests**: Executes `npm run test:unit` to run unit tests on the project.

---

## Troubleshooting Common Issues

- **Dependency Installation Failures**: If `npm ci` fails during the install step, verify the integrity of `package-lock.json` or try clearing the cache.
- **Cache Issues**: If the cached `node_modules` is outdated or causing build failures, clear the cache by changing the cache key.
- **Build Failures**: Ensure code changes do not introduce syntax errors or unsupported constructs. Check for environment-specific build configurations.
- **Lint/Prettier Errors**: Ensure that the code follows the project's style guide and run `npm run prettier:check -- --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"` locally to auto-correct issues.
- **TypeScript Errors**: Resolve any type errors reported in the `typescript` step by fixing the type definitions in the code.
- **Test Failures**: Debug failing tests locally using `npm run test:unit`.

---

## Conclusion

This GitHub workflow automates essential CI/CD processes, including installation, building, linting, formatting, type-checking, and unit testing. By maintaining code quality and verifying build integrity, this workflow ensures that only production-ready code is merged into `main`.

