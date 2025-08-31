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

// Pitanja
import { QuestionController } from './WebAPI/Controllers/QuestionController';
import { QuestionRepository } from './Domain/repositories/questions/QuestionRepository';
import { QuestionService } from './Services/questions/QuestionService';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repozitorijumi
const userRepository: IUserRepository = new UserRepository();
const questionRepository = new QuestionRepository();

// Servisi
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const questionService = new QuestionService(questionRepository);

// Kontroleri
const authController = new AuthController(authService);
const languagesController = new LanguagesController();
const userController = new UserController(userService);
const languageLevelController = new LanguageLevelController();
const userLanguageLevelController = new UserLanguageLevelController(); // Ako i ovaj koristi servis, uradi isto kao za pitanje
const kvizController = new KvizController();
const questionController = new QuestionController(questionService); // Prosleđujemo servis!

// Registracija ruta
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', languagesController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', languageLevelController.getRouter());
app.use('/api/v1', userLanguageLevelController.getRouter());
app.use('/api/v1', kvizController.getRouter());
app.use('/api/v1', questionController.getRouter()); // Registracija pitanja

export default app;
