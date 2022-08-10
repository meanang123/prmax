/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.DateTextBox"]){dojo._hasResource["ttl.DateTextBox"]=true;dojo.provide("ttl.DateTextBox");dojo.require("dijit.form.DateTextBox");dojo.require("ttl.utilities");dojo.declare("ttl.DateTextBox",dijit.form.DateTextBox,{_getValueISOAttr:function(){var _1=this.textbox.value;if(_1.length>0){var _2=_1.split("/");if(_2.length>=3){return _2[2]+"/"+_2[1]+"/"+_2[0];}}return "";}});}