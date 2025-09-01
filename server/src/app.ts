import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Repozitorijumi

import { UserRepository } from './Domain/repositories/users/UserRepository';
import { QuestionRepository } from './Domain/repositories/questions/QuestionRepository';
import { AnswerRepository } from './Domain/repositories/answers/AnswerRepository';
import { UserLanguageLevelRepository } from './Domain/repositories/userLanguage/UserLanguageRepository';
import { KvizRepository } from './Domain/repositories/quiz/QuizRepository';

// Servisi
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';

import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';

import { QuestionService } from './Services/questions/QuestionService';
import { AnswerService } from './Services/answers/AnswerService';
import { UserLanguageLevelService } from './Services/userLanguages/UserLanguageService';


// Kontroleri
import { AuthController } from './WebAPI/Controllers/AuthController';
import { LanguagesController } from './WebAPI/Controllers/LanguageContoller';
import { UserController } from './WebAPI/Controllers/UserController';
import { LanguageLevelController } from './WebAPI/Controllers/LanguageLevelController';
import { UserLanguageLevelController } from './WebAPI/Controllers/UserLanguage';
import { KvizController } from './WebAPI/Controllers/QuizContoller';
import { QuestionController } from './WebAPI/Controllers/QuestionController';
import { AnswerController } from './WebAPI/Controllers/AnswerController';
import { KvizService } from './Services/quiz/QuizService';
import { IUserRepository } from './Database/repositories/user/IUserRepository';

// Express aplikacija
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inicijalizacija repozitorijuma
const userRepository: IUserRepository = new UserRepository();
const questionRepository = new QuestionRepository();
const answerRepository = new AnswerRepository();
const userLanguageLevelRepository = new UserLanguageLevelRepository();
const kvizRepository = new KvizRepository();

// Inicijalizacija servisa
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const questionService = new QuestionService(questionRepository);
const answerService = new AnswerService(answerRepository);
const userLanguageLevelService = new UserLanguageLevelService(userLanguageLevelRepository);
const kvizService = new KvizService(kvizRepository);

// Inicijalizacija kontrolera
const authController = new AuthController(authService);
const languagesController = new LanguagesController();
const userController = new UserController(userService);
const languageLevelController = new LanguageLevelController();
const userLanguageLevelController = new UserLanguageLevelController(userLanguageLevelService);
const kvizController = new KvizController(kvizService); // Promenjeno: koristi service
const questionController = new QuestionController(questionService);
const answerController = new AnswerController(answerService);

// Registracija ruta
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', languagesController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', languageLevelController.getRouter());
app.use('/api/v1', userLanguageLevelController.getRouter());
app.use('/api/v1', kvizController.getRouter());
app.use('/api/v1', questionController.getRouter());
app.use('/api/v1', answerController.getRouter());

// Izvoz aplikacije
export default app;
