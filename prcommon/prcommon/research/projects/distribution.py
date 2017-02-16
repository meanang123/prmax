
from prcommon.lib.distribution import EmailDistributionQueue
from prcommon.research.questionnaires import QuestionnaireEmailer

import prcommon.Constants as Constants

class ProjectDistributionController(threading.Thread):
	""" thread waits for a project question record, then process email and log it """

_sql_set_processing = """ UPDATE research.researchprojectitem SET emailstatusid = %(emailstatusid)s,queued_time = LOCALTIMESTAMP WHERE listmemberdistributionid = %(listmemberdistributionid)s"""

	def __init__( self, queue, lock, do_email = True, isTest = False  ):
		""" setup """
		threading.Thread.__init__(self)
		self._queue = queue
		self._lock = lock
		self._do_email = do_email
		self._istest = isTest
		self._typ = "Z" if isTest else "P"

	def run(self):
		"""  """

		# global items
		email = None

		while True:
			db = DBConnect(Constants.db_Command_Service)
			edistctrl = EmailDistributionQueue( self._lock , db,
			                                    ProjectDistributionController._sql_set_processing )
			sender = None
			try:
				# wait for an item to bebore avaliable
				record = self._queue.get()
				log.info ("Processing %d, Thread: %d" % ( record["researchprojectitemid"], thread.get_ident()))

				# build and email questionallier
				body = QuestionnaireEmailer.getfordistribution( record["objecttypeid"], record["objectid"], record["researchprojectstatusid"] )

				email = EmailMessage(ResearchEmail,
				                     record["emailaddress"],
				                     record['subject'],
				                     body,
				                     "text/html",
				                     "",
				                     None,
				                     False ,
				                     senderaddress = None,
				                     sendAddress = Constants.FeedbackEmail)

				# build the email message
				email.BuildMessage()
				sender = "%s.%d@prmax.co.uk" % (self._typ, record["researchprojectitemid"])

				# send email and update database
				if not edistctrl.markassent ( record, \
				                              edistctrl.sendemail ( email, sender)):
					log.info ("Failed %d, Thread: %d" % ( record["researchprojectitemid"], thread.get_ident()))
				else:
					log.info ("Processed %d, Thread: %d" % ( record["researchprojectitemid"], thread.get_ident()))
			del email
			del record
			db.Close()