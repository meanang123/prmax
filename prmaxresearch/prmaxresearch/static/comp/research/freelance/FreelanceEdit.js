//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../freelance/templates/FreelanceEdit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",	
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"research/employees/EmployeeSelect",
	"dojox/validate",
	"prcommon2/interests/Interests",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox",
	"research/audit/AuditViewer",
	"research/ResearchDetails",
	"research/freelance/FreelanceDelete",
	"prcommon2/web/WebButton",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, json, ItemFileReadStore, lang, topic, domattr ){
 return declare("research.freelance.FreelanceEdit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._saved_call_back = lang.hitch(this,this._saved);
		this._load_call_back= lang.hitch(this,this._loaded);
		this._deleted_call_back= lang.hitch(this, this._deleted_call);
		this.outletid = -1 ;
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.prmax_outlettypeid.set("value",42);

		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());
		this.delete_ctrl.set("dialog", this.delete_dlg);

		this.blog_show.set("source",this.blog);
		this.www_show.set("source",this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);
		this.instagram_show.set("source",this.instagram);
		this.inherited(arguments);
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Updated");
			if (response.data.comm.tel != this.tel.get("value"))
			{
				this.tel.set("value", response.data.comm.tel)
			}
			if (response.data.comm.fax != this.fax.get("value"))
			{
				this.fax.set("value", response.data.comm.fax)
			}
			this._clear_reason();
		}
		else
		{
			alert("Failed to update ");
		}
		this.savenode.cancel();
	},
	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},
	_save:function()
	{
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		var data = this.requirednode.get("value");
		data['outletid'] = this.outletid;
		request.post('/research/admin/outlets/research_freelance_check',
			utilities2.make_params({ data : data})).
			then(this._deleted_call_back);		
	},
	_deleted_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Freelance '" + response.data.outlet_name + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				data = 	this.requirednode.get("value");
				data["reasoncodeid"] = this.reasoncodeid.get("value");
				data['outletid'] = this.outletid;
				request.post('/research/admin/outlets/freelance_research_update',
					utilities2.make_params( {data:data})).then
					(this._saved_call_back);			
			}
		}
		else
		{
			data = 	this.requirednode.get("value");
			data["reasoncodeid"] = this.reasoncodeid.get("value");
			data['outletid'] = this.outletid;
			request.post('/research/admin/outlets/freelance_research_update',
				utilities2.make_params( {data:data})).then
				(this._saved_call_back);			
		}
		this.savenode.cancel();	
	},

	
	new_freelance:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.savenode.cancel();
		this.selectcontact.clear();
		this.outletid = -1;
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.countryid.set("value",1);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.blog.set("value","");
		this.prmax_outlettypeid.set("value",42);
		this._clear_reason();
	},
	load:function( outletid )
	{
		this.outletid = outletid;
		this._name = "";
		this.outlet_audit_ctrl.load ( this.outletid ) ;

		request.post ('/research/admin/outlets/freelance_get_for_load',
			utilities2.make_params({ data : {outletid: outletid} })).then
			(this._load_call_back);
	},
	_loaded:function( response )
	{
		if  ( response.success == "OK" )
		{
			var data = response.data;

			this._name = data.contact.familyname;

			this.selectcontact.contactid.set("value",data.employee.contactid);
			domattr.set(this.selectcontact.contactid.display, "innerHTML", data.contactname);
			this.sortname.set("value",data.outlet.sortname);
			this.job_title.set("value",data.employee.job_title);
			this.outletid = data.outlet.outletid;
			this.address1.set("value",data.address.address1);
			this.address2.set("value",data.address.address2);
			this.townname.set("value",data.address.townname);
			this.county.set("value",data.address.county);
			this.postcode.set("value",data.address.postcode);
			this.www.set("value", data.outlet.www);
			this.email.set("value",data.comm.email);
			this.tel.set("value",data.comm.tel);
			this.fax.set("value",data.comm.fax);
			this.mobile.set("value",data.comm.mobile);
			this.interests.set("value",data.interests);
			this.profile.set("value",data.profile);
			this.countryid.set("value",data.outlet.countryid);
			this.twitter.set("value",data.comm.twitter);
			this.facebook.set("value",data.comm.facebook);
			this.linkedin.set("value",data.comm.linkedin);
			this.instagram.set("value",data.comm.instagram);
			this.blog.set("value",data.comm.blog);
			this.prmax_outlettypeid.set("value",data.outlet.prmax_outlettypeid);


			this._clear_reason();
			this.outlet_research_ctrl.load( data.outlet.outletid,19 );
		}
		else
		{
			alert("Problem Loading freelancer");
		}
	},
	_delete:function()
	{
		this.delete_ctrl.load ( this.outletid ,this._name);
		this.delete_dlg.show();
	}
});
});
