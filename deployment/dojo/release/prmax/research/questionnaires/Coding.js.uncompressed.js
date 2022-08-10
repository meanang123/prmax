require({cache:{
'url:research/questionnaires/templates/Coding.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"researchprojectitemid\">\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Supplement of</td><td><div data-dojo-type=\"prcommon2/outlet/OutletSelect\" data-dojo-attach-point=\"supplementofid\" data-dojo-props='name:\"supplementofid\"'></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"suppllementofid_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Outlet Supplements</td><td><div data-dojo-type=\"prcommon2/outlet/SelectMultipleOutlets\" data-dojo-attach-point=\"supplements\" data-dojo-props='value:\"\",name:\"supplements\"'></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"supplements_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Series Parent</td><td><div data-dojo-type=\"prcommon2/outlet/OutletSelect\" data-dojo-attach-point=\"seriesparentid\" data-dojo-props='name:\"seriesparentid\"'></div></td><tr>\r\n\t\t\t\t<tr id='serieschildren_tr'><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Series Feedback</td><td data-dojo-attach-point=\"seriesfeedback\"></td></tr>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Media Channel</td><td class=\"prmaxrowdisplay\"><select data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"prmax_outlettypeid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select outlet type\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\"  data-dojo-attach-point=\"prmax_outlettypeid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Keywords</td><td ><div data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-attach-point=\"interests\" data-dojo-props='name:\"interests\",selectonly:true,size:6,displaytitle:\"\",startopen:true,restrict:0,keytypeid:6,title:\"Select\"'></div></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\", style:\"width:100%;height:40px;padding:5px\"' >\r\n\t\t\t<label class=\"prmaxrowtag\">Reason Code</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\"'></select>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_update_coding\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\"'></button>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"publisher_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Publisher Add\"'>\r\n\t\t<div data-dojo-attach-point=\"publisher_add_ctrl\" data-dojo-type=\"prcommon2/publisher/PublisherAdd\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Coding.js
// Author:   Chris Hoy
// Purpose:
// Created: 04/01/2013
// To do:
//-----------------------------------------------------------------------------
//
define("research/questionnaires/Coding", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/Coding.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dojo/dom-attr",
	"dojo/dom-construct",
	"dojo/dom",
	"dojo/on",
	"dojo/_base/array",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/outlet/SelectMultipleOutlets"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic, lang, utilities2, request , JsonRest, ItemFileReadStore, domattr, domConstruct, dom, on, array, Button, TextBox){
 return declare("research.questionnaires.Coding",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
	},
		postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.seriesparentid.set("parentbtnvalue", false);

		this.inherited(arguments);
	},
	_reset_fields:function()
	{

	},
	load:function( projectitem, outlet , user_changes )
	{

		domattr.set(this.seriesfeedback,"innerHTML","");

		this.seriesparentid.set("parentbtnvalue", false);
		this._reset_fields();
		this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);

		this.interests.set("value",outlet.interests ) ;
//		domattr.set(this.serieschildren, "innerHTML",outlet.serieschildren);

		if (outlet.serieschildren.length > 0)
		{
			domConstruct.destroy('serieschildren_table');
			if (dom.byId('serieschildren_td'))
			{
				domConstruct.destroy('serieschildren_td');
			};
			domConstruct.create('td', {
				'align':'right',
				'class': 'prmaxrowtag' ,
				'valign':'top',
				'style': {'padding-top': '10px'},
				'id':'serieschildren_td',
				innerHTML: 'Series Children'
				}, 'serieschildren_tr', 'first');

			td2 = domConstruct.create('td', {}, 'serieschildren_tr', 'last');
			div = domConstruct.create('div', {
				'id': 'serieschildren_div'
			}, td2);

			domConstruct.create('table', {'id':'serieschildren_table'}, 'serieschildren_div', 'first');
			array.forEach(outlet.serieschildren, function(child, i) {
				var tr = domConstruct.create("tr", {}, "serieschildren_table"),
					td = domConstruct.create("td", {}, tr),
					txbox = domConstruct.create(new TextBox({
							value: child.outletname,
							'readonly':'readonly'
							}).placeAt(td, 'first'))
			 });
		}
		else
		{
			domConstruct.destroy('serieschildren_table');
			domConstruct.destroy('serieschildren_td');
		};

		if (outlet.profile.profile)
		{
			this.seriesparentid.set("parentbtnvalue", false);
			this.seriesparentid.set("value", outlet.profile.profile.seriesparentid);
			this.supplementofid.set("value", outlet.profile.profile.supplementofid)
			this.seriesparentid.set("displayvalue", outlet.profile.seriesparentname);
			this.supplementofid.set("displayvalue", outlet.profile.supplementofname);
		}
		else
		{
			this.seriesparentid.set("value", null);
			this.supplementofid.set("value", null);
			this.seriesparentid.set("displayvalue", "");
			this.supplementofid.set("displayvalue","");
		}

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 45:
					this.seriesparentid_modified.load(change_record.value, outlet.profile.profile.seriesparentid, this.seriesparentid);
					break;
				case 47:
					this.supplementofid_modified.load(change_record.value, outlet.profile.profile.supplementofid, this.supplementofid);
					break;
				case 52:
					this.supplements_modified.load(change_record.value, outlet.supplements, this.supplements);
					break;
				case 53:
					this.editions_modified.load(change_record.value, outlet.editions, this.editions);
					break;
				case 64:
					domattr.set(this.seriesfeedback,"innerHTML",change_record.value);
					break;
			}
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);
		this.savenode.cancel();

	},
	clear:function()
	{
		this.outletid.set("value", -1);
		domattr.set(this.seriesfeedback,"innerHTML","");
		this.savenode.cancel();
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

		request.post('/research/admin/projects/user_feed_coding',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Coding Updated");
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





