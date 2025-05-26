const jwtConfig = {
    secret: process.env.JWT_SECRET ||'fallback_secret_for_development',
    expiresIn: '1h'
}

module.exports = jwtConfig;