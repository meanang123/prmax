/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.contacthistory.notes"]){dojo._hasResource["prcommon.contacthistory.notes"]=true;dojo.provide("prcommon.contacthistory.notes");dojo.declare("prcommon.contacthistory.notes",null,{constructor:function(){},show_notes:function(_1){dojo.publish(PRCOMMON.Events.Edit_Notes,[_1]);}});}