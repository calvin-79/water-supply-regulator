import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Complaint from "./Complaint";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  createComplaint,
  getComplaints as getComplaintList,
  updateComplaint,
} from "../../utils/complaint";
import AddComplaint from "./AddComplaint";
import Nav from "../utils/Nav";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of complaints
  const getComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setComplaints(await getComplaintList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const save = async (data) => {
    try {
      setLoading(true);
      createComplaint(data).then((resp) => {
        getComplaints();
      });
      toast(<NotificationSuccess text="Complaint added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a complaint." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      updateComplaint(data).then((resp) => {
        getComplaints();
      });
      toast(<NotificationSuccess text="Complaint updated successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update a complaint." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <h1 className="fs-4 fw-bold mt-5 mb-0">Complaints Listings</h1>
          <div className="row">
            <Nav />
            <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex mr-0 ml-auto justify-content-end align-items-end mb-4">
                <AddComplaint save={save} />
              </div>
              <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                {complaints.map((_complaint, index) => (
                  <Complaint
                    key={index}
                    complaint={{
                      ..._complaint,
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

export default Complaints;
