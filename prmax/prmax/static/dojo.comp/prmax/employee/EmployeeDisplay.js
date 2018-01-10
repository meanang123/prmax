//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeDisplay
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.employee.EmployeeDisplay");

dojo.require("prcommon.display.panel");
dojo.require("prcommon.crm.viewer_only");
dojo.require("prcommon.crm.responses.resend");

dojo.declare("prmax.employee.EmployeeDisplay",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	outletid:-1,
	employeeid:-1,
	customerid:-1,
	ccustomerid:-1,
	templatePath: dojo.moduleUrl( "prmax.employee","templates/employeedisplay.html"),
	constructor: function()
	{
		this._LoadCallBack = dojo.hitch(this,this._Load);
		this.crm_loaded = false ;
		this.resend_loaded = false;
		this.whereused_loaded = false ;
		this._setstore = false;
		dojo.subscribe(PRCOMMON.Events.Update_Notes, dojo.hitch(this,this._profile_refresh_event));

	},
	postCreate:function()
	{
		this.whereusedstore= new dojox.data.QueryReadStore (
			{url:'/lists/whereused',
			onError:ttl.utilities.globalerrorchecker
			});
		// tab selected sub scrip event
		dojo.subscribe(this.tabControl.id+"-selectChild", dojo.hitch(this,this.onSelectTab));

		//this.inherited(arguments);
		this.whereused._setStore(this.whereusedstore );
		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		if (this.crmview && this.crmview.controlButton)
			this.crmview.controlButton.domNode.style.display = (PRMAX.utils.settings.crm)?"":"none";
		if (this.resendview && this.resendview.controlButton)
			this.resendview.controlButton.domNode.style.display = (PRMAX.utils.settings.crm)?"":"none";

	},
	onSelectTab:function(button)
	{
		// if the tab is the contact view make sure that this is displayed/ refreshed
		if (button.id==this.whereusedtab.id && this.whereused_loaded==false)
		{
			this.whereused_loaded = true;
			this.whereused.setQuery( ttl.utilities.getPreventCache({employeeid:this.employeeid}));
		}
		if (button.id==this.resendview.id)
		{
			this.resendctrl.Load(this._contactemail, this.employeeid);
		}
		if (button.id==this.crmview.id && this.crm_loaded==false)
		{
			this.crm_loaded = true;
			this.crmctrl.load_employee(this.employeeid,this.contactname,this.outletid);
		}
	},
	// Load employee details on the screen
	LoadEmployee:function(employeeid,contactname)
	{
		this.employeeid = employeeid;
		this.contactname = contactname;
		if (this.contactname == undefined)
		{
			this.contactname = '';
		}
		if (this.employeeid==-1)
		{
			this.Clear();
		}
		else
		{
			this._clear_loaded_data();

			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadCallBack,
					url:'/employees/employeedisplay',
					content: {employeeid:employeeid}
			})	);
		}
		this.LoadWhereUsed(employeeid);
	},
	// Call back load date t o controls
	_Load:function(response)
	{
		this._contactemail = response.employee.email;
		this.tabControl.selectChild(this.maintab);
		this.Clear();
		dojo.attr(this.employee_display_contactname, "innerHTML", response.employee.contactname);
		dojo.attr(this.employee_display_job_title,"innerHTML",response.employee.job_title);
		dojo.attr(this.employee_display_address,"innerHTML",response.employee.address);
		dojo.attr(this.employee_display_email,"href","mailto:" + response.employee.email);
		dojo.attr(this.employee_display_email,"innerHTML",response.employee.email);

		if ( response.employee.twitter != null && response.employee.twitter.length > 0 )
		{
			dojo.attr(this.employee_display_twitter,"href",response.employee.twitter);
			dojo.attr(this.employee_display_twitter,"innerHTML",response.employee.twitter);
			dojo.removeClass(this.employee_display_twitter_row,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.employee_display_twitter_row,"prmaxhidden");
		}

		if ( response.employee.facebook != null && response.employee.facebook.length > 0 )
		{
			dojo.attr(this.employee_display_facebook,"href",response.employee.facebook);
			dojo.attr(this.employee_display_facebook,"innerHTML",response.employee.facebook);
			dojo.removeClass(this.employee_display_facebook_row,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.employee_display_facebook_row,"prmaxhidden");
		}

		if ( response.employee.linkedin != null && response.employee.linkedin.length > 0 )
		{
			dojo.attr(this.employee_display_linkedin,"href",response.employee.linkedin);
			dojo.attr(this.employee_display_linkedin,"innerHTML",response.employee.linkedin);
			dojo.removeClass(this.employee_display_linkedin_row,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.employee_display_linkedin_row,"prmaxhidden");
		}
		if ( response.employee.instagram != null && response.employee.instagram.length > 0 )
		{
			dojo.attr(this.employee_display_instagram,"href",response.employee.instagram);
			dojo.attr(this.employee_display_instagram,"innerHTML",response.employee.instagram);
			dojo.removeClass(this.employee_display_instagram_row,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.employee_display_instagram_row,"prmaxhidden");
		}

		dojo.attr(this.employee_display_tel,"innerHTML",response.employee.tel);
		dojo.attr(this.employee_display_fax,"innerHTML",response.employee.fax);
		dojo.attr(this.employee_display_mobile,"innerHTML",response.employee.mobile);
		dojo.attr(this.employee_display_localprofile,"innerHTML",response.employee.localprofile.replace(/\n/g,"<br/>"));
		dojo.attr(this.employee_display_roles,"innerHTML",response.employee_display_roles);
		dojo.attr(this.interest_display,"innerHTML", response.employee_display_interests.replace(/,/g,"<br/>"));

		this.customerid = response.employee.customerid;
		this.ccustomerid = response.employee.customerid;
		var display_info = "";
		if ( this.customerid != -1 || this.ccustomerid != -1 )
			display_info = "Private";
		if ( response.employee.isprimary)
		{
			if (display_info.length>0) display_info+=" | ";
				display_info += "Primary";
		}

		dojo.attr(this.employee_display_options, "innerHTML", display_info );

		if (response.employee.telflag)
			dojo.toggleClass(this.employee_display_tel,"prmaxoverride",true);
		if (response.employee.addressflag)
			dojo.toggleClass(this.employee_display_address,"prmaxoverride",true);
		if (response.employee.emailflag)
			dojo.toggleClass(this.employee_display_email,"prmaxoverride",true);
		if (response.employee.faxflag)
			dojo.toggleClass(this.employee_display_fax,"prmaxoverride",true);

	},
	LoadWhereUsed:function(employeeid)
	{
		this.whereused.setQuery( ttl.utilities.getPreventCache({employeeid:employeeid}));
		this.whereused.render();

	},
	_Emptyfields : ["employee_display_contactname",
		"employee_display_contactname",
		"employee_display_job_title",
		"employee_display_address",
		"employee_display_email",
		"employee_display_twitter",
		"employee_display_linkedin",
		"employee_display_facebook",
		"employee_display_instagram",
		"employee_display_tel",
		"employee_display_fax",
		"employee_display_mobile",
		"employee_display_localprofile",
		"employee_display_roles",
		"interest_display"],
	// empty all details
	Clear:function()
	{
		//dojo.style(this.innerCont,"display","none");
		this.customerid =-1;
		this.ccustomerid = -1;
		for ( var key in this._Emptyfields )
			dojo.attr(this[this._Emptyfields[key]], "innerHTML", "" );

		this._clear_loaded_data();

		dojo.addClass(this.employee_display_twitter_row, "prmaxhidden" );
		dojo.addClass(this.employee_display_facebook_row, "prmaxhidden" );
		dojo.addClass(this.employee_display_linkedin_row,"prmaxhidden" );
		dojo.addClass(this.employee_display_instagram_row,"prmaxhidden" );

		dojo.removeClass(this.employee_display_tel,"prmaxoverride");
		dojo.removeClass(this.employee_display_address,"prmaxoverride");
		dojo.removeClass(this.employee_display_email,"prmaxoverride");
		dojo.removeClass(this.employee_display_tel,"prmaxoverride");
		dojo.removeClass(this.employee_display_fax,"prmaxoverride");

		this.tabControl.selectChild(this.maintab);

	},
	_Expand:function()
	{
		ttl.utilities.open_close_panel_node(this.tglbtn, this.interest_inner_panel);
	},
	destroy: function()
	{
		delete this.whereusedstore;
		this.inherited(arguments);
	},
	resize:function()
	{
		// top can be ignore
		if ( arguments[0] )
			this.frame.resize( {h:arguments[0].h, l:arguments[0].l, t:0, w:arguments[0].w} );

		this.inherited(arguments);
	},
	_do_notes_edit:function()
	{
		dojo.publish ( PRCOMMON.Events.Edit_Notes , [ null, this.employeeid ]);
	},
	_profile_refresh_event:function( outletid, employeeid)
	{
		if ( employeeid != null && employeeid == this.employeeid)
			this.LoadEmployee ( employeeid);
	},
	_clear_loaded_data:function()
	{
		this.crm_loaded = false ;
		this.whereused_loaded = false ;
	}
});
