import { Router} from 'express'
import { signup, login} from '../requestHandler/user.handler'
import { protect } from "../middleware/protect.middleware";

const router = Router()

router.post('/user/signup', signup)
router.post('/user/login', login)


export default router