# -*- coding: utf-8 -*-
""" Taks controller """
#-----------------------------------------------------------------------------
# Name:        tasks.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     16/06/2014
# Copyright:  (c) 2014

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, ISODateValidatorNull
from ttl.base import stdreturn
from prcommon.model import TasksGeneral, User
from prcommon.model.crm2.tasktypes import TaskType

class TaskAddSchema(PrFormSchema):
	""" schema """
	due_date = ISODateValidatorNull()
	assigntoid = validators.Int()
	taskstatusid = validators.Int()
	tasktypeid = validators.Int()

class TaskUpdateSchema(PrFormSchema):
	""" schema """
	due_date = ISODateValidatorNull()
	assigntoid = validators.Int()
	taskstatusid = validators.Int()
	tasktypeid = validators.Int()
	taskid = validators.Int()

class TaskTypeUpdateSchema(PrFormSchema):
	""" schema """
	tasktypestatusid = validators.Int()
	tasktypeid = validators.Int()

class TaskIdSchema(PrFormSchema):
	"schema"

	taskid = validators.Int()

class TaskController(SecureController):
	""" Task Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def tasks(self, *args, **params):
		""" retrive details about a seopress release """

		return TasksGeneral.list_tasks(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TaskAddSchema(), state_factory=std_state_factory)
	def task_add(self, *args, **params):
		""" add a new client to the system  """

		taskid = TasksGeneral.add(params)

		return stdreturn(data=TasksGeneral.get(taskid, True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def tasktype_add(self, *args, **params):
		""" add a new task type to the system  """

		tasktypeid = TaskType.addtype(params)

		return stdreturn(data=TaskType.get(tasktypeid, True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def get_tasktype(self, *args, **params):
		""" add a new task type to the system  """

		return stdreturn(data=TaskType.get(params["tasktypeid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list_tasktypes(self, *args, **params):
		""" list with all task types """

		return TaskType.list_tasktypes(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TaskTypeUpdateSchema(), state_factory=std_state_factory)
	def tasktype_update(self, *args, **params):
		""" update a task system  """

		TaskType.update(params)

		return stdreturn(data=TaskType.get(params["tasktypeid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TaskUpdateSchema(), state_factory=std_state_factory)
	def task_update(self, *args, **params):
		""" update a task system  """

		TasksGeneral.update(params)

		return stdreturn(data=TasksGeneral.get(params["taskid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TaskIdSchema(), state_factory=std_state_factory)
	def task_get(self, *args, **params):
		""" Get a record """

		return stdreturn(data=TasksGeneral.get(params["taskid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def customer_users(self, *args, **params):
		""" retrive details about a seopress release """

		params["icustomerid"] = params["customerid"]
		return User.getDataGridPage(params)

	@expose(template="mako:prmax.templates.display.task_source_view")
	@validate(validators=TaskIdSchema(), state_factory=std_state_factory)
	def task_source_view(self, *args, **params):
		"Task Soutrce view "

		return dict(data=TasksGeneral.get_source(params["taskid"]))

