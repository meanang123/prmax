//-----------------------------------------------------------------------------
// Name:    emailserver.js
// Author:
// Purpose:
// Created: March 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/prmaxdatasets.html",
	"dijit/layout/BorderContainer",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"ttl/grid/Grid"],
	function(declare, BaseWidgetAMD, template, BorderContainer, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore, JsonRest, Observable, Grid){

		_data_set_selected = function(inDatum)
		{
			var status = inDatum ? 'checked.gif':'unchecked.gif';
			return '<img  height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/'+status+'" ></img>';
		};

return declare("control.customer.options.PrmaxDataSets",
	[BaseWidgetAMD, BorderContainer],{
	templateString:template,
	gutters:false,
	constructor: function()
	{
		this._datasets = new Observable(new JsonRest( {
			target:"/datasets/customer_data_sets",
			idProperty:"prmaxdatasetid",
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
		}));

		this._update_data_set_call_back = lang.hitch(this,this._update_data_set_call);
		this._has_international_data = false;
	},
	postCreate:function()
	{
		this.inherited(arguments);

		var cells =
		[
			{label: 'Selected',className:"grid-field-image-view",field:'customerprmaxdatasetid', formatter:_data_set_selected},
			{label: 'Data Set',className:"dgrid-column-status",field:'prmaxdatasetdescription'}
		];

		this.datasetsgrid_view = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._datasets,
			sort: [{ attribute: "prmaxdatasetdescription", descending: false }],
			query:{}
		});

		this.datasetsgrid.set("content", this.datasetsgrid_view);
		this.datasetsgrid_view.on(".dgrid-cell:click", lang.hitch(this,this._on_row_select));
	},
	_on_row_select:function(e)
	{
		if (this._has_international_data==true)
		{
			var cell = this.datasetsgrid_view.cell(e);

			this._row = cell.row.data;

			var message = "Remove Data Set " + this._row.prmaxdatasetdescription + " ?";
			if ( this._row.customerprmaxdatasetid == null)
				message = null;

			if ( message == null || confirm (message) == true)
			{
				var content = {};
				content['icustomerid'] = this._customerid;
				content['customerprmaxdatasetid'] = this._row.customerprmaxdatasetid;
				content['prmaxdatasetid'] = this._row.prmaxdatasetid;


				request.post ('/datasets/customer_data_set_update',
					utilities2.make_params({ data : content})).
					then ( this._update_data_set_call_back);
			}
		}
		else
		{
			alert("International Data Disabled");
		}
	},

	_update_data_set_call:function( response )
	{
		if ( response.success == "OK")
		{
			this._row.customerprmaxdatasetid = response.data.customerprmaxdatasetid;
			this._datasets.put(this._row);
		}
		else
		{
			alert("Problem Updating");
		}
	},
	load:function(customerid, has_international_data)
	{
		if ( customerid != null)
		{
			this._customerid = customerid;
			var query = lang.mixin(utilities2.get_prevent_cache(), {icustomerid:customerid});
			this.datasetsgrid_view.set("query", query);
		}
		this._has_international_data = has_international_data;
	}
});
});
