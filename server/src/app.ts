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

// Odgovori (answers)
import { AnswerController } from './WebAPI/Controllers/AnswerController';
import { AnswerRepository } from './Domain/repositories/answers/AnswerRepository';
import { AnswerService } from './Services/answers/AnswerService';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repozitorijumi
const userRepository: IUserRepository = new UserRepository();
const questionRepository = new QuestionRepository();
const answerRepository = new AnswerRepository(); // <-- answer repo

// Servisi
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const questionService = new QuestionService(questionRepository);
const answerService = new AnswerService(answerRepository); // <-- answer service

// Kontroleri
const authController = new AuthController(authService);
const languagesController = new LanguagesController();
const userController = new UserController(userService);
const languageLevelController = new LanguageLevelController();
const userLanguageLevelController = new UserLanguageLevelController();
const kvizController = new KvizController();
const questionController = new QuestionController(questionService);
const answerController = new AnswerController(answerService); // <-- answer controller

// Registracija ruta
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', languagesController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', languageLevelController.getRouter());
app.use('/api/v1', userLanguageLevelController.getRouter());
app.use('/api/v1', kvizController.getRouter());
app.use('/api/v1', questionController.getRouter());
app.use('/api/v1', answerController.getRouter()); // <-- answer ruta

export default app;
