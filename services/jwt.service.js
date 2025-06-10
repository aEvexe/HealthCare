const config = require('config');
const jwt = require('jsonwebtoken');

class JwtService {
    constructor(accessKey, refreshKey, accessTime, refreshTime){
        this.accessKey = accessKey;
        this.refreshKey = refreshKey;
        this.accessTime = accessTime;
        this.refreshTime = refreshTime;
    }

    generateToken(payload){
        const accessToken = jwt.sign(payload, this.accessKey, {
            expiresIn: this.accessTime,
        })

        const refreshToken = jwt.sign(payload, this.refreshKey, {
            expiresIn: this.refreshTime,
        })
        return {
            accessToken,
            refreshToken,
        }
    }

    async verifyAccessToken(token){
        return jwt.verify(token, this.accessKey)
    }

    async verifyRefreshToken(token){
        return jwt.verify(token, this.refreshKey)
    }


}

let AdminJwtServicee = new JwtService(
    config.get("admin_access_key"),
    config.get("admin_refresh_key"),
    config.get("admin_access_time"),
    config.get("admin_refresh_time")
)

let ClientJwtServicee = new JwtService(
    config.get("client_access_key"),
    config.get("client_refresh_key"),
    config.get("client_access_time"),
    config.get("client_refresh_time")
)

let OwnerJwtServicee = new JwtService(
    config.get("owner_access_key"),
    config.get("owner_refresh_key"),
    config.get("owner_access_time"),
    config.get("owner_refresh_time")
)

module.exports = {
    AdminJwtServicee,
    ClientJwtServicee,
    OwnerJwtServicee
}