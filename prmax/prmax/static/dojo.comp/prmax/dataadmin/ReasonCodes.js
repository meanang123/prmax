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
dojo.provide("prmax.dataadmin.ReasonCodes");

dojo.declare("prmax.dataadmin.ReasonCodes",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/ReasonCodes.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore(
				{	url:'/dataadmin/reasoncodes',
					onError:ttl.utilities.globalerrorchecker,
					nocallback:true
				});

		this.reasoncategories = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncategories"});
		this.reasoncategories_filter = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncategories&nooption=1"});

		this._AddReasonCallBack = dojo.hitch(this, this._AddReasonCall);
	},
	postCreate:function()
	{
		this.reasons.set("structure",this._view);
		this.reasons._setStore(this.model);
		this.reasoncategoryid.store = this.reasoncategories;
		this.reasoncategoryfilter.store = this.reasoncategories_filter;
		this.reasoncategoryfilter.set("value",-1);
		this.reasoncategoryid.set("value",1);

		this.inherited(arguments);
	},
	_view:{noscroll: false,
			cells: [[
				{name: 'Reason Name',width: "auto",field:'reasoncodedescription'},
				{name: 'Categories',width: "auto",field:'reasoncategoryname'}
		]]
	},
	_Execute:function()
	{
		var query = {};

		if ( arguments[0].filter.length>0 )
			query["filter"] = arguments[0].filter;

		if (arguments[0].reasoncategoryid != -1)
				query["reasoncategoryid"] = arguments[0].reasoncategoryid
			this.reasons.setQuery( ttl.utilities.getPreventCache(query));
	},
	_ExecuteAdd:function()
	{
		if (this.reasoncodedescription.isValid() == false )
		{
			alert("No Code Specified");
		}
		else
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._AddReasonCallBack,
				url:'/dataadmin/reason_code_add',
				content: {reasoncodedescription:arguments[0].reasoncodedescription,
								reasoncategoryid:arguments[0].reasoncategoryid
				}}));
		}
		return false ;
	},
	_AddReasonCall:function( response )
		{
			if (response.success == "OK" )
			{
				alert("Reason Added");
				gHelper.AddRowToQueryWriteGrid(this.reasons,this.model.newItem( response.data ));
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

	_ClearFilter:function()
	{
		this.reasoncategoryfilter.set("value",-1);
		this.reason_filter_description.set("value","");
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	}
});





