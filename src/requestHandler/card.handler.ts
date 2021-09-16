import { RequestHandler } from 'express';
import { chargeCardController, submitOtpController, submitPhoneController, submitPinController } from '../controllers/card.controller';
import logger from '../utils/logger';


export const chargeCard: RequestHandler = async (req, res) => {
  try {
    const { amount, card } = req.body;
    // @ts-ignore
    const result = await chargeCardController(req.user.id, amount, card);
    // console.log(result, 'from handler');
    
    if (!result.success) {
      return res.status(400).json({ message: result });
    }
    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res.json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const submitPin: RequestHandler = async (req, res) => {
  try {
    const { reference, pin } = req.body;
    // @ts-ignore
    const { success, error, status, data, message } = await submitPinController(reference, pin);
    if (!success) {
      return res.status(status).json({ success, error });
    }
    return res.status(status).json({ success, data, message, status });
  } catch (error) {
    logger.error(error);
    return res.json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const submitOtp: RequestHandler = async (req, res) => {
  try {
    const { reference, otp } = req.body;
    // @ts-ignore
    const { success, error, status, data, message } = await submitOtpController(reference, otp);
    if (!success) {
      return res.status(status).json({ success, error });
    }
    return res.status(status).json({ success, data, message, status });
  } catch (error) {
    logger.error(error);
    return res.json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const submitPhone: RequestHandler = async (req, res) => {
  try {
    const { reference, phone } = req.body;
    // @ts-ignore
    const { success, error, status, data, message } = await submitPinController(reference, phone);
    if (!success) {
      return res.status(status).json({ success, error });
    }
    return res.status(status).json({ success, data, message, status });
  } catch (error) {
    logger.error(error);
    return res.json({
      success: false,
      error: 'Internal server error',
    });
  }
};