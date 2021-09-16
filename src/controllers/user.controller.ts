import joi, { string,number } from 'joi';
import { signPayload } from '../helpers/jwt';
import { hash, compare } from '../helpers/bcrypt'
import { createUser, findUser } from '../services/user.service';
import { chargeCard, submitOtp, submitPIN, submitPhone } from "../services/card.service";
import { fundAccount } from "../services/card.service";
import { PrismaClient } from "@prisma/client";
import  logger from "../utils/logger";
const prisma = new PrismaClient()

// Interface for expected response
export interface IHelperResponse {
  success: boolean;
  status: number;
  data?: { token: string };
  error?: string;
  message?: string;
}

export const signupController = async (
  email: string,
  first_name: string,
  last_name: string,
  password: string,
): Promise<IHelperResponse> => {
  const validationSchema = joi.object({
    email: joi.string().required().email(),
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    password: joi.string().min(5),
  });

  const validationResult = validationSchema.validate({
    email,
    first_name,
    last_name,
    password,
  });
  if (validationResult.error) {
    return {
      success: false,
      status: 400,
      error: validationResult.error.message,
    };
  }

  // check for existing user
  const existingUser = await findUser(email);
  if (existingUser) {
    return {
      success: false,
      status: 400,
      error: 'Invalid username and/or password.',
    };
  }
  const hashPassword = await hash(password)

  const user = await createUser(email, first_name, last_name, hashPassword);
  return {
    success: true,
    status: 200,
    message: 'Account successfully created',
    data: { token: signPayload({ id: user.email }) },
  };
};

export const loginController = async (email: string, password: string): Promise<IHelperResponse> => {
  const validationSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(5),
  });

  const validationResult = validationSchema.validate({
    email,
    password,
  });
  if (validationResult.error) {
    return {
      success: false,
      status: 400,
      error: validationResult.error.message,
    };
  }

  const user = await findUser(email);
  if (!user) {
    return { success: false, status: 401, error: 'Incorrect username and/or password.' };
  }
  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    return { success: false, status: 401, error: 'Incorrect username and/or password.' };
  }

  return {
    success: true,
    status: 200,
    message: 'Login successful',
    data: { token: signPayload({ id: user.email }) },
  }
}

