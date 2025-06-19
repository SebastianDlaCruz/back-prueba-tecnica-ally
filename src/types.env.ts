declare namespace NodeJS {
  export interface ProcessEnv {
    // Variables de MySQL (Railway)
    MYSQLHOST: string;
    MYSQLUSER: string;
    MYSQLPASSWORD: string;
    MYSQLDATABASE: string;
    MYSQLPORT: string;
    // Otras variables
    KEY_JWT: string;
    NODE_ENV: 'dev' | 'prod' | 'test';
  }
}