declare namespace NodeJS {
  export interface ProcessEnv {
    PAYLOAD_SECRET: string;
    MONGODB_URI: string;
    S3_BUCKET: string;
    GEMINI_API_KEY: string;
    GEMINI_MODEL_NAME: string;
    MINIO_ROOT_USER: string;
    MINIO_ROOT_PASSWORD: string;
    MEILI_MASTER_KEY: string;
    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
    ME_CONFIG_BASICAUTH_USERNAME: string;
    ME_CONFIG_BASICAUTH_PASSWORD: string;
    DIFY_API_KEY: string;
    DIFY_DATASET_ID: string;
    DIFY_API_URL: string;
  }
}
