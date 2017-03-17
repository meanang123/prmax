# -*- coding: utf-8 -*-
"""synchronise parent children employees"""
#-----------------------------------------------------------------------------
# Name:        employeesynchronise.py
# Purpose:
# Author:      
# Created:     10/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
import logging
from turbogears.database import session
from sqlalchemy.sql import text
from prcommon.model.outlet import Outlet, OutletProfile
from prcommon.model.outlets.outletdesk import OutletDesk
from prcommon.model.communications import Communication, Address
from prcommon.model.employee import Employee, EmployeeInterests, EmployeeInterestView, EmployeePrmaxRole
from prcommon.model.contact import Contact
from prcommon.model.research import ResearchDetails
import prcommon.Constants as Constants
from datetime import datetime


from ttl.model import BaseSql

LOGGER = logging.getLogger("prcommon")

class EmployeeSynchronise(object):
	""" EmployeesSynchronise  """

	def __init__(self, childoutlet, intrans=False):
		self._childoutlet = childoutlet
		self._intrans = intrans
		
	def synchronise_employees(self):

		if not self._intrans:
			transaction = BaseSql.sa_get_active_transaction()		

		try:
			
			self.check_childoutlet_com_address()
			
			child_employees = session.query(Employee).filter(Employee.outletid == self._childoutlet.outletid).all()
			parent_employees = session.query(Employee).\
		        filter(Employee.outletid == self._childoutlet.seriesparentid).\
		        filter(Employee.prmaxstatusid != 2).\
		        filter(Employee.customerid == -1).all()
			
			for parent_emp in parent_employees:
				sync_emp = session.query(Employee).\
			        filter(Employee.synchroniseid == parent_emp.employeeid).\
			        filter(Employee.outletid == self._childoutlet.outletid).scalar()
				if not sync_emp:
					self.add_employee(parent_emp)
				else:
					self.check_update_employee(parent_emp, sync_emp)
					
			#set primary employee to child outlet		
			self.set_primary_employee()
					
			#delete employees of child outlet that are not present in parent outlet
			parentids = [row.employeeid for row in parent_employees]
			for child in child_employees:
				if child.synchroniseid not in parentids:
					self.delete_employee(child)
			
			self.update_researchdetails()

			if not self._intrans:					
				transaction.commit()
			
		except:
			LOGGER.exception("synchronise_employees")
			if not self._intrans:
				transaction.rollback()
			raise
		
	def check_childoutlet_com_address(self):

		parent_outlet = Outlet.query.get(self._childoutlet.seriesparentid)
		parent_com = Communication.query.get(parent_outlet.communicationid)
		parent_address = session.query(Address). \
		    filter(Address.addressid == parent_com.addressid).scalar()

		child_outlet = Outlet.query.get(self._childoutlet.outletid)
		child_com = Communication.query.get(child_outlet.communicationid)
		child_address = session.query(Address). \
		    filter(Address.addressid == child_com.addressid).scalar()

		self.update_childoutlet_address(parent_address, child_address, parent_com, child_com)
		self.update_childoutlet_communication(parent_com, child_com)
		
	def update_childoutlet_communication(self, parent_com, child_com):
		if parent_com.tel != child_com.tel or \
		   parent_com.fax != child_com.fax :
			session.execute(text("UPDATE communications SET tel = :tel, fax = :fax WHERE communicationid = :communicationid"),\
			                {'tel': parent_com.tel, 'fax': parent_com.fax, 'communicationid':child_com.communicationid}, Communication)								

	def update_childoutlet_address(self, parent_address, child_address, parent_com, child_com):
		if not parent_address:
			parent_address = Address(address1 = '',
					          address2 = '',
					          county = '',
					          postcode = '',
					          townname = '')
			session.add(parent_address)
			session.flush()
			session.execute(text("UPDATE communications SET addressid = :addressid WHERE communicationid = :communicationid"),\
			                {'addressid': parent_address.addressid, 'communicationid':parent_com.communicationid}, Communication)			

		if not child_address:
			child_address = Address(address1 = '',
					          address2 = '',
					          county = '',
					          postcode = '',
					          townname = '')
			session.add(child_address)
			session.flush()
			session.execute(text("UPDATE communications SET addressid = :addressid WHERE communicationid = :communicationid"),\
			                {'addressid': child_address.addressid, 'communicationid':child_com.communicationid}, Communication)			
			
		if parent_address.address1 != child_address.address1 or \
		   parent_address.address2 != child_address.address2 or \
		   parent_address.townname != child_address.tonwname or \
		   parent_address.county != child_address.county or \
		   parent_address.postcode != child_address.postcode: 
			session.execute(text("UPDATE addresses SET address1 = :address1, address2 = :address2, townname = :townname, county = :county, postcode = :postcode WHERE addressid = :addressid"),\
			                {'address1': parent_address.address1, 'address2': parent_address.address2, 'townname': parent_address.townname, 'county': parent_address.county, \
			                 'postcode': parent_address.postcode, 'addressid':child_address.addressid}, Address)
			
	def update_researchdetails(self):
		last_sync = datetime.now()
		session.execute(text("UPDATE research.researchdetails SET last_sync = :last_sync, researchfrequencyid = :researchfrequencyid WHERE outletid = :outletid"),\
		                {'last_sync': last_sync, 'researchfrequencyid': 1, 'outletid':self._childoutlet.outletid}, Outlet)
		
			
	def check_update_employee(self, parent_emp, employee):
		
		try:
			self.check_contact(parent_emp, employee)
			self.check_desk(parent_emp, employee)
			self.update_jobroles(parent_emp,employee)
			self.update_interests(parent_emp,employee)
			self.check_jobtitle(parent_emp, employee)
		except:
			LOGGER.exception("employee_update")
			raise

	def set_primary_employee(self):
		parent_outlet = session.query(Outlet).filter(Outlet.outletid == self._childoutlet.seriesparentid).scalar()
		child_primary = session.query(Employee).\
			join(Outlet, Outlet.outletid == Employee.outletid).\
		    filter(Employee.outletid == self._childoutlet.outletid).\
		    filter(Employee.employeeid == Outlet.primaryemployeeid).scalar()

		if parent_outlet.primaryemployeeid != child_primary.synchroniseid:
			new_child_primary = session.query(Employee).\
			    filter(Employee.outletid == self._childoutlet.outletid).\
			    filter(Employee.synchroniseid == parent_outlet.primaryemployeeid).scalar()
			session.execute(text("UPDATE outlets SET primaryemployeeid = :primaryemployeeid WHERE outletid = :outletid"),\
			                {'primaryemployeeid': new_child_primary.employeeid, 'outletid':self._childoutlet.outletid}, Outlet)
			
	def check_contact(self, parent_emp, employee):
		if parent_emp.contactid != employee.contactid:
			session.execute(text("UPDATE employees SET contactid = :contactid WHERE employeeid = :employeeid"),\
			                {'contactid': parent_emp.contactid, 'employeeid':employee.employeeid}, Employee)
			
	def check_desk(self, parent_emp, employee):
		desk = self.get_desk(parent_emp)
		if desk:
			session.execute(text("UPDATE employees SET outletdeskid = :outletdeskid WHERE employeeid = :employeeid"),\
			                {'outletdeskid': desk.outletdeskid, 'employeeid':employee.employeeid}, Employee)
			
	def check_jobtitle(self, parent_emp, employee):
		if parent_emp.job_title != employee.job_title:
			session.execute(text("UPDATE employees SET job_title = :job_title WHERE employeeid = :employeeid"),\
			                {'job_title': parent_emp.job_title, 'employeeid':employee.employeeid}, Employee)

	def update_jobroles(self, parent_emp, employee):
		dbroles = {}
		existing_jobroles = session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employee.employeeid).all()
		parent_jobroles = [row.prmaxroleid for row in session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == parent_emp.employeeid ).all()]
	
		# do deletes
		for role in existing_jobroles:
			dbroles[role.prmaxroleid] = True
			if not role.prmaxroleid in parent_jobroles:
				session.delete(role)
				
		for roleid in parent_jobroles:
			if not roleid in dbroles:
				role = EmployeePrmaxRole(
					employeeid = employee.employeeid,
					outletid = employee.outletid,
					prmaxroleid = roleid)
				session.add(role)
				session.flush()
				
	def update_interests(self, parent_emp, employee):
		dbinterest = []
		existing_interests = session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == employee.employeeid).all()
		parent_interests = [row.interestid for row in session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == parent_emp.employeeid).all()]

		# do deletes
		for employeeinterest in existing_interests:
			dbinterest.append(employeeinterest.interestid)
			if not employeeinterest.interestid in parent_interests:
				session.delete(employeeinterest)
				
		for interestid in parent_interests:
			if not interestid in dbinterest:
				interest = EmployeeInterests(
					employeeid = employee.employeeid,
					interestid = interestid,
					customerid = employee.customerid,
					outletid = employee.outletid,
					interesttypeid = Constants.Interest_Type_Tag)
				session.add(interest)
				session.flush()
				
	def delete_employee(self, employee):
		transaction = session.begin(subtransactions=True)
		try:
			session.execute(text("SELECT employee_research_force_delete(:employeeid)"), {'employeeid':employee.employeeid}, Employee)
			transaction.commit()
		except:
			LOGGER.exception("synchronise_employee_delete")
			transaction.rollback()
			raise				
				
	def add_employee(self, employee):	
		if employee.contactid:
			contact = Contact.query.get(employee.contactid)
		else:
			contact = None				
		com = Communication.query.get(employee.communicationid)
		desk = self.get_desk(employee)

		sync_emp = Employee(outletid = self._childoutlet.outletid,
	                       contactid = contact.contactid if contact else None,
	                       communicationid = com.communicationid,
	                       synchroniseid = employee.employeeid,
	                       job_title = employee.job_title,
	                       outletdeskid = desk.outletdeskid if desk else None,
	                       sourcetypeid = 2,
	                       isprimary = employee.isprimary
	                       )
		session.add(sync_emp)
		session.flush()
		
#		self.check_isprimary(employee, sync_emp)

		#add roles to new employee
		employee_roles = session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employee.employeeid).all()
		employee_roles2 = {}
		if employee_roles:
			for row in employee_roles:
				employee_roles2[row.prmaxroleid] = True
				sync_emp_role = EmployeePrmaxRole(employeeid = sync_emp.employeeid,
			                                     prmaxroleid = row.prmaxroleid
			                                     )
				session.add(sync_emp_role)
				session.flush()
				
		#add interests to new employee
		employee_interests = session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == employee.employeeid).all()
		if employee_interests:
			for row in employee_interests:
				interest_exist = session.query(EmployeeInterests).\
			        filter(EmployeeInterests.employeeid == sync_emp.employeeid).\
			        filter(EmployeeInterests.interestid == row.interestid).scalar()
				if not interest_exist:
					sync_emp_interest = EmployeeInterests(employeeid = sync_emp.employeeid,
				                                         interestid = row.interestid,
				                                         outletid = row.outletid
				                                         )
					session.add(sync_emp_interest)
					session.flush()
					
	def get_desk(self, employee):
		deskname = session.query(OutletDesk.deskname).filter(OutletDesk.outletdeskid == employee.outletdeskid).scalar()
		desk = session.query(OutletDesk).\
		    filter(OutletDesk.outletid == self._childoutlet.outletid).\
		    filter(OutletDesk.deskname == deskname).scalar()
		return desk
