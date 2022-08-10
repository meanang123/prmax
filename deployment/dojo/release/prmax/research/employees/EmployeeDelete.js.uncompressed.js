require({cache:{
'url:research/employees/templates/EmployeeDelete.html':"<div style=\"width:400px\" >\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\" '>\r\n\t\t<input data-dojo-attach-point=\"employeeid\" data-dojo-props='name:\"employeeid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" data-dojo-attach-point=\"header\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td ><select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td></td><td><label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"delete_completely\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"delete_option\",\"class\":\"prmaxdefault\",checked:\"checked\",type:\"radio\",value:\"1\"'/>Delete completely</label></td></tr>\r\n\t\t\t<tr><td></td><td><label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"delete_and_retain\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"delete_option\",\"class\":\"prmaxdefault\",type:\"radio\",value:\"2\"'/>Delete contact and retain role</label></td></tr>\r\n\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td align=\"left\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_close\">Close</button></td>\r\n\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_delete_submit\">Delete Contact</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/employees/EmployeeDelete", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/EmployeeDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, domattr ,domclass){
 return declare("research.employees.EmployeeDelete",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._deleted_contact_call_back = lang.hitch(this, this._deleted_contact_call );
	},
	postCreate:function()
	{
		this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Del_Codes());
		this.inherited(arguments);
	},
	_delete_submit:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}
		if  ( confirm ("Delete " + domattr.get(this.heading,"innerHTML" ) + " ?" ))
		{
			request.post('/research/admin/employees/research_employee_delete',
				utilities2.make_params({data:this.form.get("value")})).then
				( this._deleted_contact_call_back);
		}
	},
	_deleted_contact_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			topic.publish(PRCOMMON.Events.Employee_Deleted, response.data);
			if ( response.data.has_deleted == false )
				alert("Contact deleted but retained role. Please verify the 'Research tab' to make sure these changes haven't effected it");
			else
				alert("Contact Deleted. Please verify the 'Research tab' to make sure these changes haven't effected it");
			if (response.data.series == true)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}				
			this.clear();
			this._dialog.hide()
		}
		else
		{
			alert ( "Problem Deleteing Contact" ) ;
		}
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	},
	// styandard clear function
	clear:function()
	{
		this.employeeid.set("value", -1 ) ;
		this.reasoncodes.set("value",null);
		domattr.set(this.delete_completely, "checked", "checked");
	},
	load:function( employeeid, job_title , name )
	{
		this.employeeid.set("value", employeeid );
		domattr.set(this.heading,"innerHTML" , job_title + "(" + name + ")" ) ;
		this.reasoncodes.set("value", null);
		domattr.set(this.delete_completely, "checked", "checked");
	},
	_close:function()
	{
		this._dialog.hide();
	}

});
});





