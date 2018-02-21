dojo.provide("prcommon.prcommonobjects");

// This contains all the data object that the system uses

// Display control object for display pane
//  Contacts
function Constants() {}
Constants.prototype.Search_grid_markall = 0 ;
Constants.prototype.Search_grid_invertmarks = 1 ;
Constants.prototype.Search_grid_clear = 2 ;
Constants.prototype.Search_grid_clear_appended = 3 ;
Constants.prototype.Search_grid_mark_appended = 4 ;
Constants.prototype.PRMAX_Base = 1 ;
Constants.prototype.PRMAX_Pro = 2 ;
Constants.prototype.Freelance = 19;

// Events
function PREvents() {}
// An employee has been deleted
PREvents.prototype.Employee_Deleted = "/employee/deleted";
// An employees details has been chnaged
PREvents.prototype.Employee_Updated = "/employee/update";
// An Item has been added to a seach session
PREvents.prototype.SearchSession_Added = "/searchsession/add";
// Search session an item has been deleted
PREvents.prototype.SearchSession_Deleted = "/searchsession/delete";
// outlet deleted
PREvents.prototype.Outlet_Deleted = "/outlet/deleted";
// outlet updated
PREvents.prototype.Outlet_Updated = "/outlet/update";
// Outlet overrides
PREvents.prototype.Outlet_Overrides = "/outlet/overrides";
// Search session details have been changed
PREvents.prototype.SearchSession_Changed = "/searchsession/changed";
PREvents.prototype.Advance_Session_Changed = "/advance/sessionchanged";

// display control retry
PREvents.prototype.Display_Retry = "/display/retry";
// Employee add
PREvents.prototype.Employee_Add = "/employee/add";
// Employee override
PREvents.prototype.Employee_Override = "/employee/overrides";
// Display control clear
PREvents.prototype.Display_Clear ="/display/clear";
//Load
PREvents.prototype.Display_Load ="/display/load";
// dilaof events
PREvents.prototype.Dialog_Close = "/dialog/close";
//  refresh load`
PREvents.prototype.Display_ReLoad = "/display/refresh";
//  view changed
PREvents.prototype.Display_View_Changed = "/display/chnaged";

// search partial mactch chnaged
PREvents.prototype.Search_PartialMatch = "/search/partialmatch";
// search total option
PREvents.prototype.Search_Total = "/search/searchtotal";
// collateral record added
PREvents.prototype.Collateral_Add = "/collateral/add";

// Projects
PREvents.prototype.Project_Add = "/projects/add";
PREvents.prototype.Project_Update = "/projects/update";
PREvents.prototype.Project_Delete = "/projects/delete";

// Lists
PREvents.prototype.List_Deleted = "/lists/delete";
PREvents.prototype.List_Add = "/lists/add";

// users
PREvents.prototype.User_Added = "/user/added";

// word html
PREvents.prototype.Word_Html_Data = "/email.html";

// geographical
PREvents.prototype.Geographical_Area_Delete = "/geographical/delete";
PREvents.prototype.Geographical_Area_Update = "/geographical/update";
PREvents.prototype.Geographical_Area_Add = "/geographical/add";

// interests
PREvents.prototype.Interest_Delete = "/interest/delete";
PREvents.prototype.Interest_Update = "/interest/update";
PREvents.prototype.Interest_Add = "/interest/add";

// Coverage
PREvents.prototype.Coverage_Moved = "/coverage/moved";

// Person
PREvents.prototype.Person_Added = "/person/add";
PREvents.prototype.Person_Update = "/person/update";
PREvents.prototype.Person_Delete = "/person/delete";

// Press Release
PREvents.prototype.PressReleaseStart = "/pressrelease/start";

// Contact History
PREvents.prototype.Crm_Note_Add = "/crm/add";
PREvents.prototype.Crm_Note_Update = "/crm/update";
PREvents.prototype.Crm_Note_Delete = "/crm/delete";

// Payments
PREvents.prototype.Monthly_Payments = "/payment/taken";

// Messages
PREvents.prototype.Message_Sent = "/messages/sent";

// Generic button Pressed name of button is first  param
PREvents.prototype.Button_Pressed = "/button/pressed";

// Features
PREvents.prototype.Feature_Deleted = "/feature/deleted";
PREvents.prototype.Feature_Added = "/feature/added";
PREvents.prototype.Feature_Updated = "/feature/update";

PREvents.prototype.Feature_List_Add = "/featurelist/add";
PREvents.prototype.Feature_List_Update = "/featurelist/update";
PREvents.prototype.Feature_List_Update = "/featurelist/delete";

// Geographical
PREvents.prototype.Geographical_Selected = "/geographical/selected";
// bounced email
PREvents.prototype.BouncedEmail_Completed = "/events/bouncedcompleted";

PREvents.prototype.Financial_ReLoad = "/financial/refresh";

// Maint

PREvents.prototype.Show_Customer_Main = "/m/show";
PREvents.prototype.Expire_Date_Changed = "/m/exp";
PREvents.prototype.Task_Refresh = "/m/t_refresh";

PREvents.prototype.Edit_Notes = "/crm/edit_notes";
PREvents.prototype.Update_Notes ="crm/notes_updated";

PREvents.prototype.Issue_Add ="issue/add";
PREvents.prototype.Issue_Update = "issue/update";
PREvents.prototype.Issue_Delete = "issue/delete";

PREvents.prototype.Task_Add = "/task/add";
PREvents.prototype.Task_Update = "task/updated";

PREvents.prototype.Document_Add = "/document/add";
PREvents.prototype.Document_Update = "/document/update";
PREvents.prototype.Document_Deleted = "document/delete";

PRCOMMON.Events = new PREvents();
PRCOMMON.Constants = new Constants();
