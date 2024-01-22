import React from "react";
import Header from "./Header";
import { Container } from "react-bootstrap";

export default function MemberLists() {
  return (
    <div className="edit-profile-section-wrapper">
      <Container>
        <Header />
        <div className="edit-profile-section"></div>
        <table style={{border:"2px solid black",marginTop:"20px",width:"100%"}}>
            <thead>
            <tr>
                <td>Token Number</td>
                <td>Name</td>
                <td>Gender</td>
                <td>DOB</td>
                <td>Occupation</td>
                <td>Gender</td>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>SPJ12515415</td>
                    <td>rAGUVAN</td>
                    <td>SPJ12515415</td>
                    <td>SPJ12515415</td>
                    <td>SPJ12515415</td>
                    <td>SPJ12515415</td>
                </tr>
            </tbody>
        </table>
      </Container>
    </div>
  );
}
