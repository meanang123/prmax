//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dijit/layout/ContentPane",
	"dojo/text!../employees/templates/EmployeeEdit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/window",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/validate",
	"research/employees/EmployeeSelect",
	"prcommon2/roles/Roles",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, ContentPane, template, BorderContainer, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass, win){
 return declare("research.employees.EmployeeEdit",
	[BaseWidgetAMD,BorderContainer],{
	templateString:template,
	employeeid:-1,
	outletid:-1,
	gutters:false,
	constructor: function()
	{
		this._saved_call = lang.hitch(this,this._saved);
		this._load_call = lang.hitch(this,this._load);
		this._desklist = null;

		this.reasoncode_data_add = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
		this.reasoncode_data_upd = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			if (this.employeeidnode.get("value")==-1)
			{
				this.employeeidnode.set("value",response.employee.employeeid);
				topic.publish(PRCOMMON.Events.Employee_Add, response.employee);
				alert("Contact added");
				this._close();
			}
			else
			{
				topic.publish(PRCOMMON.Events.Employee_Updated, response.employee);
				alert("Contact updated");
			}
		}
		else
		{
			alert("Problem with Employee ");
		}

		this.savenode.cancel();
	},
	postCreate:function()
	{
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);	
		this.instagram_show.set("source",this.instagram);	
		this.inherited(arguments);
	},
	load:function( employeeid, outletid, sourceid )
	{
		this._sourceid = sourceid;
		this.outletid = outletid;
		this.employeeid = employeeid;
		this.outletidnode.set("value",this.outletid);
		this.employeeidnode.set("value",this.employeeid);
		if (outletid != null )
		{
			this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+outletid + "/", idProperty:"outletdeskid"});
			this.outletdeskid.set("store",this._desklist);
		}
		if (this.employeeid!=-1)
		{
			this.reasoncodeid.store = this.reasoncode_data_upd;
			request.post('/research/admin/employees/research_get_edit',
				utilities2.make_params({data:{employeeid:this.employeeid}})).then
				(this._load_call);
		}
		else
		{
			this.reasoncodeid.store = this.reasoncode_data_add;
			this.clear();
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			this.savenode.set('disabled',false);
			domclass.add(this.delete_button,"prmaxhidden");
		}
	},
	_load:function(response)
	{
		this.employeeidnode.set("value", response.data.employee.employeeid);
		this.job_title.set("value", response.data.employee.job_title);
		this.email.set("value", response.data.comm.email);
		this.tel.set("value", response.data.comm.tel);
		this.fax.set("value", response.data.comm.fax);
		this.twitter.set("value", response.data.comm.twitter);
		this.facebook.set("value", response.data.comm.facebook);
		this.linkedin.set("value", response.data.comm.linkedin);
		this.instagram.set("value", response.data.comm.instagram);
		this.mobile.set("value", response.data.comm.mobile);
		this.interests.set("value", response.data.interests);
		this.profile.set("value", response.data.employee.profile);
		this.jobroles.set("value", response.data.jobroles);

		this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+response.data.employee.outletid + "/", idProperty:"outletdeskid"});
		this.outletdeskid.set("store",this._desklist);
		this.outletdeskid.set("value", (response.data.employee.outletdeskid == null)? -1 : response.data.employee.outletdeskid);

		if (response.data.employee.contactid==null)
		{
			this.selectcontact.set_no_contact();
		}
		else
		{
			this.selectcontact.set("checked",false);
			this.selectcontact.set("value",response.data.employee.contactid);
		}
		if (response.data.employee.communicationid == null )
		{
			this.no_address.set("checked", false );
			this._address_show_do(false);
		}
		else
		{
			if (response.data.address != null )
			{
				this.no_address.set("checked", true );
				this._address_show_do(true);
				this.address1.set("value", response.data.address.address1);
				this.address2.set("value", response.data.address.address2);
				this.townname.set("value", response.data.address.townname);
				this.county.set("value", response.data.address.county);
				this.postcode.set("value",response.data.address.postcode);
			}
			else
			{
				this.no_address.set("checked", false );
				this._address_show_do(false);
				this.address1.set("value", "");
				this.address2.set("value", "");
				this.townname.set("value", "");
				this.county.set("value", "");
				this.postcode.set("value","");
			}
		}

		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.savenode.set('disabled',false);

		//cannot delete primary
		if (response.data.isprimary == false)
			domclass.remove(this.delete_button,"prmaxhidden");
		else
			domclass.add(this.delete_button,"prmaxhidden");

		this.job_title.focus();
		win.scrollIntoView(this.selectcontact.domNode);

	},
	_save:function()
	{
		if ( utilities2.form_validator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		var formdata = this.formnode.get("value");

		formdata["reasoncodeid"] = this.reasoncodeid.get("value");

		url = (this.employeeid == -1 ) ? '/research/admin/employees/research_new' :  '/research/admin/employees/research_update' ;
		request.post(url,utilities2.make_params({ data : formdata})).then
			(this._saved_call);
	},
	clear:function()
	{
		this.employeeidnode.set("value",-1);
		this.selectcontact.clear();
		this.job_title.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.selectcontact.clear();
		this.no_address.set("checked", false);
		this._address_show_do ( false );
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.jobroles.clear();
		this.outletdeskid.set("value",-1);
		this._desklist = null;
	},
	_close:function()
	{
		this.clear();
		this._dialog.hide();
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	},
	_address_show:function()
	{
		this._address_show_do ( this.no_address.get("checked") ) ;
	},
	_address_show_do:function ( show_it )
	{
		var _HidFields = ["addr1","addr2","addr3","addr4","addr5"];

		if ( show_it == false )
		{
			for ( var key in _HidFields )
				domclass.add(this[_HidFields[key]], "prmaxhidden");
		}
		else
		{
			for ( var key in _HidFields )
				domclass.remove(this[_HidFields[key]], "prmaxhidden");
		}
	},
	_delete_contact:function()
	{
		topic.publish("/employee/delete_request", this.employeeidnode.get("value"), this._sourceid);
	}
});
});
