# -*- coding: utf-8 -*-
"""Model"""
#-----------------------------------------------------------------------------
# Name:        __init__.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:	   06/08/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------

from prcommon.model.identity import UserView, User, Customer, Visit, VisitIdentity, Group, Permission, CustomerView, UserGroups, \
     UserDefaultCountries
from prcommon.model.interests import Interests, OutletInterestView, EmployeeInterestView, InterestGroups
from prcommon.model.interestsresearch import InterestsResearch

from prcommon.model.messages import MessageTypes, MessageUser
from prcommon.model.common import BaseSql, RunInTransaction
from prcommon.model.query import AdHocQuery, QueryHistory
from prcommon.model.session import UserSession, UserSessionImage
from prcommon.model.logintokens import LoginTokens
from prcommon.model.lookups import CustomerTypes, UserTypes, SortOrder, Frequencies, PRmaxOutletTypes, AdvanceFeaturesStatus, \
     FinancialStatus, PaymentReturnReason, Months, Years, DaysOfMonth, CustomerOrderStatus, VatCodes, Countries, \
     OutletTypes, CustomerStatus, OutletSearchType, CustomerPaymentTypes, PaymentMethods, AdjustmentsTypes, TaskStatus, PrmaxModules, \
     CustomerSources, CountryTypes, OrderConformationPaymentMethods, ResearchProjectStatus, SEOCategories, SEOStatus, SeoPaymentTypes, \
     NewsFeedTypes, UnSubscribeReason, OutletPrices, EmailSendTypes, IssueStatus, ContactHistoryStatus, QuestionTypes, \
     ClippingPriceServiceLevel, ClippingStatus, ClippingSource, DistributionTemplateTypes, ClippingsTypes, ClippingsTone, MediaAccessTypes, \
     CustomerProducts, TaskTypeStatus, ServerTypes, ChartView, DateRanges, GroupBy, DashboardSettingsMode, DashboardSettingsStandard, \
     DashboardSettingsStandardSearchBy, Sourcetypes, DeletionHistoryType

from prcommon.model.list import List, ListMembers, ExclusionList

from prcommon.model.internal import AuditTrail, Terms, NbrOfLogins, \
     CustomerProtex, CustomerPayments, Cost, HelpTree, Labels, LabelRows, \
     PRMaxSettings, SourceType, CustomerInvoice, \
     CustomerAllocation, Adjustments, LockedObject

from prcommon.model.communications import Communication, Address
from prcommon.model.admin import CustomerExternal, PRMaxControl, PRMaxAdmin, PriceCode
from prcommon.model.report import Report, ReportTemplate
from prcommon.model.caching import CacheStoreList, CacheQueue, CacheStore, CacheProfile, CachePreBuildPageStore

from prcommon.model.advance import AdvanceFeature, AdvanceFeatureInterests, \
     AdvanceFeatureInterestsView, AdvanceFeatureResearch, AdvanceFeatureResultView,\
     AdvanceFeaturesList, AdvanceFeaturesListMembers, AdvanceListUser

from prcommon.model.geographical import GeographicalLookup, GeographicalLookupView, \
     GeographicalLookupTypes, Geographical, GeographicalTree, \
     GeographicalLookupCascade, Continents


from prcommon.model.research import ReasonCodes, Activity, ActivityDetails, IgnorePrnEmployees, \
     IgnorePrnOutlets, ResearchControRecord, ReasonCategories, IgnorePrnContacts, \
     ResearchDetails, ResearchFrequencies, ResearchGeneral, BouncedEmails, DataSourceTranslations, ResearchDetailsDesk

from prcommon.model.crm import ContactHistorySources, ContactHistory, Task, TaskTags

from prcommon.model.employee import EmployeeRoles, Employee, EmployeeRoleView, EmployeeDisplay, \
     EmployeeInterests, EmployeeCustomer, EmployeeCustomerView, \
     EmployeePrmaxRole

from prcommon.model.contact import Contact

from prcommon.model.outlet import OutletCoverage, OutletCoverageView, Outlet, OutletAltTitle, \
     Freelance, OutletInterests, OutletCustomer, OutletCustomerView
from prcommon.model.outletlanguages import OutletLanguages

from prcommon.model.outlets.outletdesk import OutletDesk
from prcommon.model.outlets.outletdeskgeneral import OutletDeskGeneral

from prcommon.model.searchsession import SearchSession, PrmaxCommon

from prcommon.model.indexer import SetIndex, IndexerQueue, StandardIndexerInternal

from prcommon.model.emails import EmailQueue, Collateral, EmailTemplates, EmailTemplateList, \
     ListMemberDistribution, EmailTemplatesAttachements

from prcommon.model.projects import Project, ProjectMember, ProjectCollateral

from prcommon.model.roles import PRMaxRoleSynonymsView, PRMaxRoleSynonyms, PRMaxRoles, \
     PRMaxRolesWords, PRMaxRoleInterests, PRMaxRoleInterestsView

from prcommon.model.collateral import Collateral, ECollateral, CollateralIntgerests, CollateralSpaceException, ForwardCache

from prcommon.model.queues import WordToHtml, ProcessQueue

from prcommon.model.seopressreleases import SEORelease, SEOReleaseInterests, SEOCache, SEOSite, SEOImage

from prcommon.model.researchprojects.projects import ResearchProjects, ResearchProjectItems, ResearchProjectChanges
from prcommon.model.researchprojects.projectgeneral import ProjectGeneral

from prcommon.model.client import Client

from prcommon.model.newsfeed import NewsFeed

from prcommon.model.newsroom.newsroom import VirtualNewsRoom
from prcommon.model.newsroom.clientnewsroom import ClientNewsRoom
from prcommon.model.newsroom.clientnewsroomimage import ClientNewsRoomImage
from prcommon.model.newsroom.clientnewsroomcustumlinks import ClientNewsRoomCustumLinks
from prcommon.model.newsroom.clientnewsroomcontactdetails import ClientNewsRoomContactDetails

from prcommon.model.sales.prospect import Prospect
from prcommon.model.sales.unsubscribe import UnSubscribe
from prcommon.model.sales.prospectarchive import ProspectArchive
from prcommon.model.sales.prospectcompany import ProspectCompany
from prcommon.model.sales.mailinglist import MailingList
from prcommon.model.sales.mailing import Mailing
from prcommon.model.sales.prospectsources import ProspectSource
from prcommon.model.sales.prospecttypes import ProspectType
from prcommon.model.sales.prospectregions import ProspectRegion

from prcommon.model.outletgeneral import OutletGeneral

from prcommon.model.publisher import Publisher
from prcommon.model.circulationsources import CirculationSources
from prcommon.model.circulationdates import CirculationDates
from prcommon.model.websources import WebSources
from prcommon.model.webdates import WebDates
from prcommon.model.productioncompany import ProductionCompany
from prcommon.model.language import Languages
from prcommon.model.outlettooutlets import OutletToOutlets
from prcommon.model.general.profilecache import ProfileCache
from prcommon.model.outletprofile import OutletProfile

from prcommon.model.partners.comeval import ComEval

from prcommon.model.questionnaires.questionnairesgeneral import QuestionnairesGeneral
from prcommon.model.researchprojects.projectemails import ProjectEmails
from prcommon.model.subjects import Subject, SubjectInterest

from prcommon.model.customer.customerdatasets import CustomerPrmaxDataSets
from prcommon.model.customer.customergeneral import CustomerGeneral
from prcommon.model.prrequests import PRRequest
from prcommon.model.prrequestgeneral import PRRequestGeneral

from prcommon.model.crmgeneral import PRNotesGeneral

from prcommon.model.apis.search import ApiSearch
from prcommon.model.apis.lookups import ApiLookups

from prcommon.model.researchext.researcherdetails import ResearcherDetails

from prcommon.model.crm2.issues import Issue
from prcommon.model.crm2.issuehistory import IssueHistory
from prcommon.model.crm2.issuesgeneral import IssuesGeneral
from prcommon.model.crm2.contacthistorytypes import ContactHistoryTypes
from prcommon.model.crm2.contacthistoryissues import ContactHistoryIssues
from prcommon.model.crm2.contacthistorygeneral import ContactHistoryGeneral
from prcommon.model.crm2.tasksgeneral import TasksGeneral
from prcommon.model.crm2.tasktypes import TaskType
from prcommon.model.crm2.contacthistoryhistory import ContactHistoryHistory
from prcommon.model.usergeneral import UserGeneral
from prcommon.model.crm2.contacthistoryuserdefine import ContactHistoryUserDefine
from prcommon.model.crm2.contacthistoryresponses import ContactHistoryResponses

from prcommon.model.crm2.documentsgeneral import DocumentsGeneral
from prcommon.model.crm2.briefingnotesstatus import BriefingNotesStatus
from prcommon.model.crm2.briefingnotesgeneral import BriefingNotesGeneral

from prcommon.model.customer.unsubscribegeneral import UnsubscribeGeneral
from prcommon.model.crm2.customersolidmedia import CustomerSolidMedia
from prcommon.model.crm2.customersolidmediaprofiles import CustomerSolidMediaProfiles
from prcommon.model.crm2.solidmediageneral import SolidMediaGeneral
from prcommon.model.crm2.statements import Statements
from prcommon.model.solidmedia.solidsearch import SolidSearch

from prcommon.model.postgreslock import PostGresLockManager

from prcommon.model.accounts.customeraccountsdetails import CustomerAccountsDetails
from prcommon.model.accounts.salescoding import SalesCoding
from prcommon.model.datafeeds.stamm import StammImport
from prcommon.model.datafeeds.nijgh import NijghImport
from prcommon.model.datafeeds.datafeedsgeneral import DataFeedsGeneral

from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.questions import Question
from prcommon.model.clippings.questionscope import QuestionScope
from prcommon.model.clippings.clippingsprices import ClippingsPrices
from prcommon.model.clippings.clippingsorder import ClippingsOrder
from prcommon.model.clippings.clippingsordercountry import ClippingsOrderCountry
from prcommon.model.clippings.clippingsorderlanguage import ClippingsOrderLanguage
from prcommon.model.clippings.clippingsordertype import ClippingsOrderType
from prcommon.model.clippings.clippingsanalysis import ClippingAnalysis
from prcommon.model.clippings.clippingsissues import ClippingsIssues
from prcommon.model.clippings.clippingsanalysistemplate import ClippingsAnalysisTemplate
from prcommon.model.clippings.clippingimport import ClippingsImport
from prcommon.model.clippings.clippingordergeneral import ClippingsOrderGeneral
from prcommon.model.clippings.clippinggeneral import ClippingsGeneral
from prcommon.model.clippings.clippingscache import ClippingCache
from prcommon.model.clippings.analysegeneral import AnalyseGeneral
from prcommon.model.clippings.analyseglobal import AnalyseGlobal
from prcommon.model.clippings.clippingstype import ClippingsType
from prcommon.model.mediatoolkit.mediatoolkitaccess import MediaToolKitAccess
from prcommon.model.madaptive.madaptiveaccess import MadaptiveAccess
from prcommon.model.clippings.output.clippingsreport import ClippingsReport
from prcommon.model.clippings.clippingschartgeneral import ClippingsChartGeneral
from prcommon.model.clippings.dashboardsettingsgeneral import DashboardSettingsGeneral
#from prcommon.model.customer.customeremailserver import CustomerEmailServer
from prcommon.model.emailserver import EmailServer

from prcommon.model.researchext.outletexternallinks import OutletExternalLink
from prcommon.model.researchext.outletexternallinkgeneral import OutletExternalLinkGeneral

from prcommon.model.clippings.questiongeneral import QuestionsGeneral

from prcommon.model.customer.customersettings import CustomerSettings
from prcommon.model.journorequests.journorequestsgeneral import JournoRequestsGeneral

from prcommon.model.distribution.distributiontemplates import DistributionTemplates
from prcommon.model.distribution.generaldistributiontemplates import GeneralDistributionTemplates
from prcommon.model.cyberwatch.clippingscyberwatch import ClippingsCyberWatch

from prcommon.model.newsroom.newsrooms import Newsrooms
from prcommon.model.dataclean.dataclean import DataClean

from prcommon.model.customer.customeraccesslog import CustomerAccessLog

from prcommon.model.prmax_outlettypes import Prmax_Outlettypes

__all__ = ["UserView", "Interests", "OutletInterestView", "EmployeeInterestView", "InterestGroups", "BaseSql", "MessageTypes",
           "MessageUser", "AdHocQuery", "User", "UserSession", "RunInTransaction", "LoginTokens", "CustomerTypes", "UserTypes",
           "SortOrder", "Customer", "List", "ListMembers", "Visit", "VisitIdentity", "Group", "Permission", "AuditTrail", "Terms",
           "NbrOfLogins", "CustomerProtex", "CustomerPayments", "Cost", "HelpTree", "Labels", "LabelRows", "PRMaxSettings",
           "SourceType", "Communication", "Address", "Outlet", "CustomerExternal", "Report", "ReportTemplate", "QueryHistory",
           "AdvanceFeature", "AdvanceFeatureInterests", "AdvanceFeatureInterestsView", "AdvanceFeatureResearch",
           "GeographicalLookup", "GeographicalLookupView", "GeographicalLookupTypes", "Geographical", "GeographicalTree",
           "GeographicalLookupCascade", "Frequencies", "PRmaxOutletTypes", "OutletCoverage", "ReasonCodes", "Activity",
           "ActivityDetails", "IgnorePrnEmployees", "IgnorePrnOutlets", "ResearchControRecord", "ReasonCategories",
           "IgnorePrnContacts", "ResearchDetails", "ResearchFrequencies", "ResearchGeneral", "CustomerView", "AdvanceFeaturesStatus",
           "FinancialStatus", "PRMaxControl", "PaymentReturnReason", "AdvanceListUser", "Months", "Years", "DaysOfMonth",
           "CustomerOrderStatus", "ContactHistorySources", "ContactHistory", "Task", "PRMaxAdmin", "VatCodes", "Countries",
           "CustomerAllocation", "EmployeeRoles", "Employee", "EmployeeRoleView", "EmployeeDisplay", "EmployeeInterests", "EmployeeCustomer",
           "EmployeeCustomerView", "Contact", "OutletCoverageView", "SearchSession", "PrmaxCommon", "EmailQueue", "Collateral",
           "EmailTemplates", "EmailTemplateList", "ListMemberDistribution", "SetIndex", "IndexerQueue", "OutletTypes",
           "CustomerStatus", "OutletSearchType", "CustomerPaymentTypes", "PaymentMethods", "OutletAltTitle", "Freelance",
           "OutletInterests", "OutletCustomer", "OutletCustomerView", "Project", "ProjectMember", "ProjectCollateral",
           "Collateral", "ECollateral", "CollateralIntgerests", "PRMaxRoleSynonymsView", "PRMaxRoleSynonyms", "PRMaxRoles",
           "PRMaxRolesWords", "PRMaxRoleInterests", "PRMaxRoleInterestsView", "WordToHtml", "CollateralSpaceException", "AdjustmentsTypes",
           "Adjustments", "TaskStatus", "TaskType", "PriceCode", "PrmaxModules", "CustomerSources", "CustomerProducts","TaskTags", "UserGroups", "ExclusionList",
           "LockedObject", "OrderConformationPaymentMethods", "ResearchProjects", "ResearchProjectItems", "ResearchProjectStatus",
           "SEORelease", "SEOReleaseInterests", "SEOCache", "SEOSite", "SEOCategories", "Client", "SEOImage", "SEOStatus",
           "SeoPaymentTypes", "NewsFeed", "NewsFeedTypes", "VirtualNewsRoom", "ClientNewsRoom", "ComEval", "UserSessionImage",
           "ClientNewsRoomImage", "ClientNewsRoomCustumLinks", "Prospect", "UnSubscribe", "ProspectArchive", "ProspectCompany",
           "MailingList", "Mailing", "UnSubscribeReason", "ProspectRegion", "InterestsResearch", "Publisher", "OutletGeneral",
           "ProcessQueue", "CacheProfile", "CirculationSources", "CirculationDates", "WebSources", "WebDates", "OutletPrices", "Languages", "ProductionCompany",
           "OutletToOutlets", "ProfileCache", "ProjectGeneral", "OutletProfile", "EmployeePrmaxRole", "QuestionnairesGeneral",
           "ResearchProjectChanges", "ProjectEmails", "EmailSendTypes", "OutletDesk", "StandardIndexerInternal",
           "OutletLanguages", "Subject", "SubjectInterest", "CustomerPrmaxDataSets", "Continents", "PRNotesGeneral",
           "CustomerGeneral", "PRRequest", "PRRequestGeneral", "IssueStatus", "Issue", "IssuesGeneral",
           "ContactHistoryTypes", "ContactHistoryStatus", "UserGeneral", "ContactHistoryIssues", "ContactHistoryGeneral",
           "TasksGeneral", "IssueHistory", "ContactHistoryHistory", "ContactHistoryUserDefine", "DocumentsGeneral",
           "UnsubscribeGeneral", "CustomerSolidMedia", "CustomerSolidMediaProfiles", "SolidMediaGeneral", "SolidSearch",
           "PostGresLockManager", "CustomerAccountsDetails", "SalesCoding", "StammImport", "DataSourceTranslations",
           "DataFeedsGeneral", "QuestionTypes", "Clipping", "Question", "ClippingPriceServiceLevel", "ClippingsPrices", "ClippingsType","ClippingsOrderCountry",
           "ClippingsOrder", "ClippingsOrderLanguage","ClippingStatus", "ClippingAnalysis", "ClippingsIssues", "ClippingsAnalysisTemplate", "ClippingsImport",
           "ClippingsOrderGeneral", "OutletExternalLink", "CachePreBuildPageStore", "OutletExternalLinkGeneral", "ClippingsGeneral",
           "ClippingCache", "QuestionsGeneral", "AnalyseGeneral", "ClippingsReport", "NijghImport", "CustomerSettings",
           "JournoRequestsGeneral", "ForwardCache", "ResearchDetailsDesk", "DistributionTemplates", "ClippingsCyberWatch",
           "OutletDeskGeneral", "GeneralDistributionTemplates", "DistributionTemplateTypes", "MediaToolKitAccess", "MadaptiveAccess",
           "CustomerAccessLog", "ClippingsChartGeneral", "DashboardSettingsGeneral", "ClippingsTypes", "ClippingsTone", "MediaAccessTypes", "ApiSearch",
           "ApiLookups", "TaskTypeStatus", "ServerTypes", "CustomerEmailServer", "EmailHeader", "EmailFooter", "EmailLayout",
           "AnalyseGlobal", "Statements", "EmailServer"
           ,"Newsrooms", "Prmax_Outlettypes"
					 ]
