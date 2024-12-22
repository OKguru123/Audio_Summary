import express from 'express'
import { sendOTPOnEmail, verifyOTP } from '../Controllers/user.controller';

const router = express.Router();

router.post("/sendOTPOnEmail" , sendOTPOnEmail)
router.post("/verfiyOTP" , verifyOTP)

export default router;  