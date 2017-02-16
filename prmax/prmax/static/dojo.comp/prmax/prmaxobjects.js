dojo.provide("prmax.prmaxobjects");

// This contains all the data object that the system uses

// Display control object for display pane
function DisplayObject()
{
	//DisplayObject.prototype.Clear();
	this.outletid = -1;
	this.employeeid = -1;
	this.grid_employeeid = -1;
	this.customerid = -1;
	this.grid_employeeid = -1;
	this.sessionsearchid = -1 ;
	this.outlettypeid = - 1;
	this.outletname = "";
	this.contactname = "";
	this.isoutlet = true;
	this.advancefeatureid = -1;
	this.listid = -1;
	this.listname = "";
	this.displaylink = null;
}

DisplayObject.prototype.Clear=function()
{
	this.outletid = -1;
	this.employeeid = -1;
	this.grid_employeeid = -1;
	this.customerid = -1;
	this.grid_employeeid = -1;
	this.sessionsearchid = -1 ;
	this.outlettypeid = - 1;
	this.outletname = "";
	this.contactname = "";
	this.isoutlet = true;
	this.advancefeatureid = -1;
	this.listid = -1;
	this.listname = "";
	this.displaylink = null;

};

DisplayObject.prototype.Set=function(obj)
{
	this.outletid = obj.outletid||-1;
	this.employeeid = obj.employeeid||-1;
	this.grid_employeeid = obj.grid_employeeid||-1;
	this.customerid=obj.customerid||-1;
	this.grid_employeeid = obj.grid_employeeid||-1;
	this.sessionsearchid = obj.sessionsearchid||-1 ;
	this.outlettypeid = obj.outlettypeid||-1;
	this.outletname = obj.outletname||"";
	this.contactname = obj.contactname||"";
	this.advancefeatureid = obj.advancefeatureid||-1;
	this.isoutlet = (this.outletid != -1 ) ?true : false ;
	this.listid = obj.listid||-1;
	this.listname = obj.listname||"";
	this.displaylink = obj.displaylink||null;

};

function SearchGridCount()
{
	this.Clear();
}

SearchGridCount.prototype.Set=function(obj)
{
	this.total  = obj.total ;
	this.selected = obj.selected ;
	this.appended = obj.appended ;
};

SearchGridCount.prototype.Clear=function()
{
	this.total  = 0;
	this.selected = 0;
	this.appended = 0;
};


function DisplayContext( context, env)
{
	this._context = context;
	this._env = env;
	this.std_menu = null;
	this.std_menu_emp = null;
	this.std_menu_cont = null;
	this.private_menu = null;
	this.private_menu_emp = null;
}

DisplayContext.prototype._private_record_context_menu = function()
{
	if (this.private_menu===null)
	{
		this.private_menu = new dijit.Menu();
		if ( this._env.private_data )
		{
			this.private_menu.addChild(new dijit.MenuItem({label:"Edit Contact", onClick:dojo.hitch(this._env,this._env._EditEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.private_menu.addChild(new dijit.MenuItem({label:"Delete Contact", onClick:dojo.hitch(this._env,this._env._DeleteEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
		}
		this._add_std_menu( this.private_menu );
		this.private_menu.startup();
	}
	return this.private_menu;
}
DisplayContext.prototype._add_std_menu = function ( menu )
{
	if ( this._env.private_data )
	{
		menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this._env,this._env._AddEmployee)}));
	}
	if ( this._context == "search")
	{
		menu.addChild(new dijit.MenuItem({label:"Add Contact To Results", onClick:dojo.hitch(this._env,this._env._AddToResults)}));
		menu.addChild(new dijit.MenuItem({label:"Delete Contact from Results", onClick:dojo.hitch(this._env,this._env._DeleteToResults)}));
		menu.addChild(new dijit.MenuItem({label:"Change Contact on Selected Row", onClick:dojo.hitch(this._env,this._env._ChangeSelectedRow)}));
	}
}

DisplayContext.prototype._std_record_context_menu = function()
{
	if (this.std_menu===null)
	{
		this.std_menu = new dijit.Menu();
		if ( this._env.private_data )
		{
			this.std_menu.addChild(new dijit.MenuItem({label:"Edit Contact", onClick:dojo.hitch(this._env,this._env._EditEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
		}
		this._add_std_menu( this.std_menu );
		this.std_menu.startup();
	}

	return this.std_menu;
}

DisplayContext.prototype._private_record_context_menu2 = function()
{
	if (this.private_menu_emp===null)
	{
		this.private_menu_emp = new dijit.Menu();
		if ( this._env.private_data )
		{
			this.private_menu_emp.addChild(new dijit.MenuItem({label:"Edit Contact", onClick:dojo.hitch(this._env,this._env._EditEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.private_menu_emp.addChild(new dijit.MenuItem({label:"Delete Contact", onClick:dojo.hitch(this._env,this._env._DeleteEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
		}
		this._add_std_menu( this.private_menu_emp );
		this.private_menu_emp.startup();
	}
	return this.private_menu_emp;
}

// this has to be done for IE7 to work ?
// it's context i suspect
PRMAX.DisplayObject = DisplayObject;
PRMAX.SearchGridCount = SearchGridCount;
PRMAX.DisplayContext = DisplayContext;
