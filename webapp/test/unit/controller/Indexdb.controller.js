/*global QUnit*/

sap.ui.define([
	"com/indexdb/sapui5indexdb/controller/Indexdb.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Indexdb Controller");

	QUnit.test("I should test the Indexdb controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});