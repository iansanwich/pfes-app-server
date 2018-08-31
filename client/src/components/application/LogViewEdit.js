import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import ReactToPrint from "react-to-print";
import AlertBox from "./AlertBox";

import { clearAlert } from "../../actions/alertActions";

import {
  editLog,
  getDomesticLogs,
  getInternationalLogs,
  deleteLog,
  clearErrors,
  submitCompleteLog
} from "../../actions/logsActions";

import countries from "../../assets/countries.json";
import logo from "../../img/pfes-logo.png";

const provinces = require("philippines/provinces");
const cities = require("philippines/cities");

export class LogViewEdit extends Component {
  constructor() {
    super();
    this.state = {
      domJo: "",
      shipperConsignee: "",
      associate: "",
      modeOfTransport: "",

      commodityType: "",
      commodityDescription: "",

      blAwb: "",

      originProvinceKey: "",
      originProvinceName: "",
      originCity: "",

      originLocation: "",

      originCountry: "",

      destinationProvinceKey: "",
      destinationProvinceName: "",
      destinationCity: "",

      destinationLocation: "",

      destinationCountry: "",

      pickupDate: moment().format("YYYY-MM-DD"),
      etd: moment().format("YYYY-MM-DD"),
      eta: moment().format("YYYY-MM-DD"),
      status: "Ongoing",
      type: "",
      remarks: "",

      contactName: "",
      contactNumber: "",
      contactEmail: "",

      tagUrgent: false,
      tagInsured: false,

      errors: {},
      isEditable: false,

      isToggleComplete: false
    };

    this.onChange = this.onChange.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    this.enableEdit = this.enableEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.deleteLog = this.deleteLog.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.closeComplete = this.closeComplete.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);

    this.submitCompleteLog = this.submitCompleteLog.bind(this);

    this.toPrint = React.createRef();
  }

  // @componentswillreceiveprops
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.alert) {
      if (nextProps.alert.success === true) {
        this.setState({ isEditable: false, isToggleComplete: false });
      }
    }

    if (nextProps.log) {
      this.setState({
        domJo: nextProps.log.log.domJo,
        shipperConsignee: nextProps.log.log.shipperConsignee,
        associate: nextProps.log.log.associate,
        modeOfTransport: nextProps.log.log.modeOfTransport,

        commodityType: nextProps.log.log.commodity.type,
        commodityDescription: nextProps.log.log.commodity.description,

        blAwb: nextProps.log.log.blAwb,

        pickupDate: moment(nextProps.log.log.pickupDate).format("YYYY-MM-DD"),
        etd: moment(nextProps.log.log.etd).format("YYYY-MM-DD"),
        eta: moment(nextProps.log.log.eta).format("YYYY-MM-DD"),
        status: nextProps.log.log.status,
        type: nextProps.log.log.type,
        remarks: nextProps.log.log.remarks,

        tagUrgent: nextProps.log.log.tags.urgent,
        tagInsured: nextProps.log.log.tags.insured,

        contactName: nextProps.log.log.contact.name,
        contactNumber: nextProps.log.log.contact.number,
        contactEmail: nextProps.log.log.contact.email,

        originLocation: nextProps.log.log.origin.location,
        destinationLocation: nextProps.log.log.destination.location
      });

      // Domestic
      if (nextProps.log.log.type === "Domestic") {
        this.setState({
          originProvinceKey: nextProps.log.log.origin.provinceKey,
          originProvinceName: nextProps.log.log.origin.provinceName,
          originCity: nextProps.log.log.origin.city,

          destinationProvinceKey: nextProps.log.log.destination.provinceKey,
          destinationProvinceName: nextProps.log.log.destination.provinceName,
          destinationCity: nextProps.log.log.destination.city
        });
      }

      if (nextProps.log.log.type === "International") {
        this.setState({
          originCountry: nextProps.log.log.origin.country,
          destinationCountry: nextProps.log.log.destination.country
        });
      }
    }
  }

  // @onChange
  onChange(e) {
    if (
      e.target.name === "pickupDate" ||
      e.target.name === "etd" ||
      e.target.name === "eta"
    ) {
      if (e.target.value === "") {
        return;
      } else {
        const today = Date.parse(moment());

        switch (e.target.name) {
          case "pickupDate":
            this.setState({ pickupDate: e.target.value }, () => {
              let pickupDate = Date.parse(
                moment(this.state.pickupDate).format("DD MMM YYYY")
              );

              if (pickupDate < today) {
                this.setState({
                  pickupDate: moment(today).format("YYYY-MM-DD")
                });
              }

              let etd = Date.parse(
                moment(this.state.etd).format("DD MMM YYYY")
              );

              if (etd < pickupDate) {
                this.setState(
                  {
                    etd: moment(pickupDate).format("YYYY-MM-DD")
                  },
                  () => {
                    etd = Date.parse(
                      moment(this.state.etd).format("DD MMM YYYY")
                    );

                    let eta = Date.parse(
                      moment(this.state.eta).format("DD MMM YYYY")
                    );

                    if (eta < etd) {
                      this.setState({
                        eta: moment(etd).format("YYYY-MM-DD")
                      });
                    }
                  }
                );
              }
            });
            break;

          case "etd":
            this.setState({ etd: e.target.value }, () => {
              let pickupDate = Date.parse(
                moment(this.state.pickupDate).format("DD MMM YYYY")
              );

              let etd = Date.parse(
                moment(this.state.etd).format("DD MMM YYYY")
              );

              if (etd < pickupDate) {
                this.setState({ etd: moment(pickupDate).format("YYYY-MM-DD") });
              }

              let eta = Date.parse(
                moment(this.state.eta).format("DD MMM YYYY")
              );

              if (eta < etd) {
                this.setState({
                  eta: moment(etd).format("YYYY-MM-DD")
                });
              }
            });
            break;

          case "eta":
            this.setState({ eta: e.target.value }, () => {
              let etd = Date.parse(
                moment(this.state.etd).format("DD MMM YYYY")
              );

              let eta = Date.parse(
                moment(this.state.eta).format("DD MMM YYYY")
              );

              if (eta < etd) {
                this.setState({
                  eta: moment(etd).format("YYYY-MM-DD")
                });
              }
            });
            break;

          default:
            console.log("Oh my...");
        }

        return;
      }
    } else if (e.target.name === "contactName") {
      const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

      if (e.target.value === "") {
        this.setState({ [e.target.name]: e.target.value });
      } else if (regex.test(e.target.value)) {
        this.setState({ [e.target.name]: e.target.value });
      }
      return;
    } else if (e.target.name === "contactNumber") {
      const regex = /[\d-]+$/u;

      if (e.target.value === "") {
        this.setState({ [e.target.name]: e.target.value });
      } else if (regex.test(e.target.value)) {
        this.setState({ [e.target.name]: e.target.value });
      }
      return;
    } else if (e.target.name === "originProvinceKey") {
      const province = provinces.filter(
        province => province.key === e.target.value
      );

      this.setState({
        originProvinceKey: e.target.value,
        originProvinceName: province[0].name,
        originCity: ""
      });
    } else if (e.target.name === "originCity") {
      this.setState({
        originCity: e.target.value
      });
    } else if (e.target.name === "destinationProvinceKey") {
      const province = provinces.filter(
        province => province.key === e.target.value
      );

      this.setState({
        destinationProvinceKey: e.target.value,
        destinationProvinceName: province[0].name,
        destinationCity: ""
      });
    } else if (e.target.name === "destinationCity") {
      this.setState({
        destinationCity: e.target.value
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }

    if (e.target.name === "modeOfTransport") {
      this.setState({ blAwb: "" });

      if (e.target.value === "Air") {
        this.setState({ commodityType: "" });
      }
    }
  }

  toggleCheck(e) {
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }

  enableEdit() {
    this.setState({
      isEditable: true,
      isToggleComplete: false
    });
  }

  toggleComplete() {
    this.setState({
      isToggleComplete: true,
      isEditable: false
    });
  }

  // @submitCompleteLog
  submitCompleteLog() {
    const { log } = this.props.log;

    const data = {
      domJo: log.domJo,
      remarks: this.state.remarks,
      type: log.type,
      user: log.user
    };

    this.props.submitCompleteLog(data);
  }

  closeEdit() {
    const { log } = this.props.log;

    this.setState({
      domJo: log.domJo,
      shipperConsignee: log.shipperConsignee,
      associate: log.associate,
      modeOfTransport: log.modeOfTransport,
      commodityType: log.commodity.type,
      commodityDescription: log.commodity.description,
      blAwb: log.blAwb,

      pickupDate: moment(log.pickupDate).format("YYYY-MM-DD"),
      etd: moment(log.etd).format("YYYY-MM-DD"),
      eta: moment(log.eta).format("YYYY-MM-DD"),
      status: log.status,
      type: log.type,
      remarks: log.remarks,

      tagUrgent: log.tags.urgent,
      tagInsured: log.tags.insured,

      contactName: log.contact.name,
      contactNumber: log.contact.number,
      contactEmail: log.contact.email,

      originLocation: log.origin.location,

      destinationLocation: log.destination.location,

      isEditable: false
    });

    if (log.type === "Domestic") {
      this.setState({
        originProvinceKey: log.origin.provinceKey,
        originProvinceName: log.origin.provinceName,
        originCity: log.origin.city,

        destinationProvinceKey: log.destination.provinceKey,
        destinationProvinceName: log.destination.provinceName,
        destinationCity: log.destination.city
      });
    }

    if (log.type === "International") {
      this.setState({
        originCountry: log.origin.country,
        destinationCountry: log.destination.country
      });
    }
    this.props.clearErrors();
  }

  closeComplete() {
    this.setState({ isToggleComplete: false });
  }

  // @submitEdit
  submitEdit() {
    const { log } = this.props.log;

    this.props.clearAlert();

    if (log.type === "Domestic") {
      const editLog = {
        domJo: log.domJo,
        shipperConsignee: this.state.shipperConsignee,
        modeOfTransport: this.state.modeOfTransport,

        commodityType: this.state.commodityType,
        commodityDescription: this.state.commodityDescription,

        blAwb: this.state.blAwb,

        originProvinceKey: this.state.originProvinceKey,
        originProvinceName: this.state.originProvinceName,
        originCity: this.state.originCity,
        originLocation: this.state.originLocation,

        destinationProvinceKey: this.state.destinationProvinceKey,
        destinationProvinceName: this.state.destinationProvinceName,
        destinationCity: this.state.destinationCity,
        destinationLocation: this.state.destinationLocation,

        pickupDate: this.state.pickupDate,
        etd: this.state.etd,
        eta: this.state.eta,
        status: this.state.status,

        tagUrgent: this.state.tagUrgent,
        tagInsured: this.state.tagInsured,

        contactName: this.state.contactName,
        contactNumber: this.state.contactNumber,
        contactEmail: this.state.contactEmail,

        type: "Domestic"
      };

      this.props.editLog(editLog);
    }

    if (log.type === "International") {
      const editLog = {
        domJo: log.domJo,
        shipperConsignee: this.state.shipperConsignee,
        modeOfTransport: this.state.modeOfTransport,

        commodityType: this.state.commodityType,
        commodityDescription: this.state.commodityDescription,

        blAwb: this.state.blAwb,

        originCountry: this.state.originCountry,
        originLocation: this.state.originLocation,

        destinationCountry: this.state.destinationCountry,
        destinationLocation: this.state.destinationLocation,

        etd: this.state.etd,
        eta: this.state.eta,
        status: this.state.status,

        tagUrgent: this.state.tagUrgent,
        tagInsured: this.state.tagInsured,

        contactName: this.state.contactName,
        contactNumber: this.state.contactNumber,
        contactEmail: this.state.contactEmail,

        type: "International"
      };

      this.props.editLog(editLog);
    }
  }

  deleteLog() {
    this.props.deleteLog(this.props.log.log);
  }

  //
  render() {
    const { errors, isEditable, isToggleComplete } = this.state;
    const { auth } = this.props;
    const { log, submitInProgress } = this.props.log;

    let editControls = null;

    let etaLimit;
    if (this.state.etd !== "") {
      etaLimit = moment(this.state.etd).format("YYYY-MM-DD");
    } else {
      etaLimit = moment().format("YYYY-MM-DD");
    }

    let tags = [];

    if (log.tags.urgent === true) tags.push("Urgent");
    if (log.tags.insured === true) tags.push("Insured");

    if (
      auth.user.userType === "admin" ||
      (auth.user.userType === "sales" && auth.user.id === log.user)
    ) {
      if (!isToggleComplete && log.isCompleted === false) {
        editControls = (
          <button
            type="button"
            className="btn btn-outline-primary mr-2 mb-3 pfes-print-hide"
            onClick={this.enableEdit}
          >
            Edit Job Order
          </button>
        );

        if (isEditable && log.isCompleted === false) {
          editControls = (
            <button
              disabled={submitInProgress ? true : false}
              type="button"
              className="btn btn-primary mr-2 mb-3"
              onClick={this.submitEdit}
            >
              Confirm Edit
            </button>
          );
        }
      }
    }

    let completeControl = null;
    if (
      auth.user.userType === "admin" ||
      (auth.user.userType === "sales" && auth.user.id === log.user)
    )
      if (!isEditable && log.isCompleted === false) {
        completeControl = (
          <button
            title={
              !log.operations.unloading.isFinished
                ? "Operations must be finished before this log can be marked as complete"
                : null
            }
            disabled={!log.operations.unloading.isFinished}
            type="button"
            className={classnames("btn mr-2 mb-3 pfes-print-hide", {
              "btn-secondary": !log.operations.unloading.isFinished,
              "btn-outline-success": log.operations.unloading.isFinished
            })}
            onClick={this.toggleComplete}
          >
            Mark as Complete
          </button>
        );

        if (
          isToggleComplete &&
          log.isCompleted === false &&
          log.operations.unloading.isFinished
        ) {
          completeControl = (
            <button
              disabled={submitInProgress ? true : false}
              type="button"
              className="btn btn-success mr-2 mb-3 pfes-print-hide"
              onClick={this.submitCompleteLog}
            >
              Confirm Complete
            </button>
          );
        }
      } else if (log.isCompleted === true) {
      }

    let deleteControl = null;
    if (auth.user.userType === "admin") {
      deleteControl =
        isEditable || isToggleComplete ? null : (
          <button
            disabled={submitInProgress ? true : false}
            title="Delete Log"
            className="btn btn-outline-danger mb-3 mr-2 pfes-print-hide"
            onClick={this.deleteLog}
          >
            <i className="fas fa-trash-alt" />
          </button>
        );
    }

    // Define domestic origin and destination inputs
    // @defineDomesticOriginAndDestinationInputs
    let originDestinationInputs = null;

    if (log.type === "Domestic") {
      originDestinationInputs = (
        <React.Fragment>
          <div className="row mt-3">
            {isEditable ? (
              <React.Fragment>
                <div className="form-group col-lg-4 pr-lg-1">
                  <label className="mb-1" htmlFor="originProvinceKey">
                    Origin Address
                  </label>

                  <input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.originLocation
                    })}
                    placeholder=""
                    name="originLocation"
                    value={this.state.originLocation}
                    onChange={this.onChange}
                    maxLength="100"
                  />

                  <small className="form-text text-muted">
                    Building, Street Name, Barangay
                  </small>

                  {errors.originLocation && (
                    <div className="invalid-feedback">
                      {errors.originLocation}
                    </div>
                  )}
                </div>

                <div className="form-group col-lg-4 px-lg-1">
                  <label
                    className="mb-1 d-none d-lg-block"
                    htmlFor="originProvinceKey"
                  >
                    &nbsp;
                  </label>
                  <select
                    className={classnames("form-control", {
                      "is-invalid": errors.originProvinceKey
                    })}
                    id="originProvinceKey"
                    name="originProvinceKey"
                    value={this.state.originProvinceKey}
                    onChange={this.onChange}
                  >
                    <option value="" disabled defaultValue>
                      Select a Province
                    </option>

                    {provinces.map((province, index) => {
                      return (
                        <option key={index} value={province.key}>
                          {province.name}
                        </option>
                      );
                    })}
                  </select>

                  <small className="form-text text-muted">Province</small>

                  {errors.originProvinceKey && (
                    <div className="invalid-feedback">
                      {errors.originProvinceKey}
                    </div>
                  )}
                </div>

                <div className="form-group col-lg-4 pl-lg-1">
                  <label
                    className="mb-1 d-none d-lg-block"
                    htmlFor="originLocation"
                  >
                    &nbsp;
                  </label>

                  <select
                    disabled={
                      this.state.originProvinceKey === "" ? true : false
                    }
                    className={classnames("form-control", {
                      "is-invalid": errors.originCity
                    })}
                    id="originCity"
                    name="originCity"
                    value={this.state.originCity}
                    onChange={this.onChange}
                  >
                    <option value="" disabled defaultValue>
                      Select a City/Municipality
                    </option>

                    {this.state.originProvinceKey === ""
                      ? null
                      : cities
                          .filter(
                            city =>
                              city.province === this.state.originProvinceKey
                          )
                          .map((city, index) => {
                            return (
                              <option key={index} value={city.name}>
                                {city.name}
                              </option>
                            );
                          })}
                  </select>

                  <small className="form-text text-muted">
                    City/Municipality
                  </small>

                  {errors.originCity && (
                    <div className="invalid-feedback">{errors.originCity}</div>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div className="col-md-12 mb-2">
                <h5>
                  Origin:{" "}
                  <strong>
                    {log.origin.location}, {log.origin.city},{" "}
                    {log.origin.provinceName}
                  </strong>
                </h5>
              </div>
            )}
          </div>

          <div className="row">
            {isEditable ? (
              <React.Fragment>
                <div className="form-group col-lg-4 pr-lg-1">
                  <label className="mb-1" htmlFor="destinationProvinceKey">
                    Destination Address
                  </label>

                  <input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.destinationLocation
                    })}
                    placeholder=""
                    name="destinationLocation"
                    value={this.state.destinationLocation}
                    onChange={this.onChange}
                    maxLength="100"
                  />

                  <small className="form-text text-muted">
                    Building, Street Name, Barangay
                  </small>

                  {errors.destinationLocation && (
                    <div className="invalid-feedback">
                      {errors.destinationLocation}
                    </div>
                  )}
                </div>

                <div className="form-group col-lg-4 px-lg-1">
                  <label
                    className="mb-1 d-none d-lg-block"
                    htmlFor="destinationCity"
                  >
                    &nbsp;
                  </label>
                  <select
                    className={classnames("form-control", {
                      "is-invalid": errors.destinationProvinceKey
                    })}
                    id="destinationProvinceKey"
                    name="destinationProvinceKey"
                    value={this.state.destinationProvinceKey}
                    onChange={this.onChange}
                  >
                    <option value="" disabled defaultValue>
                      Select a Province
                    </option>

                    {provinces.map((province, index) => {
                      return (
                        <option key={index} value={province.key}>
                          {province.name}
                        </option>
                      );
                    })}
                  </select>

                  <small className="form-text text-muted">Province</small>

                  {errors.destinationProvinceKey && (
                    <div className="invalid-feedback">
                      {errors.destinationProvinceKey}
                    </div>
                  )}
                </div>

                <div className="form-group col-lg-4 pl-lg-1">
                  <label
                    className="mb-1 d-none d-lg-block"
                    htmlFor="destinationLocation"
                  >
                    &nbsp;
                  </label>

                  <select
                    disabled={
                      this.state.destinationProvinceKey === "" ? true : false
                    }
                    className={classnames("form-control", {
                      "is-invalid": errors.destinationCity
                    })}
                    id="destinationCity"
                    name="destinationCity"
                    value={this.state.destinationCity}
                    onChange={this.onChange}
                  >
                    <option value="" disabled defaultValue>
                      Select a City/Municipality
                    </option>

                    {this.state.destinationProvinceKey === ""
                      ? null
                      : cities
                          .filter(
                            city =>
                              city.province ===
                              this.state.destinationProvinceKey
                          )
                          .map((city, index) => {
                            return (
                              <option key={index} value={city.name}>
                                {city.name}
                              </option>
                            );
                          })}
                  </select>

                  <small className="form-text text-muted">
                    City/Municipality
                  </small>

                  {errors.originCity && (
                    <div className="invalid-feedback">{errors.originCity}</div>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div className="col-md-12 mb-2">
                <h5>
                  Destination:{" "}
                  <strong>
                    {log.destination.location}, {log.destination.city},{" "}
                    {log.destination.provinceName}
                  </strong>
                </h5>
              </div>
            )}
          </div>
        </React.Fragment>
      );
    }

    if (log.type === "International") {
      originDestinationInputs = (
        <React.Fragment>
          <div className="row mt-3">
            {isEditable ? (
              <React.Fragment>
                <div className="form-group col-lg-8">
                  <label className="mb-1" htmlFor="originLocation">
                    Origin Address
                  </label>

                  <input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.originLocation
                    })}
                    placeholder=""
                    name="originLocation"
                    value={this.state.originLocation}
                    onChange={this.onChange}
                    maxLength="100"
                  />

                  <small className="form-text text-muted">Address</small>

                  {errors.originLocation && (
                    <div className="invalid-feedback">
                      {errors.originLocation}
                    </div>
                  )}
                </div>

                <div className="form-group col-lg-4">
                  <label
                    className="mb-1 d-none d-lg-block"
                    htmlFor="originCountry"
                  >
                    &nbsp;
                  </label>

                  <select
                    className={classnames("form-control", {
                      "is-invalid": errors.originCountry
                    })}
                    id="originCountry"
                    name="originCountry"
                    value={this.state.originCountry}
                    onChange={this.onChange}
                  >
                    <option value="" disabled defaultValue>
                      Select a Country
                    </option>

                    {countries.map((country, index) => {
                      return (
                        <option key={index} value={country.name}>
                          {country.name}
                        </option>
                      );
                    })}
                  </select>

                  <small className="form-text text-muted">Country</small>

                  {errors.originCountry && (
                    <div className="invalid-feedback">
                      {errors.originCountry}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div className="col-md-12 mb-2">
                <h5>
                  Origin:{" "}
                  <strong>
                    {log.origin.location}, {log.origin.country}
                  </strong>
                </h5>
              </div>
            )}
          </div>

          <div className="row">
            {isEditable ? (
              <React.Fragment>
                <div className="form-group col-lg-8">
                  <label className="mb-1" htmlFor="destinationLocation">
                    Destination Address
                  </label>

                  <input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.destinationLocation
                    })}
                    placeholder=""
                    name="destinationLocation"
                    value={this.state.destinationLocation}
                    onChange={this.onChange}
                    maxLength="100"
                  />

                  <small className="form-text text-muted">Address</small>

                  {errors.destinationLocation && (
                    <div className="invalid-feedback">
                      {errors.destinationLocation}
                    </div>
                  )}
                </div>

                <div className="form-group col-lg-4">
                  <label
                    className="mb-1 d-none d-lg-block"
                    htmlFor="destinationCountry"
                  >
                    &nbsp;
                  </label>

                  <select
                    className={classnames("form-control", {
                      "is-invalid": errors.destinationCountry
                    })}
                    id="destinationCountry"
                    name="destinationCountry"
                    value={this.state.destinationCountry}
                    onChange={this.onChange}
                  >
                    <option value="" disabled defaultValue>
                      Select a Country
                    </option>

                    {countries.map((country, index) => {
                      return (
                        <option key={index} value={country.name}>
                          {country.name}
                        </option>
                      );
                    })}
                  </select>

                  <small className="form-text text-muted">Country</small>

                  {errors.destinationCountry && (
                    <div className="invalid-feedback">
                      {errors.destinationCountry}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div className="col-md-12 mb-2">
                <h5>
                  Destination:{" "}
                  <strong>
                    {log.destination.location}, {log.destination.country}
                  </strong>
                </h5>
              </div>
            )}
          </div>
        </React.Fragment>
      );
    }

    // @return
    return (
      <div ref={this.toPrint}>
        <AlertBox />
        <div className="container row">
          <div className="pfes-print-element">
            <div>
              <img
                src={logo}
                alt="Logo print"
                style={{ width: "10rem", height: "auto", margin: "1rem" }}
              />
            </div>
            <h2>
              {log.type} Job Order #{log.domJo}
            </h2>
          </div>

          <h2 className="mr-3 pfes-print-hide">Details</h2>

          <div className="d-block">
            {log.isCompleted ? null : editControls}

            {editControls !== null ? (
              isEditable ? (
                <button
                  disabled={submitInProgress ? true : false}
                  type="button"
                  className="btn btn-secondary mb-3 mr-2"
                  onClick={this.closeEdit}
                >
                  Back
                </button>
              ) : null
            ) : null}

            {completeControl}

            {completeControl !== null && log.operations.unloading.isFinished ? (
              isToggleComplete ? (
                <button
                  disabled={submitInProgress ? true : false}
                  type="button"
                  className="btn btn-secondary mb-3 mr-2"
                  onClick={this.closeComplete}
                >
                  Back
                </button>
              ) : null
            ) : null}
          </div>

          <div className="d-block">
            {deleteControl}

            {/* @print */}
            {isEditable || isToggleComplete ? null : (
              <ReactToPrint
                trigger={() => (
                  <button
                    title="Print Log"
                    type="button"
                    className="btn btn-outline-primary shadow-sm mb-3 pfes-print-hide"
                  >
                    <i className="fas fa-print" />
                  </button>
                )}
                content={() => this.toPrint.current}
              />
            )}
          </div>
        </div>

        {(() => {
          if (
            isToggleComplete &&
            log.isCompleted === false &&
            log.operations.unloading.isFinished
          ) {
            return (
              <form noValidate>
                <div className="row">
                  <div className="col-12">
                    <textarea
                      type="text"
                      className="form-control mb-3"
                      name="remarks"
                      placeholder="Job Order Completion Remarks (Optional)"
                      value={this.remarks}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </form>
            );
          }
        })()}

        {(() => {
          if (log.isCompleted === true) {
            return (
              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <h2>
                      <span className="badge badge-success">Complete</span>
                    </h2>
                  </div>

                  <div className="mb-3">
                    <h5
                      title={moment(log.dateCompleted).format(
                        "MMMM Do YYYY, h:mm:ssa"
                      )}
                    >
                      Date Completed:{" "}
                      <strong>
                        {moment(log.dateCompleted).format("MMMM Do YYYY")}
                      </strong>
                    </h5>
                  </div>

                  <div className="mb-3">
                    <h5>
                      Completion Remarks: <strong>{log.remarks}</strong>
                    </h5>
                  </div>

                  <div className="dropdown-divider mb-3" />
                </div>
              </div>
            );
          }
        })()}

        <form noValidate>
          <div className="row">
            {isEditable ? (
              <div className="form-group col-md-12">
                <label className="mb-1" htmlFor="associate">
                  Associate
                </label>
                <input
                  readOnly
                  type="text"
                  className={classnames("form-control", {
                    "is-invalid": errors.associate
                  })}
                  placeholder=""
                  name="associate"
                  value={this.state.associate}
                  // onChange={this.onChange}
                />
                {errors.associate && (
                  <div className="invalid-feedback">{errors.associate}</div>
                )}
              </div>
            ) : (
              <div className="col-md-6 mb-2">
                <h5>
                  Associate: <strong>{log.associate}</strong>
                </h5>
              </div>
            )}
          </div>

          <div className="row">
            {isEditable ? (
              <div className="form-group col-md-6">
                <label className="mb-1" htmlFor="shipperConsignee">
                  Shipper/Consignee
                </label>
                <input
                  readOnly={!isEditable}
                  type="text"
                  className={classnames("form-control", {
                    "is-invalid": errors.shipperConsignee
                  })}
                  placeholder=""
                  name="shipperConsignee"
                  value={this.state.shipperConsignee}
                  onChange={this.onChange}
                  maxLength="100"
                />
                {errors.shipperConsignee && (
                  <div className="invalid-feedback">
                    {errors.shipperConsignee}
                  </div>
                )}
              </div>
            ) : (
              <div className="col-md-6 mb-2">
                <h5>
                  Shipper/Consignee: <strong>{log.shipperConsignee}</strong>
                </h5>
              </div>
            )}

            {isEditable ? (
              <div className="form-group col-md-6">
                <label className="mb-1" htmlFor="modeOfTransport">
                  Mode of Transport
                </label>

                <select
                  className={classnames("form-control", {
                    "is-invalid": errors.modeOfTransport
                  })}
                  id="modeOfTransport"
                  name="modeOfTransport"
                  value={this.state.modeOfTransport}
                  onChange={this.onChange}
                >
                  <option value="" disabled defaultValue>
                    Select a Mode of Transport
                  </option>

                  {log.type === "Domestic" ? (
                    <option value="Truck">Truck</option>
                  ) : null}
                  <option value="Sea">Sea</option>
                  <option value="Air">Air</option>
                </select>

                {errors.modeOfTransport && (
                  <div className="invalid-feedback">
                    {errors.modeOfTransport}
                  </div>
                )}
              </div>
            ) : (
              <div className="col-md-6 mb-2">
                <h5>
                  Mode of Transport: <strong>{log.modeOfTransport}</strong>
                </h5>
              </div>
            )}
          </div>

          <div className="row">
            {/* @commodity */}
            {isEditable ? (
              <div className="col-lg-6">
                <div className="row">
                  <div className="form-group col-5 pr-1">
                    <label className="mb-1" htmlFor="commodity">
                      Commodity
                    </label>

                    <select
                      disabled={
                        this.state.modeOfTransport === "" ||
                        this.state.modeOfTransport === "Air"
                          ? true
                          : false
                      }
                      className={classnames("form-control", {
                        "is-invalid": errors.commodityType
                      })}
                      id="commodityType"
                      name="commodityType"
                      value={this.state.commodityType}
                      onChange={this.onChange}
                    >
                      <option value="" disabled defaultValue>
                        (Container)
                      </option>

                      <option value="FCL 1x10'">FCL 1x10'</option>

                      <option value="FCL 1x20'">FCL 1x20'</option>

                      <option value="FCL 1x40'">FCL 1x40'</option>

                      <option value="FCL 1x40' HC">FCL 1x40' HC</option>

                      <option value="LCL">LCL</option>
                    </select>

                    <small className="form-text text-muted">
                      For Truck and Sea
                    </small>

                    {errors.commodityType && (
                      <div className="invalid-feedback">
                        {errors.commodityType}
                      </div>
                    )}
                  </div>

                  <div className="form-group col-7 pl-1">
                    <label className="mb-1" htmlFor="commodity">
                      &nbsp;
                    </label>

                    <input
                      type="text"
                      className={classnames("form-control", {
                        "is-invalid": errors.commodityDescription
                      })}
                      placeholder="Description"
                      name="commodityDescription"
                      value={this.state.commodityDescription}
                      onChange={this.onChange}
                      maxLength="100"
                    />
                    {errors.commodityDescription && (
                      <div className="invalid-feedback">
                        {errors.commodityDescription}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-6 mb-2">
                <h5>
                  Commodity:{" "}
                  <strong>
                    {log.commodity.type ? `${log.commodity.type},` : null}{" "}
                    {log.commodity.description}
                  </strong>
                </h5>
              </div>
            )}

            {isEditable ? (
              <div className="form-group col-md-6">
                {this.state.modeOfTransport === "" ||
                this.state.modeOfTransport === "Truck" ? (
                  <label className="mb-1" htmlFor="blAwb">
                    <span className="text-muted">
                      <em>For Air and Sea transport only</em>
                    </span>
                  </label>
                ) : this.state.modeOfTransport === "Sea" ? (
                  <label className="mb-1" htmlFor="blAwb">
                    Bill of Lading Number{" "}
                    <span className="text-muted">
                      <em>- Optional</em>
                    </span>
                  </label>
                ) : this.state.modeOfTransport === "Air" ? (
                  <label className="mb-1" htmlFor="blAwb">
                    Air Waybill Number{" "}
                    <span className="text-muted">
                      <em>- Optional</em>
                    </span>
                  </label>
                ) : (
                  <label className="mb-1" htmlFor="blAwb">
                    <span className="text-muted">
                      <em>For Air and Sea transport only</em>
                    </span>
                  </label>
                )}

                <input
                  readOnly={
                    this.state.modeOfTransport === "" ||
                    this.state.modeOfTransport === "Truck"
                      ? true
                      : false
                  }
                  type="text"
                  className={classnames("form-control", {
                    "is-invalid": errors.blAwb
                  })}
                  placeholder={
                    this.state.modeOfTransport === "" ||
                    this.state.modeOfTransport === "Truck"
                      ? ""
                      : this.state.modeOfTransport === "Sea"
                        ? ""
                        : this.state.modeOfTransport === "Air"
                          ? ""
                          : ""
                  }
                  name="blAwb"
                  value={this.state.blAwb}
                  onChange={this.onChange}
                  maxLength="100"
                />
                {errors.blAwb && (
                  <div className="invalid-feedback">{errors.blAwb}</div>
                )}
              </div>
            ) : (
              <div className="col-md-6 mb-2">
                <h5>
                  BL/AWB#:{" "}
                  {log.blAwb ? <strong>{log.blAwb}</strong> : <em>n/a</em>}
                </h5>
              </div>
            )}
          </div>

          <div className="dropdown-divider" />

          {/* @originDestination */}
          {originDestinationInputs}

          <div className="dropdown-divider" />

          {/* @pickup */}
          <div className="row mt-3">
            {isEditable ? (
              <div className="form-group col-md-4">
                <label className="mb-1" htmlFor="pickupDate">
                  Pickup
                </label>
                <input
                  readOnly={!isEditable}
                  type="date"
                  className={classnames("form-control", {
                    "is-invalid": errors.pickupDate
                  })}
                  name="pickupDate"
                  value={this.state.pickupDate}
                  onChange={this.onChange}
                  max="2999-01-01"
                />
                {errors.pickupDate && (
                  <div className="invalid-feedback">{errors.pickupDate}</div>
                )}
              </div>
            ) : (
              <div className="col-md-4 mb-2">
                <h5>
                  Pickup:{" "}
                  <strong title={moment(log.pickupDate).format("MMMM Do YYYY")}>
                    <Moment format="MM/DD/YYYY">{log.pickupDate}</Moment>
                  </strong>
                </h5>
              </div>
            )}

            {isEditable ? (
              <div className="form-group col-md-4">
                <label className="mb-1" htmlFor="etd">
                  ETD
                </label>
                <input
                  readOnly={!isEditable}
                  type="date"
                  className={classnames("form-control", {
                    "is-invalid": errors.etd
                  })}
                  name="etd"
                  value={this.state.etd}
                  onChange={this.onChange}
                  min={moment(this.state.pickupDate).format("YYYY-MM-DD")}
                  max="2999-01-01"
                />
                {errors.etd && (
                  <div className="invalid-feedback">{errors.etd}</div>
                )}
              </div>
            ) : (
              <div className="col-md-4 mb-2">
                <h5>
                  ETD:{" "}
                  <strong title={moment(log.etd).format("MMMM Do YYYY")}>
                    <Moment format="MM/DD/YYYY">{log.etd}</Moment>
                  </strong>
                </h5>
              </div>
            )}

            {isEditable ? (
              <div className="form-group col-md-4">
                <label className="mb-1" htmlFor="eta">
                  ETA
                </label>
                <input
                  readOnly={!isEditable}
                  type="date"
                  className={classnames("form-control", {
                    "is-invalid": errors.eta
                  })}
                  name="eta"
                  value={this.state.eta}
                  onChange={this.onChange}
                  min={etaLimit}
                  max="2999-01-01"
                />
                {errors.eta && (
                  <div className="invalid-feedback">{errors.eta}</div>
                )}
              </div>
            ) : (
              <div className="col-md-4 mb-2">
                <h5>
                  ETA:{" "}
                  <strong title={moment(log.eta).format("MMMM Do YYYY")}>
                    <Moment format="MM/DD/YYYY">{log.eta}</Moment>
                  </strong>
                </h5>
              </div>
            )}
          </div>

          <div className="row">
            {isEditable ? (
              <div className="form-group col-md-6">
                <label className="mb-1" htmlFor="status">
                  Status
                </label>

                <select
                  className={classnames("form-control", {
                    "is-invalid": errors.status
                  })}
                  disabled={!isEditable}
                  readOnly={!isEditable}
                  id="status"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Void">Void</option>
                </select>
                {errors.status && (
                  <div className="invalid-feedback">{errors.status}</div>
                )}
              </div>
            ) : (
              <div className="col-md-4 mb-2">
                <h5>
                  Status: <strong>{log.status}</strong>
                </h5>
              </div>
            )}

            {isEditable ? (
              <div className="form-group col-md-6">
                <label className="mb-1" htmlFor="status">
                  Tags
                </label>

                <div className="form-control">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="tagUrgent"
                      name="tagUrgent"
                      checked={this.state.tagUrgent}
                      onChange={this.toggleCheck}
                    />
                    <label className="form-check-label" htmlFor="tagUrgent">
                      Urgent
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="tagInsured"
                      name="tagInsured"
                      checked={this.state.tagInsured}
                      onChange={this.toggleCheck}
                    />
                    <label className="form-check-label" htmlFor="tagInsured">
                      Insured
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-4 mb-2">
                <h5>
                  Tags:{" "}
                  {tags.length ? (
                    <strong> {tags.join(", ")} </strong>
                  ) : (
                    <em>No tags</em>
                  )}
                </h5>
              </div>
            )}
          </div>

          <div className="dropdown-divider" />

          {/* CONTACT */}

          <div className="row mt-3">
            {isEditable ? (
              <div className="form-group col-md-6">
                <label className="mb-1" htmlFor="contactName">
                  Contact Name
                </label>
                <input
                  type="text"
                  className={classnames("form-control", {
                    "is-invalid": errors.contactName
                  })}
                  placeholder=""
                  name="contactName"
                  value={this.state.contactName}
                  onChange={this.onChange}
                  maxLength="100"
                />
                {errors.contactName && (
                  <div className="invalid-feedback">{errors.contactName}</div>
                )}
              </div>
            ) : (
              <div className="col-md-6">
                <h6>
                  Contact Name: <strong>{log.contact.name}</strong>
                </h6>
              </div>
            )}

            {isEditable ? (
              <div className="form-group col-md-6">
                <label className="mb-1" htmlFor="contactNumber">
                  Contact Number
                </label>
                <input
                  type="text"
                  className={classnames("form-control", {
                    "is-invalid": errors.contactNumber
                  })}
                  placeholder=""
                  name="contactNumber"
                  value={this.state.contactNumber}
                  onChange={this.onChange}
                  maxLength="15"
                />
                {errors.contactNumber && (
                  <div className="invalid-feedback">{errors.contactNumber}</div>
                )}
              </div>
            ) : (
              <div className="col-md-4">
                <h6>
                  Contact Number: <strong>{log.contact.number}</strong>
                </h6>
              </div>
            )}
          </div>

          <div className="row">
            {isEditable ? (
              <div className="form-group col-md-12">
                <label className="mb-1" htmlFor="contactEmail">
                  Contact Email
                </label>
                <input
                  type="text"
                  className={classnames("form-control", {
                    "is-invalid": errors.contactEmail
                  })}
                  placeholder="example@address.com"
                  name="contactEmail"
                  value={this.state.contactEmail}
                  onChange={this.onChange}
                  maxLength="100"
                />
                {errors.contactEmail && (
                  <div className="invalid-feedback">{errors.contactEmail}</div>
                )}
              </div>
            ) : (
              <div className="col-md-12">
                <h6>
                  Contact Email: <strong>{log.contact.email}</strong>
                </h6>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

LogViewEdit.propTypes = {
  getDomesticLogs: PropTypes.func.isRequired,
  editLog: PropTypes.func.isRequired,
  getInternationalLogs: PropTypes.func.isRequired,
  submitCompleteLog: PropTypes.func.isRequired,
  deleteLog: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  log: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  log: state.log,
  errors: state.errors,
  success: state.success,
  alert: state.alert
});

export default connect(
  mapStateToProps,
  {
    editLog,
    getDomesticLogs,
    getInternationalLogs,
    deleteLog,
    clearErrors,
    submitCompleteLog,
    clearAlert
  }
)(LogViewEdit);
