# -*- coding: utf-8 -*-

import imaplib
import email
import StringIO
from ttl.postgres import DBConnect
import prcommon.Constants as Constants
from prcommon.model.customer.unsubscribegeneral import UnsubscribeGeneral

class ConnectToImap(object):
    """ access the emails from unsubscribe account """

    _Email_IMAP_host = "imap.gmail.com"
    _Email_Support_User = "unsubscribe@prmax.co.uk"
    _Email_Support_Password = "Xc$cR6QhAa3s"

    def __init__(self):
        """ init the connection too the email server """
        self._msg_ids = []
        self._connection = imaplib.IMAP4_SSL(ConnectToImap._Email_IMAP_host)

    def login(self, account, password):
        """ login to the account """
        self._connection.login(account, password)

    def close(self):
        """ close email server collection """
        self._connection.close()

    def selectINBOX(self):
        """ select the inbox"""
        self._connection.select('INBOX')

    def getEmailList(self):
        """ get a list of msgs id's in the inbox """
        msg_ids = self._connection.search(None, 'ALL')
        self._msg_ids = [r for r in msg_ids[1][0].split(' ') if r]

    def unsubscribeMessage(self, msg_id):
        typ,msg_data = self._connection.fetch(msg_id, '(RFC822)')

        for emailBody in msg_data:
            if isinstance(emailBody, tuple):
                mail = email.message_from_string(emailBody[1])

        for part in mail.walk():
            if part.get('Subject') is None:
                continue
            else:
                if 'unsubscribe' in part.get('Subject'):
                    ref = {}
                    subject = part.get('Subject')
                    subject = subject.replace(">", "")
                    ref['listmemberdistributionid'] = unicode(subject[subject.find('lunsubscribe')+12:].strip())
                    if ref['listmemberdistributionid'].isnumeric:
                        UnsubscribeGeneral.do_unsubscribe(ref)
                        print 'Unsubscribe listmemberdistributionid = %s' %ref['listmemberdistributionid']


    def archiveMessage(self, msg_id):
        """ move a message to the archive mail store """
        self._connection.store(msg_id, '+FLAGS', '\\Seen')
        self._connection.store(msg_id, '+FLAGS', '\\Deleted')

    def restEmail(self, msg_id):
        """ convert the message back too unread"""
        self._connection.store(msg_id, '+FLAGS', '\\UnSeen')

    def updateMessage(self):
        """ update mail box """
        self._connection.expunge()

class AnalysisMessages(ConnectToImap, DBConnect):

    def __init__(self, log, istest):
        """ setup all the connection"""
        DBConnect.__init__(self, Constants.db_Command_Service)
        ConnectToImap.__init__(self)
        self._log = log

    def run(self):
        """ do process"""

        # get emails
        self.login(AnalysisMessages._Email_Support_User, AnalysisMessages._Email_Support_Password)
        self.selectINBOX()
        self.getEmailList()

        # download attachments and archive messages
        for i, msg_id in enumerate(self._msg_ids):
            self._log.info("Processing %d" % i)
            self.unsubscribeMessage(msg_id)
            self.archiveMessage(msg_id)

        return len(self._msg_ids)
