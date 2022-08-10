require({cache:{
'url:control/customer/options/templates/details.html':"<div class=\"common_prmax_layout\">\r\n<br/>\r\n\t<table style=\"width:100%;border-collapse:collapse;\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr><td class=\"prmaxrowtag\">Name</td><td class=\"prmaxrowdisplay\" data-dojo-attach-point=\"displayname\"></td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Customer Source</td><td data-dojo-attach-point=\"customersourcedescription\"></td></tr>\r\n\r\n\t\t<tr><td class=\"prmaxrowtag\">Status</td><td>\r\n\t\t\t<select data-dojo-attach-point=\"statusid\" data-dojo-props=\"autoComplete:true,labelType:'html'\" data-dojo-type=\"dijit/form/FilteringSelect\"></select>\r\n\t\t\t<button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='label:\"Change Status\"' data-dojo-attach-point=\"statusidbutton\" data-dojo-attach-event=\"onClick:_ChangeStatus\"></button>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Customer type</td><td>\r\n\t\t\t<select data-dojo-attach-point=\"customertypeid\" data-dojo-props=\"autoComplete:true,labelType:'html'\" data-dojo-type=\"dijit/form/FilteringSelect\"></select>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_CustomerType\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Set Customer Type\",type:\"button\"' ></button>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Expire Date</td>\r\n\t\t\t<td><div style=\"display:inline\" class=\"prmaxrowtag\" data-dojo-attach-point=\"expire_display\"></div>&nbsp;\r\n\t\t\t\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Set Expire Date\",type:\"button\"' data-dojo-attach-event=\"onClick:_SetExpireDate\" ></button>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Concurrent Count</td><td>\r\n\t\t\t<form data-dojo-attach-point=\"setusercountform\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"logins\"' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"logins\" >\r\n\t\t\t\t<button data-dojo-attach-point=\"setusercount\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Set User Count\",type:\"submit\"' ></button>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">User Name Count</td><td>\r\n\t\t\t<form data-dojo-attach-point=\"setupernamecount\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"nbrofusersaccounts\"' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"nbrofusersaccounts\" >\r\n\t\t\t\t<button data-dojo-attach-point=\"setusercount\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Set User Name Count\",type:\"submit\"'></button>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Collateral Limit</td><td>\r\n\t\t\t<form data-dojo-attach-point=\"collaterallimitform\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"collateral_size\"' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"collateral_size\" >\r\n\t\t\t\t<button data-dojo-attach-point=\"collateral_sizecollateral_size_btn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Set Collateral Size\",type:\"submit\"'></button>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Email Day Limit</td><td>\r\n\t\t\t<form data-dojo-attach-point=\"emaillimitform\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"max_emails_for_day\"' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"max_emails_for_day\" >\r\n\t\t\t\t<button data-dojo-attach-point=\"email_limit_btn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Set Email Day Limit\",type:\"submit\"'></button>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\">Demo Status</td><td>\r\n\t\t\t<form data-dojo-attach-point=\"demoaccountform\"  onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<table style=\"width:100%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" width=\"20%\">Core</td><td align=\"left\"><input data-dojo-props='type:\"text\",name:\"demo\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"demoaccount_check\"></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\">Features</td><td><input data-dojo-props='type:\"text\",name:\"isadvancedemo\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"isadvancedemo\"></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\">Monitoring</td><td><input data-dojo-props='type:\"text\",name:\"ismonitoringdemo\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"ismonitoringdemo\"></td></tr>\r\n\t\t\t\t\t<tr><td></td><td><button data-dojo-attach-point=\"demoaccountset\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Change Demo Status\",type:\"submit\"'></button>\r\n\t\t\t\t\t<button data-dojo-attach-point=\"reactive_demo\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Re-Activate Demo\",type:\"button\",\"class\":\"prmaxhidden\"' data-dojo-attach-event=\"onClick:_ReActiveDemo\" ></button></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Email Enabled</td><td>\r\n\t\t\t<form data-dojo-attach-point=\"emailenabledform\"  data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"useemail\",value:\"1\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"useemail_check\">\r\n\t\t\t\t<label> Email Test Mode</label>\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"emailistestmode\",value:\"1\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"emailistestmode_check\">\r\n\t\t\t\t<button data-dojo-attach-point=\"useemailset\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Change Email Status\",type:\"submit\"'></button>\r\n\t\t\t</form>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Is Internal Account</td><td>\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"isinternal\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"isinternal\">\r\n\t\t\t\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Change Internal Status\",type:\"button\"' data-dojo-attach-event=\"onClick:_ChangeInternalStatus\"></button>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Delete Account</td>\r\n\t\t\t<td><button data-dojo-attach-point=\"deleteaccount\" data-dojo-attach-event=\"onClick: _DeleteAccount\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Delete Account\",type:\"button\"' ></button></td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\">Modules</td><td>\r\n\t\t\t<table>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Professional</td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"is_bundle\" data-dojo-props='name:\"is_bundle\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"_bundle_settings\"></td><td></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Features</td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"advancefeatures\" data-dojo-props='name:\"advancefeatures\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\" ></td><td></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Crm</td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"crm\" data-dojo-props='name:\"crm\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">International Data</td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"has_international_data\" data-dojo-props='name:\"has_international_data\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td class=\"prmaxrowtag\" align=\"right\">Monitoring</td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"updatum\" data-dojo-props='name:\"updatum\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_CheckLayout\" ></td>\r\n\t\t\t\t\t<td><table width=\"100%\" data-dojo-attach-point=\"max_users_monitoring\" class=\"prmaxhidden\"><tr><td class=\"prmaxrowtag\">Max Logins</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"maxmonitoringusers\",type:\"text\"' data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-attach-point=\"maxmonitoringusers\" ></td></tr></table></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">News Room's</td>\r\n\t\t\t\t<td><input data-dojo-attach-point=\"has_news_rooms\" data-dojo-props='name:\"has_news_rooms\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\"></td><td></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">SEO</td>\r\n\t\t\t\t<td><input data-dojo-attach-point=\"seo\" data-dojo-props='name:\"seo\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Journo Requests</td>\r\n\t\t\t\t<td><input data-dojo-attach-point=\"has_journorequests\" data-dojo-props='name:\"has_journorequests\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Clippings</td>\r\n\t\t\t\t<td><input data-dojo-attach-point=\"has_clippings\" data-dojo-props='name:\"has_clippings\",type:\"checkBox\",value:true' data-dojo-type=\"dijit/form/CheckBox\" ></td>\r\n\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_UpdateModules\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Update Modules\",type:\"button\"' ></button></td></tr>\r\n\t\t\t</table></td>\r\n\t\t</tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Support User</td><td>\r\n\t\t\t\t<select data-dojo-attach-point=\"support_userid\" data-dojo-props=\"autoComplete:true,searchAttr:'name',labelType:'html',required:true\" data-dojo-type=\"dijit/form/FilteringSelect\" ></select>\r\n\t\t\t\t<button data-dojo-props='\"class\":\"prmaxbutton\",type:\"button\",label:\"Set Support User to Customer\"' data-dojo-attach-event=\"onClick:_SetCustomer\" data-dojo-type=\"dijit/form/Button\"></button>\r\n\t\t</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">SEO Free Qty</td>\r\n\t\t\t<td class=\"prmaxrowtag\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_SetSeoCount\" data-dojo-props='label:\"Set SEO Free Count\"'></button></td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Extended Email Subject</td><td>\r\n\t\t\t\t<input data-dojo-props='type:\"text\",name:\"has_extended_email_subject\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"has_extended_email_subject\">\r\n\t\t\t\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='label:\"Change Extended Subject\",type:\"button\"' data-dojo-attach-event=\"onClick:_change_extended_subject\"></button>\r\n\t\t</td></tr>\r\n\t</table>\r\n<div data-dojo-attach-point=\"expirectrl\" data-dojo-type=\"control/customer/options/SetExpireDate\" ></div>\r\n<div data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Re-Activate Demo\"' data-dojo-attach-point=\"reactiveatedialog\">\r\n\t<div data-dojo-attach-point=\"reactiveatectrl\" data-dojo-type=\"control/customer/options/ReActivateDemo\"></div>\r\n</div>\r\n<div data-dojo-type=\"control/customer/options/SetFreeSEOCount\" data-dojo-attach-point=\"seofree\"></div>\r\n\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    details.js
// Author:
// Purpose:
// Created: March 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("control/customer/options/details", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/details.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",	
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/NumberTextBox",
	"dojox/form/BusyButton",
	"dijit/form/CheckBox",
	"control/customer/options/SetExpireDate",
	"control/customer/options/ReActivateDemo",
	"control/customer/options/SetFreeSEOCount"],
	function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.details",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()	
	{

		this._customersourceid =  new ItemFileReadStore ( { url:"/common/lookups?searchtype=customersources"});
		this._clippingsourceid = new ItemFileReadStore ( { url:"/common/lookups?searchtype=clippingsource&nofilter=1"});
		this._statusid  = new ItemFileReadStore	( {url:"/common/lookups?searchtype=customerstatus"});
		
		this._ChangeStatusResponseCall = lang.hitch(this,this._ChangeStatusResponse);
//		this._LoadCustomerCall = lang.hitch(this,this._LoadCustomer);
//		this._UpdateUserPasswordResponseCall = lang.hitch(this,this._UpdateUserPasswordResponse);
//		this._UpdateUserDetailsResponseCall = lang.hitch ( this , this._UpdateUserDetailsResponse);
//		this._EmailResponseCall = lang.hitch(this,this._EmailResponse);
		this._SetUserCountResponseCall = lang.hitch(this,this._SetUserCountResponse);
		this._ChangeDemoStatusResponseCall = lang.hitch(this,this._ChangeDemoStatusResponse);
		this._ChangeEmailStatusResponseCall = lang.hitch(this,this._ChangeEmailStatusResponse);
//		this._CustomerSaveResponseCall = lang.hitch(this,this._CustomerSaveResponse);
//		this._LoadUserCall = lang.hitch(this, this._LoadUser);
		this._DeleteAccountResponseCall = lang.hitch(this,this._DeleteAccountResponse);
//		this._DeleteUserResponseCall = lang.hitch(this,this._DeleteUserResponse);
//		this._UnlockUserResponseCall = lang.hitch(this,this._UnlockUserResponse);
		this._SetUserNameCountResponseCall = lang.hitch(this,this._SetUserNameCountResponse);
//		this._UserLoggedOffCallBack = lang.hitch(this,this._UserLoggedOffCall);
//		this._UpdatedCustomerTypeCallBack = lang.hitch(this,this._UpdatedCustomerTypeCall);
		this._UpdatedInternalStatusCallBack = lang.hitch(this, this._UpdatedInternalStatusCall);
		this._SetCustomerCallBack = lang.hitch(this, this._SetCustomerCall);
//		this._LoadCustomer2CallBack = lang.hitch(this, this._LoadCustomer2Call);
//		this._UpdateUpdatumCallBack = lang.hitch(this, this._UpdateUpdatumCall);
		this._change_extended_subject_call_back = lang.hitch(this,this._change_extended_subject_call);

		this.user_model = new ItemFileReadStore ({url:'/customer/users_support'});

		
	},
	postCreate: function()
	{
		this.customertypeid.set("store", PRCOMMON.utils.stores.Customer_Types());
		this.statusid.set("store", this._statusid);
		this.support_userid.set("store", this.user_model);


		dojo.connect(this.setusercountform, "onSubmit", dojo.hitch(this,this._SetUserCount));
		dojo.connect(this.setupernamecount, "onSubmit", dojo.hitch(this,this._SetUserNameCount));
		dojo.connect(this.demoaccountform, "onSubmit", dojo.hitch(this,this._ChangeDemoStatus));
		dojo.connect(this.emailenabledform, "onSubmit", dojo.hitch(this,this._ChangeEmailStatus));
		dojo.connect(this.collaterallimitform, "onSubmit", dojo.hitch(this,this._Set_Collateral_Limit));
		dojo.connect(this.emaillimitform, "onSubmit", dojo.hitch(this,this._set_email_day_limit));

	
		this.inherited(arguments);	
	},
	_SetExpireDate:function( response )
	{
		this.expirectrl.Load( this._customerid ) ;
	},
	_CustomerType:function()
	{
		if ( confirm("Change Customer Type"))
		{
			request.post ('/customer/update_customertypeid',
				utilities2.make_params({ data : {customerid:this._customer.customerid, customertypeid:this.customertypeid.get("value")}})).then
				(this._UpdatedCustomerTypeCallBack);
		}
	},
	_ChangeStatus:function()
	{
		request.post ('/customer/changestatus',
			utilities2.make_params({ data : {customerid:this._customer.customerid, customerstatusid:this.statusid.get("value")}})).then
			(this._ChangeStatusResponseCall);	
	},
	_ChangeStatusResponse:function( response )
	{
		if (response.success=="OK")
		{
			alert("Status Changed was Successful");
		}
		else
		{
			alert("Status Changed Failed ");
		}
		this.statusidbutton.cancel();
	},
	_SetUserCountResponse:function( response )
	{
		if ( response.success == "OK" )
			alert("Concurrent User Count Re-Set");
		else
			alert("Problem Resetting Concurrent User Count");
	},
	_SetUserCount:function()
	{
		if (utilities2.form_validator( this.setusercountform ) == false )
		{
			alert("form invalid");
			return false;
		}
		var content = this.setusercountform.get("value");
		content["icustomerid"] = this._customerid;
		
		request.post ('/customer/set_login_count',
			utilities2.make_params({ data : content})).then
			(this._SetUserCountResponseCall);
	},
	_SetUserNameCountResponse:function( response )
	{
		if ( response.success == "OK" )
			alert("Nbr of User Names Re-Set");
		else
			alert("Problem Resetting Nbr of User Names");
	},
	_SetUserNameCount:function()
	{
		if (utilities2.form_validator( this.setupernamecount ) == false )
		{
			alert("form invalid");
			return false;
		}

		var content = this.setupernamecount.get("value");
		content["icustomerid"] = this._customerid;

		request.post ('/customer/set_users_count',
			utilities2.make_params({ data : content})).then
			(this._SetUserNameCountResponseCall);
	},
	_Set_Collateral_Limit:function()
	{
		if (utilities2.form_validator( this.collateral_size ) == false )
		{
			alert("form invalid");
			return false;
		}

		var content = this.collaterallimitform.get("value");
		content["icustomerid"] = this._customerid;

		request.post ('/customer/set_collateral_limit',
			utilities2.make_params({ data : content})).then
			(this._Set_Collateral_Limit_Response);
	},
	_Set_Collateral_Limit_Response:function( response )
	{
		if ( response.success == "OK" )
			alert("Collateral Limit Updated");
		else
			alert("Collateral Limit Update Failed");
	},
	_set_email_day_limit:function()
	{
		if (utilities2.form_validator( this.emaillimitform ) == false )
		{
			alert("form invalid");
			return false;
		}

		var content = this.emaillimitform.get("value");
		content["icustomerid"] = this._customerid;

		request.post ('/customer/set_max_emails_for_day',
			utilities2.make_params({ data : content})).then
			(this._set_email_day_limit_call);
	},
	_set_email_day_limit_call:function( response )
	{
		if ( response.success == "OK" )
			alert("Email Limit Updated");
		else
			alert("Email Limit Update Failed");
	},
	_ChangeDemoStatusResponse:function( response )
	{
		if ( response.success == "OK" )
			alert("Demo Status Changed");
		else
			alert("Problem Changing Demo Status ");
	},
	_ChangeDemoStatus:function()
	{
		var content = dojo.mixin ({'icustomerid':this._customerid}, this.demoaccountform.get("value"));

		request.post ('/customer/set_demo_status',
			utilities2.make_params({ data : content})).then
			(this._ChangeDemoStatusResponseCall);
	},
	_ReActiveDemo:function()
	{
		this.reactiveatectrl.Load ( this._customerid, this.reactiveatedialog ) ;
	},
	_ChangeEmailStatusResponse:function( response )
	{
		if ( response.success == "OK" )
			alert("Email Status Changed");
		else
			alert("Problem Changing Email Status ");
	},
	_ChangeEmailStatus:function()
	{
		var content = lang.mixin ({'icustomerid':this._customerid}, this.emailenabledform.get("value"));

		request.post ('/customer/set_email_status',
			utilities2.make_params({ data : content})).then
			(this._ChangeEmailStatusResponseCall);
	},
	_UpdatedInternalStatusCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Status Changed");
		}
		else
		{
			alert("Problem Changing Status");
		}
	},
	_ChangeInternalStatus:function()
	{
		if ( confirm("Change Status"))
		{

			request.post ('/customer/update_internal_status',
				utilities2.make_params({ data : {icustomerid: this._customerid,isinternal: this.isinternal.get("value")}})).then
				(this._UpdatedInternalStatusCallBack);
		}
	},
	_DeleteAccountResponse:function ( response )
	{
		if ( response.success=="OK")
		{
			this.customergrid.setQuery(utilities2.get_prevent_cache({}));
			this.customergrid.selection.clear();
			domattr.set(this.detailsview.domNode,"display","none");
			domclass.add(this.userdetails, "prmaxhidden") ;
			alert("Account Deleted");
		}
		else if ( response.success == "FD")
		{
			alert("Record has been marked as Deleted but has not been delete because it has Financial Information attached");
		}
		else
		{
			alert("Problem Deleteing Account");
		}
	},
	_DeleteAccount:function()
	{
		if ( confirm ("Do You Wish to Delete Account ?"))
		{
			if ( confirm ("Are you REALLY Sure?"))
			{

				request.post ('/customer/delete_customer',
					utilities2.make_params({ data : {'icustomerid': this._customerid}})).then
					(this._DeleteAccountResponseCall);
			}
		}
	},
	_bundle_settings:function()
	{

	},	
	_UpdateModulesCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Module Updated");
			this._CheckLayout( response.data.cust, response.data.mediaaccesstype );
		}
		else
		{
			alert("Module Update Failed");
		}
	},
	_UpdateModules:function()
	{
		request.post ('/customer/update_customer_modules',
			utilities2.make_params({ data : 
				{'icustomerid': this._customerid,
				crm: this.crm.get("value"),
				advancefeatures: this.advancefeatures.get("value"),
				updatum: this.updatum.get("value"),
				seo: this.seo.get("value"),
				maxmonitoringusers: this.maxmonitoringusers.get("value"),
				is_bundle : this.is_bundle.get("value"),
				has_news_rooms : this.has_news_rooms.get("value"),
				has_international_data: this.has_international_data.get("value"),
				has_clippings : this.has_clippings.get("value"),
				has_journorequests: this.has_journorequests.get("value")}})).then
			(this._UpdateModulesCall);	
	},
	_CheckLayout:function( customer, mediaaccesstype, emailserver)
	{
		if (this.updatum.get("checked"))
		{
			domclass.remove(this.max_users_monitoring, "prmaxhidden");
//			domclass.remove(this.user_monitor_total_view, "prmaxhidden");
		}
		else
		{
			domclass.add(this.max_users_monitoring, "prmaxhidden");
//			domclass.add(this.user_monitor_total_view, "prmaxhidden");
		}

		this.financialcontrol.Show_Hide_Fields(customer);
		this.datasets.load(null, customer.has_international_data);

		var display = (customer.has_clippings)?"":"none";
		this.clippings.controlButton.domNode.style.display = display;
		display = (customer.has_international_data)?"":"none";
		this.datasets.controlButton.domNode.style.display = display;
		this.extendedsettings.load(customer, mediaaccesstype);
		this.emailserver.load(customer, emailserver);

	},
	_SetCustomerCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Support Customer updated");
		}
		else
		{
			alert("pRoblem Updating Support Customer");
		}
	},
	_SetCustomer:function()
	{
		var iuserid = this.support_userid.get("value");
		if (iuserid == null || iuserid === "")
		{
			alert("No User Specified");
			return;
		}

		if ( confirm ( "Set Support Customer" ) )
		{
			request.post ('/customer/support_customer_set',
				utilities2.make_params({ data : {iuserid : iuserid,icustomerid : this._customerid}})).then
				(this._SetCustomerCallBack);		
		}
	},
	_SetSeoCount:function()
	{
		this.seofree.Load(this._customerid);
	},
	_change_extended_subject:function()
	{
	
		request.post ('/customer/update_extended_subject',
			utilities2.make_params({ data : {
				'icustomerid': this._customerid,
				has_extended_email_subject: this.has_extended_email_subject.get("value")}})).then
			(this._change_extended_subject_call_back);
	},
	_change_extended_subject_call:function ( response)
	{
		if (response.success == "OK")
		{
			alert("Updated");
		}
		else
		{
			alert("Problem Updating");
		}
	},




	
	load: function(customer, custsource)
	{
		this._customer = customer;	
		this._customerid = customer.customerid;
		
		this._customertypeid = customer.customertypeid;

		this.statusid.set("value",customer.customerstatusid);
		dojo.attr(this.displayname,"innerHTML",customer.customername);
		dojo.attr(this.customersourcedescription,"innerHTML", custsource.customersourcedescription);
		this.customertypeid.set("value", customer.customertypeid);
		dojo.attr(this.expire_display , "innerHTML", customer.licence_expire_display);
		this.logins.set("value", customer.logins);
		this.nbrofusersaccounts.set("value",customer.maxnbrofusersaccounts);
		this.collateral_size.set("value",customer.collateral_size);
		this.max_emails_for_day.set("value",customer.max_emails_for_day);

		this.demoaccount_check.set("value", customer.isdemo);
		this.isadvancedemo.set("value", customer.isadvancedemo);
		this.ismonitoringdemo.set("value", customer.ismonitoringdemo);

		// if demo flag set then show reactivate butto n
		if ( customer.isdemo )
			domclass.remove(this.reactive_demo.domNode, "prmaxhidden");
		else
			domclass.add(this.reactive_demo.domNode, "prmaxhidden");

		this.useemail_check.set("value", customer.useemail);
		this.emailistestmode_check.set("value", customer.emailistestmode);
		this.isinternal.set("value", customer.isinternal);
		this.crm.set("value",customer.crm);
		this.seo.set("value", customer.seo)
		this.updatum.set("value", customer.updatum);
		this.maxmonitoringusers.set("value", customer.maxmonitoringusers);
		this.is_bundle.set("value", customer.is_bundle);
		this.has_news_rooms.set("value", customer.has_news_rooms);
		this.has_journorequests.set("value", customer.has_journorequests);
		this.has_international_data.set("value", customer.has_international_data);
		this.has_clippings.set("value", customer.has_clippings);
		this.advancefeatures.set("value",customer.advancefeatures);
		this.has_extended_email_subject.set("value", customer.has_extended_email_subject);


/*

		// Modules

		this.customertypeid.set("value", customer.customertypeid);


		// load details

		this.contact_title.set("value", customer.contact_title);
		this.contact_firstname.set("value", customer.contact_firstname);
		this.contact_surname.set("value", customer.contact_surname);
		this.individual.set("checked",customer.individual);
		this.customersourceid.set("value", customer.customersourceid);

		this.contactjobtitle.set("value", customer.contactjobtitle);
		this.email.set("value", customer.email);
		this.tel.set("value", customer.tel);
		this.countryid.set("value", customer.countryid );
		this.vatnumber.set("value", customer.vatnumber );


		if (customer.extended_security)
		{
			this._extended_security	= true;
		}

		dojo.attr(this.expire_display , "innerHTML", customer.licence_expire_display);


		// Load SEO
		this.seo_view.Load( customer.customerid );

		//load datasets
		this.datasets.load(customer.customerid, customer.has_international_data);

		//Clippings
		this.clippings.load(customer.customerid, customer.end_date);

		// check external user id
		if (customer.customertypeid == 23 || customer.customertypeid == 24)
		{
			dojo.removeClass(this.external_id_view,"prmaxhidden");
			this.external_key.set("required", true);
		}
		else
		{
			dojo.addClass(this.external_id_view,"prmaxhidden");
			this.external_key.set("required", false);
		}
*/		
	},
});
});