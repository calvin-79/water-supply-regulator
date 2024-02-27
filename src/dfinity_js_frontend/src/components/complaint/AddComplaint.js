import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddComplaint = ({ save }) => {
  const [title, setTitle] = useState(0);
  const [homeId, setHomeId] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);

  const isFormFilled = () => description && homeId && title;
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className="rounded-pill  btn btn-success">
        File Complaint<i className="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>File Complaint</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputHomeId"
              label="HomeId"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="HomeId"
                onChange={(e) => {
                  setHomeId(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputTitle"
              label="Title"
              className="mb-3"
            >
              <Form.Control
                type="test"
                placeholder="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
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
                homeId: homeId.trim(),
                description,
                title,
              });
              handleClose();
            }}
          >
            Save complaint
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddComplaint.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddComplaint;
