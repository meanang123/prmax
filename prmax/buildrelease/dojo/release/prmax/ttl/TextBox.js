/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.TextBox"]){dojo._hasResource["ttl.TextBox"]=true;dojo.provide("ttl.TextBox");dojo.require("dijit.form.TextBox");dojo.declare("ttl.TextBox",[dijit.form.TextBox],{_onKeyPress:function(e){ttl.TextBox.superclass._onKeyPress.call(this,e);this.onChanged();},onChanged:function(){},isNumber:function(){return ttl.utilities.isNumber(this.getValue());},isValid:function(){if(this.isNumber()==false){alert("Must be a number");return false;}return this.isNumber();}});}