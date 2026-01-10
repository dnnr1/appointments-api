import { Router } from "express"
import { CreateAppointmentController } from "./controllers/CreateAppointmentController"
import { CancelAppointmentController } from "./controllers/CancelAppointmentController"
import { RescheduleAppointmentController } from "./controllers/RescheduleAppointmentController"
import { ListAppointmentsByUserController } from "./controllers/ListAppointmentsByUserController"
import { ListAppointmentsByDateController } from "./controllers/ListAppointmentsByDateController"
import { auth } from "./middlewares/auth"
import { useCases } from "../container"

const router = Router()

const asyncHandler = (fn: (req: any, res: any, next: any) => Promise<any>) => {
	return (req: any, res: any, next: any) => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}

const createController = new CreateAppointmentController(useCases.createAppointment)
const cancelController = new CancelAppointmentController(useCases.cancelAppointment)
const rescheduleController = new RescheduleAppointmentController(useCases.rescheduleAppointment)
const listByUserController = new ListAppointmentsByUserController(useCases.listByUser)
const listByDateController = new ListAppointmentsByDateController(useCases.listByDate)

router.use(auth)

router.post("/appointments", asyncHandler((req, res) => createController.handle(req, res)))
router.post("/appointments/:id/cancel", asyncHandler((req, res) => cancelController.handle(req, res)))
router.post("/appointments/:id/reschedule", asyncHandler((req, res) => rescheduleController.handle(req, res)))
router.get("/appointments/user", asyncHandler((req, res) => listByUserController.handle(req, res)))
router.get("/appointments/date", asyncHandler((req, res) => listByDateController.handle(req, res)))

export { router }
