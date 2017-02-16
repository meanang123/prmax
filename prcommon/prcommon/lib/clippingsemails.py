# -*- coding: utf-8 -*-

import imaplib
import email
import StringIO
from ttl.postgres import DBConnect
import prcommon.Constants as Constants
from prcommon.model.clippings.clippingimport import ClippingsImport

class ConnectToImap(object):
    """ access the emails from ipcb account """

    _Email_IMAP_host = "imap.gmail.com"
    _Email_Support_User = "ipcb@prmax.co.uk"
    _Email_Support_Password = "9mmFYZ3h"
    
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
        msg_ids = self._connection.search(None, 'UNSEEN')
        self._msg_ids = [r for r in msg_ids[1][0].split(' ') if r]

    def importAttachment(self, part):

        fo = StringIO.StringIO(part.get_payload(decode=True))
        importer = ClippingsImport()
        if isinstance(fo, object):
            importer.import_ipcb_file(None, fo)
        fo.close()

    def getMessage(self, msg_id):
        typ,msg_data = self._connection.fetch(msg_id, '(RFC822)')

        for emailBody in msg_data:
            if isinstance(emailBody, tuple):
                mail = email.message_from_string(emailBody[1])

        for part in mail.walk():
            if part.get_content_maintype() == 'multipart':
                # print part.as_string()
                continue
            if part.get('Content-Disposition') is None:
                # print part.as_string()
                continue
            fileName = part.get_filename()
            if bool(fileName) and  fileName.lower().endswith('.xml'):
                self.importAttachment(part)


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

class AnalysisMessage(object):

    def __init__(self, msg, istest):
        """ setup default settings"""
        self._msg = msg
        #self._to = ""

    @property
    def emailstatusid(self):
        """ email status id """
        return self._emailstatusid


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
            self.getMessage(msg_id)

            self.archiveMessage(msg_id)

        self.updateMessage()

        return len(self._msg_ids)
