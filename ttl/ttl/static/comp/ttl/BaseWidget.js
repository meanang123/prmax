dojo.provide("ttl.BaseWidget");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");

dojo.declare("ttl.BaseWidget",
	[dijit._Widget, dijit._Templated, dijit._Container],{
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