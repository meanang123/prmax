require({cache:{
'url:research/employees/templates/PersonNew.html':"<div style=\"border: 1px solid black\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<table cellspacing =\"0\" cellpadding=\"0\" width=\"100%\">\r\n\t\t<tr><td class=\"prmaxrowtag\">${displayname}</td><td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Prefix</td><td ><input  data-dojo-attach-point=\"prefix\" data-dojo-props='\"class\":\"prmaxinput\",name:\"prefix\",style:\"width: 2em;\",type:\"text\",trim:true'  data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">First Name</td><td ><input data-dojo-props='style:\"width: 5em;\",\"class\":\"prmaxinput\",name:\"firstname\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"firstname\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Surname</td><td><input data-dojo-attach-point=\"familyname\"  data-dojo-props='\"class\":\"prmaxrequired\",name:\"familyname\",type:\"text\",trim:true,required:true,style:\"width: 12em\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\" data-dojo-props='name:\"countryid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",autoComplete:true'/></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Source</td><td ><select data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"sourcetypeid\" data-dojo-props='name:\"sourcetypeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'  /></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Reason</td><td ><select data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"reasoncodeid\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'  /></td></tr>\r\n\t\t<tr><td colspan=\"2\" align=\"right\" valign=\"bottom\" ><button data-dojo-attach-event=\"onClick:_add_contact\" data-dojo-attach-point=\"addcontactnode\" type=\"button\" data-dojo-type=\"dijit/form/Button\" label=\"Add\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeNew
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/employees/PersonNew", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/PersonNew.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, ItemFileReadStore ){
 return declare("research.employees.PersonNew",
	[BaseWidgetAMD],{
	displayname:"New Person",
	templateString: template,
	constructor: function()
	{
		this._sourcetypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=sourcetypes"});

		this._add_call_back = lang.hitch(this,this._add_call);
		this._check_call_back = lang.hitch(this,this._check_call);
		this._parentcallback = null;
		this._dialog = null;
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.sourcetypeid.set("store", this._sourcetypes);
		this.sourcetypeid.set("value", 2);
		
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.inherited(arguments);
	},
	load:function(dialog)
	{
		this._dialog = dialog;
	},
	_add_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if ( confirm("Add Contact?"))
		{
			request.post('/research/admin/contacts/research_check',
				utilities2.make_params({ data : this.form.get("value")})).
				then(this._check_call_back);
		}		
	},
	_check_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Contact '" + response.data.firstname+ " " + response.data.familyname + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				request.post('/research/admin/contacts/research_addnew',
					utilities2.make_params( {data:this.form.get("value")})).then
					(this._add_call_back);			
			}
		}
		else if (response.success == 'DU')
		{
			if ((response.exist == true && confirm("Contact already exist with same Firstname and Surname.\nDo you want to proceed?")) || response.exist == false)
			{
				request.post('/research/admin/contacts/research_addnew',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);				
			}		
		}
		else if (response.success == 'DEL+DU')
		{
			if (confirm("Contact '" + response.data.deletionhistory.firstname+ " " + response.data.deletionhistory.familyname + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				if ((response.data.exist == true && confirm("Contact already exist with same Firstname and Surname.\nDo you want to proceed?")) || response.data.exist == false)
				{
					request.post('/research/admin/contacts/research_addnew',
						utilities2.make_params({ data : this.form.get("value")})).
						then(this._add_call_back);				
				}
			}
		}
		else if (response.success == 'OK')
		{
			request.post('/research/admin/contacts/research_addnew',
				utilities2.make_params({ data : this.form.get("value")})).
				then(this._add_call_back);				
		
		}
	},
	_add_call:function( response )
	{
		console.log(response);

		if (response.success=="OK")
		{
			alert("Contact Added");
			if ( this._parentcallback )
				this._parentcallback(response.contact);
			topic.publish(PRCOMMON.Events.Person_Added, response.contact);
			this._clear_add_form();
			if (this._dialog)
				this._dialog.hide();
		}
		else
		{
				alert("Failed");
		}
	},
	clear:function()
	{
		this._clear_add_form();
	},
	_clear_add_form:function()
	{
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.sourcetypeid.set("value", 2);
	},
	_setCallbackAttr:function( func)
	{
		this._parentcallback = func;
	},
	focus:function()
	{
		this.prefix.focus();
	},
	disabled:function( status )
	{
		this.prefix.set("disabled",status);
		this.firstname.set("disabled",status);
		this.familyname.set("disabled",status);
		this.reasoncodeid.set("disabled",status);
		this.sourcetypeid.set("disabled", status);
	}
});
});
