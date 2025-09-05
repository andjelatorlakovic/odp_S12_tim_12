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
import { UserQuizResultRepository } from './Domain/repositories/userQuiz/UserQuizRepository';
import { LanguagesRepository } from './Domain/repositories/languages/LanguagesRepository';
import { LanguageLevelRepository } from './Domain/repositories/languageLevels/LanguageLevelRepository';

// Servisi
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';
import { QuestionService } from './Services/questions/QuestionService';
import { AnswerService } from './Services/answers/AnswerService';
import { UserLanguageLevelService } from './Services/userLanguages/UserLanguageService';
import { KvizService } from './Services/quiz/QuizService';
import { UserQuizResultService } from './Services/userQuiz/UserQuizService';
import { LanguageService } from './Services/languages/LanguageService';
import { LanguageLevelService } from './Services/languageLevels/LanguageLevelService';

// Kontroleri
import { AuthController } from './WebAPI/Controllers/AuthController';
import { LanguagesController } from './WebAPI/Controllers/LanguageContoller';
import { UserController } from './WebAPI/Controllers/UserController';
import { LanguageLevelController } from './WebAPI/Controllers/LanguageLevelController';
import { UserLanguageLevelController } from './WebAPI/Controllers/UserLanguageController';
import { KvizController } from './WebAPI/Controllers/QuizContoller';
import { QuestionController } from './WebAPI/Controllers/QuestionController';
import { AnswerController } from './WebAPI/Controllers/AnswerController';
import { IUserRepository } from './Database/repositories/user/IUserRepository';
import { UserQuizResultController } from './WebAPI/Controllers/UserQuizController';
import { IQuestionService } from './Domain/services/questions/IQuestionService';
import { IQuestionRepository } from './Database/repositories/question/IQuestionRepository';
import { IAnswerRepository } from './Database/repositories/answer/IAnswerRepository';
import { IUserLanguageLevelRepository } from './Database/repositories/userLanguage/IUserLanguageRepository';
import { IKvizRepository } from './Database/repositories/quiz/IQuizRepository';
import { IUserQuizResultRepository } from './Database/repositories/userQuiz/IUserQuizRepository';
import { ILanguageRepository } from './Database/repositories/language/ILanguagesRepository';
import { ILanguageLevelRepository } from './Database/repositories/languageLevel/ILanguageLevelRepository';
import { IAnswerService } from './Domain/services/answers/IAnswerService';
import { IUserLanguageLevelService } from './Domain/services/userLanguage/IUserLanguageService';
import { IKvizService } from './Domain/services/quiz/IQuizService';
import { IUserQuizResultService } from './Domain/services/userQuiz/IUserQuizService';
import { ILanguageService } from './Domain/services/languages/ILanguageService';
import { ILanguageLevelService } from './Domain/services/languageLevel/ILanguageLevelService';


// Express aplikacija
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inicijalizacija repozitorijuma
const userRepository: IUserRepository = new UserRepository();
const questionRepository: IQuestionRepository = new QuestionRepository();
const answerRepository: IAnswerRepository = new AnswerRepository();
const userLanguageLevelRepository: IUserLanguageLevelRepository = new UserLanguageLevelRepository();
const kvizRepository: IKvizRepository = new KvizRepository();
const userQuizResultRepository: IUserQuizResultRepository = new UserQuizResultRepository();
const languageRepository: ILanguageRepository = new LanguagesRepository();
const languageLevelRepository: ILanguageLevelRepository = new LanguageLevelRepository();

// Inicijalizacija servisa
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const questionService: IQuestionService = new QuestionService(questionRepository);
const answerService: IAnswerService = new AnswerService(answerRepository);
const userLanguageLevelService: IUserLanguageLevelService = new UserLanguageLevelService(userLanguageLevelRepository);
const kvizService: IKvizService = new KvizService(kvizRepository);
const userQuizResultService: IUserQuizResultService = new UserQuizResultService(userQuizResultRepository);
const languageService: ILanguageService = new LanguageService(languageRepository);
const languageLevelService: ILanguageLevelService = new LanguageLevelService(languageLevelRepository);

// Inicijalizacija kontrolera
const authController = new AuthController(authService);
const languagesController = new LanguagesController(languageService);
const userController = new UserController(userService);
const languageLevelController = new LanguageLevelController(languageLevelService);
const userLanguageLevelController = new UserLanguageLevelController(userLanguageLevelService);
const kvizController = new KvizController(kvizService);
const questionController = new QuestionController(questionService);
const answerController = new AnswerController(answerService);
const userQuizResultController = new UserQuizResultController(userQuizResultService);

// Registracija ruta
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', languagesController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', languageLevelController.getRouter());
app.use('/api/v1', userLanguageLevelController.getRouter());
app.use('/api/v1', kvizController.getRouter());
app.use('/api/v1', questionController.getRouter());
app.use('/api/v1', answerController.getRouter());
app.use('/api/v1', userQuizResultController.getRouter());

export default app;
