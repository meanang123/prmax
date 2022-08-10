/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


define(["dojo/_base/declare","dijit/_Widget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dijit/_Container"],function(_1,_2,_3,_4,_5){return _1("ttl.BaseWidgetAMD",[_2,_3,_4,_5],{widgetsInTemplate:true,_lock:false,Lock_Code:function(){this._lock=true;},isLocked:function(){return this._lock;},UnLock_Code:function(){this._lock=false;},Lock_Code_Wait:function(){while(this._lock==true){ttl.utilities.sleepStupidly(1);}this._lock=true;},_ReturnFalse:function(){return false;}});});