/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


define(["dojo/_base/declare","dijit/form/Form",],function(_1,_2){return _1("ttl.Form2",[_2],{formid:"",isValid:function(){return dojo.every(this.getChildren(),function(_3){var _4=!_3.isValid||_3.isValid();if(_4==false){if(_3.isFocusable()){_3.focus();}else{_4=true;}}return _4;});},setExtendedMode:function(_5){dojo.forEach(this.getChildren(),function(_6){if(!_6.name){return;}_6.set("extended",_5);});}});});