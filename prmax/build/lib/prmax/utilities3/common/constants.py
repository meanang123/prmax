# -*- coding: utf-8 -*-

Search_And = 1
Search_Or = 2

# search Data
Search_Data_Outlet = 0
Search_Data_Employee = 1
Search_Data_Mixed = 2
Search_Data_Advance = 3
Search_Data_Crm = 4
Search_Data_Types = (Search_Data_Outlet, Search_Data_Employee,\
					 Search_Data_Mixed)
Search_Data_Count = 5

#search types
Search_Standard_Type = 1
Search_Standard_Lookup = 2
Search_Standard_Research = 3
Search_Standard_Distribute = 4
Search_Standard_Projects = 5

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


outlet_name = 1
outlet_statusid =2
outlet_frequencyid =3
outlet_circulationid=4
outlet_searchtypeid=5
outlet_interest = 6
outlet_outlettypeid = 23
outlet_countryid = 24

# employee index
employee_contact_employeeid = 10
employee_contact_outletid = 11
employee_employeeid_interestid = 7
employee_outletid_interestid = 8
employee_contactfull_employeeid = 22
employee_outletid_countryid = 27
employee_countryid = 131
employee_contact_ext_employeeid = 133
employee_contactfull_ext_employeeid = 138

# freelance index
freelance_employeeid_interestid = 14
freelance_outletid_interestid = 15
freelance_employee_outletid = 16
freelance_employeeid = 17
freelance_countryid = 25
freelance_employeeid_countryid = 51

# mp index
mp_employeeid_interestid = 18
mp_outletid_interestid = 19
mp_employee_outletid = 20
mp_employeeid = 21
mp_countryid = 26

outlet_coverage = 50

# Search Types
outlet_tel = 100
outlet_email = 101
outlet_profile = 102
outlet_job_role = 119

# employee
employee_tel = 110
employee_email = 111
employee_job_role = 120
employee_prmaxoutlettypeid = 121

# freelance
freelance_tel = 112
freelance_email = 113
freelance_profile = 115


# quick
quick_search_interests = 114
quick_search_email = 117
quick_search_tel = 118
quick_search_countryid = 132

# advance features
advance_search_name = 122
advance_interest = 123
advance_pub_date = 124
advance_outletname = 126
advance_outlettypeid = 127
advance_search_name_outletid = 128

seo_categories = 129
seo_keywords = 130

crm_subject = 134
taken_dates = 135

# next id 139

HIGHEST_INDEX_ID = 138

isListOfKeys = ( outlet_interest, outlet_searchtypeid, outlet_circulationid,
				 outlet_searchtypeid, employee_employeeid_interestid,
				 freelance_employeeid_interestid,mp_employeeid_interestid,
				 quick_search_interests,outlet_coverage, outlet_outlettypeid,
                 outlet_job_role, employee_job_role, employee_prmaxoutlettypeid,
                 advance_pub_date, advance_interest, advance_outlettypeid,
                 outlet_countryid, employee_outletid_countryid, freelance_countryid, freelance_employeeid_countryid, employee_countryid,
                 employee_contact_ext_employeeid, employee_contactfull_ext_employeeid)

Search_Data_IsOutlet = (outlet_name, outlet_statusid, outlet_frequencyid,
	outlet_circulationid, outlet_searchtypeid, outlet_interest,
	employee_contact_outletid, employee_outletid_interestid,
	freelance_outletid_interestid, freelance_employee_outletid,
	mp_outletid_interestid, mp_employee_outletid, outlet_tel,
	outlet_email, outlet_profile,outlet_outlettypeid, outlet_countryid, freelance_countryid)

Search_Extended_Data = (outlet_interest, employee_employeeid_interestid,
                        freelance_employeeid_interestid, mp_employeeid_interestid,
                        outlet_outlettypeid, outlet_job_role, employee_job_role,
                        employee_prmaxoutlettypeid, advance_interest,
                        employee_outletid_countryid, outlet_countryid,freelance_countryid, freelance_employeeid_countryid,employee_countryid )

isEmailAddress = ( employee_email, outlet_email, freelance_email,quick_search_email)
isTelNumber = (freelance_tel, employee_tel, outlet_tel,quick_search_tel)
isProfile = ( outlet_profile, freelance_profile )
isQuickProcedure = (quick_search_countryid, )

FAMILY_INDEX = ( mp_employeeid, employee_contact_employeeid, freelance_employeeid, employee_contactfull_employeeid , freelance_employee_outletid)
FAMILY_OUTLET_INDEX = ( freelance_employee_outletid, mp_employee_outletid, employee_contact_outletid )


index_Add = 1
index_Delete = 2

sleepintervals = 3


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
