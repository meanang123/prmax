require({cache:{
'url:research/questionnaires/templates/Coverage.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"researchprojectitemid\">\r\n\t\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" width=\"150px\">Geo. Coverage</td><td ><div data-dojo-attach-point=\"coverage\" data-dojo-type=\"prcommon2/geographical/Geographical\" data-dojo-props='name:\"coverage\",selectonly:true,size:6,displaytitle:\"\",startopen:true,title:\"Select\"'></div></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\">User FeedBack</td></tr>\r\n\t\t\t\t<tr><td style=\"padding:5px\" class=\"prmaxrowemphasise\" colspan=\"2\" data-dojo-attach-point=\"feedback\"></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\", style:\"width:100%;height:40px;padding:5px\"' >\r\n\t\t\t<label class=\"prmaxrowtag\">Reason Code</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\"'></select>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_update_coding\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\"'></button>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"publisher_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Publisher Add\"'>\r\n\t\t<div data-dojo-attach-point=\"publisher_add_ctrl\" data-dojo-type=\"prcommon2/publisher/PublisherAdd\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Coverage.js
// Author:   Chris Hoy
// Purpose:
// Created: 04/04/2013
// To do:
//-----------------------------------------------------------------------------
//
define("research/questionnaires/Coverage", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/Coverage.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic, lang, utilities2, request , domattr ){
 return declare("research.questionnaires.Coverage",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
	},
		postCreate:function()
	{
		this.inherited(arguments);
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
	},
	load:function( projectitem, outlet, user_changes )
	{

		this.coverage.set("value",outlet.coverage ) ;
		domattr.set(this.feedback,"innerHTML","");

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 54:
					domattr.set(this.feedback, "innerHTML", change_record.value);
					break;
			}
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);
		this.savenode.cancel();
	},
	clear:function()
	{

		this.savenode.cancel();
		domattr.set(this.feedback,"innerHTML","");
	},
	_update_coding:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		// add the reason code
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");

		request.post('/research/admin/projects/user_feed_coverage',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Coverage Updated");
		}
		else
		{
			alert("Problem");
		}
		this.savenode.cancel();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	}
});
});

