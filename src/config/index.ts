import dotenv from "dotenv"
import path from "path"

/**
 * DOTENV configutation
 */
dotenv.config({ path: path.resolve(".env") })

const config = {

    // APPLICATION HOST
    app_host : process.env.HOST || "http://35.163.116.73",

    // APPLICATION NAME
    app_name: process.env.APP_NAME || "Fuse Bulletin",

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
        name:  process.env.DATABASE_NAME || "client_app",
        host: process.env.DATABASE_HOST || "localhost",
        port: process.env.DATABASE_PORT || 27017,
        usename: process.env.DATABASE_USER || "",
        password: process.env.DATABASE_NAME || "",
    },

    session_secret : process.env.SESSION_SECRET || "ashdfjhasdlkjfhalksdjhflak",
    client_secret : process.env.CLIENT_SECRET || "ashdfjhasdlkjfhalksdjhflak",
    ses_service: {
        enabled: process.env.SES_SERVICE || true,
        from : "developer@fusemachines.com"
    },
    /**
     * IMAGE UPLOAD
     * ------------
     * - USER
     * - PROEJCT
    */
    upload: {
       user: {
           dest: "uploads/users",

           // MB
           uploadSize: 1
       },
       projectLogo: {
           dest: "uploads/projects",

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
            username: "developer@fusemachines.com",
            password: "developer2019",
        }
    },

    /**
     * PASSPORT CONFIGURATION
     * ----------------------
     * TOKEN
     * - expiresAt in 12 months
     */
    passport: {
        token: {
            expiresAt: 12
        }
    }
}

export default config
