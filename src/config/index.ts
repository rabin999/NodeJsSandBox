import dotenv from "dotenv"
import path from "path"

/**
 * DOTENV configutation
 */
dotenv.config({ path: path.resolve(".env") })

const config = {

    // APPLICATION HOST
    app_host : process.env.HOST || "<your domain>",

    // APPLICATION NAME
    app_name: process.env.APP_NAME || "App Name",

    // PORT
    port: process.env.PORT || 3000,

    // DATE AND TIME
    timezone: 'Asia/Kathmandu',
    tokenExipiresAt: '12',

    /**
     * ENVIRONMENT
     * -----------
     *
     * development -    help to debug and maintain
     * production -     for deployment
     */
    env : process.env.ENV || "development",

    // DATABASE CONFIG
    database : {
        name:  process.env.DATABASE_NAME || "database",
        host: process.env.DATABASE_HOST || "localhost",
        port: process.env.DATABASE_PORT || 27017,
        usename: process.env.DATABASE_USER || "",
        password: process.env.DATABASE_NAME || "",
    },

    session_secret : process.env.SESSION_SECRET || "<your session secret key>",
    client_secret : process.env.CLIENT_SECRET || "<your client secret key>",
    ses_service: {
        enabled: process.env.SES_SERVICE || true,
        from : "<mail from address>"
    },
    /**
     * IMAGE UPLOAD
     * ------------
     * - USER
     * - PROEJCT
    */
    upload: {
       dashboard: {
           dest: "uploads/dashboards",
           // MB
           uploadSize: 1
       }
    },

    /**
     * -------------------------------
     * EMAIL CONFIGURATION
     * --------------------------------
     */
    email: {
        gmail: {
            provider: "Gmail",
            username: "<username>",
            password: "<password>",
        }
    }
}

export default config
