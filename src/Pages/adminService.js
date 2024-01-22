import { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import moment from "moment";
import { getUserData, totalUsers } from "../helpers/api/registerUser.api";
import { hasError, showToast } from "../helpers/utlils";
import toast from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import config from "../config";

const AdminServices = () => {
  const [show, setShow] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);
  const [user, setUser] = useState(false);
  const [usersCount, setUserCount] = useState();
  const [formData, setFormData] = useState({ phone: "" });
  const [validationErrors, setValidationErrors] = useState([]);

  const handleOnChange = (name, value) => {
    let errors = validationErrors?.filter((err) => err.key !== name);
    setValidationErrors(errors);
    if (name === "phone") {
      if (value.length <= 10) {
        setFormData((prevstate) => ({
          ...prevstate,
          [name]: value,
        }));
      } else {
        return;
      }
    }
  };

  const getTotalUsers = async () => {
    try {
      const { data } = await totalUsers();
      setUserCount(data.users);
    } catch (err) {
      showToast("error", err);
    }
  };

  useEffect(() => {
    getTotalUsers();
  }, []);

  const searchAnotherCandidate = () => {
    setButtonShow(true);
    setShow(false);
  };

  const checkValidations = (data) => {
    let errors = [];
    if (data.phone === undefined || data.phone === "") {
      const error = {
        error: "Please enter phone number ",
        key: "phone",
      };
      errors.push(error);
    }

    const validatePhone = /^[6-9]{1}[0-9]{9}$/;
    if (!validatePhone.test(data.phone)) {
      const error = {
        error: "Please provide valid phone number ",
        key: "phone",
      };
      errors.push(error);
    }

    if (errors?.length > 0) {
      toast.dismiss();
      showToast("error", errors[0].error);
      setValidationErrors(errors);
    }
    return errors;
  };

  const handleSubmit = async () => {
    toast.dismiss();

    const hasError = checkValidations(formData);
    if (hasError.length > 0) {
      return false;
    }
    try {
      const { data } = await getUserData(formData);
      if (data.data.length > 0) {
        data.data.map((user) => setUser(user));
        setShow(true);
        setFormData({ phone: "" });
        setButtonShow(false);
      }
      if (data?.status === 403) {
        showToast("error", data.message);
      }
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const otherLocality = () => {
    if (user.locality === "Other") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="edit-profile-section-wrapper">
        <Container>
          <Header />
          {show && (
            <div className="edit-profile-section">
              <div className="personal-info-heading">
                <div className="personal-info-text">Member Information</div>
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group className="errorclass user-token">
                      <Form.Label>Token No:</Form.Label>
                      <span>{user.token}</span>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <div className="edit-profile-section-inner">
                <div className="edit-profile-photo">
                  <div className="avatar-upload">
                    <div className="avatar-edit"></div>
                    <div className="avatar-preview">
                      <div className="avatar-img">
                        <div className="avatar-img">
                          <img
                            src={`${config.USER_IMG_URL}${user.profileImg}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="image-error">
                    {hasError(validationErrors, "profileImg")}
                  </div>
                </div>

                <div className="edit-profile-details">
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="errorclass">
                        <Form.Label>Name of Family Head:</Form.Label>
                        <span>{user.name}</span>
                        {hasError(validationErrors, "name")}
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="errorclass">
                      <Form.Label htmlFor="gender">Gender:</Form.Label>
                      <span>{user.gender}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6} className="errorclass">
                      <Form.Group>
                        <Form.Label>Date Of Birth:</Form.Label>

                        <span>
                          
                          {!(moment(user.dob).utc().format("DD-MM-YYYY")==="Invalid date") ? moment(user.dob).add(1,"day").utc().format("DD-MM-YYYY") : user.dob }
                        </span>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="errorclass">
                        <Form.Label>Mobile No:</Form.Label>
                        <span>{user.phone}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="errorclass">
                        <Form.Label>Email:</Form.Label>
                        <span>{user.email}</span>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group className="errorclass">
                        <Form.Label>Locality:</Form.Label>
                        {user.locality}
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="other-locality">
                        {otherLocality() && (
                          <Form.Group className="errorclass">
                            <Form.Label>Specify Locality:</Form.Label>
                            {user.otherLocality}
                          </Form.Group>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="errorclass">
                        <Form.Label>Occupation:</Form.Label>
                        <span>{user.occupation}</span>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="gotra-input">
                        <Form.Label>Gotra:</Form.Label>
                        <span>{user.gotra}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="errorclass">
                        <Form.Label>Native Place:</Form.Label>
                        {user.nativePlace}
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Blood Group:</Form.Label>
                        {user.bloodGroup}
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col xs={12} md={12}>
                      <Form.Group>
                        <Form.Label>Full Address:</Form.Label>
                        {user.address}
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="submit-btn-wrapper">
                <button
                  type="submit"
                  onClick={searchAnotherCandidate}
                  className="submit-button "
                >
                  Search another candidate
                </button>
              </div>
            </div>
          )}
        </Container>
      </div>
      <Container>
        {buttonShow && (
          <Row className="inputField">
            <Col xs={12}>
              <div class="services">
                <div class="services-input">
                  <h2>Total Registerd Users : {usersCount}</h2>
                  <Form.Group className="errorclass  inputMobileNumber">
                    <div>
                      <Form.Label>Enter Mobile No: </Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData?.phone || ""}
                        placeholder="Enter Mobile Number"
                        onChange={(e) =>
                          handleOnChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </Form.Group>

                  <div className="submit-btn-wrapper service-btn">
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="submit-button "
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <Footer />
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default AdminServices;
