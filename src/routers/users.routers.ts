import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

export const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/', userController.readAll);
usersRouter.post('/', userController.create);

usersRouter.get('/:id', userController.read);
usersRouter.patch('/:id', userController.update);
usersRouter.delete('/:id', userController.delete);
