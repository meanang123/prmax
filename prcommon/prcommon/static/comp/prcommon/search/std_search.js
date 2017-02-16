//-----------------------------------------------------------------------------
// Name:    standard.js
// Author:  Chris Hoy
// Purpose: basic search field, This is a standard text field should be overridden
//			for ther fields such as dropdown list etc
// Created: 27/05/2008
//
// To do:
//			1. css settings for each field
//			2. use of table for layout to fixed?

//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.std_search");

dojo.require("prcommon.search.SearchCount");


dojo.declare("prcommon.search.std_search",
	null,
	{
		commoncontrols:"search", // base name for the setting controls that might be used to control this control ie expand results etc
		dojoAttachEvent: "",
		dojoAttachPoint: "",
		waiRole: "",
		waiState:"",
		name:"",
		keytypeid:"",
		displayname:"",
		testmode:false,
		usepartial:false,
		search:"",
		min:0,
		searchTime:400,
		constructor: function()
		{
			this._LoadCallBack = dojo.hitch(this,this._Load);
			this._value = "";
			this._extended = false;
			this.open = false;
			this.searchTimer = null;

			dojo.subscribe(PRCOMMON.Events.Search_PartialMatch, dojo.hitch(this,this._PartialEvent));
		},
		_PartialEvent:function( command )
		{
			if (this.usepartial && command.search==this.search && this._value.length>0)
				this._Get (this._value, true ) ;
		},
		_setdisplay:function(value)
		{
			if (value.length==0)
				this.countNode.Clear();
			else
				this.countNode.set("value",value);
		},
		// Load the details of a specific customer
		_Load: function(response, ioArgs)
		{
			if (response.success=="OK")
			{
				console.log ("response" , this._transactionid , response.transactionid ) ;

				if(this._transactionid == response.transactionid )
					this._setdisplay(response.count.toString());
			}
		},
		// Load the  customer into the system
		_Send_Request_Count:function(value)
		{
			// send the request to the server
			var content= this._CaptureExtendedContent({keytypeid:this.keytypeid,fieldname:this.name,value:this._value});

			this._transactionid = PRCOMMON.utils.uuid.createUUID();
			content['transactionid'] = this._transactionid;

			dojo.xhrPost(
				ttl.utilities.makeParamsIgnore({
					load: this._LoadCallBack,
					url:'/search/displaycount',
					content: content
					})	);
			this.searchTimer = null;
		},
		_Get: function(value,force)
		{
			// value not changed
			if (this._value==value && force!=true) return ;
			// setup new value
			// if empty then simply clear
			this._value=value;
			if (this._value.length>this.min)
			{
				if (this.searchTimer)
				{
					clearTimeout ( this.searchTimer);
					this.searchTimer = null;
				}
				this.searchTimer = setTimeout(dojo.hitch(this, this._Send_Request_Count,value),this.searchTime);
			}
			else
			{
				this._setdisplay("");
			}

			dojo.publish(PRCOMMON.Events.Search_Total, [{search:this.search}]);
		},
		_CaptureExtendedContent:function(stdfields)
		{
			// This need to capture the flags that may be avalible on the current
			// form
			// partial match need to check
			var partial = dijit.byId("search_partial");
			var private_only = dijit.byId(this.commoncontrols +"private");
			try
			{
				return dojo.mixin(stdfields,{
					partial:partial? partial.checked?2:0:2,
					private_only:private_only? private_only.attr("value"):0
					});
			}
			catch(e) { alert(e); }
		},
		_setExtendedAttr:function(value)
		{
			this._extended = value;
		},
		_getExtendedAttr:function()
		{
			return this._extended;
		},
		_Toggle:function()
		{
			this.open = !this.open;
			this._ToggleCascade();
		},
		_ToggleCascade:function()
		{
			dojo.style(this.selectarea,"display",this.open?"block":"none");
			this.toggleCtrl.src =  this.open?"/static/images/toclosed.gif":"/static/images/toopen.gif";

			if (this.open) this._focus();
		},
		Clear:function()
		{
			this._MakeClosed();
			if (this.searchTimer)
			{
				clearTimeout ( this.searchTimer);
				this.searchTimer = null;
			}

		},
		_MakeClosed:function()
		{
			if (this.open==true)
				this._Toggle();
		},
		MakeOpen:function()
		{
			this.open=false;
			this._Toggle();
		}
	}
);





