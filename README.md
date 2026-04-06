# 🚀 Create Scalable React App

![NPM Version](https://img.shields.io/npm/v/create-scalable-react-app.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)

**Create Scalable React App** is a powerful, dynamic CLI tool designed to scaffold production-ready React applications. Tailored for modern development, it empowers you to bootstrap enterprise-grade React projects with robust architectures, built-in best practices, and your preferred tech stack in seconds.

---

## ✨ Features

- **TypeScript & JavaScript Support**: Choose between strict type-safety or standard JS.
- **State Management**: Built-in boilerplate for **Redux Toolkit** or **Zustand** (or simply opt out).
- **Styling**: Out-of-the-box configuration for **Tailwind CSS** or standard CSS.
- **Routing**: Ready-to-go **React Router DOM** setup.
- **Code Quality Guardrails**: Pre-configured **ESLint & Prettier** for consistent code styles out of the gate.
- **Testing**: Optional pre-configured **Jest + React Testing Library**.
- **Scalable Architecture**: Choose between a **Feature-based** folder structure (highly recommended for scalable apps) or a standard **Flat** folder structure.

## 📦 Quick Start

The easiest way to get started is to use `npx`. There is no need to install anything globally.

```bash
npx create-scalable-react-app my-scalable-app
```

Navigate into your new project, install dependencies, and start the development server:

```bash
cd my-scalable-app
npm install
npm run dev
```

## 🛠 Interactive Configuration

If you run the command without a project name, the CLI will interactively guide you through the setup process:

```bash
npx create-scalable-react-app
```

### Available Prompts

During setup, you can customize your project with the following choices:

1. **Project Name**: The name of your new application directory.
2. **Language**: `TypeScript` / `JavaScript`
3. **State Management**: `Redux Toolkit` / `Zustand` / `None`
4. **Tailwind CSS**: `Yes` / `No`
5. **React Router DOM**: `Yes` / `No`
6. **ESLint + Prettier**: `Yes` / `No`
7. **Testing (Jest + React Testing Library)**: `Yes` / `No`
8. **Folder Structure**: `Feature-based` (recommended) / `Flat`

<!-- ## 📁 Supported Architectures

### Feature-based Structure
We highly recommend the Feature-based structure for any mid-to-large scale application. It organizes code by domain/feature rather than technical role (e.g., all auth-related components, hooks, and logic live together), bringing unparalleled modularity to your React application.

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── dashboard/
├── store/          # Global state (Redux/Zustand)
├── components/     # Shared UI components
├── hooks/          # Shared hooks
├── utils/          # Helper functions
├── App.tsx
└── main.tsx
```

### Flat Structure
For smaller projects or quick prototypes, the standard flat structure organizes files strictly by their technical type.

```text
src/
├── components/
├── hooks/
├── pages/
├── store/
├── utils/
├── App.tsx
└── main.tsx
``` -->

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/nirmitkotadiya/create-scalable-react-app/issues).

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
Designed and maintained with ❤️ by Team [Nirmit Kotadiya](https://github.com/nirmitkotadiya).
