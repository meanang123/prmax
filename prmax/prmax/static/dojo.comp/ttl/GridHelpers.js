//-----------------------------------------------------------------------------
// Name:    GridHelper.js
// Author:  Chris Hoy
// Purpose: function to help grid
// Created: 04/01/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.GridHelpers");

dojo.declare("ttl.GridHelpers",null,{
	// make sure that the grid is re-sized where the parent container is re-sized
	initGridInLayout : function(container, grid) {
		var container = dijit.byId(container), grid = dijit.byId(grid);
		// resize grid when its containing widget resizes
		dojo.connect(container, "resize", grid, function() {
			grid.resize();
		});
		// render grid when it's parent is shown
		container.onShow = function() {
			setTimeout(function(){grid.render()}, 0);
			};
		// render initially since containers don't do this for some reason.
		grid.update();
	},
	// check to see if virtual grid has been loaded
	isGridRendered: function(grid)
	{
		return (grid.model.data.length>0)? true:false;
	}
	,
	// Add Row to a grid
	AddRowToQueryWriteGrid:function(grid,item)
	{
			grid._addItem(item, item.n);
			//grid.addRow ( );
	}
});

ttl.GridHelpers.onStyleRow=function(inRow,grid,comp) {
		//this.styleRowState(inRow);
		if (inRow.selected) inRow.customClasses += " prmaxSelectedRow";
		if (inRow.odd)  inRow.customClasses += " dojoxGridRowOdd";
		if (inRow.over)  inRow.customClasses += " dojoxGridRowOver";

		if (grid != null && grid != undefined )
		{
			var rowData = grid.getItem(inRow.index);
			if (rowData && comp ( rowData ))
				inRow.customClasses += " selectedRow";

		}

	}

