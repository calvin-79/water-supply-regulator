import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateComplaint = ({ complaint, update }) => {
  const [status, setStatus] = useState("");

  const isFormFilled = () => status;

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
          <Modal.Title>Update Complaint Status</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputStatus"
              label="status"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                placeholder="Enter status"
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
              update({
                status,
                complaintId: complaint.id,
              });
              handleClose();
            }}
          >
            update Complaint
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateComplaint.propTypes = {
  update: PropTypes.func.isRequired,
};

export default UpdateComplaint;
