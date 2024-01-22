import React, { useState } from "react";
import Header from "./Header";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Images } from "../helpers/Images";
import axios from "axios";
import { validateAdmin } from "../helpers/api/registerUser.api";
import { hasError, showToast } from "../helpers/utlils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [formData, setFormData] = useState({adminName:'',adminPass:''});
  const [passCheck, setPassCheck] = useState();
  const [validationErrors, setValidationErrors] = useState([]);

  const handleOnChange = (name, value) => {
    let errors = validationErrors?.filter((err) => err.key !== name);
    setValidationErrors(errors);
    setFormData((prv) => ({
      ...prv,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const checkValidations = (data) => {
    let errors = [];
    if (data.adminName === "") {
      const error = {
        error: "Please provide admin username ",
        key: "adminName",
      };
      errors.push(error);
    }
    if (data.adminPass === "") {
      const error = {
        error: "Please provide admin password ",
        key: "adminPass",
      };
      errors.push(error);
    }
    setValidationErrors(errors)
    return errors;
  };

  const handleSubmit = async () => {
    const hasError = checkValidations(formData);
    if (hasError.length > 0) {
      return false;
    }
    try {
      const { data } = await validateAdmin(formData);
      toast.dismiss();
      if (data?.status) {
        showToast("success", data.message);
        passCheck
          ? localStorage.setItem("login", true)
          : sessionStorage.setItem("login", true);
        navigate("Dashboard");
      } else {
        showToast("error", data.message);
      }
    } catch (err) {
      toast.dismiss();
      showToast("error", "Network error");
    }
  };

  return (
    <>
      {/* <Header/> */}
      <div className="admin-main-wrapper ">
        <div className="adminWrapper ">
          <div className="admin-image">
            <img src={Images.adminImage} alt="img-fluid" />
          </div>
          <div className="admin-input ">
            <div className="quote-text admin-top-data">
              <b>
                injury to all living beings is the only religion.” (first
                truth of Jainism)
              </b>
            </div>
            <div className="admin-wrap"> 
              <Row>
                <Col xs={12} md={12}>
                  <Form.Group className="errorclass">
                    <Form.Label className="admin-label">Username</Form.Label>
                    <Form.Control
                      className="admin-input-form"
                      type="text"
                      name="name"
                      placeholder="admin"
                      onChange={(e) =>
                        handleOnChange("adminName", e.target.value)
                      }
                    />
                    {hasError(validationErrors, "adminName")}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <Form.Group className="errorclass">
                    <Form.Label  className="admin-label">Password</Form.Label>
                    <Form.Control
                       className="admin-input-form"
                      type="password"
                      name="name"
                      placeholder="password"
                      onChange={(e) =>
                        handleOnChange("adminPass", e.target.value)
                      }
                    />
                    {hasError(validationErrors, "adminPass")}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <div class="form-check-errorclass-admin ">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="defaultCheck1"
                      onChange={(e) => setPassCheck(e.target.checked)}
                    />
                    <label class="form-check-label " for="defaultCheck1">
                      Remember Me
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="admin-submit-btn">
                <Button className="admin-input-submit" onClick={handleSubmit}>Login</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
