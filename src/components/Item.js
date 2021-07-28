import React, { useState, useEffect, useRef } from "react";
import "./item.css";
import axios from "axios";
import Dropzone from "./Dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Options from "./Options";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const Item = () => {
  const [items, setItems] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [show, setShow] = useState(false);
  const [hShow, setHShow] = useState(false);
  const [updateItem, setUpdateItem] = useState([]);
  const [increase, setIncrease] = useState(false);
  const [lowStockUnit, setLowStockUnit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [date, setDate] = useState(new Date());

  const inc = useRef();
  const dec = useRef();
  const newStocks = useRef();

  const handleClose = () => setShow(false);
  const handleShow = (item) => setShow(true);

  const handleEditShow = () => setHShow(true);
  const handleEditClose = () => setHShow(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get("/all");
        setItems(res.data);
        setIsFetching(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, []);

  const updateIsChecked = (id) => {
    if (isChecked.includes(id)) {
      setIsChecked(isChecked.filter((item) => item !== id));
    } else {
      setIsChecked([...isChecked, id]);
    }
  };

  if (selectAll) {
    const inputs = document.getElementsByTagName("input");

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type.toLowerCase() === "checkbox") {
        inputs[i].setAttribute("checked", "true");
      }
    }
  } else {
    const inputs = document.getElementsByTagName("input");

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type.toLowerCase() === "checkbox") {
        inputs[i].removeAttribute("checked");
      }
    }
  }

  const handleUpdateProduct = async (id) => {
    if (!increase) {
      newStocks.current.value = -1 * newStocks.current.value;
    }

    const update = {
      opening: newStocks.current.value,
    };
    try {
      await axios.put("/edit-stocks/" + id, update);
      const fetchItems = async () => {
        const res = await axios.get("/all");
        setItems(res.data);
      };
      fetchItems();
    } catch (err) {
      console.log(err);
    }
    setShow(false);
  };

  const handleEditSubmit = async (id) => {};

  const handleEdit = (item) => {
    console.log(item);
  };

  return (
    <>
      <Options
        items={items}
        setItems={setItems}
        toDelete={isChecked}
        selectAll={selectAll}
      />

      <div class="list">
        <table border="0" cellSpacing="0">
          <tr class="table-header">
            <td>
              <input
                type="checkbox"
                onChange={() => setSelectAll(!selectAll)}
              />
            </td>
            <td class="center">Item Name</td>
            <td class="center">Item Code</td>
            <td class="center">Category</td>
            <td class="center">Stock Quantity</td>
            <td>Stock on Hold</td>
            <td class="center">Stock Value</td>
            <td class="center">Purchase Price</td>
          </tr>
          {items.map((item, i) => {
            return (
              <tr key={item._id}>
                <td>
                  <input
                    type="checkbox"
                    // checked={selectAll}
                    onChange={() => updateIsChecked(item._id)}
                  />
                </td>
                <td>{item.name}</td>
                <td class="left">{item.code}</td>
                <td class="center">{item.category}</td>
                <td>{item.opening}</td>
                <td>0</td>
                <td>₹ {item.purchase_price * item.opening}</td>
                {item.tax ? (
                  <td>
                    ₹{" "}
                    {(item.tax_rate / 100) * item.purchase_price +
                      item.purchase_price}
                  </td>
                ) : (
                  <td>₹ {item.purchase_price}</td>
                )}

                <Modal
                  show={show}
                  onHide={handleClose}
                  style={{ Width: "300px!important" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Adjust Stock Quantity</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <strong>Item Name:</strong> {updateItem.name}
                    <br />
                    <strong>Current Stock:</strong> {updateItem.opening}
                    <br />
                    <input
                      id="inc"
                      type="radio"
                      style={{ marginRight: "10px" }}
                      name="plusminus"
                      ref={inc}
                      onChange={() => setIncrease(true)}
                    />
                    <label for="inc">Add (+)&nbsp;&nbsp;</label>
                    <input
                      id="dec"
                      name="plusminus"
                      type="radio"
                      ref={dec}
                      style={{ marginRight: "10px", paddingLeft: "10px" }}
                      onChange={() => setIncrease(false)}
                    />
                    <label for="dec">Reduce (-)</label>
                    <div
                      className="col-3 input-effect"
                      style={{ lineHeight: "0" }}
                    >
                      <input
                        className="effect-20"
                        type="text"
                        ref={newStocks}
                        placeholder="Adjust Stock"
                      />
                      <label>Adjust Stock</label>
                      <span className="focus-border">
                        <i></i>
                      </span>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleUpdateProduct(updateItem._id);
                      }}
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={hShow} onHide={handleEditClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Item: {updateItem.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div class="row" style={{ lineHeight: "0" }}>
                      <div class="col-md-6" style={{ height: "500px" }}>
                        <hr></hr>
                        General Information
                        <hr></hr>
                        <div class="col-3 input-effect">
                          <input
                            class="effect-20"
                            type="text"
                            placeholder="Item Name"
                            value={updateItem.name}
                          />
                          <label>Item Name</label>
                          <span class="focus-border">
                            <i></i>
                          </span>
                        </div>
                        <div class="form-group">
                          <br />

                          <select
                            class="form-control"
                            style={{ marginTop: "20px" }}
                            title="Category"
                            name="category"
                            id="category"
                            value={updateItem.category}
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
                        <div class="col-3 input-effect">
                          <input
                            class="effect-20"
                            type="text"
                            placeholder="Item Code"
                            value={updateItem.code}
                          />
                          <label>Item Code</label>
                          <span class="focus-border">
                            <i></i>
                          </span>
                        </div>
                        <div class="col-3 input-effect">
                          <input
                            class="effect-20"
                            type="text"
                            value={updateItem.desc}
                          />
                          <label>Item Description</label>
                          <span class="focus-border">
                            <i></i>
                          </span>
                          <Dropzone />
                        </div>
                      </div>
                      <div class="col-md-6" style={{ height: "500px" }}>
                        <div class="row" style={{ height: "auto" }}>
                          <div class="col-md-12">
                            <hr></hr>
                            Stock Details
                            <hr></hr>
                            <div class="form-group">
                              <br />

                              <select
                                class="form-control"
                                style={{ marginTop: "20px" }}
                                name="unit"
                                id="unit"
                                value={updateItem.unit}
                              >
                                <option value="" disabled selected>
                                  Unit
                                </option>
                                <option value="feet">FEET(FT)</option>
                                <option value="inches">INCHES(IN)</option>
                                <option value="unit">UNITS(UNT)</option>
                                <option value="piece">PIECES(PCS)</option>
                                <option value="meter">METERES(MTR)</option>
                              </select>
                            </div>
                            <div class="col-3 input-effect">
                              <input
                                class="effect-20"
                                type="text"
                                placeholder="Opening Stock"
                                value={updateItem.opening}
                              />
                              <label>Opening Stock</label>
                              <span class="focus-border">
                                <i></i>
                              </span>
                            </div>
                            <label>DATE:&nbsp;&nbsp;&nbsp;</label>
                            <DatePicker
                              style={{ marginBottom: "3px" }}
                              class="form-control"
                              selected={date}
                              value={updateItem.date}
                              onChange={(date) => setDate(date)}
                            />
                            <div
                              className="col-3 m-auto d-flex align-items-center"
                              style={{ verticalAlign: "middle" }}
                            >
                              Enable Low Stock Warning&nbsp;&nbsp;
                              <div
                                className="form-group"
                                style={{
                                  marginTop: "5px",
                                  verticalAlign: "middle",
                                }}
                              >
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="checkbox"
                                    id="checkbox"
                                    onChange={() =>
                                      setLowStockUnit(!lowStockUnit)
                                    }
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            {lowStockUnit && (
                              <div class="col-3 input-effect">
                                <input
                                  class="effect-20"
                                  id="showthis"
                                  type="text"
                                  placeholder="Low Stock Units"
                                  value={updateItem.low_stock_unit}
                                />
                                <label>Low Stock Units</label>
                                <span class="focus-border">
                                  <i></i>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-12">
                            <hr></hr>
                            Pricing Details
                            <hr></hr>
                            <div class="col-3 input-effect">
                              <input
                                class="effect-20"
                                type="text"
                                placeholder="Purchase Price"
                                value={updateItem.purchase_price}
                              />
                              <label>Purchase Price</label>
                              <span class="focus-border">
                                <i></i>
                              </span>
                            </div>
                            <div
                              className="col-3 m-auto d-flex align-items-center"
                              style={{
                                marginBottom: "15px",
                                verticalAlign: "middle",
                              }}
                            >
                              Inclusive Of Tax&nbsp;&nbsp;
                              <div
                                className="form-group"
                                style={{
                                  marginTop: "5px",
                                  verticalAlign: "middle",
                                }}
                              >
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="checkbox"
                                    id="checkbox"
                                    updateItem={updateItem.tax}
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                            <div
                              className="col-3 m-auto d-flex align-items-center"
                              style={{
                                marginBottom: "15px",
                                verticalAlign: "middle",
                              }}
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
                                {/* <label for="category"></label> */}
                                <select
                                  className="form-control"
                                  style={{ marginTop: "20px" }}
                                  name="unit"
                                  id="unit"
                                  value={updateItem.tax_rate}
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
                    <Button variant="secondary" onClick={handleEditClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
                <td>
                  {item.low_stock_warning &&
                    item.opening < item.low_stock_unit && (
                      <i class="fas fa-exclamation-triangle"></i>
                    )}
                  <i
                    class="fas fa-pencil-alt"
                    onClick={() => {
                      handleEditShow();
                      setUpdateItem(item);
                      handleEdit(item);
                      alert("Edit Part is not done!!!");
                    }}
                  ></i>

                  <button
                    class="btn btn-light"
                    onClick={() => {
                      handleShow();
                      setUpdateItem(item);
                    }}
                  >
                    Adjust Stock
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Item;
