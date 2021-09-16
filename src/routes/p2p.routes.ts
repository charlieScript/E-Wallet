import { Router } from 'express';
import { sendMoney } from '../requestHandler/p2p.handler';
import { protect } from "../middleware/protect.middleware";

const router = Router();

router.post('/user/fund/send', protect, sendMoney);


export default router;