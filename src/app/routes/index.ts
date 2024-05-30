import { Router } from 'express';
import { AuthRoutes } from '../modules/authentication/auth.route';
import { BloodRequestRoutes } from '../modules/bloodrequest/request.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/bloodrequests',
    route: BloodRequestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
