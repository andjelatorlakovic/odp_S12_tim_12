import express from 'express';
import cors from 'cors';
import { authenticate } from './Middlewares/autentification/AuthMiddleware'; 
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Domain/repositories/users/UserRepository';
import { AuthController } from './WebAPI/Controllers/AuthController';
import { LanguagesController } from './WebAPI/Controllers/LanguageContoller';
import { UserController } from './WebAPI/Controllers/UserController';
import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';
import { LanguageLevelController } from './WebAPI/Controllers/LanguageLevelController';  

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Inicijalizujemo repozitorijume
const userRepository: IUserRepository = new UserRepository();

// Inicijalizujemo servise
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);

// Inicijalizujemo kontrolere
const authController = new AuthController(authService);
const languagesController = new LanguagesController();
const userController = new UserController(userService);
const languageLevelController = new LanguageLevelController();

// Registrujemo rute pod istim prefiksom (api/v1)
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', languagesController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', languageLevelController.getRouter());  // ✅ sada i LanguageLevelController koristi getRouter()

export default app;
