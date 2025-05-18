# Fly-Wash: Real-Time Industrial Monitoring with AWS IoT

## English

This project is a Next.js application designed for real-time industrial monitoring using AWS IoT Shadow via a REST API. It features JWT-based authentication for secure access and enables bidirectional synchronization and remote management of industrial machines.

This project is open-source and available on GitHub. It's intended for developers with a basic understanding of JavaScript, React.js, Next.js, and AWS IoT.

### Features

*   **Real-Time Monitoring:** Leverages AWS IoT Device Shadow to get real-time status and data from industrial machines.
*   **Remote Management:** Send commands and updates to machines remotely through AWS IoT.
*   **Secure Authentication:** Uses JSON Web Tokens (JWT) for user login and to protect application endpoints.
*   **AWS IoT Integration:** Demonstrates how to connect a Next.js application to AWS IoT services for device communication.

### Prerequisites

Before you begin, ensure you have a basic understanding of the following:

*   **AWS IoT Core:** Familiarity with concepts like Things, Device Shadows, MQTT, and AWS IoT policies.
*   **Next.js & React.js:** Basic knowledge of building web applications with Next.js and React.
*   **JavaScript/TypeScript:** The project is built using TypeScript.
*   **Device-Side Programming (e.g., C for ESP32):** Understanding how to program the physical machine's microcontroller (e.g., an ESP32 using C) to communicate with AWS IoT Shadow, typically via MQTT or HTTPS.

### Project Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd fly-wash
    ```

2.  **Install dependencies:**

    This project uses npm for package management. The necessary dependencies are listed in the `package.json` file. Key dependencies include:

    *   `next`, `react`, `react-dom`: For the Next.js framework.
    *   `@aws-sdk/client-iot`, `@aws-sdk/credential-providers`, `@aws-sdk/protocol-http`, `@aws-sdk/signature-v4`: For interacting with AWS IoT services.
    *   `jose` or `jsonwebtoken`: For JWT handling.
    *   `zod`: For data validation.

    Install them using:

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env.local` file in the root of your project by copying the `.env.example` file:

    ```bash
    cp .env.example .env.local
    ```

    Then, update `.env.local` with your specific AWS credentials and application settings:

    *   `USER_EMAIL`: The email for the admin user (e.g., `admin@example.com`).
    *   `USER_PASSWORD`: The password for the admin user.
    *   `JWT_SECRET`: A strong, unique secret key for signing JWTs (at least 32 characters long).
    *   `AWS_ACCESS_KEY_ID`: Your AWS IAM user's access key ID with permissions for AWS IoT.
    *   `AWS_SECRET_ACCESS_KEY`: Your AWS IAM user's secret access key.
    *   `AWS_REGION`: The AWS region where your IoT resources are configured (e.g., `us-west-2`).
    *   `AWS_IOT_ENDPOINT`: Your AWS IoT Core data endpoint (ATS). You can find this in the AWS IoT console under Settings.

    **Important Security Note:** Never commit your `.env.local` file or actual secrets to your Git repository. The `.gitignore` file should already be configured to ignore `.env.local`.

4.  **AWS IoT Configuration:**

    *   **Create an IoT Thing:** In the AWS IoT console, create a "Thing" to represent each of your industrial machines.
    *   **Device Shadow:** Ensure the Device Shadow service is active for your Things. The application interacts with the named shadows.
    *   **IAM Permissions:** The AWS credentials used in your `.env.local` file must belong to an IAM user or role with appropriate permissions to:
        *   List Things (`iot:ListThings`).
        *   Get Thing Shadow (`iot:GetThingShadow`).
        *   Update Thing Shadow (`iot:UpdateThingShadow` - if you plan to send updates from the app).
        *   Publish to IoT topics (e.g., `iot:Publish` to topics like `cmd/things/{thingName}/vending` or `update/things/{thingName}`).
    *   **IoT Policies:** Attach appropriate IoT policies to your device certificates to allow them to connect and publish/subscribe to relevant MQTT topics for shadow updates and commands.

5.  **Device (e.g., ESP32) Configuration:**

    *   The physical machine's microcontroller (e.g., ESP32) needs to be programmed (e.g., in C) to connect to AWS IoT Core.
    *   It should securely store its device certificate and private key.
    *   It should publish its state to its Device Shadow and subscribe to shadow update topics or specific command topics to receive instructions from the cloud application.

### Authentication

This application uses a simple JWT-based authentication system. 

*   **Admin User:** The `.env.local` file allows you to define a single admin user's email (`USER_EMAIL`) and password (`USER_PASSWORD`).
*   **Login Endpoint:** The application provides a login endpoint (e.g., `/api/auth/login`) where you can send these credentials to receive a JWT.
*   **Protected Routes:** This JWT must then be included in the `Authorization` header (as a Bearer token) for accessing protected API routes and application features.

This setup is suitable for small projects or personal use where a simple, predefined admin account is sufficient.

### Running the Application

*   **Development Mode:**

    ```bash
    npm run dev
    ```

    This will start the Next.js development server, typically on `http://localhost:3000`.

*   **Production Build:**

    ```bash
    npm run build
    npm run start
    ```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Español

Este proyecto es una aplicación Next.js diseñada para el monitoreo industrial en tiempo real utilizando AWS IoT Shadow a través de una API REST. Cuenta con autenticación basada en JWT para un acceso seguro y permite la sincronización bidireccional y la gestión remota de máquinas industriales.

Este proyecto es de código abierto y está disponible en GitHub. Está destinado a desarrolladores con un conocimiento básico de JavaScript, React.js, Next.js y AWS IoT.

### Características

*   **Monitoreo en Tiempo Real:** Utiliza AWS IoT Device Shadow para obtener el estado y los datos en tiempo real de las máquinas industriales.
*   **Gestión Remota:** Envía comandos y actualizaciones a las máquinas de forma remota a través de AWS IoT.
*   **Autenticación Segura:** Utiliza JSON Web Tokens (JWT) para el inicio de sesión de usuarios y para proteger los puntos finales de la aplicación.
*   **Integración con AWS IoT:** Demuestra cómo conectar una aplicación Next.js a los servicios de AWS IoT para la comunicación con dispositivos.

### Prerrequisitos

Antes de comenzar, asegúrate de tener un conocimiento básico de lo siguiente:

*   **AWS IoT Core:** Familiaridad con conceptos como "Things" (Objetos), "Device Shadows" (Sombras de Dispositivo), MQTT y políticas de AWS IoT.
*   **Next.js & React.js:** Conocimiento básico de la creación de aplicaciones web con Next.js y React.
*   **JavaScript/TypeScript:** El proyecto está construido con TypeScript.
*   **Programación del Lado del Dispositivo (ej., C para ESP32):** Comprensión de cómo programar el microcontrolador de la máquina física (por ejemplo, un ESP32 usando C) para comunicarse con AWS IoT Shadow, típicamente mediante MQTT o HTTPS.

### Configuración del Proyecto

1.  **Clona el repositorio:**

    ```bash
    git clone <your-repository-url>
    cd fly-wash
    ```

2.  **Instala las dependencias:**

    Este proyecto utiliza npm para la gestión de paquetes. Las dependencias necesarias se enumeran en el archivo `package.json`. Las dependencias clave incluyen:

    *   `next`, `react`, `react-dom`: Para el framework Next.js.
    *   `@aws-sdk/client-iot`, `@aws-sdk/credential-providers`, `@aws-sdk/protocol-http`, `@aws-sdk/signature-v4`: Para interactuar con los servicios de AWS IoT.
    *   `jose` o `jsonwebtoken`: Para el manejo de JWT.
    *   `zod`: Para la validación de datos.

    Instálalas usando:

    ```bash
    npm install
    ```

3.  **Configura las Variables de Entorno:**

    Crea un archivo `.env.local` en la raíz de tu proyecto copiando el archivo `.env.example`:

    ```bash
    cp .env.example .env.local
    ```

    Luego, actualiza `.env.local` con tus credenciales específicas de AWS y la configuración de la aplicación:

    *   `USER_EMAIL`: El correo electrónico para el usuario administrador (ej., `admin@example.com`).
    *   `USER_PASSWORD`: La contraseña para el usuario administrador.
    *   `JWT_SECRET`: Una clave secreta fuerte y única para firmar los JWT (de al menos 32 caracteres de longitud).
    *   `AWS_ACCESS_KEY_ID`: El ID de clave de acceso de tu usuario IAM de AWS con permisos para AWS IoT.
    *   `AWS_SECRET_ACCESS_KEY`: La clave de acceso secreta de tu usuario IAM de AWS.
    *   `AWS_REGION`: La región de AWS donde están configurados tus recursos de IoT (ej., `us-west-2`).
    *   `AWS_IOT_ENDPOINT`: Tu punto de conexión de datos de AWS IoT Core (ATS). Puedes encontrarlo en la consola de AWS IoT en Configuración.

    **Nota de Seguridad Importante:** Nunca subas tu archivo `.env.local` o secretos reales a tu repositorio Git. El archivo `.gitignore` ya debería estar configurado para ignorar `.env.local`.

4.  **Configuración de AWS IoT:**

    *   **Crear un "Thing" (Objeto) en IoT:** En la consola de AWS IoT, crea un "Thing" para representar cada una de tus máquinas industriales.
    *   **Device Shadow (Sombra de Dispositivo):** Asegúrate de que el servicio Device Shadow esté activo para tus "Things". La aplicación interactúa con las sombras con nombre.
    *   **Permisos IAM:** Las credenciales de AWS utilizadas en tu archivo `.env.local` deben pertenecer a un usuario o rol IAM con los permisos adecuados para:
        *   Listar "Things" (`iot:ListThings`).
        *   Obtener la sombra del "Thing" (`iot:GetThingShadow`).
        *   Actualizar la sombra del "Thing" (`iot:UpdateThingShadow` - si planeas enviar actualizaciones desde la aplicación).
        *   Publicar en temas de IoT (ej., `iot:Publish` a temas como `cmd/things/{thingName}/vending` o `update/things/{thingName}`).
    *   **Políticas de IoT:** Adjunta políticas de IoT apropiadas a los certificados de tus dispositivos para permitirles conectarse y publicar/suscribirse a los temas MQTT relevantes para actualizaciones de sombra y comandos.

5.  **Configuración del Dispositivo (ej., ESP32):**

    *   El microcontrolador de la máquina física (ej., ESP32) necesita ser programado (ej., en C) para conectarse a AWS IoT Core.
    *   Debe almacenar de forma segura su certificado de dispositivo y clave privada.
    *   Debe publicar su estado en su Device Shadow y suscribirse a los temas de actualización de sombra o temas de comando específicos para recibir instrucciones desde la aplicación en la nube.

### Autenticación

Esta aplicación utiliza un sistema de autenticación simple basado en JWT.

*   **Usuario Administrador:** El archivo `.env.local` te permite definir el correo electrónico (`USER_EMAIL`) y la contraseña (`USER_PASSWORD`) de un único usuario administrador.
*   **Punto de Conexión de Inicio de Sesión:** La aplicación proporciona un punto de conexión de inicio de sesión (ej., `/api/auth/login`) donde puedes enviar estas credenciales para recibir un JWT.
*   **Rutas Protegidas:** Este JWT debe incluirse luego en el encabezado `Authorization` (como un token Bearer) para acceder a las rutas API protegidas y a las características de la aplicación.

Esta configuración es adecuada para proyectos pequeños o uso personal donde una cuenta de administrador simple y predefinida es suficiente.

### Ejecutando la Aplicación

*   **Modo de Desarrollo:**

    ```bash
    npm run dev
    ```

    Esto iniciará el servidor de desarrollo de Next.js, típicamente en `http://localhost:3000`.

*   **Compilación para Producción:**

    ```bash
    npm run build
    npm run start
    ```

### Aprende Más

Para aprender más sobre Next.js, echa un vistazo a los siguientes recursos:

- [Documentación de Next.js](https://nextjs.org/docs) - aprende sobre las características y la API de Next.js.
- [Aprende Next.js](https://nextjs.org/learn) - un tutorial interactivo de Next.js.

Puedes consultar [el repositorio de GitHub de Next.js](https://github.com/vercel/next.js) - ¡tus comentarios y contribuciones son bienvenidos!

### Desplegar en Vercel

La forma más fácil de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Consulta nuestra [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.
