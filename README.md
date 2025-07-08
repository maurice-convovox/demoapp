# Transmit Security sso-page Journey Implementation

## Overview

This project was generated based on the journey you created in the [Transmit Security Admin Portal](https://portal.transmitsecurity.io/).  
The project is a simple web application, written in [TypeScript](https://www.typescriptlang.org/) using the [Vite](https://vitejs.dev/guide/#trying-vite-online) vanilla-ts template, that demonstrates the use of the [Transmit Security IDO SDK](https://developer.transmitsecurity.com/sdk-ref/idosdk/overview/).  
It is here to help you test and debug the journey, and get started with the integration of the [Transmit Security IDO SDK](https://developer.transmitsecurity.com/sdk-ref/idosdk/overview/) into your application.

Note that the code in this project is meant to demonstrate how the journey can be driven using the SDK
with an implementation that is straightforward and unopinionated, so it is not production-ready and is not intended to be used as-is in production.  
In order to keep the code simplified and straightforward there are several considerations that we did not cover and that should be
taken into account when implementing a production ready application, such as:

- Application Security
- Runtime lifecycle management
- Telemetry
- Session management
- Persistence
- etc.

---

## Project structure

The project contains the following files:

- `README.md` - This file
- `public` - Static assets such as images and styles
- `index.html` - The application's main HTML file
- `vite.config.ts` - Vite configuration file (see [Vite docs](https://vitejs.dev/config/) for more information)
- `src` - Project source folder
  - `main.ts` - The application's main entry point
  - `config.ts` - The configuration file - map .env variables to config object
  - `common.ts` - Common functions
  - `sdkState.ts` - The SDK state management
  - `jouneyExecutor.ts` - The journey executor implementation responsible for looping through the journey steps
  - `stepHandlers.ts` - A step handlers map
  - `steps/*.ts` - The step handlers implementations
  - `types/*.ts` - Typescript types
  - `components/*.ts` - UI Components

---

## Prerequisites

- Node.js 20.10.0 or higher
  - We recommend using the [Node Version Manager](https://github.com/nvm-sh/nvm/blob/master/README.md) for version management. With that package, you can run `nvm use` to switch to the recommended version
- An application defined in the [Transmit Security Admin Portal](https://portal.transmitsecurity.io/)
- An IDO server with the journey you created

---

## Setup

### Set up the Transmit tenant

- Create an application on the [Transmit portal](https://portal.identity.security/applications) (see [guide](https://developer.transmitsecurity.com/guides/user/create_new_application) for more information).
- If you intend to create users as part of your workflow, you should allow registering new users - make sure `Public sign-up` is set to `Allow registration`.
- If you intend to use hosted solutions where you'll need to provide a redirect URI, add the URIs to the `Redirect URIs` field.
- Click "Add" to save.
- Note that a `Client ID` is automatically generated for the app and will be used in the following section.

### Configure the application

Edit the `.env` file in the application's root directory and update the following values:

- VITE_CLIENT_ID="The `Client ID` you got from the [Transmit portal](https://portal.identity.security/)"

The remaining environment variables are pre-configured with values specific to your project’s requirements.

---

## Running the application

First, install the dependencies:

```bash
npm install
```

The application is served by a local server and is reloaded automatically when the code changes.  
Additionally, the application is served with source maps for easier debugging.

To run the application, use the following command:

```bash
npm start
```

It is served on port `3000` by default (configurable via the `vite.config.ts` file).  
Browse to `http://localhost:3000` and start using the application.

---

## Troubleshooting

- If you encounter issues during setup or while running the application, ensure that your Node.js version matches the required version.
- Verify that the `.env` file is correctly configured with the appropriate `Client ID`.
- Check the browser console for any error messages and stack traces that could provide more insight into potential issues.

---

We hope you find this sample useful.  
For any inquiries or feedback, feel free to contact us at [info@transmitsecurity.com](mailto:info@transmitsecurity.com).

Happy integration process!
