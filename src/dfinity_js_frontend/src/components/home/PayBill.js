import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const PayBill = ({ home, paybill }) => {
  const [amount, setAmount] = useState("");

  const isFormFilled = () => amount;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="outline-dark"
        className="w-100 py-3"
      >
        PayBill
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Add Home Bill Payment for {`${home.address}`}
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputAmount"
              label="amount"
              className="mb-3"
            >
              <Form.Control
                type="number"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder="Enter amount"
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
              paybill({
                amount,
                homeId: home.id,
              });
              handleClose();
            }}
          >
            PayBill
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

PayBill.propTypes = {
  paybill: PropTypes.func.isRequired,
};

export default PayBill;
