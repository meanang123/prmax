//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeSelect
// Author:  Chris Hoy
// Purpose: This select a contact record or creates a new one and select it
//			exposed to a form contactid and contacttype (N,S) N is for no
//			selection
// Created: 11/02/2009
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.dataadmin.employees.EmployeeSelect");

dojo.declare("prmax.dataadmin.employees.EmployeeSelect",
	[ttl.BaseWidget ],
	{
	required:false,
	nonew:false,
	name:"eselect",
	widgetsInTemplate: true,
	mustexists:false,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.employees","templates/EmployeeSelect.html"),
	constructor: function() {
		this.contactstore=new dojox.data.QueryReadStore(
			{url:"/contacts/research_lookuplist",
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
		});
		this._shopadd = true;

	},
	postCreate:function()
	{
		this.contactlist.store = this.contactstore ;
		dojo.attr(this.nocontactlabel,'for',this.nocontactNode.id);
		dojo.attr(this.selectcontactlabel, 'for', this.selectContactNode.id);
		this.addContactControl.set("callback", dojo.hitch(this, this._UpdateAfterAdd ));
		this.addContactControl.Disabled( true );
		if ( this.mustexists==true )
		{
			dojo.addClass(this.select_view,"prmaxhidden");
			this.selectContactNode.set("checked",true);
			dojo.addClass(this.displayname,"prmaxhidden");
			dojo.addClass(this.contactlist.domNode,"prmaxrequired");
		}

		if (this.nonew == true )
			dojo.addClass(this.newbutton.domNode,"prmaxhidden");


		if ( this.required == true )
		{
			dojo.addClass(this.contactlist.domNode,"prmaxrequired");
		}

		this.inherited(arguments);

	},
	_setCheckedAttr:function( value )
	{
		this.nocontactNode.set("checked",value);
		this.selectContactNode.set("checked",true);
		this._ContactMode();
	},
	setNoContact:function()
	{
		this.nocontactNode.set("checked",true);
		this._ContactMode();
	},
	_getValueAttr:function( )
	{
		return this.contactlist.get("value");
	},
	_setValueAttr:function( value )
	{
		this.contactlist.set("value", value );
	},
	isValid:function()
	{
		var rvalid = true ;
		var valid = true;

		var v = this.contactlist.get("value");
		if ( v=="" || v == -1 || v==0 || v==null)
			valid = false;
		if (this.required==true)
		{
			if (valid==false)
				rvalid = false;
		}
		else
		{
			if ( this.nocontactNode.get("checked")==false && valid==false)
			{
				rvalid = false;
			}
		}
		return rvalid;
	},
	isFocusable: function()
	{
		return true;
	},
	focus: function()
	{
		this.contactlist.focus();
	},
	Clear:function()
	{
		this.contactlist.set("value",null);
		this._shopadd = false;
		this._AddContactShow();
	},
	destroy: function()
	{
		this.inherited(arguments);
		delete this.contactstore;
	},
	_ContactMode:function()
	{
		var mode = this.nocontactNode.get("checked");
		dojo.removeClass(this.selectContactForm, mode?"prmaxvisible":"prmaxhidden");
		dojo.addClass(this.selectContactForm, mode?"prmaxhidden":"prmaxvisible");

		if (mode)
			dojo.removeClass(this.contactlist, "prmaxrequired");
		else
			dojo.addClass(this.contactlist, "prmaxrequired");

		this.contactlist.set("disabled" , mode);
		this._shopadd = false;
		this._AddContactShow( );
	},
	_AddContactShow:function( )
	{
		if (this._shopadd == false )
		{
			dojo.removeClass(this.addContactForm, "prmaxvisible");
			dojo.addClass(this.addContactForm, "prmaxhidden");
			this.addContactControl.Disabled( true );
			 this._shopadd = true;
		}
		else
		{
			dojo.removeClass(this.addContactForm, "prmaxhidden");
			dojo.addClass(this.addContactForm, "prmaxvisible");
			this.addContactControl.Disabled( false );
			this.addContactControl.focus();
			 this._shopadd = false;
		}
	},
	_UpdateAfterAdd:function(  contact )
	{
		this.contactlist.set("value",contact.contactid);
		this._shopadd = false;
		this._AddContactShow();
	}
});
