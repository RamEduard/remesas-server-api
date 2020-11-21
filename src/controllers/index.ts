import { RateController } from './Rate/RateController';
import { UserController } from './User/UserController';

const rateController = new RateController();
const userController = new UserController();

export {
    rateController,
    userController
};