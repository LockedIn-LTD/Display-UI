#pip install twilio

from twilio.rest import Client

account_sid = 'ACCOUNT_SID'  #from twilio dashboard
auth_token = 'AUTH_TOKEN'    #from twilio dashboard
client = Client(account_sid, auth_token)

#Make the call
call = client.calls.create(
    url='', #link to TwiML file (Twilio Markup Language), programs voice message
    to='+1_DESTINATION_NUMBER',
    from_='+1_TWILIO_NUMBER' #from twilio dashboard
)

print("Call SID:", call.sid)
