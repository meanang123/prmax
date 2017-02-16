define([
	"dojo/_base/declare"
	], function(declare ){
 return declare("prcommon2.prevents",
	null,{
	// An employee has been deleted
	Employee_Deleted : "/employee/deleted",
	// An employees details has been chnaged
	Employee_Updated : "/employee/update",
	// An Item has been added to a seach session
	SearchSession_Added : "/searchsession/add",
	// Search session an item has been deleted
	SearchSession_Deleted : "/searchsession/delete",
	// outlet deleted
	Outlet_Deleted : "/outlet/deleted",
	// outlet updated
	Outlet_Updated : "/outlet/update",
	// Outlet overrides
	Outlet_Overrides : "/outlet/overrides",
	// Search session details have been changed
	SearchSession_Changed : "/searchsession/changed",
	Advance_Session_Changed : "/advance/sessionchanged",

	// display control retry
	Display_Retry : "/display/retry",
	// Employee add
	Employee_Add : "/employee/add",
	// Employee override
	Employee_Override : "/employee/overrides",
	// Display control clear
	Display_Clear :"/display/clear",
	//Load
	Display_Load :"/display/load",
	Display_Name:"/display/name",
	// dilaof events
	Dialog_Close : "/dialog/close",
	//  refresh load`
	Display_ReLoad : "/display/refresh",
	//  view changed
	Display_View_Changed : "/display/chnaged",

	// search partial mactch chnaged
	Search_PartialMatch : "/search/partialmatch",
	// search total option
	Search_Total : "/search/searchtotal",
	// collateral record added
	Collateral_Add : "/collateral/add",

	// Projects
	Project_Add : "/projects/add",
	Project_Update : "/projects/update",
	Project_Delete : "/projects/delete",

	// Lists
	List_Deleted : "/lists/delete",
	List_Add : "/lists/add",

	// users
	User_Added : "/user/added",

	// word html
	Word_Html_Data : "/email.html",

	// geographical
	Geographical_Area_Delete : "/geographical/delete",
	Geographical_Area_Update : "/geographical/update",
	Geographical_Area_Add : "/geographical/add",

	// interests
	Interest_Delete : "/interest/delete",
	Interest_Update : "/interest/update",
	Interest_Add : "/interest/add",

	// Coverage
	Coverage_Moved : "/coverage/moved",

	// Person
	Person_Added : "/person/add",
	Person_Update : "/person/update",
	Person_Delete : "/person/delete",

	// Press Release
	PressReleaseStart : "/pressrelease/start",

	// Contact History
	Crm_Note_Add : "/crm/add",
	Crm_Note_Update : "/crm/update",
	Crm_Note_Delete : "/crm/delete",

	// Payments
	Monthly_Payments : "/payment/taken",

	// Messages
	Message_Sent : "/messages/sent",

	// Generic button Pressed name of button is first  param
	Button_Pressed : "/button/pressed",

	// Features
	Feature_Deleted : "/feature/deleted",
	Feature_Added : "/feature/added",
	Feature_Updated : "/feature/update",

	Feature_List_Add : "/featurelist/add",
	Feature_List_Update : "/featurelist/update",
	Feature_List_Update : "/featurelist/delete",

	// Geographical
	Geographical_Selected : "/geographical/selected",
	// bounced email
	BouncedEmail_Completed : "/events/bouncedcompleted",

	Financial_ReLoad : "/financial/refresh",

	// Publisher
	Publisher_Added : "/publisher/add",
	Publisher_Update : "/publisher/update",
	Publisher_Deleted : "/publisher/deleted",

	// Circulation Sources
	Circulation_Sources_Added : "/circulationsources/add",
	Circulation_Sources_Update : "/circulationsources/update",

	// Circulation Dates
	Circulation_Dates_Added : "/circulationdates/add",
	Circulation_Dates_Update : "/circulationdates/update",
	Circulation_Dates_Deleted : "/circulationdates/deleted",

	// Web Sources
	Web_Sources_Added : "/websources/add",
	Web_Sources_Update : "/websources/update",

	// Web Dates
	Web_Dates_Added : "/webdates/add",
	Web_Dates_Update : "/webdates/update",
	Web_Dates_Deleted : "/webdates/deleted",

	// Production Companies
	Production_Company_Added : "/production/add",
	Production_Company_Update : "/production/update",
	Production_Company_Deleted : "/production/delete",

	Lanquage_Added : "/lang/add",
	Lanquage_Update : "/lang/update",

	//Desk
	Desk_Added : "/desk/add",
	Desk_Updated : "/desk/update",
	Desk_Deleted : "/desk/delete",

	// Maint

	Show_Customer_Main : "/m/show",
	Expire_Date_Changed : "/m/exp",
	Task_Refresh : "/m/t_refresh",

	Employee_Quest_Deleted : "/eq/deleted",
	Employee_Quest_Updated : "/eq/update",
	Employee_Quest_Add : "/eq/add",

	Edit_Notes : "/crm/edit_notes",
	Update_Notes : "crm/notes_updated",

	Task_Add : "/task/add",
	Task_Update : "task/updated",

	Brief_Note_Add: "i/bn/add",
	Brief_Note_Upd: "i/bn/upd"
	});
	});
