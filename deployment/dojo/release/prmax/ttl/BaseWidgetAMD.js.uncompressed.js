define("ttl/BaseWidgetAMD", [
	"dojo/_base/declare", // declare
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_Container"
], function( declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container ){
	return declare("ttl.BaseWidgetAMD", [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _Container], {
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