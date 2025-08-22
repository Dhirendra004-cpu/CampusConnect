# CampusConnect - Smart College Event & Notice Management System

This is a Next.js application designed to manage college notices and events for both students and administrators. It is built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, and Firebase.

## Prerequisites

Before you begin, ensure you have the following installed on your system. The steps are the same for both Windows and macOS unless specified otherwise.

*   **Node.js**: It is recommended to use version `18.x` or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm**: Node.js comes with npm (Node Package Manager) pre-installed.

## 1. Firebase Project Setup

This project requires a Firebase project to handle authentication, database storage, and file storage.

1.  **Create a Firebase Project**: If you don't have one already, go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Create a Web App**: Inside your project, create a new Web App.
3.  **Get Firebase Config**: After creating the app, Firebase will provide you with a `firebaseConfig` object. Copy these keys. They will look something like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "123...",
      appId: "1:123...:web:abc..."
    };
    ```
4.  **Enable Firestore & Storage**: In the Firebase console, go to the **Build** section and enable **Firestore Database** and **Storage**. When setting up Firestore, start in **test mode** for easy local development (you can secure it later with security rules).
5.  **Enable Authentication**: In the **Authentication** section, enable the **Email/Password** sign-in method.

## 2. Environment Variables

The application uses environment variables to securely store your Firebase project keys.

1.  **Create `.env.local` file**: In the root directory of the project, create a new file named `.env.local`.
2.  **Add Firebase Keys**: Open the `.env.local` file and add the keys from your `firebaseConfig` object, prefixed with `NEXT_PUBLIC_FIREBASE_`.

    Your `.env.local` file should look like this:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_if_using_app_check
    ```
    > **Note**: If you are not using Firebase App Check, you can omit the `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` variable.

## 3. Local Installation & Setup

Follow these steps in your terminal to get the application running.

1.  **Clone the Repository (if you haven't already)**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies**
    This command will download all the necessary packages for the project.
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    This command starts the Next.js application in development mode.
    ```bash
    npm run dev
    ```

4.  **Open the App**
    Once the server starts, it will typically be available at `http://localhost:9002`. Open this URL in your web browser to see the application.

The app should now be running locally, connected to your Firebase project. You can start by creating a new admin or student account.