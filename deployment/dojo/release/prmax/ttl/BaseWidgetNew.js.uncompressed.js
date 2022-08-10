// wrapped by build app
define("ttl/BaseWidgetNew", ["dijit","dojo","dojox","dojo/require!dijit/_Widget,dijit/_TemplatedMixin,dijit/_WidgetsInTemplateMixin,dijit/_Container"], function(dijit,dojo,dojox){
dojo.provide("ttl/BaseWidgetNew");

dojo.require("dijit/_Widget");
dojo.require("dijit/_TemplatedMixin");
dojo.require("dijit/_WidgetsInTemplateMixin");
dojo.require("dijit/_Container");

dojo.declare("ttl.BaseWidgetNew",
	[dijit._Widget, dijit._TemplatedMixin, dijit._WidgetsInTemplateMixin, dijit._Container],{
	widgetsInTemplate: true,
	_lock:false,

	Lock_Code:function()
	{
		this._lock = true ;
	},
	isLocked:function()
	{
		return this._lock;
	},
	UnLock_Code:function()
	{
		this._lock = false;
	},
	Lock_Code_Wait:function()
	{
		while ( this._lock == true )
		{
			console.log("Waiting for Lock");
			ttl.utilities.sleepStupidly(1);
		}

	this._lock = true ;
	},
	_ReturnFalse:function()
	{
		return false;
	}
});
});
