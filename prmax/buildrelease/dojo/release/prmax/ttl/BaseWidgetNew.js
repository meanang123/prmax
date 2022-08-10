/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl/BaseWidgetNew"]){dojo._hasResource["ttl/BaseWidgetNew"]=true;dojo.provide("ttl/BaseWidgetNew");dojo.require("dijit/_Widget");dojo.require("dijit/_TemplatedMixin");dojo.require("dijit/_WidgetsInTemplateMixin");dojo.require("dijit/_Container");dojo.declare("ttl.BaseWidgetNew",[dijit._Widget,dijit._TemplatedMixin,dijit._WidgetsInTemplateMixin,dijit._Container],{widgetsInTemplate:true,_lock:false,Lock_Code:function(){this._lock=true;},isLocked:function(){return this._lock;},UnLock_Code:function(){this._lock=false;},Lock_Code_Wait:function(){while(this._lock==true){ttl.utilities.sleepStupidly(1);}this._lock=true;},_ReturnFalse:function(){return false;}});}