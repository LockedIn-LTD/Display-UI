#pip install twilio

from twilio.rest import Client

account_sid = 'ACCOUNT_SID'  #from twilio dashboard
auth_token = 'AUTH_TOKEN'    #from twilio dashboard
dest_number = '+1_DESTINATION_NUMBER' #verified phone number
twilio_number = '+1_TWILIO_NUMBER'#from twilio dashboard
client = Client(account_sid, auth_token)

#Make a call
call = client.calls.create(
    url='', #link to TwiML file (Twilio Markup Language), programs voice message
    to=dest_number,
    from_= twilio_number
)

#Send a message
message = client.messages.create(
    body="MESSAGE"
    to=dest_number,
    from_= twilio_number #from twilio dashboard
)
print("Call SID:", call.sid)
