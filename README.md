# 🚀 Cloud Backend Builder - A Multi-Agent AI System

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-2.5_Pro-blueviolet?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

The Cloud Backend Builder is an advanced web application that leverages a hierarchical multi-agent system, powered by the Google Gemini API, to automatically design, generate, and plan the deployment of a complete, production-ready backend for your frontend application.

This tool transforms a complex, multi-week engineering task into a guided, automated process that completes in minutes.

---

## 📖 The Story Behind the Builder

This project was born out of a simple, yet profound, frustration. As developers, we've all felt the incredible power of modern AI tools like ChatGPT, Claude, and Gemini. They can write code, answer questions, and brainstorm ideas at lightning speed. But this power often comes with fragmentation.

The typical workflow looked something like this:
1.  Ask **AI Tool #1** to brainstorm a database schema.
2.  Copy that schema over to **AI Tool #2** and ask it to write the backend routes.
3.  Realize there's a bug, go back to **AI Tool #1** to fix the schema.
4.  Feed the fix back into **AI Tool #2**.
5.  Ask **AI Tool #3** to generate the infrastructure-as-code (Terraform).
6.  Spend hours debugging the inconsistencies and "hallucinations" between them.

Each tool was a brilliant specialist, but none of them could see the whole picture. There was no single "master builder"—only a collection of talented workers who didn't talk to each other.

**Cloud Backend Builder is our answer to that chaos.** We envisioned a single, cohesive system where specialized AI agents work together as a team, managed by a master orchestrator. A system that understands the full lifecycle, from analyzing a simple frontend component to generating the exact CLI command to monitor the deployed service. A system that doesn't just give you code, but validates it, plans its deployment, and understands how all the pieces fit together.

This tool is our first major step toward that vision: a truly integrated, intelligent development partner.

---

## ✨ Key Features

- **🤖 Multi-Agent Orchestration**: A "Master Orchestrator" manages a team of specialized AI agents (Analysis, Design, Generation, Deployment) to ensure a reliable, step-by-step workflow.
- **🔍 Intelligent Code Analysis**: Upload your frontend project (ZIP or source code) and the Analysis Agent will infer API endpoints, data models, and required features.
- **🎨 Automated Architecture Design**: The Design Agent plans an optimal, cost-effective, and secure serverless architecture on GCP or AWS, tailored to your budget.
- **⚙️ Full-Stack Code Generation**: The Generation Agent writes all the necessary code, including:
  - **Terraform** for Infrastructure as Code (IaC)
  - **TypeScript/Express.js** for the backend server and API routes
  - **CI/CD Pipelines** (`cloudbuild.yaml` or GitHub Actions)
  - **Testing & Integration** code snippets
- **🔄 Self-Correction & Retry Logic**: Agents automatically retry failed tasks and employ a "Circuit Breaker" to detect and prevent infinite loops.
- **📊 Real-Time Progress Dashboard**: A comprehensive UI to monitor the status, confidence scores, and outputs of each agent in real-time.
- **💾 Persistent State**: Your project progress is automatically saved to your browser's local storage, allowing you to resume at any time.
- **💬 Contextual AI Assistant**: Get help at any step from an AI assistant that understands your project's context.

---

## 🏗️ How It Works: The Multi-Agent System

The application operates like a smart factory, with a clear chain of command to ensure quality and prevent errors.

```
                    🧠 MASTER ORCHESTRATOR
                    (The Factory Manager)
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    
    📊 ANALYSIS         🎨 DESIGN         ⚙️ GENERATION      🚀 DEPLOYMENT
    MACRO AGENT        MACRO AGENT       MACRO AGENT        MACRO AGENT
```

1.  **Master Orchestrator**: The "CEO" of the operation. It takes your input, delegates tasks to the Macro Agents in the correct sequence, monitors their progress, and handles errors.
2.  **Analysis Agent**: The "Scout". It examines your frontend code to understand exactly what the backend needs to do.
3.  **Design Agent**: The "Architect". It takes the analysis and designs a robust, scalable, and cost-effective blueprint for the backend infrastructure.
4.  **Generation Agent**: The "Builder". It writes all the code based on the architect's blueprint.
5.  **Deployment Agent**: The "Quality Assurance" team. It runs a *simulated* deployment, including end-to-end tests, to verify that everything works before giving the final "GO" signal.

---

## 🚀 Getting Started

Follow these steps to generate your backend in minutes.

### Prerequisites

- A **Google Gemini API Key**. You can get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- A **Google Cloud (GCP) or AWS account** with billing enabled. The generated code uses services that fit within free tiers where possible, but a billing account is often required for activation.

### Usage Steps

1.  **Launch the App**: Open the deployed application URL.
2.  **Enter API Key**: The first time you use the app, you'll be prompted to enter your Gemini API key. This is stored *only* in your browser's local storage for security.
3.  **Configure Your Project**: In the "Project Configuration" step, choose your cloud provider (GCP/AWS), region, and set a monthly budget.
4.  **Provide Frontend Context**: In the "Frontend Analysis" step, either **upload a `.zip` file** of your frontend project or **paste relevant code** (`package.json`, route definitions, etc.) into the text area.
5.  **Run the Orchestrator**: Click the **"▶️ Run Agents"** button. The multi-agent system will now take over. You can monitor its progress in the "AI Orchestration Status" panel.
6.  **Review the Output**: As the agents complete their tasks, the UI will populate with the generated architecture plan and code.
7.  **Deploy Manually**: The final step provides all the code and commands necessary for deployment. The in-app deployment is a **simulation** for safety. You will need to save the generated files and run the `terraform apply` and other commands in your own terminal.

---

## ⚠️ Disclaimer & Responsible Use

**Please read the following carefully before using the application.**

This application is a powerful proof-of-concept designed to accelerate backend development, not replace critical engineering oversight.

-   **Intended Purpose**: This tool is for developers, founders, and students to quickly prototype and generate a foundational backend. It is an educational tool and a development accelerator.
-   **Review All Code**: **You must carefully review all generated code** (Terraform, TypeScript, etc.) before deploying it to a production environment. The AI generates code based on best practices, but it is not infallible. You are responsible for the code you deploy.
-   **No Guarantees**: This tool is provided as-is, without warranties of any kind. We are not responsible for any cloud costs, security vulnerabilities, or errors that may arise from using the generated code.
-   **Do Not Exploit**: Please use this application for its intended purpose. Do not attempt to reverse-engineer, overload, or exploit the system.

---

## 🤔 Frequently Asked Questions (FAQ)

#### Q: In simple terms, what's the input and output?

**A:** Think of it as an AI "master builder."
*   **You Provide (Input):**
    1.  Your frontend app's design (as a ZIP file or pasted code).
    2.  Your choice of cloud (Google or Amazon).
    3.  Your monthly budget (e.g., $15).
    4.  Your personal Gemini API key.
*   **You Get Back (Output):** A downloadable `.zip` file containing a complete, professional-grade backend, ready for you to deploy. This includes the infrastructure blueprints (Terraform), the "engine" code (TypeScript), and an automated deployment pipeline (CI/CD).

#### Q: I'm not a coder. What problem does this solve for me?

**A:** This app solves three of the biggest problems for founders and startups:
1.  **Time & Money:** It builds a backend in under an hour, a task that normally takes months and tens of thousands of dollars in engineering salaries.
2.  **Complexity & Risk:** It uses AI to implement security and scalability best practices, helping you avoid common, business-killing mistakes.
3.  **Focus:** It completely automates the technical "plumbing," freeing you and your team to focus on what matters: your product and your customers.

#### Q: Does the app deploy my backend for me automatically?

**A: No, and this is a critical feature for your security.** To deploy automatically, the app would need your master password to your entire Google or Amazon cloud account. **You should never give that level of access to any website.**

Instead, the app does 99% of the work and then gives you the final, simple copy-paste commands to run in your own secure terminal. You have the final say, full ownership, and your credentials remain safe.

#### Q: What happens if I get an error during deployment?

**A:** The system is designed to be your expert helper.
1.  **AI Self-Correction:** The AI agents test their own generated code. If they find a bug, they try to fix it automatically before you ever see it.
2.  **Contextual AI Assistant:** If you get a confusing error from Google or Amazon when you run a command, you can paste it into the app's "AI Assistant." Because the AI knows what it built for you, it can provide a clear, human-readable explanation and tell you how to fix it.

#### Q: Who pays for the AI usage? Will I be charged if others use my deployed app?

**A: You are only billed for your own usage.** The application is designed so that every user must enter their **own** Gemini API key.
*   The person using the tool is the one whose API key makes the calls to Google.
*   Therefore, any AI-related costs are billed to that user's Google Cloud account.
*   If you deploy this app to a public URL, you are only responsible for the (often free) cost of hosting the website, not for the AI usage of your visitors.

#### Q: Does this application have its own backend? Where is my project data stored?

**A: The application itself does not have a backend.** It is a "client-side" application, meaning all the logic runs directly and securely in your web browser.

**Your project data, any generated code, and your API key are stored exclusively in your browser's `localStorage`.** They are never sent to or stored on any central server. This ensures your work remains private and secure on your own machine.

---

## 🤝 Contributing & The Future

This project is ambitious, and we're just getting started. We believe that collaborative, agent-based AI systems are the future of software development, and we invite you to be a part of building it.

Whether you're an expert in cloud infrastructure, a frontend wizard, or passionate about AI-UX, there's a place for you to contribute. Check out our **[CONTRIBUTING.md](CONTRIBUTING.md)** file to see how you can help, from implementing real deployment agents to improving our AI's decision-making logic.

Let's push the boundaries of what's possible and build the next generation of developer tools together!

---

## 💖 Acknowledgements

This project stands on the shoulders of giants. Our multi-agent system would not be possible without the incredible advancements in Large Language Models.
- We extend our sincere thanks to the teams behind **Google's Gemini**, **Anthropic's Claude**, and **OpenAI's GPT** for creating the foundational technology that powers our agents.
- This project was built and deployed using **Google AI Studio** and **Google Cloud Run**.
- Conceptual support and sponsorship provided by [**advertflair.com**](https://advertflair.com).

---

## 💻 Technology Stack

-   **Frontend**: React 19, TypeScript, Tailwind CSS
-   **AI Engine**: Google Gemini API (`gemini-2.5-pro`)
-   **Utilities**: JSZip for file processing

This project was bootstrapped with a custom setup suitable for AI Studio.
