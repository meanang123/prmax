# -*- coding: utf-8 -*-
"""QuestionsGeneral"""
#-----------------------------------------------------------------------------
# Name:        questionsgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import session
from sqlalchemy import desc, exists
from prcommon.model.common import BaseSql
from prcommon.model.clippings.questions import Question
from prcommon.model.clippings.questionscope import QuestionScope
from prcommon.model.lookups import QuestionTypes
from prcommon.model.client import Client
from prcommon.model.crm2.issues import Issue
from prcommon.model.clippings.clippingsanalysistemplate import ClippingsAnalysisTemplate
from prcommon.model.clippings.questionanswers import QuestionAnswers
from prcommon.model.clippings.clippingsanalysis import ClippingAnalysis
from ttl.ttlmaths import from_int_ext

from simplejson import loads
import logging
LOGGER = logging.getLogger("prcommon.model")

class QuestionsGeneral(object):
	""" QuestionsGeneral """

	List_Data = """SELECT
	q.questionid,
	q.questiontext,
	qt.questiondescription,
	CASE
    WHEN c.clientname IS NOT NULL THEN c.clientname
    WHEN i.name IS NOT NULL THEN i.name
    END as scopename,
	CASE
    WHEN c.clientname IS NOT NULL THEN u.client_name
    WHEN i.name IS NOT NULL THEN u.issue_description END as scopetype,
	CASE WHEN q.deleted=TRUE THEN 'Deleted' ELSE '' END as has_been_deleted

	FROM userdata.questions AS q
	JOIN internal.questiontypes AS qt ON qt.questiontypeid = q.questiontypeid
	LEFT OUTER JOIN userdata.questionscope AS qs ON q.questionid = qs.questionid AND qs.customerid = :customerid
	LEFT OUTER JOIN userdata.client AS c ON c.clientid = qs.clientid
	LEFT OUTER JOIN userdata.issues AS i ON i.issueid = qs.issueid
	LEFT OUTER JOIN tg_user AS u ON u.user_id = :userid"""

	List_Data_Count = """SELECT COUNT(*) FROM userdata.questions AS q
	JOIN internal.questiontypes AS qt ON qt.questiontypeid = q.questiontypeid
	LEFT OUTER JOIN userdata.questionscope AS qs ON q.questionid = qs.questionid AND qs.customerid = :customerid
	LEFT OUTER JOIN userdata.client AS c ON c.clientid = qs.clientid
	LEFT OUTER JOIN userdata.issues AS i ON i.issueid = qs.issueid"""

	@staticmethod
	def list_by_source(params):
		"""list of clippings for customer"""

		if "customerid" in params:
			whereclause = BaseSql.addclause('', '(q.customerid=:customerid OR q.customerid IS NULL)')

		if "clientid" in params:
			whereclause = BaseSql.addclause(whereclause, 'qs.clientid=:clientid AND q.deleted=false')
			params['clientid'] = int(params['clientid'])

		if "iclientid" in params:
			whereclause = BaseSql.addclause(whereclause, 'q.deleted=false')
			whereclause = BaseSql.addclause(whereclause, '(qs.clientid=:iclientid OR (qs.clientid IS NULL AND qs.issueid IS NULL))')
			whereclause = BaseSql.addclause(whereclause, 'q.questionid NOT IN (select questionid FROM userdata.clippingsanalysistemplate WHERE clientid=:iclientid)')
			params['iclientid'] = int(params['iclientid'])

		if "issueid" in params:
			whereclause = BaseSql.addclause(whereclause, 'qs.issueid=:issueid AND q.deleted=false')
			params['issueid'] = int(params['issueid'])

		if "iissueid" in params:
			whereclause = BaseSql.addclause(whereclause, 'q.deleted=false')
			whereclause = BaseSql.addclause(whereclause, '(qs.issueid=:iissueid OR (qs.clientid IS NULL AND qs.issueid IS NULL))')
			whereclause = BaseSql.addclause(whereclause, 'q.questionid NOT IN (select questionid FROM userdata.clippingsanalysistemplate WHERE issueid=:iissueid)')
			params['iissueid'] = int(params['iissueid'])

		if "questiontext" in params:
			if params["questiontext"]:
				params["questiontext"] = params["questiontext"].replace("*", "") + "%"
			whereclause = BaseSql.addclause(whereclause, 'q.questiontext ILIKE :questiontext')

		if "globalonly" in  params:
			whereclause = BaseSql.addclause(whereclause, 'qs.questionid IS NULL')
			whereclause = BaseSql.addclause(whereclause, 'q.questionid NOT IN (select questionid FROM userdata.clippingsanalysistemplate WHERE issueid IS NULL AND clientid IS NULL AND customerid = :customerid)')


		return BaseSql.get_rest_page_base(
		  params,
		  'questionid',
		  'questiondescription',
		  QuestionsGeneral.List_Data + whereclause + BaseSql.Standard_View_Order,
		  QuestionsGeneral.List_Data_Count + whereclause,
		  Question)

	@staticmethod
	def add_question(params):
		"Add Question"

		clippingsanalysistemplateid = None
		transaction = BaseSql.sa_get_active_transaction()

		try:
			question = Question(
			    questiontypeid=params["questiontypeid"],
			    default_answer_text=params["default_answer_text"],
			    questiontext=params["questiontext"],
			    default_answer_boolean=int(params["default_answer_boolean"]),
			    default_answer_number=params["default_answer_number"],
			    default_answer_currency=params["default_answer_currency"],
			    customerid=params["customerid"]
			)
			session.add(question)
			session.flush()

			# answers

			if "answers" in params:
				answers = loads(params["answers"])
				for answer in answers:
					answerobj = QuestionAnswers(
					  questionid=question.questionid,
					  answertext=answer["answertext"])
					session.add(answerobj)
					if params.get("default_answer_answerid", None) == answer["id"]:
						session.flush()
						question.default_answerid = answerobj.questionanswerid

			# scope
			if params["restrict"] != 1:
				if params["restrict"] == 2:
					params["issueid"] = None
				if params["restrict"] == 3:
					params["clientid"] = None

				questionscope = QuestionScope(
				  questionid=question.questionid,
				  customerid=params["customerid"],
				  clientid=params["clientid"],
				  issueid=params["issueid"])
				session.add(questionscope)

				# add to analysis trail
				if params["clientid"] or params["issueid"]:
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

					ca = ClippingsAnalysisTemplate(
					  questionid=question.questionid,
					  clientid=params["clientid"],
					  issueid=params["issueid"],
					  answer_text=params["default_answer_text"],
					  answer_boolean=int(params["default_answer_boolean"]),
					  answer_number=params["default_answer_number"],
					  answer_currency=params["default_answer_currency"],
					  answer_answerid=params.get("default_answerid", None),
					  sortorder=sortorder
					)
					session.add(ca)
					session.flush()
					clippingsanalysistemplateid = ca.clippingsanalysistemplateid

			transaction.commit()
			return (question.questionid, clippingsanalysistemplateid)
		except:
			LOGGER.exception("add_question")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def get_display_line(questionid):
		"""Display line"""

		question = Question.query.get(questionid)
		questiontype = QuestionTypes.query.get(question.questiontypeid)
		has_been_deleted = 'Deleted' if question.deleted else ''
		scope = session.query(QuestionScope).filter(QuestionScope.questionid == questionid).scalar()
		scopename = ''
		scopetype = ''
		if scope:
			if scope.clientid:
				scopename = session.query(Client.clientname).filter(Client.clientid == scope.clientid).scalar()
				scopetype = 'Client'
			if scope.issueid:
				scopename = session.query(Issue.name).filter(Issue.issueid == scope.issueid).scalar()
				scopetype = 'Issue'

		return dict(questiontext=question.questiontext,
		            questiondescription=questiontype.questiondescription,
		            scopename=scopename,
		            scopetype=scopetype,
		            has_been_deleted=has_been_deleted,
		            questionid=question.questionid)

	@staticmethod
	def remove_question(questionid):
		"Remove Question"

		msg = None
		transaction = BaseSql.sa_get_active_transaction()
		try:
			question = Question.query.get(questionid)
			analysis = session.query(exists().where(ClippingsAnalysisTemplate.questionid == questionid)).scalar()
			answers = session.query(exists().where(ClippingAnalysis.questionid == questionid)).scalar()
			if analysis or answers:
				msg = "Question still in use Marked as Delete"
				question.deleted = True
			else:
				session.query(QuestionScope).filter(QuestionScope.questionid == questionid).delete()
				session.delete(question)

			transaction.commit()
			return msg
		except:
			LOGGER.exception("remove_question")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def question_exists(questiontext, questionid, clientid, issueid, customerid):
		"""Does question already exist?"""

		command = session.query(Question).\
			outerjoin(QuestionScope, QuestionScope.questionid == Question.questionid).\
		  filter(Question.questiontext.ilike(questiontext)).\
		  filter(Question.customerid == customerid)
		if questionid:
			command = command.filter(Question.questionid != questionid)
		if clientid:
			command = command.filter(QuestionScope.clientid == clientid)
		if issueid:
			command = command.filter(QuestionScope.issueid == issueid)

		return True if command.all() else False


	@staticmethod
	def get_question_from_edit(questionid):
		"""get for edit """

		question = Question.query.get(questionid)

		data = dict(questionid=questionid,
		            questiontext=question.questiontext,
		            questiontypeid=question.questiontypeid,
		            default_answerid=question.default_answerid,
		            default_answer_number=question.default_answer_number,
		            default_answer_text=question.default_answer_text,
		            default_answer_boolean=question.default_answer_boolean,
		            default_answer_currency=from_int_ext(question.default_answer_currency),
		            restrict=1,
		            clientid=None,
		            issueid=None)
		questionscope = session.query(QuestionScope).filter(QuestionScope.questionid == questionid).scalar()
		if questionscope:
			if questionscope.clientid:
				data["restrict"] = 2
				data["clientid"] = questionscope.clientid
			if questionscope.issueid:
				data["restrict"] = 3
				data["issueid"] = questionscope.issueid

		return data

	List_Answer_Data = """SELECT a.questionanswerid, a.answertext
	FROM userdata.questionanswers AS a"""

	List_Answer_Data_Count = """SELECT COUNT(*) FROM userdata.questionanswers AS a"""

	@staticmethod
	def answers_list(params):
		"""list of answers for a question """

		if 'questionanswerid' in params:
			whereclause = BaseSql.addclause('', 'a.questionanswerid =:questionanswerid')
			params["questionanswerid"] = int(params["questionanswerid"])

			if "questionid" in params:
				whereclause = BaseSql.addclause(whereclause, 'a.questionid=:questionid AND a.deleted = false')
				params["questionid"] = int(params["questionid"])
		else:
			if "questionid" not in params:
				whereclause = BaseSql.addclause('', 'a.questionid=-1')
			else:
				whereclause = BaseSql.addclause('', 'a.questionid=:questionid AND a.deleted = false')
				params["questionid"] = int(params["questionid"])

		return BaseSql.get_rest_page_base(
		  params,
		  'questionanswerid',
		  'answertext',
		  QuestionsGeneral.List_Answer_Data + whereclause + BaseSql.Standard_View_Order,
		  QuestionsGeneral.List_Answer_Data_Count + whereclause,
		  Question)

	@staticmethod
	def update_question(params):
		"""Update Question """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			question = Question.query.get(params["questionid"])
			question.questiontext = params["questiontext"]

			# scope
			questionscope = session.query(QuestionScope).filter(QuestionScope.questionid == params["questionid"]).scalar()
			if params["restrict"] == 1:
				if questionscope:
					session.delete(questionscope)
			# scope is client
			if params["restrict"] == 2:
				if questionscope:
					questionscope.issueid = None
					questionscope.clientid = params["clientid"]
				else:
					session.add(QuestionScope(questionid=params["questionid"],
					                          clientid=params["clientid"]))
				# delete where context isn't client
				session.query(ClippingsAnalysisTemplate).\
				  filter(ClippingsAnalysisTemplate.questionid == params["questionid"]).\
				  filter(ClippingsAnalysisTemplate.clientid == None).delete()

				clippingsanalysis = session.query(ClippingsAnalysisTemplate).\
					filter(ClippingsAnalysisTemplate.questionid == params["questionid"]).\
					filter(ClippingsAnalysisTemplate.clientid == params["clientid"]).scalar()

			if params["restrict"] == 3:
				if questionscope:
					questionscope.clientid = None
					questionscope.issueid = params["issueid"]
				else:
					session.add(QuestionScope(questionid=params["questionid"],
									                  issueid=params["issueid"]))
				# delete where context isn't issue
				session.query(ClippingsAnalysisTemplate).\
						filter(ClippingsAnalysisTemplate.questionid == params["questionid"]).\
						filter(ClippingsAnalysisTemplate.issueid == None).delete()
				clippingsanalysis = session.query(ClippingsAnalysisTemplate).\
						filter(ClippingsAnalysisTemplate.questionid == params["questionid"]).\
						filter(ClippingsAnalysisTemplate.issueid == params["issueid"]).scalar()

			if params["restrict"] in (2, 3) and clippingsanalysis is None:
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

				ca = ClippingsAnalysisTemplate(
						questionid=params["questionid"],
				    clientid=params["clientid"],
				    issueid=params["issueid"],
				    sortorder=sortorder
				)
				session.add(ca)

			transaction.commit()
		except:
			LOGGER.exception("update_question")
			try:
				transaction.rollback()
			except:
				pass
			raise


	@staticmethod
	def restore_question(params):
		"""Restore Question """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			question = Question.query.get(params["questionid"])
			question.deleted = False
			transaction.commit()
		except:
			LOGGER.exception("restore_question")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def update_question_defaults(params):
		"""Update Defaults """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			question = Question.query.get(params["questionid"])

			question.default_answer_text = params["default_answer_text"]
			question.default_answer_boolean = int(params["default_answer_boolean"])
			question.default_answer_number = params["default_answer_number"]
			question.default_answer_currency = params["default_answer_currency"]
			question.default_answerid = params["default_answer_answerid"]

			transaction.commit()
		except:
			LOGGER.exception("update_question_defaults")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def answer_exists(questionid, questionanswerid, answertext):
		"answer_exists"

		question = session.query(QuestionAnswers).\
		  filter(QuestionAnswers.answertext.ilike(answertext)).\
		  filter(QuestionAnswers.questionanswerid != questionanswerid).\
		  filter(QuestionAnswers.questionid == questionid).scalar()

		return True if question else False


	@staticmethod
	def add_answer(params):
		"add_answer"

		transaction = BaseSql.sa_get_active_transaction()

		try:
			questionanswer = QuestionAnswers(questionid=params["questionid"],
			                                 answertext=params["answertext"])
			session.add(questionanswer)
			session.flush()
			transaction.commit()
			return questionanswer.questionanswerid
		except:
			LOGGER.exception("add_answer")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def rename_answer(params):
		"rename_answer"

		transaction = BaseSql.sa_get_active_transaction()

		try:
			questionanswer = QuestionAnswers.query.get(params["questionanswerid"])
			questionanswer.answertext = params["answertext"]

			transaction.commit()
		except:
			LOGGER.exception("rename_answer")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def get_answer_for_display(questionanswerid):
		"get_answer_for_display"

		questionanswer = QuestionAnswers.query.get(questionanswerid)
		ret_dict = dict(questionanswerid=questionanswer.questionanswerid,
		                answertext=questionanswer.answertext)

		return ret_dict


	@staticmethod
	def answer_delete(params):
		"answer_delete"

		transaction = BaseSql.sa_get_active_transaction()

		try:
			questionanswer = QuestionAnswers.query.get(params["questionanswerid"])
			if session.query(exists().where(ClippingAnalysis.answer_answerid == params["questionanswerid"])).scalar():
				questionanswer.deleted = True
			else:
				session.delete(questionanswer)
			transaction.commit()
		except:
			LOGGER.exception("answer_delete")
			try:
				transaction.rollback()
			except:
				pass
			raise
