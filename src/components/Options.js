import React, { useState, useRef, useEffect } from "react";
import "./options.css";
import Dropzone from "./Dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const Options = ({ items, setItems, toDelete, selectAll }) => {
  const [show, setShow] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [lowStockUnit, setLowStockUnit] = useState(false);
  const [originalItems, setOriginalItems] = useState([items]);
  const [date, setDate] = useState(new Date());

  const name = useRef();
  const category = useRef();
  const code = useRef();
  const unit = useRef();
  const opening = useRef();
  const low_stock_warning = useRef();
  const low_stock_unit = useRef();
  const tax_rate = useRef();
  const tax = useRef();
  const purchase_price = useRef();
  const desc = useRef();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      name: name.current.value,
      category: category.current.value,
      unit: unit.current.value,
      opening: opening.current.value,
      desc: desc.current.value,
      date: date,
      code: code.current.value,
      low_stock_warning:
        low_stock_warning.current.value === "on" ? true : false,
      low_stock_unit: low_stock_unit.current.value,
      purchase_price: purchase_price.current.value,
      tax: tax.current.value === "on" ? true : false,
      tax_rate: tax_rate.current.value,
    };
    console.log(newItem);
    try {
      await axios.post("/", newItem);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("/all");
        setItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (!showLowStock) {
      fetchItems();
      return;
    }
    if (showLowStock) {
      const item = items.filter((i) => {
        return i.opening < i.low_stock_unit;
      });
      setItems(item);
    }
  }, [showLowStock]);

  const handleLowStock = () => {
    setLowStockUnit(!lowStockUnit);
  };

  const handleDelete = async () => {
    if (selectAll) {
      try {
        await axios.delete("/all");
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
      return;
    }
    if (toDelete.length > 1) {
      // Delete multiple
      alert("Right Now you can delete a single or all items. WORK IN PROGRESS");
      // const newItem = {
      //   to_delete: JSON.stringify(toDelete),
      // };
      // try {
      //   await axios.delete("/delete/many", newItem);
      // } catch (err) {}
    } else {
      // delete Single
      try {
        await axios.delete(`/delete/${toDelete[0]}`);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="options">
        <button
          className="btn low"
          onClick={() => setShowLowStock(!showLowStock)}
        >
          {showLowStock ? "Show All Stock" : "Show Low Stock"}
        </button>

        <button className="btn btn-danger" onClick={() => handleDelete()}>
          <i className="far fa-trash-alt"></i>Delete selected
        </button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row" style={{ lineHeight: "0" }}>
              <div className="col-md-6" style={{ height: "500px" }}>
                <hr></hr>
                General Information
                <hr></hr>
                <div className="col-3 input-effect">
                  <input
                    className="effect-20"
                    type="text"
                    placeholder="Item Name"
                    ref={name}
                  />
                  <label>Item Name</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
                <div className="form-group">
                  <br />
                  <select
                    className="form-control"
                    style={{ marginTop: "20px" }}
                    title="Category"
                    name="category"
                    id="category"
                    ref={category}
                  >
                    <option value="" selected disabled>
                      Category
                    </option>
                    <option value="Panel">Panel</option>
                    <option value="Inverter">Inverter</option>
                    <option value="Wire">Wire</option>
                    <option value="MC4 Connector">MC4 Connector</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-3 input-effect">
                  <input
                    className="effect-20"
                    type="text"
                    placeholder="Item Code"
                    ref={code}
                  />
                  <label>Item Code</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
                <div className="col-3 input-effect">
                  <input
                    className="effect-20"
                    type="text"
                    placeholder="Item Description"
                    ref={desc}
                  />
                  <label>Item Description</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                  <Dropzone />
                </div>
              </div>
              <div className="col-md-6" style={{ height: "500px" }}>
                <div className="row" style={{ height: "auto" }}>
                  <div className="col-md-12">
                    <hr></hr>
                    Stock Details
                    <hr></hr>
                    <div className="form-group">
                      <br />
                      <select
                        className="form-control"
                        style={{ marginTop: "20px" }}
                        name="unit"
                        id="unit"
                        ref={unit}
                      >
                        <option value="" selected disabled>
                          Unit
                        </option>
                        <option value="feet">FEET(FT)</option>
                        <option value="inches">INCHES(IN)</option>
                        <option value="unit">UNITS(UNT)</option>
                        <option value="piece">PIECES(PCS)</option>
                        <option value="meter">METERES(MTR)</option>
                      </select>
                    </div>
                    <div className="col-3 input-effect">
                      <input
                        className="effect-20"
                        type="text"
                        placeholder="Opening Stock"
                        ref={opening}
                      />
                      <label>Opening Stock</label>
                      <span className="focus-border">
                        <i></i>
                      </span>
                    </div>
                    <DatePicker
                      className="form-control"
                      selected={date}
                      onChange={(date) => setDate(date)}
                    />
                    <div
                      className="col-3 m-auto d-flex align-items-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      Enable Low Stock Warning&nbsp;&nbsp;
                      <div
                        className="form-group"
                        style={{ marginTop: "5px", verticalAlign: "middle" }}
                      >
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="checkbox"
                            id="checkbox"
                            checked={lowStockUnit}
                            onChange={handleLowStock}
                            ref={low_stock_warning}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    {lowStockUnit && (
                      <div className="col-3 input-effect">
                        <input
                          className="effect-20"
                          id="showthis"
                          type="text"
                          placeholder="Low Stock Units"
                          ref={low_stock_unit}
                        />
                        <label>Low Stock Units</label>
                        <span className="focus-border">
                          <i></i>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <hr></hr>
                    Pricing Details
                    <hr></hr>
                    <div className="col-3 input-effect">
                      <input
                        className="effect-20"
                        type="text"
                        placeholder="Purchase Price"
                        ref={purchase_price}
                      />
                      <label>Purchase Price</label>
                      <span className="focus-border">
                        <i></i>
                      </span>
                    </div>
                    {/* <div className="col-3 input-effect">
                      <input
                        className="effect-20"
                        type="text"
                        placeholder="Tax Rate"
                        ref={tax_rate}
                      />
                      <label>Tax Rate</label>
                      <span className="focus-border">
                        <i></i>
                      </span>
                    </div> */}
                    <div
                      className="col-3 m-auto d-flex align-items-center"
                      style={{ marginBottom: "15px", verticalAlign: "middle" }}
                    >
                      Inclusive Of Tax&nbsp;&nbsp;
                      <div
                        className="form-group"
                        style={{ marginTop: "5px", verticalAlign: "middle" }}
                      >
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="checkbox"
                            id="checkbox"
                            ref={tax}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div
                      className="col-3 m-auto d-flex align-items-center"
                      style={{ marginBottom: "15px", verticalAlign: "middle" }}
                    >
                      <div
                        className="form-group"
                        style={{
                          verticalAlign: "middle",
                        }}
                      >
                        <br />
                        <br />
                        <br />
                        <select
                          className="form-control"
                          style={{ marginTop: "20px" }}
                          name="unit"
                          id="unit"
                          ref={tax_rate}
                        >
                          <option value="" selected disabled>
                            GST Tax Rate (%)
                          </option>
                          <option value="0">None</option>
                          <option value="0">Exempted</option>
                          <option value="5">GST 5%</option>
                          <option value="12">GST 12%</option>
                          <option value="18">GST 18%</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <button className="btn btn-primary" onClick={handleShow}>
          + Add to inventory
        </button>
      </div>
    </>
  );
};

export default Options;
