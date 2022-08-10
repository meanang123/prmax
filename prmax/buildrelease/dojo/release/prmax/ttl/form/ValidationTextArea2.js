/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


define(["dojo/_base/declare","dijit/form/SimpleTextarea","dijit/form/ValidationTextBox"],function(_1,_2,_3){return _1("ttl.form.ValidationTextArea2",[_2,_3],{invalidMessage:"This field is required",postCreate:function(){this.inherited(arguments);},validate:function(){this.inherited(arguments);if(arguments.length==0){this.validate(true);}},onFocus:function(){if(!this.isValid()){this.displayMessage(this.getErrorMessage());}},onBlur:function(){this.validate(false);},validator:function(_4,_5){_4=_4.replace(/[\r\l\n]+/g," ");return (new RegExp("^(?:"+this.regExpGen(_5)+")"+(this.required?"":"?")+"$")).test(_4)&&(!this.required||!this._isEmpty(_4))&&(this._isEmpty(_4)||this.parse(_4,_5)!==undefined);}});});