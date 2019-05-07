const config = {
    
    // APPLICATION NAME
    app_name: "Client APP",

    // SEEDERS
    seed: false,

    // PORT
    port: 3000,

    /**
     * ENVIRONMENT
     * 
     * development -    help to debug and maintain
     * production -     for deployment
     */
    env : "development",

    // DATABASE CONFIG
    database : {
        name: "client_app",
        host: "localhost",
        port: "27017",
        usename: "",
        password: "",
    }
}

export default config