/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import createDebug from 'debug';

const debug = createDebug('demo:user-controller');

export class UserController {
    readAll = (req: Request, res: Response) => {
        debug('GET /users');
        res.send('GET /users');
    };
    read = (req: Request, res: Response) => {
        debug('GET /users/' + req.params.id);
        res.send('GET /users/' + req.params.id);
    };
    create = (req: Request, res: Response) => {
        debug('POST /users');
        res.status(201);
        res.send('POST /users');
    };
    update = (req: Request, res: Response) => {
        debug('PATCH /users/' + req.params.id);
        res.send('PATCH /users/' + req.params.id);
    };
    delete = (req: Request, res: Response) => {
        debug('DELETE /users/:id', req.params.id);
        res.send('DELETE /users/:id' + req.params.id);
    };
}

// export class UserController {
//     readAll() {}
//     read() {}
//     create() {}
//     update() {}
//     delete() {}
// }
