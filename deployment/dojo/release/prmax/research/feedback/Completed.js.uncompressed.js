require({cache:{
'url:research/feedback/templates/Completed.html':"<div style=\"width:600px;height:200px;\" >\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-attach-point=\"bounceddistributionid\" data-dojo-props='type:\"hidden\",name:\"bounceddistributionid\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Has Been Researched?</td><td><input data-dojo-attach-point=\"has_been_research\" data-dojo-props='\"class\":\"prmaxbutton\", type:\"text\", name:\"has_been_research\"' data-dojo-type=\"dijit/form/CheckBox\" ></td><td>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td >\r\n\t\t\t<select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='searchattr:\"name\",labeltype:\"html\",name:\"reasoncodeid\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Description</td><td  ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"reason\" data-dojo-props='name:\"reason\",\"class\":\"prmaxrowtag\",required:true,style:\"width:99%;height:80%;\"' data-dojo-type=\"dijit/form/Textarea\"></textarea></div></td></tr>\r\n\t\t\t<tr><td><br/><br/></td></tr>\r\n\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-type=\"dijit/form/Button\" type=\"button\" data-dojo-attach-event=\"onClick:_complete_submit\" name=\"submit\">Bounce Email Completed</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>"}});
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
define("research/feedback/Completed", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../feedback/templates/Completed.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, ItemFileReadStore,lang,topic ){
 return declare("research.feedback.Completed",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._completed_call_back = lang.hitch(this, this._completed_call );
	},
	postCreate:function()
	{
		this.reasoncodes.set("store", PRCOMMON.utils.stores.Research_Reason_Add_Email());

		this.inherited(arguments);
	},
	_complete_submit:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";

		}

		if ( confirm("Complete Email?"))
		{
			request.post('/research/admin/bemails/completed',
				utilities2.make_params({data:this.form.get("value")})).then
				(this._completed_call_back);
		}
	},
	_completed_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Completed");
			this.clear();
			topic.publish(PRCOMMON.Events.BouncedEmail_Completed, this.bounceddistributionid.get("value"));
		}
		else
		{
			alert ( "Problem Completing Bounnced Email" ) ;
		}
	},
	// styandard clear function
	clear:function()
	{
		this.bounceddistributionid.set("value", -1 ) ;
		this.reasoncodes.set("value",null);
		this.reason.set("value","");
		this.has_been_research.set("value", false);
	},
	load:function( bounceddistributionid )
	{
		this.bounceddistributionid.set("value", bounceddistributionid );
		this.reasoncodes.set("value", null);
		this.has_been_research.set("value", false);
		this.reason.focus();
	},
	focus:function()
	{
		this.reason.focus();
	}
});
});





