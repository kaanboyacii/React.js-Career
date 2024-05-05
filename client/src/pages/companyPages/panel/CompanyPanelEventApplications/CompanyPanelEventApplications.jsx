import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import axios from "axios";
import "./companyPanelEventApplications.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";

const CompanyPanelEventApplications = () => {
  const [applicants, setApplicants] = useState([]);
  const [userNames, setUserNames] = useState({});
  const location = useLocation();
  const eventId = location.pathname.split("/").pop();

  useEffect(() => {
    const fetchEventApplications = async () => {
      try {
        const response = await axios.get(`/events/${eventId}`);
        setApplicants(response.data.applicants);
        const userIds = response.data.applicants.map(
          (applicant) => applicant.user
        );
        await fetchUserNames(userIds);
      } catch (error) {
        console.error("Error fetching event applications:", error);
      }
    };

    fetchEventApplications();
  }, [eventId]);

  const fetchUserNames = async (userIds) => {
    try {
      const response = await axios.get(`/users?ids=${userIds.join(",")}`);
      const userData = response.data.Users;
      const names = {};
      userData.forEach((user) => {
        names[user._id] = user.name;
      });
      setUserNames(names);
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

  return (
    <Layout>
      <div className="company-panel-applications">
        <h1>Etkinlik Başvuruları</h1>
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell className="table-header-cell">
                  Başvuran Adı
                </TableCell>
                <TableCell className="table-header-cell">Durum</TableCell>
                <TableCell className="table-header-cell">Profil</TableCell>{" "}
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants.map((applicant, index) => (
                <TableRow key={index} className="table-row">
                  <TableCell>{userNames[applicant.user]}</TableCell>
                  <TableCell>{applicant.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/company-panel/user-profile/${applicant.user}`}
                    >
                      Profili İncele
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default CompanyPanelEventApplications;
