import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack } from "react-bootstrap";
import UpdateComplaint from "./UpdateComplaint";

const Complaint = ({ complaint, update }) => {
  const { id, title, homeId, date, description, status } = complaint;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex  flex-column">
          <Stack>
            <Card.Text className="flex-grow-1 ">title: {title}</Card.Text>
          </Stack>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">homeId: {homeId}</Card.Text>
          <Card.Text className="flex-grow-1 ">Date: {date}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            description: {description}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">status: {status}</Card.Text>
          <UpdateComplaint complaint={complaint} update={update} />
        </Card.Body>
      </Card>
    </Col>
  );
};

Complaint.propTypes = {
  complaint: PropTypes.instanceOf(Object).isRequired,
};

export default Complaint;
