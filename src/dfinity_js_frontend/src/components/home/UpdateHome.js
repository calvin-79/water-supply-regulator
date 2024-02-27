import React, { useState } from "react";
import { Button, Modal, Form, Stack, FloatingLabel } from "react-bootstrap";

const UpdateHome = ({ home, save }) => {
  const [waterConsumption, setWaterConsumption] = useState(home.waterConsumption);
  const [phone, setPhone] = useState(home.phone);
  const [address, setAddress] = useState(home.address);
  const [status, setStatus] = useState(home.status);

  const isFormFilled = () => address && phone && waterConsumption;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className="rounded-pill btn btn-warning">
        Update <i className="bi bi-pen-fill"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Stack>
            <Modal.Title>Update Home</Modal.Title>
          </Stack>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputPhone"
              label="Phone"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Phone"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAddress"
              label="Address"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Address"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputStatus"
              label="Status"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Status"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputWaterConsumption"
              label="WaterConsumption"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="waterConsumption"
                onChange={(e) => {
                  setWaterConsumption(e.target.value);
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
                id: home.id,
                phone,
                status,
                address,
                waterConsumption,
              });
              handleClose();
            }}
          >
            Save home
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateHome;
