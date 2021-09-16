import { verifyPayload } from "../helpers/jwt";
import { RequestHandler } from "express";


//Protect routes;
export const protect: RequestHandler = async (req, res, next) => {
  let token = '';
  // Check for token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[+!!{}];
    try {
      const decoded = verifyPayload(token);
      // sends the  user the email to the controller
      //@ts-ignore  
      req.user = decoded;

      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({
        status: '403',
        message: 'Not authorized to access this resource',
      });
    }
  }
};

