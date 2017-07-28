# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        Data.py
# Purpose:		Data  constants
#
# Author:      Chris Hoy
#
# Created:     01/11/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008
#
#-----------------------------------------------------------------------------
#Customer
Internal_Customer_Id = -1

Customer_Awaiting_Activation = 1
Customer_Active = 2
Customer_Inactive = 3
Customer_Awaiting_Deletion = 4
Customer_Financial_Only = 5

# Oulet Status
Record_Active = 1
Record_Deleted = 2
# freelance
Outlet_Type_Standard = 1
Outlet_Type_Freelance = 19
Outlet_Type_Mp = 41
Outlet_Is_Individual = (Outlet_Type_Freelance,)
# this is using the prmax types
Outlet_Is_Mp = ( 50,51,52,53,54,55,56,57,58,59,60,61,62 )

PRmax_OutletTypeId = 42

project_name_base = "Project"

# Search Types
Search_Type_National = 1
Search_Type_Regional = 2
Search_Type_Local = 3
Search_Type_Business = 4
Search_Type_Consumer = 5
Search_Type_Radio = 6
Search_Type_Tv = 7
Search_Type_Web = 8
Search_Type_Other  = 9
Search_Type_Freelance = 10

Interest_Type_Standard  = 1
Interest_Type_Tag		= 2

Interest_Tag_Root_Name = "Custom Tags"


# audit trail
audit_status_changed 	= 1
audit_payment_started 	= 2
audit_payment_failed 	= 3
audit_payment_complete	= 4
audit_expire_date_changed = 5
audit_logins_changed = 6
audit_email_status_changed = 7
audit_proforma = 8
audit_dd_invoice = 9
audit_dd_csv = 10
audit_dd_rejected = 11
audit_customer_typeid = 12
audit_invoice = 14
audit_credit = 15
audit_adjustment = 16
audit_order_confirmation = 17
audit_order_confirmation_confirmed = 18
audit_trail_seo_free_changed = 19
audit_trail_monitoring_user_count = 20
audit_trail_international = 21
audit_trail_clipping_order_new = 22
audit_trail_clipping_order_change = 23
audit_clipping_order_confirmation = 24
audit_trail_clipping_order_cancel = 25
audit_trail_clipping_order_reactivate = 26

# payment methods
payment_cc  = 1
payment_so  = 2
payment_chq = 3


# geogoraphical view lookup types
Geographical_l_city			= 1
Geographical_l_county 	= 2
Geographical_l_regions 	= 3
Geographical_l_tv				= 4
Geographical_l_metro		= 5


# Cache database

Cache_Display_Outlet	 = 1
Cache_Display_Employee = 2
Cache_Search_List_Standard = 3
Cache_Search_Outlet_Profile = 4
Cache_Search_Outlet_Interests = 5
Cache_Search_Outlet_Coverage = 6
Cache_Search_Outlet_Extra = 7
Cache_Search_Employee_Interests = 8

Cache_Outlet_Objects = ( Cache_Display_Outlet, Cache_Search_Outlet_Profile,
                         Cache_Search_Outlet_Interests, Cache_Search_Outlet_Coverage,
                         Cache_Search_Outlet_Extra)

Cache_Employee_Objects = (Cache_Display_Employee, Cache_Search_Employee_Interests)

# Email queue record type

EmailQueueType_Standard = 1
EmailQueueType_Internal	= 2

Email_Html_And_Plain = 1
Email_Html_Only = 2

Email_Queue_Batch_Size  = 500

PRMax_Base = 1
PRMax_Pro = 2

Vat_Countries = (1,)

# Distribtion Status
Distribution_Draft = 1
Distribution_Sent= 2

# Payment types
Payment_CC = 1
Payment_Cheque = 2
Payment_Bank = 3
Payment_DD = 4
Payment_Credit = 5

# Customer Types
CustomerType_PRmax 				= 1
CustomerType_AIMedia 			= 2
CustomerType_NewsLive			= 3	# Dead
CustomerType_Updatum 			= 4
Customer_Financial_Only 	= 5
CustomerType_KantarMedia 	= 6
CustomerType_Fens 				= 7
CustomerType_IHubbub			= 8
CustomerType_Phoenixpb		= 9
CustomerType_SEO					= 10
CustomerType_BlueBoo			= 15
CustomerType_IPCB					= 16
CustomerType_SolididMedia	= 17
CustomerType_DePerslijst	= 18
CustomerType_MyNewsdesk		= 19
CustomerType_Professional = 20
CustomerType_LevelCert 	 	= 21
CustomerType_StereoTribes = 22
CustomerType_PressData = 23

Customer_Has_Private_Data = (
  CustomerType_PRmax, CustomerType_NewsLive, CustomerType_Updatum,   CustomerType_Fens, CustomerType_KantarMedia, \
  CustomerType_BlueBoo, CustomerType_PressData)

Customer_Token_Login = (CustomerType_AIMedia, CustomerType_KantarMedia, CustomerType_StereoTribes, CustomerType_PressData)


Customer_Is_Partner = (CustomerType_AIMedia, CustomerType_NewsLive,
                       CustomerType_Fens, CustomerType_KantarMedia,
                       CustomerType_IHubbub, CustomerType_Phoenixpb, CustomerType_BlueBoo, CustomerType_StereoTribes)
# User Types
UserType_Standard = 1
UserType_Support = 2

# Interest Types
Employee_Interests_Local = 1
Employee_Interests_Job_Role = 2


#Contact History

Contact_History_Type_Financial = 1
Contact_History_Type_Sales = 2

# Customer Finanncial Status
Customer_Financial_Active = 1
Customer_Financial_Cancelled = 2
Customer_Financial_Renewal_Overdue = 3
Customer_Financial_Payment_Overdue = 4

# Financial Order Status
Financial_Order_Status_A_P_NOT_A 	= 1
Financial_Order_Status_A_P_A 			= 2
Financial_Order_Status_A_DD_NOT_A	= 3
Financial_Order_Status_A_DD_A			= 4
Financial_Order_Status_Completed	= 5
Financial_Order_Status_Not_Going	= 6
Financial_Order_Status_DD_NOT_C		= 7

Financial_Order_Status_Inactive  = (Financial_Order_Status_A_P_NOT_A,
                                    Financial_Order_Status_A_DD_NOT_A,
                                    Financial_Order_Status_Not_Going)


# tasks
TaskType_Trial = 1
TaskType_Renewal = 2

TaskStatus_InProgress = 1
TaskStatus_Suspended = 2
TaskStatus_Completed = 3
TaskStatus_Abandoned = 4
TaskType_Standard = 5

# Email Distribution Status
Distribution_Email_Sent = 0
Distribution_Email_Viewed = 1
Distribution_Email_Waiting = 2
Distribution_Email_Processing = 3
Distribution_Email_No_Email = 4
Distribution_Email_Duplicate = 5
Distribution_Email_Bounced = 6
Distribution_Email_OutofOffice = 7

# Customer Trail Email Status
EmailActionStatus_NoEmails = 5
EmailActionStatus_TrailCreated = 1
EmailActionStatus_PostPeriod = 6

PaymentMethod_Fixed = 1
PaymentMethod_DD = 2
PaymentMethod_StandingOrder = 3
PaymentMethod_Invoice_Advance = 4

isPaymentMethodMonthly = (PaymentMethod_DD, PaymentMethod_StandingOrder)
Lock_Type_Warning = 1


Research_Project_Status_Send_Email  = 1
Research_Project_Status_First_Email_Send = 2
Research_Project_Status_Customer_Completed = 3
Research_Project_Status_Second_Email_Sent = 4
Research_Project_Status_Final_Email_Sent =  5
Research_Project_Status_Research_Completed = 6
Research_Project_Status_No_Response = 7
Research_Project_Status_No_Email  = 8


SEO_Pending  						= 1
SEO_Live 								= 2
SEO_Customer_Withdrawn 	= 3
SEO_PRmax_Withdrawn 		= 4
SEO_Waiting_Payment			= 5

SEO_PaymentType_CC			= 1
SEO_PaymentType_DD			= 2
SEO_PaymentType_PO			= 3
SEO_PaymentType_Sales		= 4
SEO_PaymentType_Beta		= 5

SEO_Status_Pending			= 1
SEO_Status_Live					= 2
SEO_Status_Withdraw_Customer	= 3
SEO_Status_Withdraw_Prmax			= 4

NewsFeed_General = 1
NewsFeed_Advance = 2
NewsFeed_SEO 		 = 3
NewsFeed_Monitor = 4

from datetime import date
Direct_Debit_Expire_Date = date(2020, 12, 31)

OrderConfirmationPayment_CC = 1
OrderConfirmationPayment_SI_GA = 2
OrderConfirmationPayment_SI_NA = 3
OrderConfirmationPayment_DD_SUP_GA = 4
OrderConfirmationPayment_DD_SM_GA = 5
OrderConfirmationPayment_DD_SMM_NA = 6

OrderConfirmationPayment_Allow_Acces = (
  OrderConfirmationPayment_CC,
  OrderConfirmationPayment_SI_GA,
  OrderConfirmationPayment_DD_SUP_GA,
  OrderConfirmationPayment_DD_SM_GA)

OrderConfirmationPayment_Send_Invoice = (
  OrderConfirmationPayment_SI_GA,
  OrderConfirmationPayment_SI_NA
)

OrderConfirmationPayment_Is_DD = (
  OrderConfirmationPayment_DD_SUP_GA,
  OrderConfirmationPayment_DD_SM_GA,
  OrderConfirmationPayment_DD_SMM_NA
)

OrderConfirmationPayment_Is_Fixed_Term = (
  OrderConfirmationPayment_CC,
  OrderConfirmationPayment_SI_GA,
  OrderConfirmationPayment_SI_NA
)

ReasonCode_Questionnaire =  27

Source_Type_Stamm = 5
Source_Type_Nijgh = 6
Source_Type_Usa = 7
Source_Type_Cyberwatch = 8
Source_Type_MediaToolKit = 9
Source_Type_Madaptive = 10
Source_Type_SouthAmerica = 11

Clipping_Status_Unallocated = 1
Clipping_Status_Unprocessed = 2
Clipping_Status_Missing_Outlet = 3
Clipping_Status_Processed = 4


Clipping_Source_Unknown = 3
Clipping_Source_Private = 2
Clipping_Source_IPCB = 1
Clipping_Source_Cyberwatch = 4
Clipping_Source_MediaToolKit = 5
Clipping_Source_Madaptive = 6



