//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeSelect
// Author:  Chris Hoy
// Purpose: This select a contact record or creates a new one and select it
//			exposed to a form contactid and contacttype (N,S) N is for no
//			selection
// Created: 11/02/2009
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.employee.EmployeeSelect");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.employee.EmployeeSelect",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	required:false,
	name:"eselect",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.employee","templates/employee_select.html"),
	constructor: function() {
		this.contactstore=new dojox.data.QueryReadStore(
			{url:"/contacts/lookuplist",
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
		});
	},
	postCreate:function()
	{
		this.contactlist.store = this.contactstore ;
		this.nocontactlabel['for'] = this.nocontactNode.id;
		this.selectcontactlabel['for'] = this.selectContactNode.id;
		this.addContactControl.set("callback", dojo.hitch(this, this._UpdateAfterAdd ));
	},
	_setCheckedAttr:function( value )
	{
		this.nocontactNode.set("checked",value);
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
		this._AddContactShow(true);
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
		if (mode)
			this._AddContactShow(true);
	},
	_AddContactShow:function( hide )
	{
		if (hide == true)
		{
			dojo.removeClass(this.addContactForm, "prmaxvisible");
			dojo.addClass(this.addContactForm, "prmaxhidden");
		}
		else
		{
			dojo.removeClass(this.addContactForm, "prmaxhidden");
			dojo.addClass(this.addContactForm, "prmaxvisible");
			this.addContactControl.focus();
		}
	},
	_UpdateAfterAdd:function(  contact )
	{
		this.contactlist.set("value",contact.contactid);
		this._AddContactShow(true);
	}
});
