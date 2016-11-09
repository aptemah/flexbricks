'use strict'
function Table () {

};
Table.prototype.init = function (container, tableData) {
	this.container = document.querySelector(container);
	this.dataObject = tableData;
	this.dataObjectReadOnly = JSON.parse(JSON.stringify(tableData))
	this.rowMaxAmount = 25;
	this.rowOffset = 0;
	this.getDisplayDimensions();
	this.build();
};

Table.prototype.getDisplayDimensions = function () {
	this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	this.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}
Table.prototype.getRowsAmount = function () {
	return this.dataObject.data.length;
};

Table.prototype.getColumnsAmount = function () {
	var object = this.dataObject.schema;
	var length = 0, key;
	for (key in object) {
		if (object.hasOwnProperty(key)) length++;
	}
	return length;
};

Table.prototype.getCellData = function (row, cell) {
	var currentRow = row + this.rowOffset;
	var object = this.dataObject.data[currentRow];
	var key, i = 0;
	for (key in object) {
		if (cell == i) { return object[key]} else { i++ };
	}
};

Table.prototype.getHeadData = function (cell) {
	var object = this.dataObject.schema;
	var key, i = 0;
	for (key in object) {
		if (cell == i) { return [object[key], key]} else { i++ };
	}
};

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
			if (j == 1) { console.log(this.getCellData(i,j)) }
		}
	}

	this.thead = this.table.createTHead();
	var row = this.thead.insertRow();
	for (var k = this.columnsAmount - 1; k >= 0; k--) {
		var cell = row.insertCell();
		cell.textContent = this.getHeadData(k)[0];
		cell.setAttribute("data-title", this.getHeadData(k)[1]);
	}

	this.container.appendChild(this.table);
	this.paginationBuild();
	this.tHeadMethods();
};

Table.prototype.pagination = function (where) {
	switch(where) {
		case 'first':
			this.rowOffset = 0;
			this.currentPage = 1;
		break;

		case 'previous':
			if (this.rowOffset - this.rowMaxAmount >= 0) {
				this.rowOffset -= this.rowMaxAmount;
				this.currentPage = this.rowOffset / this.rowMaxAmount + 1;
			}
		break;

		case 'next':
			if (this.getRowsAmount() - this.rowOffset - this.rowMaxAmount > 0) {
				this.rowOffset += this.rowMaxAmount;
				this.currentPage = this.rowOffset / this.rowMaxAmount + 1;
			}
		break;

		case 'last':
			var rowsFromEnd = this.getRowsAmount() % this.rowMaxAmount;
			if (rowsFromEnd != 0) {
				this.rowOffset = this.getRowsAmount() - rowsFromEnd;
			} else {
				this.rowOffset = this.getRowsAmount() - this.rowMaxAmount;
			}
			this.currentPage = this.rowOffset / this.rowMaxAmount + 1;
		break;
	}
	this.build()
};

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

	this.pageNumber = document.createElement('span');
	this.pageNumber.textContent = this.currentPage || 1;
	this.paginationBlock.appendChild(this.pageNumber);
	this.pageNumber.className = "page-number";


	this.container.insertBefore(this.paginationBlock, this.container.firstChild);
};

Table.prototype.tHeadMethods = function(){
	var self = this;

	var headArray = this.thead.querySelectorAll('td'),
			key;
	for (key in headArray) {
		if (headArray.hasOwnProperty(key)) {
			(function(){
				var a = key;
				headArray[key].addEventListener('click', function(){
					self.sortData(this.getAttribute('data-title'));
				})
				
			})();

		}
	};
};

Table.prototype.sortData = function(column){
	var self = this;

	switch(column) {
		case 'Active':
			sortLib().active()
		break;

		case 'FormattedDate':
			sortLib().formatteddate()

		break;

		case 'Message':
			sortLib().message()

		break;

		case 'Type':
			sortLib().active()

		break;
	}
	self.build();

	function sortLib() {
		return {
			active : function() {
				switch(self.currentSort) {
					case 'Active':
						self.dataObject.data.sort(compareNumericR);
						self.currentSort = 'ActiveR';
					break;
					case 'ActiveR':
						self.dataObject = self.dataObjectReadOnly;
						self.currentSort = undefined;
					break;
					case undefined:
						self.dataObject.data.sort(compareNumeric);
						self.currentSort = 'Active';
					break;
				}
			}, formatteddate : function() {
				switch(self.currentSort) {
					case 'FormattedDate':
						self.dataObject.data.sort(compareDateR);
						self.currentSort = 'ActiveR';
					break;
					case 'FormattedDateR':
						self.dataObject = self.dataObjectReadOnly;
						self.currentSort = undefined;
					break;
					case undefined:
						self.dataObject.data.sort(compareDate);
						self.currentSort = 'FormattedDate';
					break;
				}
			}, message : function() {
				switch(self.currentSort) {
					case 'Message':
						self.dataObject.data.sort(compareStringR);
						self.currentSort = 'ActiveR';
					break;
					case 'MessageR':
						self.dataObject = self.dataObjectReadOnly;
						self.currentSort = undefined;
					break;
					case undefined:
						self.dataObject.data.sort(compareString);
						self.currentSort = 'Message';
					break;
				}
			}

		}
	}

	function compareNumeric(a, b) {
		if (a[column] > b[column]) return 1;
		if (a[column] < b[column]) return -1;
	}
	function compareNumericR(a, b) {
		if (a[column] > b[column]) return -1;
		if (a[column] < b[column]) return 1;
	}

	function compareDate(a, b) {
		var msa = moment(a[column],'DD.MM.YYYY');
		a = parseInt(msa.format("x"));
		var msb = moment(b[column],'DD.MM.YYYY');
		b = parseInt(msb.format("x"));
		console.log(b);
		if (a > b) return 1;
		if (a < b) return -1;
	}
	function compareDateR(a, b) {
		if (a[column] > b[column]) return -1;
		if (a[column] < b[column]) return 1;
	}

	function compareString(a, b) {
		var A = a[column].toLowerCase();
		var B = b[column].toLowerCase();
		if (A < B){
			return -1;
		}else if (A > B){
			return  1;
		}else{
			return 0;
		}
	}
	function compareStringR(a, b) {
		var A = a.toLowerCase();
		var B = b.toLowerCase();
		if (A < B){
			return 1;
		}else if (A > B){
			return -1;
		}else{
			return 0;
		}
	}

};
