/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


define(["dojo/_base/declare","dijit/form/DateTextBox","ttl/utilities2"],function(_1,_2){return _1("ttl.DateTextBox2",[_2],{_getValueISOAttr:function(){var _3=this.textbox.value;if(_3.length>0){var _4=_3.split("/");if(_4.length>=3){return _4[2]+"/"+_4[1]+"/"+_4[0];}}return "";}});});