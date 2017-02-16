dojo.provide("prmax.iadmin.PrmaxDataSets");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.data.JsonRestStore");

_data_set_selected = function(inDatum)
{
	var status = inDatum ? 'checked.gif':'unchecked.gif';
	return '<img  height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/'+status+'" ></img>';
};

dojo.declare("prmax.iadmin.PrmaxDataSets",
	[ttl.BaseWidget],{
	templatePath: dojo.moduleUrl( "prmax.iadmin","templates/prmaxdatasets.html"),
	constructor: function()
	{
		this._datasets = new dojox.data.JsonRestStore( {target:"/iadmin/customer_data_sets", idAttribute:"prmaxdatasetid"});
		this._update_data_set_call_back = dojo.hitch(this,this._update_data_set_call);
		this._has_international_data = false;
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.datasetsgrid.set("structure",this.view);
		this.datasetsgrid._setStore(this._datasets );
		this.datasetsgrid['onRowClick'] = dojo.hitch(this,this._on_row_select);
	},
	_on_row_select:function(e)
	{
		if (this._has_international_data==true)
		{
			this._row = this.datasetsgrid.getItem(e.rowIndex);

			var message = "Remove Data Set " + this._row.prmaxdatasetdescription + " ?";
			if ( this._row.customerprmaxdatasetid == null)
				message = null;

			if ( message == null || confirm (message) == true)
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._update_data_set_call_back,
						url:'/iadmin/customer_data_set_update',
						content:{
							'icustomerid':this._customerid,
							customerprmaxdatasetid:this._row.customerprmaxdatasetid,
							prmaxdatasetid:this._row.prmaxdatasetid
						}
						}));
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
			this._datasets.setValue( this._row, "customerprmaxdatasetid",response.data.customerprmaxdatasetid);
		}
		else
		{
			alert("Problem Updating");
		}
	},
	resize:function()
	{
		this.inherited(arguments);
		this.borderControl.resize(arguments[0]);
	},
	view :
	{noscroll: false,
			cells: [[
			{name: 'Selected',width: "5em",field:'customerprmaxdatasetid', formatter:_data_set_selected},
			{name: 'Data Set',width: "auto",field:'prmaxdatasetdescription' }
		]]
	},
	load:function(customerid, has_international_data)
	{
		if ( customerid != null)
		{
			this._customerid = customerid;
			this.datasetsgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(), {icustomerid:customerid}));
		}

		this._has_international_data = has_international_data;
	}
});
