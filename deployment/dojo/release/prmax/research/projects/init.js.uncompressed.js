require({cache:{
'url:research/projects/templates/init.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\"'>\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border =\"0\" style=\"margin-left:10px\">\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td><label>Project Status</label>\r\n\t\t\t\t<input align=\"left\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",name:\"status_check\"' data-dojo-attach-point=\"status_check\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_status_change\"/></td>\r\n\t\t\t\t<td><select data-dojo-props='\"class\":\"prmaxhidden\"' data-dojo-attach-point=\"researchprojectstatusid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"researchprojectstatusid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\"'/></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t\t<div style=\"height:320px;width:550px;float:left;padding-left:10px;padding-top:15px;margin:0px\" data-dojo-attach-point=\"researchers_node\">\r\n\t\t\t<div data-dojo-attach-point=\"owners\" data-dojo-props='style:\"width:550px\",name:\"owners\"' data-dojo-type=\"research/projects/researchers\"></div>\r\n\t\t</div>\r\n\t\t<div align=\"right\" padding-right=\"10px\"><button data-dojo-attach-event=\"onClick:_assign\" data-dojo-attach-point=\"assignbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-list-alt fa-2x\",type:\"button\",busyLabel:\"Please Wait Assigning...\",label:\"Assign\",\"class\":\"btnright\"'></button></div>\r\n\t</form>\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    init.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: Oct 2019
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/projects/init", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/init.html",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",	
	"dojo/data/ItemFileWriteStore",	
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"research/projects/researchers"
	],
	function(declare, BaseWidgetAMD, template, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore, ItemFileWriteStore, JsonRest, Observable){

 return declare("research.projects.init",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
	
		this.researchprojectstatus = new ItemFileReadStore({url:"/common/lookups?searchtype=researchprojectstatus&nofilter=1"});
		this._assign_call_back = lang.hitch(this,this._assign_call);
		this._researchprojectid = null;

	},
	postCreate:function()
	{
		this.researchprojectstatusid.set("store",PRCOMMON.utils.stores.Research_Project_Status());	
		this.researchprojectstatusid.set("value",-1);
		this.inherited(arguments);
		
	},
	load:function(dialog, researchprojectid)
	{
		this._dialog = dialog;	
		this._researchprojectid = researchprojectid;
		this.assignbtn.cancel();
	},
	
	_assign:function()
	{
		if (utilities2.form_validator(this.form) == false)
		{
			alert("Please Enter Details");
			this.assignbtn.cancel();
			return false;
		}

		var data = this.form.get("value");
		data['researchprojectstatusid'] = this.researchprojectstatusid.get("value");
		data['researchprojectid'] = this._researchprojectid;
		data['status_check'] = this.status_check.checked;
		this.assignbtn.makeBusy();

		request.post('/research/admin/projects/projectitems_assign',
			utilities2.make_params({data: data})).
			then(this._assign_call_back);

	},
	_assign_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Assignments have been completed");
			this._dialog.hide();
			topic.publish('researchprojectitem/update_assignment');
		}
		else
		{
			alert("Problem assign project items to researchers");
		}

		this.assignbtn.cancel();
	},	
	_status_change:function()
	{
		if (this.status_check.checked)
		{
			domclass.remove(this.researchprojectstatusid.domNode, "prmaxhidden");
		}
		else
		{
			domclass.add(this.researchprojectstatusid.domNode, "prmaxhidden");
		}
	}

});
});
