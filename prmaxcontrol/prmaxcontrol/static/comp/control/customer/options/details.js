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
define([
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