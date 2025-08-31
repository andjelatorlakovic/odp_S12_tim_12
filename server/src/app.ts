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
import { UserLanguageLevelController } from './WebAPI/Controllers/UserLanguage';
import { KvizController } from './WebAPI/Controllers/QuizContoller';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repozitorijumi
const userRepository: IUserRepository = new UserRepository();

// Servisi
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);

// Kontroleri
const authController = new AuthController(authService);
const languagesController = new LanguagesController();
const userController = new UserController(userService);
const languageLevelController = new LanguageLevelController();
const userLanguageLevelController = new UserLanguageLevelController();
const kvizController = new KvizController(); // <--- instanca kviz kontrolera

// Registracija ruta
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', languagesController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', languageLevelController.getRouter());
app.use('/api/v1', userLanguageLevelController.getRouter());
app.use('/api/v1', kvizController.getRouter());  // <--- registracija ruta za kviz

export default app;
