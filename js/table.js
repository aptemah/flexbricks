'use strict'
function Table () {

}
Table.prototype.init = function (container, tableData) {
	this.container = document.querySelector(container);
	this.dataObject = tableData;
	this.rowMaxAmount = 25;
	this.rowOffset = 0;
	this.getDisplayDimensions();
	this.build()
}

Table.prototype.getDisplayDimensions = function () {
	this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	this.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}
Table.prototype.getRowsAmount = function () {
	return this.dataObject.data.length;
}

Table.prototype.getColumnsAmount = function () {
	var object = this.dataObject.schema;
	var length = 0, key;
	for (key in object) {
		if (object.hasOwnProperty(key)) length++;
	}
	return length;
}

Table.prototype.getCellData = function (row, cell) {
	var currentRow = row + this.rowOffset;
	var object = this.dataObject.data[currentRow];
	var key, i = 0;
	for (key in object) {
		if (cell == i) { return object[key]} else { i++ };
	}
}

Table.prototype.getHeadData = function (cell) {
	var object = this.dataObject.schema;
	var key, i = 0;
	for (key in object) {
		if (cell == i) { return object[key]} else { i++ };
	}
}

Table.prototype.build = function () {
	while (this.container.firstChild) {
		this.container.removeChild(this.container.firstChild);
	}

	this.columnsAmount = this.getColumnsAmount();
	this.table = document.createElement('table');
	this.table.className = "table";
	for (var i = this.rowMaxAmount - 1; i >= 0; i--) {
		var row = this.table.insertRow();
		for (var j = this.columnsAmount - 1; j >= 0; j--) {
			var cell = row.insertCell();
			cell.textContent = this.getCellData(i,j);
		}
	}

	this.thead = this.table.createTHead();
	var row = this.thead.insertRow();
	for (var k = this.columnsAmount - 1; k >= 0; k--) {
		var cell = row.insertCell();
		cell.textContent = this.getHeadData(k);
	}

	this.container.appendChild(this.table);
	this.paginationBuild();
}

Table.prototype.pagination = function (where) {
	switch(where) {
		case 'first':
			this.rowOffset = 0;
		break;

		case 'previous':
			if (this.rowOffset - this.rowMaxAmount >= 0) {
				this.rowOffset -= this.rowMaxAmount;
			}
		break;

		case 'next':
			if (this.getRowsAmount() - this.rowOffset - this.rowMaxAmount > 0) {
				this.rowOffset += this.rowMaxAmount;
			}
		break;

		case 'last':
			var rowsFromEnd = this.getRowsAmount() % this.rowMaxAmount;
			if (rowsFromEnd != 0) {
				this.rowOffset = this.getRowsAmount() - rowsFromEnd;
			} else {
				this.rowOffset = this.getRowsAmount() - this.rowMaxAmount;
			}
		break;
	}
	this.build()
	console.log(this.dataObject);
}

Table.prototype.rowsSorting = function() {

}

Table.prototype.paginationBuild = function () {
	var self = this;

	this.paginationBlock = document.createElement('div');
	this.paginationBlock.className = "pagination";

	this.navFirst = document.createElement('span');
	this.navFirst.textContent = 'first';
	this.paginationBlock.appendChild(this.navFirst);
	this.navFirst.addEventListener('click', function(){self.pagination('first')});

	this.navPrevious = document.createElement('span');
	this.navPrevious.textContent = 'previous';
	this.paginationBlock.appendChild(this.navPrevious);
	this.navPrevious.addEventListener('click', function(){self.pagination('previous')});

	this.navNext = document.createElement('span');
	this.navNext.textContent = 'next';
	this.paginationBlock.appendChild(this.navNext);
	this.navNext.addEventListener('click', function(){self.pagination('next')});

	this.navLast = document.createElement('span');
	this.navLast.textContent = 'last';
	this.paginationBlock.appendChild(this.navLast);
	this.navLast.addEventListener('click', function(){self.pagination('last')});


	this.container.insertBefore(this.paginationBlock, this.container.firstChild);
}