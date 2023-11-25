import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/style.css";
import { toast } from "react-toastify";
import Table from "./Table";
import Search from "./Search";
import PageHandler from "./PageHandler";
import DeleteButton from "./DeleteButton";
import EditData from "./EditData";

const URL =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const Interface = () => {
  const [users, setUsers] = useState([]);
  const [filterUsers, setfilterUsers] = useState([]);
  const [page, setpage] = useState(1);
  const [searchText, setsearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setmodalOpen] = useState(false);
  const [editData, seteditData] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchTheData();
  }, []);

  const fetchTheData = async () => {
    try {
      const response = await axios.get(URL);
      setUsers(response.data);
      setfilterUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setsearchText(query);

    const filtered = users.filter(
      (user) =>
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    setfilterUsers(filtered);
    setpage(1);
  };

  const handleEdit = (id) => {
    const rowToEdit = filterUsers.find((user) => user.id === id);
    seteditData(rowToEdit);
    setmodalOpen(true);
  };

  const handleDelete = (id) => {
    if (!selectedRows.includes(id)) {
      toast.error("Please select the row to delete.");
      return;
    }

    setfilterUsers((prevfilterUsers) =>
      prevfilterUsers.filter((user) => user.id !== id)
    );

    toast.error("Deleted Successfully!");
  };

  const handlePage = (page) => {
    setpage(page);
  };

  const handleSelectAllRows = (event) => {
    const { checked } = event.target;
    const allRowIds = currentUsers.map((user) => user.id); // Use currentUsers instead of filterUsers

    if (checked && selectedRows.length !== allRowIds.length) {
      setSelectedRows(allRowIds);
      toast.warn("Hey You Selected All !", {
        position: toast.POSITION.BOTTOM_CENTER,
        theme: "dark",
      });
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelection = (event, id) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
      // toast.success('Selected');
      toast.success("Selected", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((rowId) => rowId !== id)
      );
    }
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setfilterUsers(updatedUsers);
    setSelectedRows([]);
    toast.error("Selected rows deleted successfully");
  };

  // Calculate the current page's subset of users
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filterUsers.slice(startIndex, endIndex);

  return (
    <div className="container">
      <Search searchText={searchText} handleSearch={handleSearch} />
      <Table
        users={currentUsers}
        selectedRows={selectedRows}
        handleRowSelection={handleRowSelection}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSelectAllRows={handleSelectAllRows}
      />
      <PageHandler
        page={page}
        itemsPerPage={itemsPerPage}
        totalItems={filterUsers.length}
        handlePagination={handlePage}
      />
      <DeleteButton
        handleDeleteSelected={handleDeleteSelected}
        selectedRows={selectedRows}
      />
      {modalOpen && (
        <EditData editData={editData} setmodalOpen={setmodalOpen} />
      )}
    </div>
  );
};

export default Interface;
