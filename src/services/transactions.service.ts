import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import crypto from 'crypto'

const ref = crypto.createHash('sha256').update(crypto.randomBytes(10)).digest('hex')


export const creditAccount = async (amount: number, account_id: string, purpose: string, metadata: any) => {
  const account = await prisma.accounts.findFirst({
    where: { user_id: account_id}
  })

  if (!account) {
    return {
      success: false,
      message: 'Account does not exist',
    };
  }

  await prisma.accounts.update({
    where: {
      user_id: account.user_id
    },
    data: {
      balance: {
        increment: amount
      }
    }
  })

  await prisma.transactions.create({
    data: {
      amount,
      // @ts-ignore
      purpose,
      txn_type: 'credit',
      account_id: account.user_id,
      reference: ref,
      metadata,
      balance_before: account.balance,
      balance_after: Number(account.balance) + Number(amount),
    }
  })
  return {
    success: true,
    message: 'Credit successful',
  };
}

export const debitAccount = async (amount: number, account_id: string, purpose: string, metadata: any) => {
  const account = await prisma.accounts.findFirst({
    where: { user_id: account_id }
  });

  if (!account) {
    return {
      success: false,
      message: 'Account does not exist',
    };
  }

  if (Number(account.balance) < amount) {
    return {
      success: false,
      message: 'Insufficient balance',
    }
  }

  await prisma.accounts.update({
    where: {
      user_id: account.user_id
    },
    data: {
      balance: {
        decrement: amount
      }
    }
  })
  await prisma.transactions.create({
    data: {
      amount,
      // @ts-ignore
      purpose,
      txn_type: 'debit',
      account_id: account.user_id,
      reference: ref,
      metadata,
      balance_before: account.balance,
      balance_after: Number(account.balance) - Number(amount),
    }
  })
}

