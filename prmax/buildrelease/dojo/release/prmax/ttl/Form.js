/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.Form"]){dojo._hasResource["ttl.Form"]=true;dojo.provide("ttl.Form");dojo.require("dijit.form.Form");dojo.declare("ttl.Form",[dijit.form.Form],{formid:"",isValid:function(){return dojo.every(this.getDescendants(),function(_1){var _2=!_1.isValid||_1.isValid();if(_2==false){if(_1.isFocusable()){_1.focus();}else{_2=true;}}return _2;});},setExtendedMode:function(_3){dojo.forEach(this.getDescendants(),function(_4){if(!_4.name){return;}_4.set("extended",_3);});}});}