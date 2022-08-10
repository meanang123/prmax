require({cache:{
'url:research/questionnaires/templates/EmployeeDelete.html':"<div >\r\n\t<div data-dojo-attach-point=\"dialog_ctrl\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Contact\",style:\"width:400px\"'>\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"objectid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"objectid\">\r\n\t\t\t\t<p class=\"prmaxrowtag\" style=\"text-align:center\" data-dojo-attach-point=\"employee_name\"></p>\r\n\t\t\t\t<br/>\r\n\t\t\t\t<label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"delete_completely\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"delete_option\",\"class\":\"prmaxdefault\",checked:\"checked\",type:\"radio\",value:\"1\"'/>Delete completely</label><br/>\r\n\t\t\t\t<label class=\"prmaxrowtag\"><input data-dojo-attach-point=\"delete_and_retain\" data-dojo-type=\"dijit/form/RadioButton\" data-dojo-props='name:\"delete_option\",\"class\":\"prmaxdefault\",type:\"radio\",value:\"2\"'/>Delete contact and retain role</label><br/>\r\n\t\t\t\t<br/>\r\n\t\t\t\t<button data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",type:\"button\",label:\"Delete Contact\",busyLabel:\"Please Wait Saving ...\"' data-dojo-attach-event=\"onClick:_delete_contact\"></button>\r\n\t\t\t\t<br/>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.questionnaires.EmployeeDelete
// Author:  Chris Hoy
// Purpose:
// Created: 19/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/questionnaires/EmployeeDelete", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dijit/layout/ContentPane",
	"dojo/text!../questionnaires/templates/EmployeeDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, ContentPane, template, request, utilities2, lang, topic, domattr ,domclass){
 return declare("research.questionnaires.EmployeeDelete",
	[BaseWidgetAMD,ContentPane],{
	templateString:template,
	constructor: function()
	{
		this._delete_call_back = lang.hitch(this,this._delete_call);
		this._error_call_back = lang.hitch(this, this._error_call);

	},
	load:function(objectid,job_title,contactname)
	{
		this.objectid.set("value",objectid);
		domattr.set(this.employee_name,"text",job_title + contactname);
		this.savenode.cancel();
		this.dialog_ctrl.show();
	},
	_delete_call:function(response)
	{
		if (response.success=="OK")
		{
			alert("Contact Deleted");
			this.dialog_ctrl.hide();
			this.objectid.set("value","-1");
			domattr.set(this.employee_name,"text","");
			if (response.data.series == true)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}
			topic.publish("/quest/emp_del", response.data.objectid);
		}
		else
		{
			alert("Problem with Employee ");
		}

		this.savenode.cancel();
	},
	_delete_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/projects/delete_employee_feedback',
			utilities2.make_params({ data : this.form.get("value")})).then
				(this._delete_call_back, this._error_call_back);
	},
	clear:function()
	{
		domattr.set(this.employee_name,"innerHTML","");
		this.objectid.set("value","-1");
	},
	_error_call:function()
	{
		this.savenode.cancel();
	}
});
});
