import { Router } from 'express';
import { chargeCard, submitOtp, submitPhone, submitPin } from '../requestHandler/card.handler';
import { protect } from "../middleware/protect.middleware";

const router = Router();

router.post('/user/fund/charge', protect, chargeCard);
router.post('/user/fund/charge/send_pin', protect, submitPin);
router.post('//user/fund/charge/submit_otp', protect, submitOtp);
router.post('/user/fund/charge/submit_phone', protect, submitPhone);


export default router;