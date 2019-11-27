sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	'sap/m/MessageBox',
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.indexdb.sapui5indexdb.controller.Indexdb", {
		onInit: function () {
			var that = this;
			if (window.indexedDB == null)

			{

				console.error("Offline store not supported!");

				return null;

			} else {

				var createDBRequest = window.indexedDB.open("MyOfflineDB", 1);

			}

			createDBRequest.onupgradeneeded = function (event) {

				var db = event.target.result;
				var objectStore = db.createObjectStore("EmployeeDetails", {
					keyPath: "employeeid"
				});

				objectStore.createIndex("employeeid", "employeeid", {
					unique: true
				});

				objectStore.createIndex("firstname", "firstname", {
					unique: false
				});

				objectStore.createIndex("grade", "grade", {
					unique: false
				});

				objectStore.createIndex("zipcode", "zipcode", {
					unique: false
				});

				objectStore.createIndex("city", "city", {
					unique: false
				});

				objectStore.createIndex("country", "country", {
					unique: false
				});

			};

			createDBRequest.onsuccess = function (event) {

				Controller.myDB = event.target.result; //Controller – which we will define in onInit function
				//Table Refresh
				that.onPressLoadIndexdbData();
			};

			createDBRequest.onerror = function (oError)

			{

				alert("Something went wrong!");

			};

		},

		writeToIDB: function () {
			var employeeID = this.getView().byId("employeeID").getValue();
			var empFirstName = this.getView().byId("empFirstName").getValue();
			var empGrade = this.getView().byId("empGrade").getValue();
			var empZipCode = this.getView().byId("empZipCode").getValue();
			var empCity = this.getView().byId("empCity").getValue();
			var empCountry = this.getView().byId("empCountry").getSelectedItem().getText();

			var oRecord = {
				employeeid: employeeID,
				firstname: empFirstName,
				grade: empGrade,
				zipcode: empZipCode,
				city: empCity,
				country: empCountry
			};

			var oTransaction = Controller.myDB.transaction(["EmployeeDetails"], "readwrite");

			var oDataStore = oTransaction.objectStore("EmployeeDetails");

			oDataStore.add(oRecord);
			var selectedCountry = this.getView().byId("empCountry").getSelectedItem().getText();
			this.getView().byId("employeeID").setValue("");
			this.getView().byId("empFirstName").setValue("");
			this.getView().byId("empGrade").setValue(null);
			this.getView().byId("empZipCode").setValue(null);
			this.getView().byId("empCity").setValue("");
			this.getView().byId("empCountry").getSelectedItem().setText(selectedCountry);
			this.getView().byId("empCountry").setSelectedKey("India");

			MessageToast.show("Data stored in db for offline usage");
			this.onPressLoadIndexdbData();

		},
		onPressLoadIndexdbData: function () {
			var that = this;
			var oTable = that.getView().byId("idEmployeeDataTable");
			oTable.setBusyIndicatorDelay(0);
			oTable.setBusy(true);

			var objectStore = Controller.myDB.transaction("EmployeeDetails").objectStore("EmployeeDetails");

			var items = [];

			objectStore.openCursor().onsuccess = function (event) {

				var cursor = event.target.result;

				if (cursor) {

					items.push(cursor.value);

					cursor.continue();

				} else {

					var oJSONModel = new sap.ui.model.json.JSONModel();

					oJSONModel.setData({
						modelData: items
					});

					that.getView().byId("idEmployeeDataTable").setModel(oJSONModel);

					var oTemplate = new sap.m.ColumnListItem(

						{
							cells: [

								new sap.m.Text({
									text: "{employeeid}"
								}),

								new sap.m.Text({
									text: "{firstname}"
								}),

								new sap.m.Text({
									text: "{grade}"
								}),

								new sap.m.Text({
									text: "{zipcode} "
								}),

								new sap.m.Text({
									text: "{city}"

								}),
								new sap.m.Text({
									text: "{country}"

								}),
								new sap.m.Button({
									icon: "sap-icon://delete",
									type: "Reject",
									press: [function (oEvent) {

										var accessKey = oEvent.getSource().getBindingContext().getObject().employeeid;

										MessageBox.confirm(
											"Employee" + " " + accessKey + " " + "will be deleted permanently.", {
												icon: MessageBox.Icon.WARNING,
												title: "Confirm Delete",
												actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
												onClose: function (oAction) {
													if (oAction === "OK") {
														var oTransaction = Controller.myDB.transaction(["EmployeeDetails"], "readwrite");
														var oDataStore = oTransaction.objectStore("EmployeeDetails");
														var request = oDataStore.delete(accessKey);
														MessageToast.show(accessKey + " " + "Employee details has deleted from indexDB");

														that.onPressLoadIndexdbData();
													}

												}
											})

									}, Controller]

								})

							]

						});
					that.getView().byId("idEmployeeDataTable").addAggregation(oTemplate);
					that.getView().byId("idEmployeeDataTable").bindItems("/modelData", oTemplate);

				}

				// Dialog Close
				setTimeout(function demo() {
					oTable.setBusy(false);
				}, 800);

			};

		}

	});
});