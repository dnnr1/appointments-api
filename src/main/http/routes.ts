import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { CreateAppointmentController } from "./controllers/CreateAppointmentController";
import { CreateUserController } from "./controllers/CreateUserController";
import { DeleteUserController } from "./controllers/DeleteUserController";
import { LoginUserController } from "./controllers/LoginUserController";
import { CancelAppointmentController } from "./controllers/CancelAppointmentController";
import { RescheduleAppointmentController } from "./controllers/RescheduleAppointmentController";
import { ListAppointmentsByUserController } from "./controllers/ListAppointmentsByUserController";
import { ListAppointmentsByDateController } from "./controllers/ListAppointmentsByDateController";
import { auth } from "./middlewares/auth";
import { useCases } from "../container";

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const createController = new CreateAppointmentController(
  useCases.createAppointment,
);
const createUserController = new CreateUserController(useCases.createUser);
const loginUserController = new LoginUserController(useCases.loginUser);
const deleteUserController = new DeleteUserController(useCases.deleteUser);
const cancelController = new CancelAppointmentController(
  useCases.cancelAppointment,
);
const rescheduleController = new RescheduleAppointmentController(
  useCases.rescheduleAppointment,
);
const listByUserController = new ListAppointmentsByUserController(
  useCases.listByUser,
);
const listByDateController = new ListAppointmentsByDateController(
  useCases.listByDate,
);

router.post(
  "/users",
  asyncHandler((req, res) => createUserController.handle(req, res)),
);

router.post(
  "/login",
  asyncHandler((req, res) => loginUserController.handle(req, res)),
);

router.use(auth);

router.delete(
  "/users/me",
  asyncHandler((req, res) => deleteUserController.handle(req, res)),
);

router.post(
  "/appointments",
  asyncHandler((req, res) => createController.handle(req, res)),
);
router.post(
  "/appointments/:id/cancel",
  asyncHandler((req, res) => cancelController.handle(req, res)),
);
router.post(
  "/appointments/:id/reschedule",
  asyncHandler((req, res) => rescheduleController.handle(req, res)),
);
router.get(
  "/appointments/user",
  asyncHandler((req, res) => listByUserController.handle(req, res)),
);
router.get(
  "/appointments/date",
  asyncHandler((req, res) => listByDateController.handle(req, res)),
);

export { router };
