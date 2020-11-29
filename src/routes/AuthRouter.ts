import express, { Request, Response } from 'express';

export const router = express.Router({
    strict: true
});

router.post('/login', (req: Request, res: Response) => {
    
})