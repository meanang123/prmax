# -*- coding: utf-8 -*-
"""AnalyseGeneral"""
#-----------------------------------------------------------------------------
# Name:        analysegeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from types import ListType
import logging
from turbogears.database import session
from sqlalchemy import desc
from prcommon.model.common import BaseSql
from prcommon.model.clippings.clippingsanalysistemplate import ClippingsAnalysisTemplate
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.questions import Question
from prcommon.model.clippings.clippingsanalysis import ClippingAnalysis
from prcommon.model.clippings.questionanswers import QuestionAnswers
from prcommon.model.clippings.clippingsissues import ClippingsIssues
from prcommon.model.crm2.issues import Issue
from prcommon.model.queues import ProcessQueue
from prcommon.model.client import Client
from prcommon.model.lookups import QuestionTypes
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

class AnalyseGeneral(object):
	""" AnalyseGeneral """

	List_Data = """SELECT
	cat.clippingsanalysistemplateid,
	q.questiontext,
	qt.questiondescription
	FROM userdata.clippingsanalysistemplate AS cat
	JOIN userdata.questions AS q ON q.questionid = cat.questionid
	JOIN internal.questiontypes AS qt ON qt.questiontypeid = q.questiontypeid """

	List_Data_Count = """SELECT COUNT(*)
	FROM userdata.clippingsanalysistemplate AS cat
	JOIN userdata.questions AS q ON q.questionid = cat.questionid
	JOIN internal.questiontypes AS qt ON qt.questiontypeid = q.questiontypeid"""

	List_Data_OrderBy = """ORDER BY cat.sortorder ASC"""

	@staticmethod
	def list_by_source(params):
		"""list of clippings for customer"""

		whereclause = ''
		if "clientid" in params:
			whereclause = BaseSql.addclause(whereclause, 'cat.clientid=:clientid AND q.deleted=false')
			params['clientid'] = int(params['clientid'])

		if "issueid" in params:
			whereclause = BaseSql.addclause(whereclause, 'cat.issueid=:issueid AND q.deleted=false')
			params['issueid'] = int(params['issueid'])

		if not whereclause:
			whereclause = BaseSql.addclause('', 'cat.clientid=-1')

		params["sortfield"] = "cat.sortorder"
		params["direction"] = "asc"

		return BaseSql.get_rest_page_base(
		  params,
		  'clippingsanalysistemplateid',
		  'sortorder',
		  AnalyseGeneral.List_Data + whereclause + BaseSql.Standard_View_Order,
		  AnalyseGeneral.List_Data_Count + whereclause,
		  ClippingsAnalysisTemplate)

	@staticmethod
	def get_display_line(clippingsanalysistemplateid):
		"""Display line"""

		clippingsanalysistemplate = ClippingsAnalysisTemplate.query.get(clippingsanalysistemplateid)
		question = Question.query.get(clippingsanalysistemplate.questionid)
		questiontype = QuestionTypes.query.get(question.questiontypeid)

		return dict(questiontext=question.questiontext,
		            questiondescription=questiontype.questiondescription,
		            clippingsanalysistemplateid=clippingsanalysistemplateid)


	@staticmethod
	def remove_question(clippingsanalysistemplateid):
		"Remove question"

		transaction = BaseSql.sa_get_active_transaction()

		try:
			clippingsanalysistemplate = ClippingsAnalysisTemplate.query.get(clippingsanalysistemplateid)
			session.delete(clippingsanalysistemplate)

			transaction.commit()
		except:
			LOGGER.exception("remove_question")
			try:
				transaction.rollback()
			except:
				pass
			raise


	@staticmethod
	def get_analyse_view_info(clippingid):
		"""Get anslysis list """

		analysis = []
		clip = Clipping.query.get(clippingid)

		if clip.clientid:
			headingadded = False

			command = session.query(ClippingsAnalysisTemplate, Question).\
			  join(Question, ClippingsAnalysisTemplate.questionid == Question.questionid).\
			  filter(ClippingsAnalysisTemplate.clientid == clip.clientid).\
			  order_by(ClippingsAnalysisTemplate.sortorder)

			for row in command.all():
				if headingadded is False:
					analysis.append(AnalysisRowHeader(session.query(Client.clientname).filter(Client.clientid == clip.clientid).scalar()))
					headingadded = True

				analysis.append(
				  AnalysisRowView(row[1],
				                  row[0],
				                  session.query(ClippingAnalysis).\
				                  filter(ClippingAnalysis.questionid == row[1].questionid).\
				                  filter(ClippingAnalysis.clippingid == clippingid).\
				                  filter(ClippingAnalysis.clientid == clip.clientid).all(),
				                  session.query(QuestionAnswers).\
				                  filter(QuestionAnswers.questionid == row[1].questionid).\
				                  filter(QuestionAnswers.deleted == False).all()
				                ))
		# find issues
		for issue in session.query(ClippingsIssues).filter(ClippingsIssues.clippingid == clippingid):
			headingadded = False
			command = session.query(ClippingsAnalysisTemplate, Question).\
				join(Question, ClippingsAnalysisTemplate.questionid == Question.questionid).\
				filter(ClippingsAnalysisTemplate.issueid == issue.issueid).\
			  order_by(ClippingsAnalysisTemplate.sortorder)

			for row in command.all():
				if headingadded is False:
					analysis.append(AnalysisRowHeader(session.query(Issue.name).filter(Issue.issueid == issue.issueid).scalar()))
					headingadded = True

				analysis.append(
					AnalysisRowView(row[1],
						              row[0],
						              session.query(ClippingAnalysis).\
						              filter(ClippingAnalysis.questionid == row[1].questionid).\
						              filter(ClippingAnalysis.clippingid == clippingid).\
				                  filter(ClippingAnalysis.issueid == issue.issueid).all(),
						              session.query(QuestionAnswers).\
						              filter(QuestionAnswers.questionid == row[1].questionid).\
				                  filter(QuestionAnswers.deleted == False).all()
						              ))

		return dict(analytics=analysis, clippingid=clippingid)

	@staticmethod
	def update(params):
		"""Update Analsysis"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			clip = Clipping.query.get(params["clippingid"])

			# fix the checkbox/multiple answer question to 0
			# code following will pick up checked ones

			for c_answer in session.query(ClippingAnalysis).\
					join(Question, Question.questionid == ClippingAnalysis.questionid).\
			    filter(ClippingAnalysis.clippingid == clip.clippingid).\
					filter(Question.questiontypeid.in_((1, 6))).all():
				c_answer.answer_boolean = 0

			# process sent back status

			for item in params.iteritems():
				if item[0].startswith("an_"):
					coding = item[0].split(":")
					clippingsanalysistemplateid = int(coding[0][3:])
					answer_answerid = None
					if len(coding) > 1:
						answer_answerid = int(coding[1])

					#
					clippingsanalysistemplate = ClippingsAnalysisTemplate.query.get(clippingsanalysistemplateid)
					question = Question.query.get(clippingsanalysistemplate.questionid)

					# now find the answer
					command = session.query(ClippingAnalysis).filter(ClippingAnalysis.questionid == clippingsanalysistemplate.questionid).\
					  filter(ClippingAnalysis.clippingid == clip.clippingid).\
					  filter(ClippingAnalysis.clientid == clippingsanalysistemplate.clientid).\
					  filter(ClippingAnalysis.issueid == clippingsanalysistemplate.issueid)

					# multiple answers for the same question
					if answer_answerid:
						command = command.filter(ClippingAnalysis.answer_answerid == answer_answerid)

					answer = command.scalar()
					if not answer:
						answer = ClippingAnalysis(
						  clippingid=params["clippingid"],
						  questionid=clippingsanalysistemplate.questionid,
						  clientid=clippingsanalysistemplate.clientid,
						  issueid=clippingsanalysistemplate.issueid,
						  answer_answerid=answer_answerid)
						session.add(answer)
						session.flush()


					# check box
					if question.questiontypeid == 1:
						answer.answer_boolean = 1 if item[1] == 'on' else 0
					# answer from a list
					elif question.questiontypeid == 2:
						try:
							if isinstance(item[1], ListType):
								for selection in item[1]:
									try:
										answer.answer_answerid = int(selection)
										break
									except ValueError:
										# try next item
										pass
							else:
								try:
									answer.answer_answerid = int(item[1])
								except ValueError:
									pass
						except TypeError:
							answer.answer_answerid = None
					# text answer
					elif question.questiontypeid == 3:
						answer.answer_text = item[1]
					# number answer
					elif question.questiontypeid == 4:
						answer.answer_number = int(item[1])
					# curremcy answer
					elif question.questiontypeid == 5:
						answer.answer_currency = float(item[1])
					# check answer for multiple
					elif question.questiontypeid == 6:
						answer.answer_boolean = 1 if item[1] == 'on' else 0

			clip.clippingsstatusid = Constants.Clipping_Status_Processed

			session.flush()
			session.add(ProcessQueue(
				processid=Constants.Process_Clipping_View,
				objectid=clip.clippingid))
			transaction.commit()
		except:
			LOGGER.exception("quuestion_answer_update")
			try:
				transaction.rollback()
			except:
				pass
			raise


	@staticmethod
	def add_question_to_analysis(params):
		"""Add a question to the Analsysis"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			command = session.query(ClippingsAnalysisTemplate.sortorder)
			if params["clientid"]:
				command = command.filter(ClippingsAnalysisTemplate.clientid == params["clientid"])

			if params["issueid"]:
				command = command.filter(ClippingsAnalysisTemplate.issueid == params["issueid"])

			sortorder = command.order_by(desc(ClippingsAnalysisTemplate.sortorder)).limit(1).scalar()
			if not sortorder:
				sortorder = 1
			else:
				sortorder += 1

			cat = ClippingsAnalysisTemplate(
				questionid=params["questionid"],
				clientid=params["clientid"],
				issueid=params["issueid"],
				sortorder=sortorder
			)
			session.add(cat)
			session.flush()
			transaction.commit()
			return cat.clippingsanalysistemplateid
		except:
			LOGGER.exception("add_question_to_analysis")
			try:
				transaction.rollback()
			except:
				pass
			raise


class AnalysisRowBase(object):
	def __init__(self, _row_type=None):
		self._row_type = _row_type

	@property
	def row_type(self):
		return self._row_type

	@row_type.setter
	def row_type(self, value):
		self._row_type = value

class AnalysisRowView(AnalysisRowBase):
	def __init__(self, question, def_question, answer, answers):
		self._question = question
		self._def_question = def_question
		if len(answer) == 1:
			self._answer = answer[0]
		else:
			self._answer = answer

		# question answers
		self._answers = answers
		self._answers_dict = {}
		if answers:
			for answerobj in answers:
				self._answers_dict[answerobj.questionanswerid] = answerobj

		AnalysisRowBase.__init__(self, 1)

	@property
	def question(self):
		return self._question

	@property
	def answers(self):
		return self._answers


	@property
	def def_analysis(self):
		return self._def_question

	def get_answer(self, context=None):
		# checkbox
		if self.question.questiontypeid == 1:
			if self._answer and self._answer.answer_boolean != None:
				return "checked" if self._answer.answer_boolean else ""
			return "checked" if self._question.default_answer_boolean == 1 else ""
		# select
		elif self.question.questiontypeid == 2:
			if self._answer and self._answer.answer_answerid == context.questionanswerid:
				return "checked"
			return ""
		# text
		elif self.question.questiontypeid == 3:
			if self._answer and self._answer.answer_text != None:
				return self._answer.answer_text
			return self._question.default_answer_text if self._question.default_answer_text != None else ""
		# number
		elif self.question.questiontypeid == 4:
			if self._answer and self._answer.answer_number != None:
				return self._answer.answer_number
			return self._question.default_answer_number if self._question.default_answer_number != None else ""
		# currency
		elif self.question.questiontypeid == 5:
			if self._answer and self._answer.answer_currency != None:
				return self._answer.answer_currency
			return self._question.default_answer_currency if self._question.default_answer_currency != None else ""
		# mutliple check answer
		elif self.question.questiontypeid == 6:
			for answer in self._answer:
				if context.questionanswerid == answer.answer_answerid:
					return "checked" if answer.answer_boolean else ""
			return ""

		return None

	def get_answer_display(self, context=None):
		# checkbox
		if self.question.questiontypeid == 1:
			if self._answer and self._answer.answer_boolean != None:
				return "Yes" if self._answer.answer_boolean else "No"
			return "Yes" if self._question.default_answer_boolean != None else "No"
		# select
		elif self.question.questiontypeid == 2:
			for answer in self._answers:
				if self._answer and self._answer.answer_answerid == self._answer.answer_answerid:
					return answer.answertext
			return ""
		# text
		elif self.question.questiontypeid == 3:
			if self._answer and self._answer.answer_text != None:
				return self._answer.answer_text
			return self._question.default_answer_text if self._question.default_answer_text != None else ""
		# number
		elif self.question.questiontypeid == 4:
			if self._answer and self._answer.answer_number != None:
				return self._answer.answer_number
			return self._question.default_answer_number if self._question.default_answer_number != None else ""
		# currency
		elif self.question.questiontypeid == 5:
			if self._answer and self._answer.answer_currency != None:
				return "%.2f" % self._answer.answer_currency
			return "%.2f" % self._question.default_answer_currency if self._question.default_answer_currency != None else ""
		# mutliple check answer
		elif self.question.questiontypeid == 6:
			for answer in self._answer:
				if context.questionanswerid == answer.answer_answerid:
					data = "Yes" if answer.answer_boolean else "No "
					return data + " - " + self._answers_dict[context.questionanswerid].answertext

			return ""

		return ""

class AnalysisRowHeader(AnalysisRowBase):
	def __init__(self, header):
		self._header = header
		AnalysisRowBase.__init__(self, 2)

	@property
	def header(self):
		return self._header
