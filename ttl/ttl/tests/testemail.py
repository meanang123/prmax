from ttl.ttlemail import SendSupportEmailMessage



SendSupportEmailMessage( "test", "body", "support@prmax.co.uk", "chris.g.hoy@gmail.com" )
SendSupportEmailMessage( "test", "body", '"PRmax Accounts" <accounts@prmax.co.uk>', "chris.g.hoy@gmail.com" )

SendSupportEmailMessage( "test", "body", "accounts@prmax.co.uk", "chris.g.hoy@gmail.com" )

SendSupportEmailMessage( "test", "body", "sales@prmax.co.uk", "chris.g.hoy@gmail.com" )
SendSupportEmailMessage( "test", "body", "research@prmax.co.uk", "chris.g.hoy@gmail.com" )
SendSupportEmailMessage( "test", "body", "chris.g.hoy@gmail.com", "chris.g.hoy@gmail.com" )