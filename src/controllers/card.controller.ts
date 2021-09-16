import joi, { string, number } from 'joi';
import { hash, compare } from '../helpers/bcrypt';
import { createUser, findUser } from '../services/user.service';
import { chargeCard, submitOtp, submitPIN, submitPhone } from "../services/card.service";
import { PrismaClient } from "@prisma/client";
import { IHelperResponse } from "./user.controller";
import logger from "../utils/logger";
const prisma = new PrismaClient()


type cardDetails = {
  number: number,
  cvv: number,
  expiry_year: number,
  expiry_month: number,
};

let res = {}
/**
 * 
 * @param email email address of the sender account owner
 * @param amount funding
 * @param card card details
 * @returns 
 * @route /user/charge
 */
export const chargeCardController = async (email: string, amount: number, card: cardDetails) => {
  const validationSchema = joi.object({
    email: joi.string().required().email(),
    amount: joi.number().required(),
    card: joi.object({
      number: joi.string(),
      cvv: joi.string().min(3).max(3),
      expiry_year: joi.string().min(2).max(2),
      expiry_month: joi.string().min(2).max(2)
    })
  });

  const validationResult = validationSchema.validate({
    email,
    amount,
    card
  });
  if (validationResult.error) {
    return {
      success: false,
      status: 400,
      message: validationResult.error.message,
    };
  }

  // 1. charge card 
  try {
    await prisma.$transaction(async (prisma) => {
      const result = await chargeCard(card, email, amount);
      // console.log(result, 'from controller');
      if (result.nextAction === 'success') {
        return res = {
          success: true,
          message: result.message,
          txn_ref: result.txn_ref,
          extra_details: `${amount} was paid into ${email} account`
        };
      }
      if (result.data.data.status === 'send_pin') {
        return res = {
          success: false,
          status: 200,
          message: 'Funding Failed Send Pin with payload and the reference',
          reference: result.data.data.reference
        }
      }
      
      if (!result) {
        res = {
          success: true,
          status: 200,
          message: 'Funding failed',
        };
      }

    });
    return {
      ...res
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    
    return {
      success: false,
      status: 400,
      error: 'charge not successful',
    };
  }
};


/**
 * 
 * @param reference reference you got while funding the card
 * @param pin 4 number 
 * @returns 
 */
export const submitPinController = async (reference: string, pin: number) => {
  const validationSchema = joi.object({
    reference: joi.string().required(),
    pin: joi.number().required().min(4).max(4)
  });

  const validationResult = validationSchema.validate({
    reference,
    pin
  });
  if (validationResult.error) {
    return {
      success: false,
      status: 400,
      error: validationResult.error.message,
    };
  }

  // 2 . submit pin
  try {
    await prisma.$transaction(async (prisma) => {
      const result = await submitPIN(reference, pin)
      if (result?.nextAction === 'send_otp') {
        return {
          success: false,
          status: 200,
          message: 'Funding Failed Send OTP with payload and the reference',
        };
      }
      if (!result?.success) {
        return {
          success: true,
          status: 200,
          message: 'Funding failed',
        };
      }

    });
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      status: 400,
      error: 'charge not successful',
    };
  }
};




export const submitOtpController = async (reference: string, otp: number) => {
  const validationSchema = joi.object({
    reference: joi.string().required(),
    otp: joi.number().required()
  });

  const validationResult = validationSchema.validate({
    reference,
    otp
  });
  if (validationResult.error) {
    return {
      success: false,
      status: 400,
      error: validationResult.error.message,
    };
  }

  // 2 . submit pin
  try {
    await prisma.$transaction(async (prisma) => {
      const result = await submitOtp(reference, otp);
      if (result?.nextAction === 'send_phone') {
        return {
          success: false,
          status: 200,
          message: 'Funding Failed Send your phone number with payload and the reference',
        };
      }
      if (!result?.success) {
        return {
          success: true,
          status: 200,
          message: 'Funding failed',
        };
      }
    });

  } catch (error) {
    logger.error(error);
    return {
      success: false,
      status: 400,
      error: 'charge not successful',
    };
  }
};


export const submitPhoneController = async (reference: string, phone: number) => {
  const validationSchema = joi.object({
    reference: joi.string().required(),
    otp: joi.number().required()
  });

  const validationResult = validationSchema.validate({
    reference,
    phone
  });
  if (validationResult.error) {
    return {
      success: false,
      status: 400,
      error: validationResult.error.message,
    };
  }

  // 2 . submit pin
  try {
    await prisma.$transaction(async (prisma) => {
      const result = await submitPhone(reference, phone);
      if (!result?.success) {
        return {
          success: true,
          status: 200,
          message: 'Funding failed',
        };
      }
    });

  } catch (error) {
    logger.error(error);
    return {
      success: false,
      status: 400,
      error: 'charge not successful',
    };
  }
};