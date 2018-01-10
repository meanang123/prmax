# -*- coding: utf-8 -*-
from turbogears.database import get_engine, create_session

get_engine()
create_session()

from prmaxmodel.md_Common import fixValue, getValue, ParamCtrl
from prmaxmodel.md_Lookups import CustomerStatus, Frequencies, \
	 OutletSearchType, PRmaxOutletTypes, SortOrder, \
     CustomerPaymentTypes, PaymentMethods

from prmaxmodel.md_Identity import Preferences
from prcommon.model import Visit, VisitIdentity, User, Group, \
     Permission, Customer, PRMaxAdmin, CustomerView

from prmaxmodel.admin import CustomerExternal, PaymentSystem, \
	 PrmaxCustomerInfo, DemoRequests
from prmaxmodel.md_Search import UserSession, Search, Searching
from prmaxmodel.SearchSession import SearchSession, PrmaxCommon
from prmaxmodel.md_Logging import ActionLog
from prmaxmodel.md_Interests import  Interests, OutletInterestView, \
     EmployeeInterestView
from prmaxmodel.md_Indexs import SetIndex, IndexerQueue
from prmaxmodel.md_Contact import Contact, Employee, \
	 EmployeeInterests, EmployeeDisplay
from prcommon.model import Address, Communication
from prmaxmodel.md_Outlet import Outlet, Freelance, OutletAltTitle, \
     OutletCoverageView, OutletCoverage, OutletInterests
from prmaxmodel.md_Display import Display, OutletDisplay
from prmaxmodel.md_Caching import CacheQueue,  CacheStore
from prmaxmodel.md_List import List, ListMembers
from prmaxmodel.projects import ProjectMember, Project, ProjectCollateral
from prcommon.model import Report, ReportTemplate
from prmaxmodel.emails import EmailQueue, EmailTemplates, EmailTemplateList, \
     ListMemberDistribution
from prmaxmodel.collateral import Collateral, ECollateral, \
	 CollateralSpaceException
from prcommon.model.internal import AuditTrail, HelpTree, Labels, Terms, \
	 NbrOfLogins, CustomerProtex, CustomerPayments, PRMaxSettings
from prmaxmodel.accounting import Accounting
from prmaxmodel.Geographical import GeographicalLookup, \
     GeographicalLookupTypes, Geographical, GeographicalLookupView
from prmaxmodel.roles import PRMaxRoles, PRMaxRolesWords
from prmaxmodel.queues import WordToHtml

from prmaxmodel.dataimport import DataImport
from prmaxmodel.research import ReasonCodes, Activity, IgnorePrnEmployees, \
     IgnorePrnOutlets, ReasonCategories, IgnorePrnContacts, ActivityDetails, \
     ResearchDetails, ResearchFrequencies, ResearchGeneral

from prmaxmodel.crm import ContactHistorySources, ContactHistory, Task

from prcommon.model import UserView, InterestGroups, Countries, OutletTypes, \
     CustomerAllocation

__all__ = ["Visit", "CustomerStatus", "VisitIdentity", "User", "Group",
	   "Permission","ActionLog","Customer","SearchSession","SearchType",
	   "UserSession","InterestGroups","Search","SetIndex","OutletSearchType"
	   "Frequencies","Contact","Address","Communication"
	   "Employee","Outlet","getValue","fixValue","Display","Interests",
	   "Searching","OutletDisplay","CacheQueue",  "CacheStore",
	   "ParamCtrl","EmployeeDisplay","PrmaxCommon","ListMembers",
	   "ProjectMember", "Project", "Report" , "Preferences", "Freelance",
	   "OutletInterestView", "EmployeeInterests", "EmailQueue",
	   "GeographicalLookup", "IndexerQueue", "OutletTypes", "HelpTree",
	   "Labels", "Terms", "PaymentSystem", "NbrOfLogins", "CustomerProtex",
	   "CustomerPayments", "Collateral",  "EmailTemplates", "OutletAltTitle",
	   "PRMaxSettings", "CollateralSpaceException", "PrmaxCustomerInfo" ,
	   "ProjectMember", "Project", "ProjectCollateral", "PRMaxRoles",
	   "PRMaxRolesWords", "DemoRequests", "CustomerView" ,
     "PRmaxOutletTypes", "WordToHtml", "Accounting",
     "DataImport", "GeographicalLookupView", "OutletCoverageView",
     "OutletCoverage","ReasonCodes", "Activity", "IgnorePrnEmployees",
     "IgnorePrnOutlets", "ReasonCategories", "IgnorePrnContacts",
     "ActivityDetails", "ResearchDetails", "ResearchFrequencies",
     "EmailTemplateList", "OutletInterests", "ContactHistorySources",
     "ContactHistory", "PaymentMethods","InterestGroups",
     "ResearchGeneral", "ListMemberDistribution", "Countries", "OutletTypes",
     "CustomerAllocation"
	]
