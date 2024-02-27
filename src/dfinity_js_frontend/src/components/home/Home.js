import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack } from "react-bootstrap";
import UpdateHome from "./UpdateHome";
import PayBill from "./PayBill";
import Refill from "./Refill";

const Home = ({ home, update, paybill, refill }) => {
  const { id, status, waterTokens, phone, address, waterConsumption, bill } =
    home;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex flex-column">
          <Stack>
            <Card.Title className="flex-grow-1 ">Address: {address}</Card.Title>
          </Stack>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">Phone: {phone}</Card.Text>
          <Card.Text>Status: {status}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            WaterTokens: {Number(waterTokens)} Litres
          </Card.Text>
          <Card.Text className="flex-grow-1 ">
            WaterConsumption: {Number(waterConsumption)} Litres
          </Card.Text>
          <Card.Text className="flex-grow-1 ">
            Bill: {Number(bill)} Dollars
          </Card.Text>
          <div className="my-2 d-flex justify-content-around">
            <UpdateHome home={home} save={update} />
            <Refill home={home} save={refill} />
          </div>
          <PayBill home={home} paybill={paybill} />
        </Card.Body>
      </Card>
    </Col>
  );
};

Home.propTypes = {
  home: PropTypes.instanceOf(Object).isRequired,
};

export default Home;
