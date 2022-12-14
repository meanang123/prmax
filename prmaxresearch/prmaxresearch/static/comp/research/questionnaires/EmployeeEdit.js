//-----------------------------------------------------------------------------
// Name:    prmax.questionnaires.EmployeeEdit
// Author:  Chris Hoy
// Purpose:
// Created: 19/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dijit/layout/ContentPane",
	"dojo/text!../questionnaires/templates/EmployeeEdit.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/validate",
	"research/employees/EmployeeSelect",
	"prcommon2/roles/Roles",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, ContentPane, template, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass){
 return declare("research.questionnaires.EmployeeEdit",
	[BaseWidgetAMD,ContentPane],{
	templateString:template,
	prmaxcontext:"outlet",
	constructor: function()
	{
		this._saved_call = lang.hitch(this,this._saved);
		this._error_call_back = lang.hitch(this, this._error_call);
		this._copy_interests_call = lang.hitch(this, this._copy_interests);
		this._desklist = null;
		this._count_desks = 0;		
		this._has_address_old = null;
		this._has_address_new = null;
		this._series_parent = false;
		this.outletid = -1;
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			if (this.employeeidnode.get("value")==-1)
			{
				topic.publish(PRCOMMON.Events.Employee_Quest_Add, "A" + response.objectid);
				alert("Contact added. Please verify the 'Research tab' to make sure these changes haven't effected it");
			}
			else
			{
				try
				{
					topic.publish(PRCOMMON.Events.Employee_Quest_Updated, "E" + this.employeeid, response.data, this.prmaxcontext);
				}
				catch(e)
				{
					alert(e);
				}
				alert("Contact updated. Please verify the 'Research tab' to make sure these changes haven't effected it");
			}
			
			if (response.data.series == true)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}	
			
			this._has_address_old = this._has_address_new;
			if (this._has_address_new == false)
			{
				this._clear_address();	
			}		
			if (response.data.tel != this.tel.get("value"))
			{
				this.tel.set("value", response.data.tel);
			}
			if (response.data.fax != this.fax.get("value"))
			{
				this.fax.set("value", response.data.fax);
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
	_reset_fields:function()
	{
		this.job_title_modified.clear();
		this.mobile_modified.clear();
		this.email_modified.clear();
		this.tel_modified.clear();
		this.fax_modified.clear();
		this.twitter_modified.clear();
		this.facebook_modified.clear();
		this.linkedin_modified.clear();
		this.instagram_modified.clear();
	},
	load:function( data, user_changes, outletdesks )
	{
		this._reset_fields();
		this.employeeid = -1;
		if (outletdesks)
		{
			this._count_desks = outletdesks.length;
		}

		if ( data.employeeid)
		{
			this.employeeid = data.employee.employeeid;
			this.outletid = data.outlet.outletid;
			this.employeeidnode.set("value",data.employee.employeeid);
			this.researchprojectitemid.set("value", data.researchprojectitemid);
			this.researchprojectitemchangeid.set("value",data.researchprojectitemchangeid);
			this.job_title.set("value", data.employee.job_title);
			this.email.set("value", data.comm.email);
			this.tel.set("value", data.comm.tel);
			this.fax.set("value", data.comm.fax);
			this.twitter.set("value", data.comm.twitter);
			this.facebook.set("value", data.comm.facebook);
			this.linkedin.set("value", data.comm.linkedin);
			this.instagram.set("value", data.comm.instagram);
			this.mobile.set("value", data.comm.mobile);
			this.interests_org.set("value", data.interests);
			domattr.set(this.interests,"innerHTML"," ");
			this.profile.set("value", data.employee.profile);
			this.jobroles.set("value", data.jobroles);
			this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+ data.employee.outletid + "/", idProperty:"outletdeskid"});
			this.outletdeskid.set("store",this._desklist);
			this.outletdeskid.set("value", (data.employee.outletdeskid == null)? -1 : data.employee.outletdeskid);
			domclass.remove(this.copy_keywords_btn, "prmaxhidden");
			
			if (data.contact_name_display != undefined)
				domattr.set(this.contact_name_display,"innerHTML", data.contact_name_display);
			else
				domattr.set(this.contact_name_display,"innerHTML", "");

			if (data.employee.contactid==null)
			{
				this.selectcontact.set_no_contact();
			}
			else
			{
				this.selectcontact.set("checked",false);
				this.selectcontact.contactid.set("value",data.employee.contactid);
				domattr.set(this.selectcontact.contactid.display, "innerHTML", data.contactname);				
			}
			if (data.employee.communicationid == null )
			{
				this.no_address.set("checked", false );
				this._has_address_old = false;
				this._address_show_do(false);
			}
			else
			{
				if (data.address != null )
				{
					this.no_address.set("checked", true );
					this._has_address_old = true;
					this._address_show_do(true);
					this.address1.set("value", data.address.address1);
					this.address2.set("value", data.address.address2);
					this.townname.set("value", data.address.townname);
					this.county.set("value", data.address.county);
					this.postcode.set("value",data.address.postcode);
				}
				else
				{
					this.no_address.set("checked", false );
					this._has_address_old = false;
					this._clear_address();
				}
			}
			for (var key in user_changes)
			{
				var  change_record = user_changes[key]

				switch (change_record.fieldid)
				{
					case 2: // job_title
						this.job_title_modified.load(change_record.value, data.employee.job_title, this.job_title);
						break;
					case 7: // mobile
						this.mobile_modified.load(change_record.value, data.comm.mobile, this.mobile);
						break;
					case 4: // email
						this.email_modified.load(change_record.value, data.comm.email, this.email);
						break;
					case 5: // tel
						this.tel_modified.load(change_record.value, data.comm.tel, this.tel);
						break;
					case 6: // fax
						this.fax_modified.load(change_record.value, data.comm.fax, this.fax);
						break;
					case 25: // twitter
						this.twitter_modified.load(change_record.value, data.comm.twitter, this.twitter);
						break;
					case 26: // facebook
						this.facebook_modified.load(change_record.value, data.comm.facebook, this.facebook);
						break;
					case 28: // linkedin
						this.linkedin_modified.load(change_record.value, data.comm.linkedin, this.linkedin);
						break;
					case 72: // instagram
						this.instagram_modified.load(change_record.value, data.comm.instagram, this.instagram);
						break;
					case 12: // address 1
						var address1 = "";
						this.address1_modified.load(change_record.value, data.address == null ? "" :data.address.address1, this.address1);
						break;
					case 13: // address 2
						this.address2_modified.load(change_record.value, data.address == null ? "" : data.address.address2, this.address2);
						break;
					case 14: // townname
						this.townname_modified.load(change_record.value, data.address == null ? "" : data.address.townname, this.townname);
						break;
					case 15: // county
						this.county_modified.load(change_record.value, data.address == null ? "" : data.address.county, this.county);
						break;
					case 16: // post code
						this.postcode_modified.load(change_record.value, data.address == null ? "" : data.address.postcode, this.postcode);
						break;
					case 8: // interests
						domattr.set(this.interests,"innerHTML",change_record.value);
						break;
					case 49: // has address flag
						this.no_address.set("checked", change_record.value );
						this._address_show_do( change_record.value );
						break;

				}
			}
		}
		else
		{
			this.employeeidnode.set("value", -1);
			this.outletid = data.outletid;
			this.researchprojectitemid.set("value", data.researchprojectitemid);
			this.researchprojectitemchangeid.set("value",data.researchprojectitemchangeid);
			this.job_title.set("value", data.job_title);
			this.email.set("value", data.email);
			this.tel.set("value", data.tel);
			this.fax.set("value", data.fax);
			this.twitter.set("value", data.twitter);
			this.facebook.set("value", data.facebook);
			this.linkedin.set("value", data.linkedin);
			this.instagram.set("value", data.instagram);
			this.mobile.set("value", data.mobile);
			this.profile.set("value", "");
			this.jobroles.set("value", null);
			this.selectcontact.set_no_contact();
			this.no_address.set("checked", data.alt_address );
			this._address_show_do(data.alt_address);
			this.address1.set("value", data.address1);
			this.address2.set("value", data.address2);
			this.townname.set("value", data.townname);
			this.county.set("value", data.county);
			this.postcode.set("value", data.postcode);
			domattr.set(this.interests,"innerHTML", data.interests);
			this.interests_org.set("value", null );
			if (data.contact_name_display != undefined)
				domattr.set(this.contact_name_display,"innerHTML", data.contact_name_display);
			else
				domattr.set(this.contact_name_display,"innerHTML", "");
			this.selectcontact.set("checked",false);
			this.selectcontact.set("value",null);
			domattr.set(this.selectcontact.contactid.display, "innerHTML", "Select Contact");
			this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+ data.outletid + "/", idProperty:"outletdeskid"});
			this.outletdeskid.set("store",this._desklist);
			this.outletdeskid.set("value", (data.outletdeskid == null)? -1 : data.outletdeskid);
			domclass.add(this.copy_keywords_btn, "prmaxhidden");
		}
		this.savenode.cancel();
	},
	_save:function()
	{
		if ( utilities2.form_validator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		
		if (this._count_desks != 0 && (this.outletdeskid.get("value") == '-1' || this.outletdeskid.get("value") == -1))
		{
			alert('Please enter Desk');
			this.savenode.cancel();
			throw "N";
		}
		
		var formdata = this.formnode.get("value");
		formdata["has_address_old"] = this._has_address_old;
		formdata['outletid'] = this.outletid;
		if (this._has_address_new != null)
		{
			formdata["has_address_new"] = this._has_address_new;
		}
		else 
		{
			formdata["has_address_new"] = this._has_address_old;
		}
		url = (this.employeeid == -1 ) ? '/research/admin/projects/new_employee' :  '/research/admin/projects/update_employee' ;
		request.post(url,utilities2.make_params({ data : formdata})).then
			(this._saved_call, this._error_call_back);
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
		this.profile.set("value","");
		this.selectcontact.clear();
		this.reason.set("value","");
		this.no_address.set("checked", false);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.outletdeskid.set("value",-1);
		this.interests_org.set("");
		this._clear_address();
		domattr.set(this.interests,"innerHTML","");
		this.jobroles.clear();
	},
	_address_show:function()
	{
		this._address_show_do ( this.no_address.get("checked") ) ;
		if (this.no_address.get('checked'))
		{
			this._has_address_old = false;
			this._has_address_new = true;
		}
		else
		{
			this._has_address_old = true;
			this._has_address_new = false;	
		}		
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
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_clear_address:function()
	{
		this._address_show_do(false);
		this.address1.set("value", "");
		this.address2.set("value", "");
		this.townname.set("value", "");
		this.county.set("value", "");
		this.postcode.set("value","");	
	},	
	_copy_keywords_btn:function()
	{
		//reasoncodeid = 8 --> Prmax Research
		request.post('/research/admin/employees/research_copy_interests_outlet_to_employee',
				utilities2.make_params({data:{employeeid:this.employeeid, outletid:this.outletid, reasoncodeid:8}})).then
				(this._copy_interests_call);
	},	
	_copy_interests:function(response)
	{
		if (response.success == 'OK')
		{
			this.interests_org.set("value", response.data.interests);
		}
	},	
});
});
