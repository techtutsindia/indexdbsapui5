/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/indexdb/sapui5indexdb/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});