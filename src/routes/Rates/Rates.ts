import express, { Request, Response } from 'express';
import { rateController } from '../../controllers';

export const router = express.Router({
    strict: true
});

router.get('/', async (req: Request, res: Response) => {
    return rateController.index(req, res);
});

router.get('/btc-avg', async (req: Request, res: Response) => {
    return rateController.btcAvg(req, res);
})

router.get('/buy/:currencyCode', async (req: Request, res: Response) => {
    return rateController.buyByCurrency(req, res)
})

router.get('/sell/:currencyCode', async (req: Request, res: Response) => {
    return rateController.sellByCurrency(req, res)
})

router.get('/by/:currencyCode', async (req: Request, res: Response) => {
    return rateController.byCurrencyCode(req, res)
})
