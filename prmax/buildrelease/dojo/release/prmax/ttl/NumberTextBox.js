/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.NumberTextBox"]){dojo._hasResource["ttl.NumberTextBox"]=true;dojo.provide("ttl.NumberTextBox");dojo.require("dijit.form.NumberTextBox");dojo.declare("ttl.NumberTextBox",[dijit.form.NumberTextBox],{_onKeyPress:function(e){ttl.NumberTextBox.superclass._onKeyPress.call(this,e);this.onChanged();},onChanged:function(){}});}