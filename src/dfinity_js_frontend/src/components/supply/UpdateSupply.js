import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateSupply = ({ supply, save }) => {
  const [capacity, setCapacity] = useState(Number(supply.capacity));
  const [price, setPrice] = useState(Number(supply.price));
  const [refill, setRefill] = useState(Number(supply.refill));
  const [show, setShow] = useState(false);

  const isFormFilled = () => refill && price && capacity;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className="rounded-pill btn btn-warning">
        Update <i className="bi bi-pen-fill"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Supply</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputPrice"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputRefill"
              label="Refill"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="refill"
                onChange={(e) => {
                  setRefill(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCapacity"
              label="Capacity"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="capacity"
                onChange={(e) => {
                  setCapacity(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                refill,
                capacity,
                price,
              });
              handleClose();
            }}
          >
            Save supply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateSupply.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateSupply;
