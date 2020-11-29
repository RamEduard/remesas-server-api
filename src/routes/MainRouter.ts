import AppRootDir from 'app-root-dir'
import express, { Request, Response } from 'express';

export const router = express.Router({
    strict: true
});

router.get('/', (req: Request, res: Response) => {
    const pjson = require(`${AppRootDir.get()}/package.json`)

    res.json({
        data: {
            author: pjson.author,
            title: pjson.description,
            version: pjson.version
        }
    })
})