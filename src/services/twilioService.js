import twilio from "twilio";
import "dotenv/config";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send an SMS
 * @param {string} to - Recipient's phone number
 * @param {string} message - Message body
 */
export async function sendSMS(to, message){
    try {
        const response = await client.messages.create({
            body: message,
            from: fromNumber,
            to,
        });
        console.log("SMS sent successfully", response.sid);
        return response;
    } catch (error) {
        console.error("Failed to send sms", error);
        throw error;
    }
}

/**
 * Make a voice call
 * @param {string} to - Recipient's phone number
 * @param {string} url - TwiML Bin or XML instructions URL
 */
export async function makeCall(to, url="http://demo.twilio.com/docs/voice.xml") {
    try {
        const call = await client.calls.create({
            from: fromNumber,
            to,
            url,
        });
        console.log("Call initiated successully", call.sid);
        return call;
    } catch (error) {
        console.error("Failed to make call", error);
        throw error;
    }
}