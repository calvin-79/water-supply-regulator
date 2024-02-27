import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddHome from "./AddHome";
import Home from "./Home";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getHomes as getHomeList,
  createHome,
  updateHome,
  payBill,
} from "../../utils/home";
import Nav from "../utils/Nav";
import { refillHome } from "../../utils/home";

const Homes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of homes
  const getHomes = useCallback(async () => {
    try {
      setLoading(true);
      setHomes(await getHomeList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const save = async (data) => {
    try {
      setLoading(true);
      createHome(data).then((resp) => {
        getHomes();
        toast(<NotificationSuccess text="Home added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a home." />);
    } finally {
      setLoading(false);
    }
  };

  const refill = async (data) => {
    try {
      setLoading(true);
      data.amount = parseInt(data.amount, 10);
      refillHome(data).then((resp) => {
        getHomes();
      });
      toast(<NotificationSuccess text="Home water refilled successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to refil home supply." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      data.waterConsumption = parseInt(data.waterConsumption, 10);
      updateHome(data).then((resp) => {
        getHomes();
      });
      toast(<NotificationSuccess text="Home added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a home." />);
    } finally {
      setLoading(false);
    }
  };

  const paybill = async (data) => {
    try {
      setLoading(true);
      data.amount = parseInt(data.amount, 10);
      payBill(data).then((resp) => {
        getHomes();
      });
      toast(<NotificationSuccess text="Bill paid successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to pay bill." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHomes();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <h1 className="fs-4 fw-bold mt-5 mb-0">Home Listings</h1>
          <div className="row">
            <Nav />
            <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex mr-0 ml-auto justify-content-end align-items-end mb-4">
                <AddHome save={save} />
              </div>
              <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                {homes.map((_home, index) => (
                  <Home
                    key={index}
                    home={{
                      ..._home,
                    }}
                    update={update}
                    paybill={paybill}
                    refill={refill}
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

export default Homes;
