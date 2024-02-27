import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddSupply from "./AddSupply";
import Supply from "./Supply";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getSupplies as getSupplyList,
  createSupply,
  updateSupply,
} from "../../utils/supply";
import Nav from "../utils/Nav";

const Supplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of supplies
  const getSupplies = useCallback(async () => {
    try {
      setLoading(true);
      setSupplies(await getSupplyList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addSupply = async (data) => {
    try {
      setLoading(true);
      data.price = parseInt(data.price, 10);
      data.capacity = parseInt(data.capacity, 10);
      data.currentLevel = parseInt(data.currentLevel, 10);
      createSupply(data).then((resp) => {
        getSupplies();
        toast(<NotificationSuccess text="Supply added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a supply." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      data.price = parseInt(data.price, 10);
      data.capacity = parseInt(data.capacity, 10);
      data.refill = parseInt(data.refill, 10);
      updateSupply(data).then((resp) => {
        getSupplies();
        toast(<NotificationSuccess text="Supply added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a supply." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSupplies();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <h1 className="fs-4 fw-bold mt-5 mb-0">Supply Listings</h1>
          <div className="row">
            <Nav />
            <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex mr-0 ml-auto justify-content-end align-items-end mb-4">
                <AddSupply supplies={supplies} save={addSupply} />
              </div>
              <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                {supplies.map((_supply, index) => (
                  <Supply
                    key={index}
                    supply={{
                      ..._supply,
                    }}
                    update={update}
                  />
                ))}
              </Row>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Supplies;
