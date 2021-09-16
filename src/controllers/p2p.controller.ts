import joi from 'joi'
import { createUser, findUser } from '../services/user.service';
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import { creditAccount, debitAccount } from '../services/transactions.service';
const prisma = new PrismaClient();



let result = {}



/**
 * 
 * @param sender the sender
 * @param amount amount to send
 * @param reciever the person recieving
 * @returns 
 * @description a controller that does peer-to-peer transactions
 */
export const sendMoneyController = async (sender: string, amount: number, reciever: string) => {
  const validationSchema = joi.object({
    sender: joi.string().required().email(),
    reciever: joi.string().required().email(),
    amount: joi.number().required(),
  });

  const validationResult = validationSchema.validate({
    sender,
    reciever,
    amount,
  });
  if (validationResult.error) {
    return {
      success: false,
      status: 400,
      message: validationResult.error.message,
    };
  }
  if (sender === reciever) {
    return {
      success: false,
      status: 400,
      message: 'you can not credit yourself',
    };
  }

  // 1. send money
  try {
    await prisma.$transaction(async (prisma) => {
        // find reciever account
        const senderAcc = await findUser(sender)
        const recieverAcc = await findUser(reciever)

        if (!recieverAcc) {
          return {
            success: false,
            status: 404,
            message: 'user not found',
          };
        }
        

        // if found debit sender and credit reciever
        // @ts-ignore
      const deb = await debitAccount(amount, senderAcc?.email, 'transfer', `${amount} was removed from ${senderAcc?.email}`)
        
        // if there is not money
        if (deb?.success === false) {
          
          result = deb
          
        }  else {
          const cred = await creditAccount(amount, recieverAcc.email, 'transfer', `${amount} was removed from ${recieverAcc?.email}`)
          result = cred
          
        }
        

    });
    return {
      ...result
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    
    return {
      success: false,
      status: 400,
      error: 'transaction failed not successful',
    };
  }
};
