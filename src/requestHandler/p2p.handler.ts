import { RequestHandler } from 'express';
import { sendMoneyController } from '../controllers/p2p.controller';
import logger from '../utils/logger';

export const sendMoney: RequestHandler = async (req, res) => {
  try {
    const { amount, reciever } = req.body;
    //@ts-ignore
    const result = await sendMoneyController(req.user.id, amount, reciever);
    
    // @ts-ignore
    if (result.success) {
      return res.status(400).json({ data: 'transaction success', message: result });
    } else {
    
      return res.status(200).json({ data: 'transaction failed', message: result });
    }
    
    // return res.status(200).json({ success: 'transaction was successful', message: result.message });
  } catch (error) {
    logger.error(error);
    // return res.status(400).json({ success: 'transaction failed' });
    return res.json({
      success: false,
      error: 'Internal server error',
    });
  }
};
