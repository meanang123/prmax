dojo.provide("prmax.iadmin.admin");

dojo.require("dojo.io.iframe");

dojo.require("dojox.data.QueryReadStore");
dojo.require("ttl.utilities");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Dialog");
dojo.require("ttl.GridHelpers");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.Dialog");
dojo.require("dijit.TitlePane");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Menu");
dojo.require("dijit.Tree");
dojo.require("dijit.ProgressBar");

dojo.require("dijit.form.Button");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.MultiSelect");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dojox.form.FileInput");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Textarea");

dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.data.QueryReadStore");

dojo.require("dojox.form.BusyButton");
dojo.require("dojox.form.PasswordValidator");
dojo.require("dojox.validate.regexp");
dojo.require("dojox.collections.Dictionary");

dojo.require("prcommon.data.QueryWriteStore");
dojo.require("prmax.user.AddUser");
dojo.require("prmax.prmaxobjects");

dojo.require("dijit.form.CurrencyTextBox");
dojo.require("prmax.iadmin.Support");
dojo.require("prmax.iadmin.Research");
dojo.require("prmax.iadmin.TaskTags");
dojo.require("prmax.iadmin.TaskAdd");

dojo.require("prmax.iadmin.accounts.FinancialControl");
dojo.require("prmax.iadmin.accounts.Reports");
dojo.require("prmax.iadmin.accounts.DDView");
dojo.require("prmax.iadmin.accounts.PriceCodes");
dojo.require("prmax.iadmin.accounts.Diary");
dojo.require("prmax.iadmin.accounts.SeoView");

dojo.require("prmax.iadmin.sales.SetExpireDate");
dojo.require("prmax.iadmin.sales.view");
dojo.require("prmax.iadmin.sales.DemoRequestView");
dojo.require("prmax.iadmin.sales.ReActivateDemo");
dojo.require("prmax.iadmin.sales.SetFreeSEOCount");

dojo.require("prmax.iadmin.support.FrontScreen");
dojo.require("prmax.iadmin.support.ActiveUsers");
dojo.require("prmax.iadmin.support.PrivateData");
dojo.require("prmax.iadmin.support.ResetAndSend");

dojo.require("prmax.iadmin.support.seo.view");
dojo.require("prmax.iadmin.support.seo.Complaints");

dojo.require("prmax.iadmin.sales.newsfeed.view");

dojo.require("prmax.iadmin.PrmaxDataSets");

dojo.require("prcommon.prcommonobjects");
dojo.require("prcommon.data.DataStores");

dojo.require("prmax.crm.viewer");
dojo.require("prmax.crm.AddContact");
dojo.require("prmax.crm.ViewContact");
dojo.require("prmax.crm.task.viewer");

dojo.require("prmax.customer.InternalAddCustomer");

dojo.require("prcommon.query.query");

dojo.require("dojox.layout.ExpandoPane");
dojo.require("dijit.tree.ForestStoreModel");
dojo.require("dijit.Tree");


dojo.require("prmax.iadmin.sales.prospects.bounces.view");
dojo.require("prmax.iadmin.sales.prospects.companies.view");
dojo.require("prmax.iadmin.sales.prospects.exclusions.view");
dojo.require("prmax.iadmin.sales.prospects.gather.view");
dojo.require("prmax.iadmin.sales.prospects.mailing.view");
dojo.require("prmax.iadmin.clippings.view");
dojo.require("prmax.iadmin.extendedsettings");
dojo.require("prmax.iadmin.emailserver");
dojo.require("prmax.iadmin.PrmaxDataSets");

dojo.declare("prmax.iadmin.admin",
	[dijit._Widget, dijit._Templated, dijit._Container],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin","templates/admin.html"),
	constructor: function()
	{
		this._LoadCustomerCall = dojo.hitch(this,this._LoadCustomer);
		this._ChangeStatusResponseCall = dojo.hitch(this,this._ChangeStatusResponse);
		this._UpdateUserPasswordResponseCall = dojo.hitch(this,this._UpdateUserPasswordResponse);
		this._UpdateUserDetailsResponseCall = dojo.hitch ( this , this._UpdateUserDetailsResponse);
		this._EmailResponseCall = dojo.hitch(this,this._EmailResponse);
		this._SetUserCountResponseCall = dojo.hitch(this,this._SetUserCountResponse);
		this._ChangeDemoStatusResponseCall = dojo.hitch(this,this._ChangeDemoStatusResponse);
		this._ChangeEmailStatusResponseCall = dojo.hitch(this,this._ChangeEmailStatusResponse);
		this._CustomerSaveResponseCall = dojo.hitch(this,this._CustomerSaveResponse);
		this._LoadUserCall = dojo.hitch(this, this._LoadUser);
		this._DeleteAccountResponseCall = dojo.hitch(this,this._DeleteAccountResponse);
		this._DeleteUserResponseCall = dojo.hitch(this,this._DeleteUserResponse);
		this._UnlockUserResponseCall = dojo.hitch(this,this._UnlockUserResponse);
		this._SetUserNameCountResponseCall = dojo.hitch(this,this._SetUserNameCountResponse);
		this._UserLoggedOffCallBack = dojo.hitch(this,this._UserLoggedOffCall);
		this._UpdatedCustomerTypeCallBack = dojo.hitch(this,this._UpdatedCustomerTypeCall);
		this._UpdatedInternalStatusCallBack = dojo.hitch(this, this._UpdatedInternalStatusCall);
		this._SetCustomerCallBack = dojo.hitch(this, this._SetCustomerCall);
		this._LoadCustomer2CallBack = dojo.hitch(this, this._LoadCustomer2Call);
		this._UpdateUpdatumCallBack = dojo.hitch(this, this._UpdateUpdatumCall);
		this._change_extended_subject_call_back = dojo.hitch(this,this._change_extended_subject_call);

		this.front_customerid = -1;
		this._show_all = 0;
		this._extended_security = false;

		dojo.subscribe(PRCOMMON.Events.User_Added, dojo.hitch(this,this._User_Added_Event));
		dojo.subscribe(PRCOMMON.Events.Show_Customer_Main, dojo.hitch(this,this._Show_Customer_Event));
		dojo.subscribe(PRCOMMON.Events.Expire_Date_Changed, dojo.hitch(this,this._Change_Expire_Date));
		dojo.subscribe("extended_settings", dojo.hitch(this, this._Change_Extended_Setting));

		this.customerlist= new prcommon.data.QueryWriteStore (
			{url:'/iadmin/customers',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
			});
		this.auditlist = new dojox.data.QueryReadStore (
			{url:'/iadmin/audit',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

		this.userlist = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/users',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});
		this._financialstatus_filter =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=financialstatus&ignore=1"});
		this._financialstatus_filter =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=financialstatus&ignore=1"});
		this._customersourceid =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=customersources"});
		this._clippingsourceid = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=clippingsource&nofilter=1"});

		this.user_model = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/users_support',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});


		this._Windows = new dojox.collections.Dictionary();

	},
	postCreate:function()
	{
		// get the front pager text
		this.filter_customertypeid.store = PRCOMMON.utils.stores.Customer_Types_Filter();
		this.filter_customersourceid.store = PRCOMMON.utils.stores.Customer_Source_Filter();
		this.filter_financialstatus.store = this._financialstatus_filter;
		this.customersourceid.store = this._customersourceid;

		this.customergrid._setStore(this.customerlist );
		this.auditgrid._setStore(this.auditlist);
		this.usergrid._setStore(this.userlist );
		this.customergrid['onStyleRow'] = dojo.hitch(this,this._OnStyleRow);
		this.customergrid['onRowClick'] = dojo.hitch(this,this._OnSelectRow);
		this.usergrid['onRowClick'] = dojo.hitch(this,this._OnSelectUserRow);
		this.auditgrid['onRowClick'] = dojo.hitch(this,this._OnSelectAudit);
		this.support_userid.store =  this.user_model ;

		this.filter_customer_statusid.set("value","-1");
		this.filter_customertypeid.set("value","-1");
		this.filter_financialstatus.set("value","-1");
		this.filter_customersourceid.set("value","-1");

		dojo.connect(this.setusercountform, "onSubmit", dojo.hitch(this,this._SetUserCount));
		dojo.connect(this.setupernamecount, "onSubmit", dojo.hitch(this,this._SetUserNameCount));
		dojo.connect(this.demoaccountform, "onSubmit", dojo.hitch(this,this._ChangeDemoStatus));
		dojo.connect(this.emailenabledform, "onSubmit", dojo.hitch(this,this._ChangeEmailStatus));
		dojo.connect(this.collaterallimitform, "onSubmit", dojo.hitch(this,this._Set_Collateral_Limit));
		dojo.connect(this.emaillimitform, "onSubmit", dojo.hitch(this,this._set_email_day_limit));

		this.countryid.store =  PRCOMMON.utils.stores.Countries();
		this.customertypeid.store = PRCOMMON.utils.stores.Customer_Types();
		this.filter_monitoringstatusid.store = this._init_monitoring_filter();
		this.filter_monitoringstatusid.set("value",-1);
		this.filter_clippingsourceid.store = this._clippingsourceid;
		this.filter_clippingsourceid.set("value",-1);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);
	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_LoadUser:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.removeClass (this.userdetails, "prmaxhidden") ;
			this.user_email_address.set("value", response.data.email_address ) ;
			this.user_display_name.set("value",response.data.display_name ) ;
			this.user_user_name.set("value",response.data.user_name ) ;
			this.canviewfinancial.set("value",response.data.canviewfinancial ) ;
			this.force_passwordrecovery.set("value",response.data.force_passwordrecovery) ;
			this.isuseradmin.set("value",response.data.isuseradmin ) ;
			this.nodirectmail.set("value",response.data.nodirectmail);
			this.userpassword.reset();
			this.hasmonitoring.set("value", response.data.hasmonitoring );
			this._ChangeMonitoring();
			this.updatum_username.set("value", response.data.updatum_username);
			this.updatum_pwd_display.set("value", response.data.updatum_pwd_display);
			this.updatum_password.reset();
			this.updatum_iuserid.set("value", this._userrow.i.user_id );
			this.external_key.set("value", response.data.external_key);
			if (response.data.invalid_login_tries >= 10 || response.data.invalid_reset_tries >= 10)
			{
				dojo.removeClass(this.unlockUserNode.domNode, "prmaxhidden");
			}
			else
			{
				dojo.addClass(this.unlockUserNode.domNode, "prmaxhidden");
			}
		}
	},
	_ChangeMonitoring:function()
	{
		if (this.hasmonitoring.get("checked"))
			dojo.removeClass (this.user_monitor_view, "prmaxhidden") ;
		else
			dojo.addClass (this.user_monitor_view, "prmaxhidden") ;

	},
	_OnSelectUserRow:function(e)
	{
		this._userrow = this.usergrid.getItem(e.rowIndex);

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadUserCall,
			url:'/iadmin/get_user_internal',
			content:{'iuserid':this._userrow.i.user_id}
			}));
	},
	_OnSelectRow : function(e) {

		var row = this.customergrid.getItem(e.rowIndex);

		this._customerid = row.i.customerid;

		if ( e.cellIndex == 0)
		{
			this.newtaskctrl.Load ( PRMAX.utils.settings.groups, this.newtaskdialog, null, this._customerid ) ;
			this.newtaskdialog.show();
		}
		else
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadCustomerCall,
				url:'/iadmin/get_internal',
				content:{'icustomerid':this._customerid}
				}));


			this._LoadTabs ( this._customerid);
			this.customergrid.selection.clickSelectEvent(e);
		}
	},
	_LoadTabs:function( icustomerid )
	{
		this.auditgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{icustomerid:icustomerid}));
		this.usergrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{icustomerid:icustomerid}));
		this.financialgrid.Load(icustomerid);
		this.crmviewer.LoadControls( null, null, null, icustomerid );
	},
	_LoadCustomer:function( response )
	{
		this._customertypeid = response.data.cust.customertypeid;

		dojo.removeClass(this.detailsview.domNode,"prmaxhidden");
		dojo.addClass (this.userdetails, "prmaxhidden") ;

		this.detailsview.resize();
		this.statusid.set("value",response.data.cust.customerstatusid);
		dojo.attr(this.displayname,"innerHTML",response.data.cust.customername);
		dojo.attr(this.customersourcedescription,"innerHTML", response.data.custsource.customersourcedescription);
		this.logins.set("value", response.data.cust.logins);
		this.nbrofusersaccounts.set("value",response.data.cust.maxnbrofusersaccounts);
		this.collateral_size.set("value",response.data.cust.collateral_size);
		this.max_emails_for_day.set("value",response.data.cust.max_emails_for_day);

		// Modules
		this.advancefeatures.set("value",response.data.cust.advancefeatures);
		this.crm.set("value",response.data.cust.crm);
		this.seo.set("value", response.data.cust.seo);
		if (this.seo.checked == false)
		{
			dojo.addClass(this.seotranslation_node, "prmaxhidden");
			this.seotranslation.set("value", false);
		}
		else
		{
			dojo.removeClass(this.seotranslation_node, "prmaxhidden");
			this.seotranslation.set("value", response.data.cust.seotranslation);
		}

		this.updatum.set("value", response.data.cust.updatum);
		this.maxmonitoringusers.set("value", response.data.cust.maxmonitoringusers);
		this._CheckLayout( response.data.cust, response.data.mediaaccesstype, response.data.emailserver );

		this.customertypeid.set("value", response.data.cust.customertypeid);

		this.demoaccount_check.set("value", response.data.cust.isdemo);
		this.isadvancedemo.set("value", response.data.cust.isadvancedemo);
		this.ismonitoringdemo.set("value", response.data.cust.ismonitoringdemo);
		this.is_bundle.set("value", response.data.cust.is_bundle);
		this.has_news_rooms.set("value", response.data.cust.has_news_rooms);
		this.has_global_newsroom.set("value", response.data.cust.has_global_newsroom);
		this.has_journorequests.set("value", response.data.cust.has_journorequests);
		this.has_international_data.set("value", response.data.cust.has_international_data);
		this.has_clippings.set("value", response.data.cust.has_clippings);

		// load details
		this.customername.set("value", response.data.cust.customername);

		this.contact_title.set("value", response.data.cust.contact_title);
		this.contact_firstname.set("value", response.data.cust.contact_firstname);
		this.contact_surname.set("value", response.data.cust.contact_surname);
		this.individual.set("checked",response.data.cust.individual);
		this.customersourceid.set("value", response.data.cust.customersourceid);

		this.contactjobtitle.set("value", response.data.cust.contactjobtitle);
		this.address1.set("value", response.data.address.address1);
		this.address2.set("value", response.data.address.address2);
		this.townname.set("value", response.data.address.townname);
		this.county.set("value", response.data.address.county);
		this.postcode.set("value", response.data.address.postcode);
		this.email.set("value", response.data.cust.email);
		this.tel.set("value", response.data.cust.tel);
		this.countryid.set("value", response.data.cust.countryid );
		this.vatnumber.set("value", response.data.cust.vatnumber );

		this.useemail_check.set("value", response.data.cust.useemail);
		this.emailistestmode_check.set("value", response.data.cust.emailistestmode);
		this.isinternal.set("value", response.data.cust.isinternal);

		this.has_extended_email_subject.set("value", response.data.cust.has_extended_email_subject);
		if (response.data.cust.extended_security)
		{
			this._extended_security	= true;
		}

		dojo.attr(this.expire_display , "innerHTML", response.data.cust.licence_expire_display);

		// finanical details
		this.financialcontrol.Load ( response.data )
		this.diary_view.Load ( response.data.cust.customerid ) ;

		// if demo flag set then show reactivate butto n
		if ( response.data.cust.isdemo )
			dojo.removeClass(this.reactive_demo.domNode, "prmaxhidden");
		else
			dojo.addClass(this.reactive_demo.domNode, "prmaxhidden");

		// Load SEO
		this.seo_view.Load( response.data.cust.customerid );

		//load datasets
		this.datasets.load(response.data.cust.customerid, response.data.cust.has_international_data);

		//Clippings
		this.clippings.load(response.data.cust.customerid, response.data.cust.end_date);

		// check external user id
		if (response.data.cust.customertypeid == 23 || response.data.cust.customertypeid == 24)
		{
			dojo.removeClass(this.external_id_view,"prmaxhidden");
			this.external_key.set("required", true);
		}
		else
		{
			dojo.addClass(this.external_id_view,"prmaxhidden");
			this.external_key.set("required", false);
		}

		this.options_tab.selectChild(this.options_tab_details);
	},
	_Change_Expire_Date:function( cust )
	{
		dojo.attr(this.expire_display , "innerHTML", cust.licence_expire_display);

	},

	_ChangeStatus:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._ChangeStatusResponseCall),
			url:'/iadmin/changestatus',
			content:{'customerid':this._customerid,
						customerstatusid: this.statusid.get("value")}
				}));
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
	_CustomerSaveResponse:function( response )
	{
		if (response.success=="OK")
		{
			alert("Customer Details Updated");
		}

		this.saveNode.cancel();

	},
	_CustomerSave:function ( )
	{
		var content = this.customerForm.get("value");
		content["icustomerid"]  = this._customerid ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._CustomerSaveResponseCall),
			url:'/iadmin/update_customer',
			content:content
		}));

	},
	_EmailResponse:function( response )
	{
		this.sendemailbutton.cancel();
		alert("Email Queued");
	},
	_SendEmail:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._EmailResponseCall),
			url:'/iadmin/sendprimarypassword',
			content:{'customerid':this._customerid,
						customerstatusid: this.statusid.get("value")}
				}));
	},
	_ResetPassword:function()
	{

	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	_SetExpireDate:function( response )
	{
		this.expirectrl.Load( this._customerid ) ;
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
		if (ttl.utilities.formValidator( this.setusercountform ) == false )
		{
			alert("form invalid");
			return false;
		}

		var content = this.setusercountform.get("value");
		content["icustomerid"] = this._customerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._SetUserCountResponseCall),
			url:'/iadmin/set_login_count',
			content:content}));
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
		if (ttl.utilities.formValidator( this.setupernamecount ) == false )
		{
			alert("form invalid");
			return false;
		}

		var content = this.setupernamecount.get("value");
		content["icustomerid"] = this._customerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._SetUserNameCountResponseCall),
			url:'/iadmin/set_users_count',
			content:content}));
	},
	_Set_Collateral_Limit:function()
	{
		if (ttl.utilities.formValidator( this.collateral_size ) == false )
		{
			alert("form invalid");
			return false;
		}

		var content = this.collaterallimitform.get("value");
		content["icustomerid"] = this._customerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._Set_Collateral_Limit_Response),
			url:'/iadmin/set_collateral_limit',
			content:content}));
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
		if (ttl.utilities.formValidator( this.emaillimitform ) == false )
		{
			alert("form invalid");
			return false;
		}

		var content = this.emaillimitform.get("value");
		content["icustomerid"] = this._customerid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._set_email_day_limit_call),
			url:'/iadmin/set_max_emails_for_day',
			content:content}));
	},
	_set_email_day_limit_call:function( response )
	{
		if ( response.success == "OK" )
			alert("Email Limit Updated");
		else
			alert("Email Limit Update Failed");
	},
	_Set_Collateral_Limit_Response:function( response )
	{
		if ( response.success == "OK" )
			alert("Collateral Limit Updated");
		else
			alert("Collateral Limit Update Failed");
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

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._ChangeDemoStatusResponseCall),
			url:'/iadmin/set_demo_status',
			content:content}));
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
		var content = dojo.mixin ({'icustomerid':this._customerid}, this.emailenabledform.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._ChangeEmailStatusResponseCall),
			url:'/iadmin/set_email_status',
			content:content}));

	},
	_SetTime:function( field )
	{
		dojo.attr( field ,"innerHTML",new Date().toString());
	},
	_UpdateUserDetails:function()
	{
		if (ttl.utilities.formValidator( this.userdetailsform ) == false )
		{
			alert("Invalid Info");
			this.userdetailsNode.cancel();
			return false;
		}

		if ( confirm("Update's users details"))
		{
			var content = this.userdetailsform.get("value");
			content["iuserid"] = this._userrow.i.user_id;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdateUserDetailsResponseCall),
				url:'/iadmin/update_user_details',
				content:content }));
		}
		return false;
	},
	_UpdateUserDetailsResponse:function ( response )
	{
		if ( response.success=="OK")
			alert("User Details Changed");
		else
			alert("Problem Changing user details");

		this.userdetailsNode.cancel();
	},
	_UpdateUpdatum:function()
	{
		if ( this.hasmonitoring.get("checked"))
		{
			if (ttl.utilities.formValidator( this.updatumform ) == false )
			{
				alert("Invalid Details");
				this.saveUpdatum.cancel();
				return false;
			}
		}

		if ( confirm("Update's Monitoring Details"))
		{
			var content = this.updatumform.get("value");

			content["updatum_password"] = this.updatum_password.value;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdateUpdatumCallBack),
				url:'/iadmin/update_updatum_password',
				content:content }));
		}
		return false;
	},
	_UpdateUpdatumCall:function( response )
	{
		if ( response.success=="OK")
		{
			alert("Updatum Details Changed");
		}
		else if ( response.success=="LI")
		{
			alert("Use Count for Monitoring Exceeded");
		}
		else
		{
			alert("Problem Changing Updatum details");
		}
		this.saveUpdatum.cancel();
	},
	_has_lower_case:function(str)
	{
		var i = 0;
		while (i <= str.length )
		{
			c = str.charAt(i);
			if (c == c.toLowerCase())
			{
				return true;
			}
			i++;
		}
		return false;
	},
	_has_upper_case:function(str)
	{
		var i = 0;
		while (i <= str.length )
		{
			c = str.charAt(i);
			if (c == c.toUpperCase())
			{
				return true;
			}
			i++;
		}
		return false;
	},
	_has_number:function(str)
	{
		var i = 0;
		while (i <= str.length )
		{
			c = str.charAt(i);
			if (parseInt(c))
			{
				return true;
			}
			i++;
		}
		return false;
	},
	_UpdateUserPassword:function()
	{
		if (ttl.utilities.formValidator( this.userpasswordform ) == false )
		{
			alert("Invalid Password");
			this.savePasswordNode.cancel();
			return false;
		}
		var userpassword = this.userpassword.value;
		if (this._extended_security == true)
		{
			if (userpassword.length < 8 || this._has_lower_case(userpassword) == false || this._has_upper_case(userpassword) == false || this._has_number(userpassword) == false)
			{
				alert("Please enter a valid password: minimum length 8 characters, at least one character upper case, one character lower case and one digit");
				this.savePasswordNode.cancel();
				return;
			}
		}
		if ( confirm("Update's users password"))
		{
			var content = this.userpasswordform.get("value");

			content["iuserid"] = this._userrow.i.user_id;
			content["password"] = this.userpassword.value;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdateUserPasswordResponseCall),
				url:'/iadmin/update_user_password',
				content:content }));
		}
		return false;
	},
	_UpdateUserPasswordResponse:function( response )
	{
		if ( response.success=="OK")
			alert("Password Changed");
		else
			alert("Problem Chnaging user password");

		this.savePasswordNode.cancel();
	},
	_DeleteUserResponse:function( response )
	{
		if ( response.success=="OK")
		{
			this.userlist.deleteItem( this._userrow);
			dojo.addClass (this.userdetails, "prmaxhidden") ;
			alert("User Deleted ");
		}
		else
		{
			alert("Problem Deleting User");
		}

		this.deleteUserNode.cancel();
	},
	_DeleteUser:function()
	{
		if (confirm("Delete User?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._DeleteUserResponseCall,
				url:'/iadmin/delete_user',
				content:{iuserid:this._userrow.i.user_id}}));
		}
	},
	_UnlockUserResponse:function( response )
	{
		if ( response.success=="OK")
		{
			alert("User Unlocked ");
		}
		else
		{
			alert("Problem unlocking User");
		}

		this.unlockUserNode.cancel();
		dojo.addClass(this.unlockUserNode.domNode, "prmaxhidden");
	},
	_UnlockUser:function()
	{
		if (confirm("Unlock User?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._UnlockUserResponseCall,
				url:'/iadmin/unlock_user',
				content:{iuserid:this._userrow.i.user_id}}));
		}
	},
	_Change_Extended_Setting:function( data )
	{
		this._extended_security = data.cust.extended_security;
	},


	_Logout:function()
	{
		if  ( confirm("Logout of Prmax?")==true)
			window.location.href = "/logout?ref=/iadmin/main";
	},
	_OnSelectAudit:function ( e )
	{
		var row = this.auditgrid.getItem(e.rowIndex);

		// open invoice
		if ( e.cellIndex  == 3 && row.i.documentpresent == true )
		{
			if ( row.i.audittypeid == 17 || row.i.audittypeid == 24 )
			{
				dojo.attr(this.htmlform_audittrailid,"value", row.i.audittrailid);
				dojo.attr(this.htmlform, "action", "/iadmin/viewhtml/" + row.i.audittrailid);
				this.htmlform.submit();
			}
			else
			{
				dojo.attr(this.documentform_audittrailid,"value", row.i.audittrailid);
				dojo.attr(this.documentform, "action", "/iadmin/viewpdf/" + row.i.audittrailid);
				this.documentform.submit();
			}
		}
		this.auditgrid.selection.clickSelectEvent(e);
	},
	_DeleteAccountResponse:function ( response )
	{
		if ( response.success=="OK")
		{
			this.customergrid.setQuery(ttl.utilities.getPreventCache({}));
			this.customergrid.selection.clear();
			dojo.style(this.detailsview.domNode,"display","none");
			dojo.addClass (this.userdetails, "prmaxhidden") ;
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
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._DeleteAccountResponseCall,
					url:'/iadmin/delete_customer',
					content:{'icustomerid':this._customerid}}));
			}
		}
	},
	_Add_User:function()
	{
		this.adduserctrl.Clear();
		this.adduserctrl.set_has_external_level(this._customertypeid);
		this.adduserctrl.icustomerid.set("value", this._customerid);
		this.adduserctrl.extended_security.set("value", this._extended_security);
		this.adduserdialog.show();
	},
	_User_Added_Event:function( data )
	{
		this.userlist.newItem( data ) ;
		this.adduserdialog.hide();
		this.adduserctrl.Clear();
	},
	_ExecuteCustomerFilter:function()
	{
		var query = {
			statusid:arguments[0].statusid,
			customername:arguments[0].customername,
			accountnbr:arguments[0].accountnbr,
			customertypeid:arguments[0].customertypeid,
			customersourceid:arguments[0].customersourceid,
			financialstatusid:arguments[0].financialstatusid,
			email:arguments[0].email,
			isinternal:arguments[0].isinternal,
			contactname:arguments[0].contactname,
			invoicenbr:arguments[0].invoicenbr,
			creditnotenbr:arguments[0].creditnotenbr,
			unallocated:arguments[0].unallocated
		};

		if ( arguments[0].licence_expired )
			query["licence_expired"] = arguments[0].licence_expired;

		if ( arguments[0].monitoringstatusid != "" && arguments[0].monitoringstatusid != "-1")
			query["monitoringstatusid"] = arguments[0].monitoringstatusid;

		if ( arguments[0].clippingsourceid != "" && arguments[0].clippingsourceid != "-1")
			query["clippingsourceid"] = arguments[0].clippingsourceid;

		this.customergrid.setQuery(ttl.utilities.getPreventCache(query));
		dojo.addClass(this.detailsview.domNode,"prmaxhidden");

	},
	_ClearFilter:function()
	{
		this.filter_licence_expired.set("checked",false);
		this.filter_isinternal.set("checked",false);
		this.filter_customername.set("value","");
		this.filter_customer_statusid.set("value","-1");
		this.filter_accountnbr.set("value","");
		this.filter_customertypeid.set("value",-1);
		this.filter_customeremail.set("value","");
		this.filter_customersourceid.set("value",-1);
		this.filter_contactname.set("value","");
		this.filter_invoicenbr.set("value","");
		this.filter_creditnotenbr.set("value", "");
		this.filter_unallocated.set("checked", false ) ;
		this.filter_monitoringstatusid.set("value",-1);
		this.filter_clippingsourceid.set("value",-1);
	},
	_SelectNode:function()
	{
		var  obj = arguments[0];
		if (this._Windows.containsKey( obj.id) == false )
		{
			var widget = null;
			if (obj.type==0)
				widget = new dijit.layout.ContentPane({title:obj.id.toString(),content:"<div dojoType='"+ obj.content + "' style='width:100%;height:100%'></div>"});
			if (obj.type==2)
				widget = new dijit.layout.ContentPane({title:obj.id.toString(),href:obj.page});

			this.zone.addChild ( widget, 0);
			setTimeout("dijit.byId('"+this.zone.id +"').selectChild('"+widget.id+"');",10);
			this._Windows.add(obj.id,  widget.id ) ;
		}
		else
		{
			var wid = this._Windows.entry(obj.id).value;

			this.zone.selectChild (  dijit.byId(wid));

		}
	},
	_CheckLayout:function( customer, mediaaccesstype, emailserver)
	{
		if (this.updatum.get("checked"))
		{
			dojo.removeClass(this.max_users_monitoring, "prmaxhidden");
			dojo.removeClass(this.user_monitor_total_view, "prmaxhidden");
		}
		else
		{
			dojo.addClass(this.max_users_monitoring, "prmaxhidden");
			dojo.addClass(this.user_monitor_total_view, "prmaxhidden");
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
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._UpdateModulesCall),
			url:'/iadmin/update_customer_modules',
			content:{'icustomerid': this._customerid,
						crm: this.crm.get("value"),
						advancefeatures: this.advancefeatures.get("value"),
						updatum: this.updatum.get("value"),
						seo: this.seo.get("value"),
						seotranslation: this.seotranslation.get("value"),
						maxmonitoringusers: this.maxmonitoringusers.get("value"),
						is_bundle : this.is_bundle.get("value"),
						has_news_rooms : this.has_news_rooms.get("value"),
						has_global_newsroom : this.has_global_newsroom.get("value"),
						has_international_data: this.has_international_data.get("value"),
						has_clippings : this.has_clippings.get("value"),
						has_journorequests: this.has_journorequests.get("value")}
			}));
	},
	_UpdatedCustomerTypeCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Customer Type Changed");
			this.extendedsettings.load(response.data.cust,response.data.mediaaccesstype);
		}
		else
		{
			alert("Problem Changing Customer Type");
		}
	},
	_CustomerType:function()
	{
		if ( confirm("Change Customer Type"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdatedCustomerTypeCallBack),
				url:'/iadmin/update_customertypeid',
				content:{
							icustomerid: this._customerid,
							customertypeid: this.customertypeid.get("value")}
				}));
		}
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
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdatedInternalStatusCallBack),
				url:'/iadmin/update_internal_status',
				content:{
							icustomerid: this._customerid,
							isinternal: this.isinternal.get("value")}
				}));
		}
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
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._SetCustomerCallBack,
					url:'/iadmin/support_customer_set',
					content: { iuserid : iuserid,
										icustomerid : this._customerid}
			}));
		}
	},
	_LoadCustomer2Call:function ( response )
	{
		this._customerid = response.data.cust.customerid;
		this._customertypeid = response.data.cust.customertypeid;


		this._LoadCustomer( response ) ;
		this._LoadTabs( this._customerid ) ;
		this.tabs.selectChild ( this.notestab);
		this.frame_tabs.selectChild( this.frame_tab_m);
	},
	_Show_Customer_Event:function ( icustomerid )
	{
		this._icustomerid = icustomerid;
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCustomer2CallBack,
			url:'/iadmin/get_internal',
			content:{'icustomerid': icustomerid}
			}));
	},
	_ReActiveDemo:function()
	{
		this.reactiveatectrl.Load ( this._customerid, this.reactiveatedialog ) ;
	},
	_SetSeoCount:function()
	{
		this.seofree.Load(this._customerid);
	},
	_bundle_settings:function()
	{

	},
	_change_extended_subject:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._change_extended_subject_call_back,
			url:'/iadmin/update_extended_subject',
			content:{'icustomerid': this._customerid,
										has_extended_email_subject: this.has_extended_email_subject.get("value")
			}
			}));
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
	_send_login_details:function()
	{
		this.send_password_ctrl.load( this._userrow.i.user_id, this.send_password_dialog);
	},
	_ChangeSeoOption:function()
	{
		if (this.seo.checked == false)
		{
			dojo.addClass(this.seotranslation_node, "prmaxhidden");
		}
		else
		{
			dojo.removeClass(this.seotranslation_node, "prmaxhidden");
		}
	},
	_init_monitoring_filter:function()
	{
		return new dojo.data.ItemFileReadStore({data: { identifier: "id",
				items: [ {id: -1, name:"No Selection"},
						{id: 1, name:"Enabled"},
						{id: 2, name:"Enabled - Has active Orders"},
						{id: 3, name:"Enabled - No Orders"},
						{id: 4, name:"Enabled - Has Expired Orders Only"}
				]
		}});
	}
});

dojo.declare("prmax.iadmin.gridlayouts",
	null,{
	constructor: function()
	{
		this.main_view = {noscroll: false,
			cells: [[
			{name: '', width:"1em", formatter:ttl.utilities.formatRowCtrl},
			{name: 'Acc',width: "4em",field:'customerid',styles:"text-align:right;padding-right:3px;"},
			{name: 'Customer name',width: "20em",field:'customername'},
			{name: 'Type',width: "8em",field:'customertypename'},
			{name: 'Contact',width: "14em",field:'contactname'},
			{name: 'Expires',width: "6em",field:'licence_expire'},
			{name: 'Status',width: "9em",field:'customerstatusname'},
			{name: 'Created',width: "6em",field:'created'},
			{name: 'Last Accessed',width: "10em",field:'last_login_display'},

		]]
		};
		this.audit_view = {noscroll: false,
			cells: [[
			{name: 'Type',width: "4em",field:'audittypeid',style:"text-align:right"},
			{name: 'Date',width: "10em",field:'auditdate'},
			{name: 'Text',width: "25em",field:'audittext'},
			{name: ' ',width: "2em",field:'documentpresent',formatter:ttl.utilities.documentExists},
			{name: 'Who',width: "10em",field:'user_name'}

		]]
		};
		this.user_view = {noscroll: false,
			cells: [[
			{name: 'User Id',width: "5em",field:'user_id'},
			{name: 'Display Name',width: "auto",field:'display_name'},
			{name: 'Login Name',width: "auto",field:'user_name'},
			{name: 'Email',width: "auto",field:'email_address'}
		]]	};

		this.demorequest = {noscroll: false,
			cells: [[
			{name: 'Customer Name',width: "auto",field:'customername'},
			{name: 'Contact Name',width: "auto",field:'contactname'},
			{name: 'Email',width: "auto",field:'email'},
			{name: 'Address1',width: "auto",field:'address1'},
			{name: 'Town',width: "auto",field:'townname'},
			{name: 'PostCode',width: "auto",field:'postcode'},
			{name: 'Telephone',width: "auto",field:'telephone'}
		]]
		};
	}
});
