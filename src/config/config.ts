const config = {
    db: {
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        database: process.env.MONGO_DATABASE || 'test',
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
};

export default config;