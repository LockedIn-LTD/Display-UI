#pip install twilio

from twilio.rest import Client

class TwilioClient:
    def __init__(self, account_sid: str, auth_token: str, twilio_number: str):
        """
        Initialize the Twilio client with credentials
        :param account_sid: Twilio account SID
        :param auth_token: TWilio Auth Token
        :param twilio_number: Twilio phone number
        """
        self.client = Client(account_sid, auth_token)
        self.twilio_number = twilio_number
def send_sms(self, to: str, message:str) -> str:
    """
    Send an SMS message.
    :param to: verified recipient phone number
    :param message: text message to send
    :return: message sid for tracking
    """
    sms = self.client.messages.create(
        body=message,
        from_=self.twilio_number,
        to=to
    )
    return sms.sid
def make_call(self, to: str, twiml_url: str) -> str:
    """
    Make a voice call coded by TwiML url.
    :param to: verified recipient phone number
    :param twiml_url: url with Twilio instructions on voice message
    :return: call SID for tracking
    """    
    call = self.client.calls.create(
        url=twiml_url, #link to TwiML file (Twilio Markup Language), programs voice message
        to=to,
        from_= self.twilio_number
    )
    return call.sid
