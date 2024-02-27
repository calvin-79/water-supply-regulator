import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddSupply = ({ supplies, save }) => {
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);

  const isFormFilled = () => currentLevel && price && capacity;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        disabled={supplies.length > 0}
        onClick={handleShow}
        className="rounded-pill btn btn-success"
      >
        Add Supply <i className="bi ml-2 bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Supply</Modal.Title>
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
              controlId="inputCurrentLevel"
              label="CurrentLevel"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="CurrentLevel"
                onChange={(e) => {
                  setCurrentLevel(e.target.value);
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
                currentLevel,
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

AddSupply.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddSupply;
