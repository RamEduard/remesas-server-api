import express, { Request, Response } from 'express';

export const router = express.Router({
    strict: true
});

router.get('/', (req: Request, res: Response) => {
    res.json({
        data: {
            author: "Ramon Serrano",
            email: "ramon.calle.88@gmail.com",
            title: 'Remesas Server API',
            version: 'v1.0.0',
        }
    })
})