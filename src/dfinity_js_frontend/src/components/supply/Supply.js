import React from "react";
import PropTypes from "prop-types";
import { Card, Col } from "react-bootstrap";
import UpdateSupply from "./UpdateSupply";

const Supply = ({ supply, update }) => {
  const { id, price, status, capacity, currentLevel } = supply;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Card.Text className="flex-grow-1 "> Total Supply </Card.Text>
        </Card.Header>
        <Card.Body className="d-flex  flex-column ">
          <Card.Text className="flex-grow-1 ">status: {status}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            Price: {Number(price)} Dollars
          </Card.Text>
          <Card.Text className="flex-grow-1">
            current level: {Number(currentLevel)} Litres
          </Card.Text>
          <Card.Text className="flex-grow-1 ">
            capacity: {Number(capacity)} Litres
          </Card.Text>
        </Card.Body>
        <div className="d-flex justify-content-around my-2">
          <UpdateSupply supply={supply} save={update} />
        </div>
      </Card>
    </Col>
  );
};

Supply.propTypes = {
  supply: PropTypes.instanceOf(Object).isRequired,
};

export default Supply;
