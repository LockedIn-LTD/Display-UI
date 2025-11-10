import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;
const fromNumber: string | undefined = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
    throw new Error("Missing required Twilio environment variables");
}

const client = twilio(accountSid, authToken);
const from = fromNumber;

/**
 * Send an SMS
 * @param to - Recipient's phone number
 * @param message - Message body
 */
export async function sendSMS(to: string, message: string): Promise<any>{
    return client.messages.create({ 
        body: message, 
        from: from,
        to 
    });
}

/**
 * Make a voice call
 * @param to - Recipient's phone number
 * @param url - TwiML Bin or XML instructions URL
 */
export async function makeCall(
    to: string, 
    url: string ="https://handler.twilio.com/twiml/EHd85424ad567fc170dd538e14f5e3d8d7"
): Promise<any>{
    return client.calls.create({
        from: from,
        to, 
        url 
    });
}