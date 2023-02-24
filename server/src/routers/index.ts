import {Router} from 'express';
import authMobileRouter from './mobile/auth.mobile.router';
import authWebRouter from "./auth.web.router";
import userRouter from './user.router';
import authRouter from "./authRouter";
import userRouterMobile from "./mobile/user.router";

import clientRouter from "./admin/client.router";
import roleRouter from "./admin/role.router";
import userRoleRouter from "./admin/userRole.router";
import {default as userAdminRouter} from "./admin/user.router";

import apiRouter from "./api.router";

import weightRouter from "./apiGatewayRouters/weight.router";
import oxyRouter from "./apiGatewayRouters/oxy.router";
import temperatureRouter from "./apiGatewayRouters/temperature.router";
import medicineReceiptRouter from "./apiGatewayRouters/medicineReceipt.router";
import ecgRouter from "./apiGatewayRouters/ecg.router";
import bloodRouter from "./apiGatewayRouters/blood.router";
import demoRouter from "./apiGatewayRouters/demo.router";
import appRouter from "./application.router";
import healthRouter from "./apiGatewayRouters/health.router";
import predictRouter from "./apiGatewayRouters/predict.router";
import apiHistoryRouter from './admin/apiHistory.router';

const router = Router();

router.use('/web/auth', authWebRouter);
router.use('/mobile/v1/auth', authMobileRouter);
router.use('/mobile/v1', userRouterMobile);
router.use('/users', userRouter);
router.use('/auth', authRouter);

router.use('/admin/clients', clientRouter);
router.use('/admin/roles', roleRouter);
router.use('/admin/userRoles', userRoleRouter);
router.use('/admin/users', userAdminRouter);
router.use('/admin/api/history', apiHistoryRouter);


router.use('/api', apiRouter);
router.use('/app', appRouter);


router.use('/weights', weightRouter);
router.use('/oxy', oxyRouter);
router.use('/temperature', temperatureRouter);
router.use('/medicineReceipt', medicineReceiptRouter);
router.use('/ecg', ecgRouter);
router.use('/blood', bloodRouter);
router.use('/health', healthRouter);
router.use('/predict', predictRouter);


router.use('/demo', demoRouter);
export default router;