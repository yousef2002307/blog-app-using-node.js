const bcrypt = require("bcrypt");
const UserRepo = require("../../Repos/UserRepo");
const { RegisterSpecification } = require("../../Specifications/Auth/RegisterSpecification");
const { LoginSpecification } = require("../../Specifications/Auth/LoginSpecification");
const jwt = require("jsonwebtoken");
class AuthController {
    /**
     * Register a new user
     */
    async register(req, res, next) {
       
            const body = req.body ?? {};

            const validation = await RegisterSpecification.validate(body);
            if (!validation.valid) {
                return res.status(400).json({
                    message: validation.message,
                    errors: validation.errors
                });
            }

            const { name, email, password } = body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserRepo.create({
                name,
                email,
                password: hashedPassword
            });

            return res.status(201).json({
                message: "User registered successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

       
    }

     async login(req, res, next) {
       
            const body = req.body ?? {};

            const validation = await LoginSpecification.validate(body);
            if (!validation.valid) {
                return res.status(validation.statusCode).json({
                    message: validation.message,
                    errors: validation.errors
                });
            }
            console.log(validation);

          //create token 
          const token = jwt.sign({
            id: validation.data.id,
            email: validation.data.email,
           
          }, process.env.JWT_SECRET, {
            expiresIn: "1h"
          });
          const refreshToken = jwt.sign({
            id: validation.data.id,
            email: validation.data.email,
           
          }, process.env.JWT_SECRET, {
            expiresIn: "7d"
          });

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
          });
        
            return res.status(200).json({
                message: "User logged in successfully",
                data: {
                  user:{
                    id: validation.data.id,
                    name: validation.data.name,
                    email: validation.data.email
                  },
                  "token":token
                }
            });

       
    }
    async regenerateToken(req, res, next) {
       
            const refreshToken = req?.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }
            const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const user = await UserRepo.findById(decodedToken.id);
            if (!user) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }
            const token = jwt.sign({
                id: user.id,
                email: user.email,
            }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });
            return res.status(200).json({
                message: "Token regenerated successfully",
                data: {
                    token
                }
            });
    }
}

module.exports = new AuthController();
