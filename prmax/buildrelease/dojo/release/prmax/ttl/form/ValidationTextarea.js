/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.form.ValidationTextarea"]){dojo._hasResource["ttl.form.ValidationTextarea"]=true;dojo.provide("ttl.form.ValidationTextarea");dojo.require("dijit.form.SimpleTextarea");dojo.require("dijit.form.ValidationTextBox");dojo.declare("ttl.form.ValidationTextarea",[dijit.form.ValidationTextBox,dijit.form.SimpleTextarea],{invalidMessage:"This field is required",postCreate:function(){this.inherited(arguments);},validate:function(){this.inherited(arguments);if(arguments.length==0){this.validate(true);}},onFocus:function(){if(!this.isValid()){this.displayMessage(this.getErrorMessage());}},onBlur:function(){this.validate(false);},validator:function(_1,_2){_1=_1.replace(/[\r\l\n]+/g," ");return (new RegExp("^(?:"+this.regExpGen(_2)+")"+(this.required?"":"?")+"$")).test(_1)&&(!this.required||!this._isEmpty(_1))&&(this._isEmpty(_1)||this.parse(_1,_2)!==undefined);}});}