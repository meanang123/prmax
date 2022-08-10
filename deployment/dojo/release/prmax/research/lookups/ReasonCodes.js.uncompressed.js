require({cache:{
'url:research/lookups/templates/ReasonCodes.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Filter Reasons\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td><label>Text</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"reason_filter_description\" data-dojo-props='name:\"filter\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td><label >Category</label></td><td><select data-dojo-attach-point=\"reasoncategoryfilter\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncategoryid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\"' /></td></tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true'>\r\n\t\t\t\t<span>New Reason</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" data-dojo-props='title:\"Enter Reason Code\"' data-dojo-attach-event=\"execute: _execute_add\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td><label >Reason</label></td><td><input data-dojo-props='required:true,invalidMessage:\"Role Name Required\",name:\"reasoncodedescription\",trim:true,maxlength:45,type:\"text\",\"class\":\"prmaxrequired\"' data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"reasoncodedescription\"  ></td></tr>\r\n\t\t\t\t\t\t<tr><td><label >Category</label></td><td><select data-dojo-attach-point=\"reasoncategoryid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncategoryid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Add Reason</button></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"reasons_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"'></div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ReasonCodes.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/03/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/lookups/ReasonCodes", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/ReasonCodes.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Cache",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Cache, Observable, Memory, request, utilities2, json, ItemFileReadStore ){
 return declare("research.lookup.ReasonCodes",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/reasoncodes', idProperty:"reasoncodeid"}));
		this.reasoncategories = new ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncategories"});
		this.reasoncategories_filter = new ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncategories&nofilter=1"});

		this._add_reason_call_back = dojo.hitch(this, this._add_reason_call);
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Reason Name',className: "standard",field:'reasoncodedescription'},
			{label: 'Categories', className: "standard",field:'reasoncategoryname'}
		];
		this.reasons = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.reasoncategoryid.set("store", this.reasoncategories);
		this.reasoncategoryfilter.set("store", this.reasoncategories_filter);
		this.reasoncategoryfilter.set("value",-1);
		this.reasoncategoryid.set("value",1);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.reasons_view.set("content", this.reasons);

	},
	_view:{noscroll: false,
			cells: [[
				{name: 'Reason Name',width: "auto",field:'reasoncodedescription'},
				{name: 'Categories',width: "auto",field:'reasoncategoryname'}
		]]
	},
	_execute:function()
	{
		var query = {};

		if ( arguments[0].filter.length>0 )
			query["filter"] = arguments[0].filter;

		if (arguments[0].reasoncategoryid != -1)
				query["reasoncategoryid"] = arguments[0].reasoncategoryid
			this.reasons.set("query",query);
	},
	_execute_add:function()
	{
		if (this.reasoncodedescription.isValid() == false )
		{
			alert("No Code Specified");
		}
		else
		{
			request.post('/research/admin/reason_code_add',
				utilities2.make_params({ data : {reasoncodedescription:arguments[0].reasoncodedescription,
								reasoncategoryid:arguments[0].reasoncategoryid}})).
				then ( this._add_reason_call_back );
		}
		return false ;
	},
	_add_reason_call:function( response )
	{
		if (response.success == "OK" )
		{
			alert("Reason Added");
			this._store.add( response.data );
		}
		else if (response.success == "DU" )
		{
			alert("Reason Already Exists");
		}
		else
		{
			alert("Problem Adding Reason");
		}
	},
	_clear_filter:function()
	{
		this.reasoncategoryfilter.set("value",-1);
		this.reason_filter_description.set("value","");
	}
});
});





