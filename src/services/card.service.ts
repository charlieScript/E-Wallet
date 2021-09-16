import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import axios from 'axios';
import logger from '../utils/logger';
import { creditAccount } from "./transactions.service";



const BASE_API = 'https://api.paystack.co/charge';
const BEARER_TOKEN = process.env.paystack_token;



export const fundAccount = async (
  card: object,
  email: string,
  amount: number,
  pin?: number,
  otp?: number,
  phone?: number,
) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const result = await chargeCard(card, email, amount);
      if (result?.nextAction === 'send_pin') {
        await submitPIN(result.txn_ref, pin)
      }
      if (result?.nextAction === 'send_otp') {
        await submitOtp(result.txn_ref, otp)
      }
      if (result?.nextAction === 'send_phone') {
        await submitPhone(result.txn_ref, phone)
      }

    });
  } catch (error) {
    logger.error(error)
    return error
   }
};

export const chargeCard = async (card: object, email: string, amount: number) => {
  try {
    const charge = await axios.post(
      BASE_API,
      {
        email,
        amount,
        card,
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      },
    );
    
    // patching work done for the code
    let res: any;
    
    // sucessful card charge
    if (charge.data.data.status === 'success') {
      
      await prisma.$transaction(async (prisma) => {
        // console.log(charge);
        
        const txn = await prisma.card_transactions.create({
          data: {
            account_id: email,
            amount: amount,
            external_reference: charge.data.data.reference,
            last_response: charge.data.data.status,
          },
        });
        res = txn;
        const creditResult = await creditAccount(amount, email, 'card_funding', charge.data.data);
        if (!creditResult.success) {
          return {
            success: false,
            error: 'Could not credit account',
            txn_ref: txn.external_reference,
            nextAction: txn.last_response
          };
        }
        
      });
      return {
        success: true,
        message: 'Charge successful',
        txn_ref: res.external_reference,
        nextAction: res.last_response
      };
    } else {
      
      return {
        data: charge.data
      }
    }

  } catch (error) {
    logger.error(error);
    console.log(error);
    
    return {
      success: false,
      message: 'Charge not successful an error happened',
    }
  }
};

export const submitPIN = async (reference: string, pin: number | undefined) => {
  try {
    const transaction = await prisma.card_transactions.findFirst({
      where: { external_reference: reference },
    });
    if (!transaction) {
      return {
        success: true,
        message: 'Transaction not found',
      };
    }
    if (transaction?.last_response === 'success') {
      return {
        success: true,
        message: 'Transaction already succeeded',
      };
    }
    const charge = await axios.post(
      `${BASE_API}/submit_pin`,
      {
        reference,
        pin,
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      },
    );
    
    if (charge.data.data.status === 'success') {
      await prisma.$transaction(async (prisma) => {
        await prisma.card_transactions.update({
          where: {
            external_reference: transaction.external_reference
          },
          data: {
            last_response: charge.data.data.status
          }
        })
        const creditResult = await creditAccount(Number(transaction.amount), transaction.account_id, 'card_funding', charge.data.data);
        if (!creditResult.success) {
          return {
            success: false,
            error: 'Could not credit account',
            txn_ref: transaction.external_reference,
            nextAction: transaction.last_response
          };
        }

      });
      return {
        success: true,
        message: 'Charge successful',
        txn_ref: transaction.external_reference,
        nextAction: transaction.last_response
      };
    }
  } catch (error) { 
    logger.error(error)
    return {
      success: false,
      message: 'Charge not successful an error happened',
    }
  }
};

export const submitOtp = async (reference: string, otp: number | undefined) => {
  try {
    const transaction = await prisma.card_transactions.findFirst({
      where: { external_reference: reference },
    });
    if (!transaction) {
      return {
        success: true,
        message: 'Transaction not found',
      };
    }
    if (transaction?.last_response === 'success') {
      return {
        success: true,
        message: 'Transaction already succeeded',
      };
    }
    const charge = await axios.post(
      `${BASE_API}/submit_otp`,
      {
        reference,
        otp,
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      },
    );

    if (charge.data.data.status === 'success') {
      await prisma.$transaction(async (prisma) => {
        await prisma.card_transactions.update({
          where: {
            external_reference: transaction.external_reference
          },
          data: {
            last_response: charge.data.data.status
          }
        });
        const creditResult = await creditAccount(Number(transaction.amount), transaction.account_id, 'card_funding', charge.data.data);
        if (!creditResult.success) {
          return {
            success: false,
            error: 'Could not credit account',
            txn_ref: transaction.external_reference,
            nextAction: transaction.last_response
          };
        }

      });
      return {
        success: true,
        message: 'Charge successful',
        txn_ref: transaction.external_reference,
        nextAction: transaction.last_response
      };
    }
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      message: 'Charge not successful an error happened',
    }
  }
};


export const submitPhone = async (reference: string, otp: number | undefined) => {
  try {
    const transaction = await prisma.card_transactions.findFirst({
      where: { external_reference: reference },
    });
    if (!transaction) {
      return {
        success: true,
        message: 'Transaction not found',
      };
    }
    if (transaction?.last_response === 'success') {
      return {
        success: true,
        message: 'Transaction already succeeded',
      };
    }
    const charge = await axios.post(
      `${BASE_API}/submit_phone`,
      {
        reference,
        otp,
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      },
    );

    if (charge.data.data.status === 'success') {
      await prisma.$transaction(async (prisma) => {
        await prisma.card_transactions.update({
          where: {
            external_reference: transaction.external_reference
          },
          data: {
            last_response: charge.data.data.status
          }
        });
        const creditResult = await creditAccount(Number(transaction.amount), transaction.account_id, 'card_funding', charge.data.data);
        if (!creditResult.success) {
          return {
            success: false,
            error: 'Could not credit account',
            txn_ref: transaction.external_reference,
            nextAction: transaction.last_response
          };
        }

      });
      return {
        success: true,
        message: 'Charge successful',
        txn_ref: transaction.external_reference,
        nextAction: transaction.last_response
      };
    }
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      message: 'Charge not successful an error happened',
    }
  }
};
// chargeCard({
//   "number": "4084084084084081",
//   "cvv": "408",
//   "expiry_year": "22",
//   "expiry_month": "09"
// }, 'gozione3@gmail.com', 200);
