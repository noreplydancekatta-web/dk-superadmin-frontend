import React, { useState, useEffect } from "react";
import {
  FiDownloadCloud,
  FiPlus,
  FiUploadCloud,
  FiEdit,
  FiTrash,
  FiUsers,
  FiHome,
  FiMapPin,
  FiGlobe,
  FiMap,
  FiTag
} from "react-icons/fi";
import API from "../axios";
import EmailAutocomplete from "../components/EmailAutocomplete";
import "../styles/DataOperations.css";

function DataOperations() {
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStudioForm, setShowStudioForm] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  // ================= User State =================
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    altMobile: "",
    guardianName: "",
    guardianMobile: "",
    guardianEmail: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    youtube: "",
    facebook: "",
    instagram: "",
    isProfessional: "No",
    experience: "0",
    profilePhoto: null,
  });

  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
  const [fetchEmail, setFetchEmail] = useState("");

  // ✅ Handle user form submit
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newUser).forEach((key) => {
        if (key === "profilePhoto" && newUser.profilePhoto) {
          formData.append("profilePhoto", newUser.profilePhoto);
        } else {
          formData.append(key, newUser[key]);
        }
      });

      await API.post("/api/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User created successfully!");
      setShowUserForm(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        altMobile: "",
        guardianName: "",
        guardianMobile: "",
        guardianEmail: "",
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        youtube: "",
        facebook: "",
        instagram: "",
        isProfessional: "No",
        experience: "0",
        profilePhoto: null,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user.");
    }
  };

  const handleFetchUser = async () => {
    try {
      const res = await API.get(`/api/users/by-email?email=${fetchEmail}`);
      if (res.data) {
        setNewUser(res.data); // Fill form with fetched data
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/users/by-email?email=${fetchEmail}`, newUser, {
        headers: { "Content-Type": "application/json" },
      });

      alert("User updated successfully!");
      setShowUpdateUserForm(false);
      setNewUser({});
      setFetchEmail("");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!fetchEmail) return alert("Enter email first");
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmDelete) return;

      await API.delete(`/api/users/by-email?email=${fetchEmail}`);
      alert("User deleted successfully");
      setFetchEmail("");
      setNewUser({});
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // ================= Studio State =================
  const [studioOwners, setStudioOwners] = useState([]);
  const [newStudio, setNewStudio] = useState({
    ownerId: "",
    studioName: "",
    registeredAddress: "",
    contactEmail: "",
    contactNumber: "",
    gstNumber: "",
    panNumber: "",
    aadharFrontPhoto: null,
    aadharBackPhoto: null,
    bankAccountNumber: "",
    bankIfscCode: "",
    studioIntroduction: "",
    studioPhotos: [],
    logoUrl: null,
    studioWebsite: "",
    studioFacebook: "",
    studioYoutube: "",
    studioInstagram: "",
  });
  const [showUpdateStudioForm, setShowUpdateStudioForm] = useState(false);
  const [showDeleteStudioForm, setShowDeleteStudioForm] = useState(false);
  const [selectedStudioId, setSelectedStudioId] = useState("");
  const [selectedStudio, setSelectedStudio] = useState(null);

  // ✅ Fetch eligible owners when opening studio form
  useEffect(() => {
    if (activeForm === 'createStudio') {
      API.get("/api/users/eligible-owners")
        .then((res) => setStudioOwners(res.data))
        .catch((err) => console.error("Error fetching eligible owners:", err));
    }
  }, [activeForm]);

  // ✅ Handle studio form submit
  const handleCreateStudio = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newStudio).forEach((key) => {
        if (key === "aadharFrontPhoto" && newStudio.aadharFrontPhoto) {
          formData.append("aadharFrontPhoto", newStudio.aadharFrontPhoto);
        } else if (key === "aadharBackPhoto" && newStudio.aadharBackPhoto) {
          formData.append("aadharBackPhoto", newStudio.aadharBackPhoto);
        } else if (key === "logoUrl" && newStudio.logoUrl) {
          formData.append("logoUrl", newStudio.logoUrl);
        } else if (
          key === "studioPhotos" &&
          newStudio.studioPhotos.length > 0
        ) {
          newStudio.studioPhotos.forEach((file) =>
            formData.append("studioPhotos", file)
          );
        } else {
          formData.append(key, newStudio[key]);
        }
      });

      await API.post("/api/studios", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Studio created successfully!");
      setShowStudioForm(false);
      setNewStudio({
        ownerId: "",
        studioName: "",
        registeredAddress: "",
        contactEmail: "",
        contactNumber: "",
        gstNumber: "",
        panNumber: "",
        aadharFrontPhoto: null,
        aadharBackPhoto: null,
        bankAccountNumber: "",
        bankIfscCode: "",
        studioIntroduction: "",
        studioPhotos: [],
        logoUrl: null,
        studioWebsite: "",
        studioFacebook: "",
        studioYoutube: "",
        studioInstagram: "",
      });
    } catch (err) {
      console.error("Error creating studio:", err);
      alert("Failed to create studio.");
    }
  };

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await API.get("/api/studios"); // backend should return all studios
        setStudioOwners(res.data);
      } catch (err) {
        console.error("Error fetching studios:", err);
      }
    };

    fetchStudios();
  }, []);

  const handleUpdateStudio = async (e) => {
    e.preventDefault();

    if (!selectedStudioId) {
      alert("Please select a studio to update");
      return;
    }

    console.log("Updating studio with ID:", selectedStudioId, newStudio);

    try {
      const res = await API.put(`/api/studios/${selectedStudioId}`, {
        studioName: newStudio.studioName,
        registeredAddress: newStudio.registeredAddress,
        contactEmail: newStudio.contactEmail,
        contactNumber: newStudio.contactNumber,
        gstNumber: newStudio.gstNumber,
        panNumber: newStudio.panNumber,
        bankAccountNumber: newStudio.bankAccountNumber,
        bankIfscCode: newStudio.bankIfscCode,
        studioIntroduction: newStudio.studioIntroduction,
        studioWebsite: newStudio.studioWebsite,
        studioFacebook: newStudio.studioFacebook,
        studioYoutube: newStudio.studioYoutube,
        studioInstagram: newStudio.studioInstagram,
      });

      console.log("Studio updated:", res.data);
      alert("Studio updated successfully");

      // Refresh studios list
      const updatedStudios = await API.get("/api/studios");
      setStudioOwners(updatedStudios.data);
    } catch (err) {
      console.error("Error updating studio:", err);
      alert("Failed to update studio");
    }
  };

  const handleDeleteStudio = async (e) => {
    e.preventDefault();

    if (!selectedStudioId) {
      alert("Please select a studio to delete");
      return;
    }

    try {
      const res = await API.delete(`/api/studios/${selectedStudioId}`);
      console.log(res.data);
      alert("Studio deleted successfully");

      // Refresh studios list
      const updatedStudios = await API.get("/api/studios");
      setStudioOwners(updatedStudios.data);
    } catch (err) {
      console.error("Error deleting studio:", err);
      alert("Failed to delete studio");
    }
  };

  // ================= Download Handler =================
  const handleDownload = async (type, endpoint) => {
    try {
      const res = await API.get(`/api/${endpoint}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}_data.csv`;
      link.click();
    } catch (err) {
      alert(`Failed to download ${type} data.`);
    }
  };

  const [showBranchForm, setShowBranchForm] = useState(false);
  const [studios, setStudios] = useState([]);
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    pincode: "",
    area: "",
    country: "",
    state: "",
    city: "",
    mapLink: "",
    contactNo: "",
    studioId: "",
  });
  const [branchImage, setBranchImage] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [studioBranches, setStudioBranches] = useState([]);

  const [showUpdateBranchForm, setShowUpdateBranchForm] = useState(false);
  const [showDeleteBranchForm, setShowDeleteBranchForm] = useState(false);

  useEffect(() => {
    if (activeForm === "createBranch") {
      API.get("/api/studios")
        .then((res) => setStudios(res.data))
        .catch((err) => console.error("Error fetching studios:", err));
    }
  }, [activeForm]);

  useEffect(() => {
    if (activeForm === "createBranch" || activeForm === "updateBranch" || activeForm === "deleteBranch") {
      API.get("/api/studios")
        .then((res) => setStudios(res.data))
        .catch((err) => console.error("Error fetching studios:", err));
    }
  }, [activeForm]);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newBranch).forEach((key) => {
        formData.append(key, newBranch[key]);
      });
      if (branchImage) {
        formData.append("image", branchImage);
      }

      await API.post("/api/branches", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Branch created successfully!");
      setShowBranchForm(false);
      setNewBranch({
        name: "",
        address: "",
        pincode: "",
        area: "",
        country: "",
        state: "",
        city: "",
        mapLink: "",
        contactNo: "",
        studioId: "",
      });
      setBranchImage(null);
    } catch (err) {
      console.error("Error creating branch:", err);
      alert("Failed to create branch.");
    }
  };

  const fetchBranches = async (studioId) => {
    try {
      const res = await API.get(`/api/branches/${studioId}`);
      setStudioBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/api/branches/${selectedBranchId}`, newBranch);
      console.log("Branch updated:", res.data);
      alert("Branch updated successfully");

      setSelectedBranchId("");
      setNewBranch({});
      fetchBranches(newBranch.studioId);
    } catch (err) {
      console.error("Error updating branch:", err);
      alert("Failed to update branch");
    }
  };

  const handleDeleteBranch = async (e) => {
    e.preventDefault();
    if (!selectedBranchId) {
      alert("Please select a branch to delete");
      return;
    }

    try {
      const res = await API.delete(`/api/branches/${selectedBranchId}`);
      console.log(res.data);
      alert("Branch deleted successfully");

      setSelectedBranchId("");
      fetchBranches(newBranch.studioId);
    } catch (err) {
      console.error("Error deleting branch:", err);
      alert("Failed to delete branch");
    }
  };

  // ================= Batch State =================
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [branches, setBranches] = useState([]);
  const [danceStyles, setDanceStyles] = useState([]);
  const [levels, setLevels] = useState([]); // <-- not hardcoded now
  const [showUpdateBatchForm, setShowUpdateBatchForm] = useState(false);
  const [showDeleteBatchForm, setShowDeleteBatchForm] = useState(false);
  const [allBatches, setAllBatches] = useState([]);

  const [batchStudios, setBatchStudios] = useState([]);
  const [branchesForBatch, setBranchesForBatch] = useState([]);
  const [batchesForBranch, setBatchesForBranch] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [newBatch, setNewBatch] = useState({
    studioId: "",
    branch: "",
    style: "",
    level: "",
    batchName: "",
    trainer: "",
    fee: "",
    capacity: "",
    startTime: "",
    endTime: "",
    fromDate: "",
    toDate: "",
    days: [],
  });

  // ✅ Fetch Studios, DanceStyles, Levels when opening Batch Form
  useEffect(() => {
    if (activeForm === "createBatch" || activeForm === "updateBatch" || activeForm === "deleteBatch") {
      API.get("/api/studios").then((res) => setStudios(res.data));
      API.get("/api/demographics/dancestyles").then((res) =>
        setDanceStyles(res.data)
      );
      API.get("/api/demographics/levels").then((res) => setLevels(res.data)); // <-- fetch from backend
    }
  }, [activeForm]);

  useEffect(() => {
    if (activeForm === "createBatch" || activeForm === "updateBatch" || activeForm === "deleteBatch") {
      API.get("/api/studios")
        .then((res) => setBatchStudios(res.data))
        .catch((err) => console.error("Error fetching studios:", err));

      API.get("/api/demographics/dancestyles").then((res) =>
        setDanceStyles(res.data)
      );

      API.get("/api/demographics/levels").then((res) => setLevels(res.data));
    }
  }, [activeForm]);

  useEffect(() => {
    if (newBatch.studioId) {
      API.get(`/api/branches/${newBatch.studioId}`)
        .then((res) => setBranchesForBatch(res.data))
        .catch((err) => console.error("Error fetching branches:", err));
    } else {
      setBranchesForBatch([]);
    }
  }, [newBatch.studioId]);

  // ✅ Fetch Branches when studio changes
  useEffect(() => {
    if (newBatch.studioId) {
      API.get(`/api/branches/${newBatch.studioId}`)
        .then((res) => setBranches(res.data))
        .catch((err) => console.error("Error fetching branches:", err));
    } else {
      setBranches([]);
    }
  }, [newBatch.studioId]);

  useEffect(() => {
    if (newBatch.branch && allBatches.length > 0) {
      const filtered = allBatches.filter(
        (batch) => batch.branch && batch.branch._id === newBatch.branch
      );
      console.log("Filtered batches:", filtered);
      setBatchesForBranch(filtered);
    } else {
      setBatchesForBranch([]);
    }
  }, [newBatch.branch, allBatches]);

  useEffect(() => {
    if (activeForm === "createBatch" || activeForm === "updateBatch" || activeForm === "deleteBatch") {
      API.get("/api/batches")
        .then((res) => {
          console.log("Fetched batches:", res.data); // Debug
          setAllBatches(res.data);
        })
        .catch((err) => console.error("Error fetching batches:", err));
    }
  }, [activeForm]);

  // ✅ Handle Batch Submit
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/batches", newBatch);
      alert("Batch created successfully!");
      setShowBatchForm(false);
      setNewBatch({
        studioId: "",
        branch: "",
        style: "",
        level: "",
        batchName: "",
        trainer: "",
        fee: "",
        capacity: "",
        startTime: "",
        endTime: "",
        fromDate: "",
        toDate: "",
        days: [],
      });
    } catch (err) {
      console.error("Error creating batch:", err);
      alert("Failed to create batch.");
    }
  };

  const handleUpdateBatch = async (e) => {
    e.preventDefault();

    if (!selectedBatchId) {
      alert("Please select a batch to update");
      return;
    }

    try {
      const res = await API.put(`/api/batches/${selectedBatchId}`, newBatch);
      console.log("Batch updated:", res.data);
      alert("Batch updated successfully");

      setSelectedBatchId("");
      setNewBatch({
        studioId: "",
        branch: "",
        style: "",
        level: "",
        batchName: "",
        trainer: "",
        fee: "",
        capacity: "",
        startTime: "",
        endTime: "",
        fromDate: "",
        toDate: "",
        days: [],
      });
      setShowUpdateBatchForm(false);
    } catch (err) {
      console.error("Error updating batch:", err);
      alert("Failed to update batch");
    }
  };
  const handleDeleteBatch = async (e) => {
    e.preventDefault();

    if (!selectedBatchId) {
      alert("Please select a batch to delete");
      return;
    }

    try {
      const res = await API.delete(`/api/batches/${selectedBatchId}`);
      console.log("Batch deleted:", res.data);
      alert("Batch deleted successfully");

      setSelectedBatchId("");
      setNewBatch({
        studioId: "",
        branch: "",
        style: "",
        level: "",
        batchName: "",
        trainer: "",
        fee: "",
        capacity: "",
        startTime: "",
        endTime: "",
        fromDate: "",
        toDate: "",
        days: [],
      });
      setShowDeleteBatchForm(false);
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch");
    }
  };

  return (
    <div className="data-operations-page">
      <h2>Data Operations</h2>

      {/* Top Actions */}
      <div className="top-actions">

        {/* USERS */}
        <div className="action-card modern">
          <div className="card-header">
            <div className="card-icon users">👤</div>
            <h3>Users</h3>
          </div>

          <div className="action-grid">
            <div
              className="action-tile create"
              onClick={() => setActiveForm(activeForm === "createUser" ? null : "createUser")}
            >
              <FiPlus />
              <span>Create</span>
            </div>

            <div
              className="action-tile update"
              onClick={() => setActiveForm(activeForm === "updateUser" ? null : "updateUser")}
            >
              <FiEdit />
              <span>Update</span>
            </div>

            <div
              className="action-tile delete"
              onClick={() => setActiveForm(activeForm === "deleteUser" ? null : "deleteUser")}
            >
              <FiTrash />
              <span>Delete</span>
            </div>
          </div>
        </div>

        {/* STUDIOS */}
        <div className="action-card modern">
          <div className="card-header">
            <div className="card-icon studios">🏢</div>
            <h3>Studios</h3>
          </div>

          <div className="action-grid">
            <div className="action-tile create" onClick={() => setActiveForm(activeForm === "createStudio" ? null : "createStudio")}>
              <FiPlus /><span>Create</span>
            </div>
            <div className="action-tile update" onClick={() => setActiveForm(activeForm === "updateStudio" ? null : "updateStudio")}>
              <FiEdit /><span>Update</span>
            </div>
            <div className="action-tile delete" onClick={() => setActiveForm(activeForm === "deleteStudio" ? null : "deleteStudio")}>
              <FiTrash /><span>Delete</span>
            </div>
          </div>
        </div>

        {/* BRANCHES */}
        <div className="action-card modern">
          <div className="card-header">
            <div className="card-icon branches">📍</div>
            <h3>Branches</h3>
          </div>

          <div className="action-grid">
            <div className="action-tile create" onClick={() => setActiveForm(activeForm === "createBranch" ? null : "createBranch")}>
              <FiPlus /><span>Create</span>
            </div>
            <div className="action-tile update" onClick={() => setActiveForm(activeForm === "updateBranch" ? null : "updateBranch")}>
              <FiEdit /><span>Update</span>
            </div>
            <div className="action-tile delete" onClick={() => setActiveForm(activeForm === "deleteBranch" ? null : "deleteBranch")}>
              <FiTrash /><span>Delete</span>
            </div>
          </div>
        </div>

        {/* BATCHES */}
        <div className="action-card modern">
          <div className="card-header">
            <div className="card-icon batches">🕺</div>
            <h3>Batches</h3>
          </div>

          <div className="action-grid">
            <div className="action-tile create" onClick={() => setActiveForm(activeForm === "createBatch" ? null : "createBatch")}>
              <FiPlus /><span>Create</span>
            </div>
            <div className="action-tile update" onClick={() => setActiveForm(activeForm === "updateBatch" ? null : "updateBatch")}>
              <FiEdit /><span>Update</span>
            </div>
            <div className="action-tile delete" onClick={() => setActiveForm(activeForm === "deleteBatch" ? null : "deleteBatch")}>
              <FiTrash /><span>Delete</span>
            </div>
          </div>
        </div>

      </div>

      {/* User Form */}
      {activeForm === "createUser" && (
        <form className="create-form" onSubmit={handleCreateUser}>
          <h3>Create New User
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <div className="form-grid">
            <label>
              First Name
              <input
                type="text"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                required
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </label>
            <label>
              Mobile
              <input
                type="text"
                value={newUser.mobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, mobile: e.target.value })
                }
                required
              />
            </label>
            <label>
              Alternate Mobile
              <input
                type="text"
                value={newUser.altMobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, altMobile: e.target.value })
                }
              />
            </label>
            <label>
              Guardian Name
              <input
                type="text"
                value={newUser.guardianName}
                onChange={(e) =>
                  setNewUser({ ...newUser, guardianName: e.target.value })
                }
              />
            </label>
            <label>
              Guardian Mobile
              <input
                type="text"
                value={newUser.guardianMobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, guardianMobile: e.target.value })
                }
              />
            </label>
            <label>
              Guardian Email
              <input
                type="email"
                value={newUser.guardianEmail}
                onChange={(e) =>
                  setNewUser({ ...newUser, guardianEmail: e.target.value })
                }
              />
            </label>
            <label>
              Date of Birth
              <input
                type="date"
                value={newUser.dateOfBirth}
                onChange={(e) =>
                  setNewUser({ ...newUser, dateOfBirth: e.target.value })
                }
                required
              />
            </label>
            <label>
              Address
              <input
                type="text"
                value={newUser.address}
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
                required
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={newUser.city}
                onChange={(e) =>
                  setNewUser({ ...newUser, city: e.target.value })
                }
                required
              />
            </label>
            <label>
              State
              <input
                type="text"
                value={newUser.state}
                onChange={(e) =>
                  setNewUser({ ...newUser, state: e.target.value })
                }
                required
              />
            </label>
            <label>
              Pincode
              <input
                type="text"
                value={newUser.pincode}
                onChange={(e) =>
                  setNewUser({ ...newUser, pincode: e.target.value })
                }
                required
              />
            </label>
            <label>
              Country
              <input
                type="text"
                value={newUser.country}
                onChange={(e) =>
                  setNewUser({ ...newUser, country: e.target.value })
                }
                required
              />
            </label>
            <label>
              YouTube
              <input
                type="text"
                value={newUser.youtube}
                onChange={(e) =>
                  setNewUser({ ...newUser, youtube: e.target.value })
                }
              />
            </label>
            <label>
              Facebook
              <input
                type="text"
                value={newUser.facebook}
                onChange={(e) =>
                  setNewUser({ ...newUser, facebook: e.target.value })
                }
              />
            </label>
            <label>
              Instagram
              <input
                type="text"
                value={newUser.instagram}
                onChange={(e) =>
                  setNewUser({ ...newUser, instagram: e.target.value })
                }
              />
            </label>
            <label>
              Professional?
              <select
                value={newUser.isProfessional}
                onChange={(e) =>
                  setNewUser({ ...newUser, isProfessional: e.target.value })
                }
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
            <label>
              Experience (years)
              <input
                type="text"
                value={newUser.experience}
                onChange={(e) =>
                  setNewUser({ ...newUser, experience: e.target.value })
                }
              />
            </label>
            <label className="file-label">
              <FiUploadCloud className="icon" />
              Upload Profile Photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewUser({ ...newUser, profilePhoto: e.target.files[0] })
                }
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">
            Save User
          </button>
        </form>
      )}

      {/* Studio Form */}
      {activeForm === "createStudio" && (
        <form className="create-form" onSubmit={handleCreateStudio}>
          <h3>Create New Studio
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <div className="form-grid">
            <label>
              Select Owner (Type Email)
              <EmailAutocomplete
                items={studioOwners}
                value={newStudio.ownerId}
                onChange={(owner) => setNewStudio({ ...newStudio, ownerId: owner._id })}
                placeholder="Type owner email..."
                displayField="email"
              />
            </label>
            <label>
              Studio Name
              <input
                type="text"
                value={newStudio.studioName}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, studioName: e.target.value })
                }
                required
              />
            </label>
            <label>
              Registered Address
              <input
                type="text"
                value={newStudio.registeredAddress}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    registeredAddress: e.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              Contact Email
              <input
                type="email"
                value={newStudio.contactEmail}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, contactEmail: e.target.value })
                }
                required
              />
            </label>
            <label>
              Contact Number
              <input
                type="text"
                value={newStudio.contactNumber}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, contactNumber: e.target.value })
                }
                required
              />
            </label>
            <label>
              GST Number
              <input
                type="text"
                value={newStudio.gstNumber}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, gstNumber: e.target.value })
                }
              />
            </label>
            <label>
              PAN Number
              <input
                type="text"
                value={newStudio.panNumber}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, panNumber: e.target.value })
                }
              />
            </label>
            <label className="file-label">
              <FiUploadCloud className="icon" />
              Upload Aadhar Front
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    aadharFrontPhoto: e.target.files[0],
                  })
                }
              />
            </label>
            <label className="file-label">
              <FiUploadCloud className="icon" />
              Upload Aadhar Back
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    aadharBackPhoto: e.target.files[0],
                  })
                }
              />
            </label>
            <label>
              Bank Account Number
              <input
                type="text"
                value={newStudio.bankAccountNumber}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    bankAccountNumber: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Bank IFSC Code
              <input
                type="text"
                value={newStudio.bankIfscCode}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    bankIfscCode: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Studio Introduction
              <textarea
                value={newStudio.studioIntroduction}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioIntroduction: e.target.value,
                  })
                }
              />
            </label>
            <label className="file-label">
              <FiUploadCloud className="icon" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewStudio({ ...newStudio, logoUrl: e.target.files[0] })
                }
              />
            </label>
            <label className="file-label">
              <FiUploadCloud className="icon" />
              Upload Studio Photos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioPhotos: Array.from(e.target.files),
                  })
                }
              />
            </label>
            <label>
              Website
              <input
                type="text"
                value={newStudio.studioWebsite}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioWebsite: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Facebook
              <input
                type="text"
                value={newStudio.studioFacebook}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioFacebook: e.target.value,
                  })
                }
              />
            </label>
            <label>
              YouTube
              <input
                type="text"
                value={newStudio.studioYoutube}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioYoutube: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Instagram
              <input
                type="text"
                value={newStudio.studioInstagram}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioInstagram: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">
            Save Studio
          </button>
        </form>
      )}

      {activeForm === "createBranch" && (
        <form className="create-form" onSubmit={handleCreateBranch}>
          <h3>Create New Branch
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <div className="form-grid">
            <label>
              Select Studio
              <select
                value={newBranch.studioId}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, studioId: e.target.value })
                }
                required
              >
                <option value="">-- Select Studio --</option>
                {studios.map((studio) => (
                  <option key={studio._id} value={studio._id}>
                    {studio.studioName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Branch Name
              <input
                type="text"
                value={newBranch.name}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              Address
              <input
                type="text"
                value={newBranch.address}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, address: e.target.value })
                }
                required
              />
            </label>
            <label>
              Pincode
              <input
                type="text"
                value={newBranch.pincode}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, pincode: e.target.value })
                }
                required
              />
            </label>
            <label>
              Area
              <input
                type="text"
                value={newBranch.area}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, area: e.target.value })
                }
                required
              />
            </label>
            <label>
              Country
              <input
                type="text"
                value={newBranch.country}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, country: e.target.value })
                }
                required
              />
            </label>
            <label>
              State
              <input
                type="text"
                value={newBranch.state}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, state: e.target.value })
                }
                required
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={newBranch.city}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, city: e.target.value })
                }
                required
              />
            </label>
            <label>
              Contact Number
              <input
                type="text"
                value={newBranch.contactNo}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, contactNo: e.target.value })
                }
              />
            </label>
            <label>
              Google Map Link
              <input
                type="text"
                value={newBranch.mapLink}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, mapLink: e.target.value })
                }
              />
            </label>

            <label className="file-label">
              <FiUploadCloud className="icon" />
              Upload Branch Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBranchImage(e.target.files[0])}
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">
            Save Branch
          </button>
        </form>
      )}

      {activeForm === "createBatch" && (
        <form className="create-form" onSubmit={handleCreateBatch}>
          <h3>Create New Batch
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <div className="form-grid">
            <label>
              Select Studio
              <select
                value={newBatch.studioId}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, studioId: e.target.value })
                }
                required
              >
                <option value="">-- Select Studio --</option>
                {studios.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.studioName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Select Branch
              <select
                value={newBatch.branch}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, branch: e.target.value })
                }
                required
              >
                <option value="">-- Select Branch --</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Dance Style
              <select
                value={newBatch.style}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, style: e.target.value })
                }
                required
              >
                <option value="">-- Select Style --</option>
                {danceStyles.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Level
              <select
                value={newBatch.level}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, level: e.target.value })
                }
                required
              >
                <option value="">-- Select Level --</option>
                {levels.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Batch Name
              <input
                type="text"
                value={newBatch.batchName}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, batchName: e.target.value })
                }
                required
              />
            </label>

            <label>
              Trainer
              <input
                type="text"
                value={newBatch.trainer}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, trainer: e.target.value })
                }
                required
              />
            </label>

            <label>
              Fee
              <input
                type="text"
                value={newBatch.fee}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, fee: e.target.value })
                }
                required
              />
            </label>

            <label>
              Capacity
              <input
                type="text"
                value={newBatch.capacity}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, capacity: e.target.value })
                }
                required
              />
            </label>

            <label>
              Start Time
              <input
                type="time"
                value={newBatch.startTime}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, startTime: e.target.value })
                }
                required
              />
            </label>

            <label>
              End Time
              <input
                type="time"
                value={newBatch.endTime}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, endTime: e.target.value })
                }
                required
              />
            </label>

            <label>
              From Date
              <input
                type="date"
                value={newBatch.fromDate}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, fromDate: e.target.value })
                }
                required
              />
            </label>

            <label>
              To Date
              <input
                type="date"
                value={newBatch.toDate}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, toDate: e.target.value })
                }
                required
              />
            </label>

            <label>
              Days (comma separated)
              <input
                type="text"
                placeholder="Mon, Wed, Fri"
                value={newBatch.days.join(", ")}
                onChange={(e) =>
                  setNewBatch({
                    ...newBatch,
                    days: e.target.value.split(",").map((d) => d.trim()),
                  })
                }
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">
            Save Batch
          </button>
        </form>
      )}

      {/* UPDATE AND DELETE FORMS */}

      {/* USERS */}

      {activeForm === "updateUser" && (
        <form className="create-form" onSubmit={handleUpdateUser}>
          <h3>Update User
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>

          {/* Step 1: Enter Email to fetch user */}
          <label>
            Enter Email to Fetch User
            <input
              type="email"
              value={fetchEmail}
              onChange={(e) => setFetchEmail(e.target.value)}
              placeholder="Type user email..."
              required
            />
          </label>
          <button type="button" onClick={handleFetchUser}>
            Fetch User
          </button>

          {/* Step 2: Reuse the exact same inputs from Create User */}
          <div className="form-grid">
            <label>
              First Name
              <input
                type="text"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                required
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </label>
            <label>
              Mobile
              <input
                type="text"
                value={newUser.mobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, mobile: e.target.value })
                }
                required
              />
            </label>
            <label>
              Alternate Mobile
              <input
                type="text"
                value={newUser.altMobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, altMobile: e.target.value })
                }
              />
            </label>
            <label>
              Guardian Name
              <input
                type="text"
                value={newUser.guardianName}
                onChange={(e) =>
                  setNewUser({ ...newUser, guardianName: e.target.value })
                }
              />
            </label>
            <label>
              Guardian Mobile
              <input
                type="text"
                value={newUser.guardianMobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, guardianMobile: e.target.value })
                }
              />
            </label>
            <label>
              Guardian Email
              <input
                type="email"
                value={newUser.guardianEmail}
                onChange={(e) =>
                  setNewUser({ ...newUser, guardianEmail: e.target.value })
                }
              />
            </label>

            <label>
              Address
              <input
                type="text"
                value={newUser.address}
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
                required
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={newUser.city}
                onChange={(e) =>
                  setNewUser({ ...newUser, city: e.target.value })
                }
                required
              />
            </label>
            <label>
              State
              <input
                type="text"
                value={newUser.state}
                onChange={(e) =>
                  setNewUser({ ...newUser, state: e.target.value })
                }
                required
              />
            </label>
            <label>
              Pincode
              <input
                type="text"
                value={newUser.pincode}
                onChange={(e) =>
                  setNewUser({ ...newUser, pincode: e.target.value })
                }
                required
              />
            </label>
            <label>
              Country
              <input
                type="text"
                value={newUser.country}
                onChange={(e) =>
                  setNewUser({ ...newUser, country: e.target.value })
                }
                required
              />
            </label>
            <label>
              YouTube
              <input
                type="text"
                value={newUser.youtube}
                onChange={(e) =>
                  setNewUser({ ...newUser, youtube: e.target.value })
                }
              />
            </label>
            <label>
              Facebook
              <input
                type="text"
                value={newUser.facebook}
                onChange={(e) =>
                  setNewUser({ ...newUser, facebook: e.target.value })
                }
              />
            </label>
            <label>
              Instagram
              <input
                type="text"
                value={newUser.instagram}
                onChange={(e) =>
                  setNewUser({ ...newUser, instagram: e.target.value })
                }
              />
            </label>
            <label>
              Professional?
              <select
                value={newUser.isProfessional}
                onChange={(e) =>
                  setNewUser({ ...newUser, isProfessional: e.target.value })
                }
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
            <label>
              Experience (years)
              <input
                type="text"
                value={newUser.experience}
                onChange={(e) =>
                  setNewUser({ ...newUser, experience: e.target.value })
                }
              />
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Update User
          </button>
        </form>
      )}

      {activeForm === "deleteUser" && (
        <div className="create-form">
          <h3>Delete User
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <label>
            Enter Email to Delete User
            <input
              type="email"
              value={fetchEmail}
              onChange={(e) => setFetchEmail(e.target.value)}
              placeholder="Type user email..."
              required
            />
          </label>
          <button onClick={handleDeleteUser} className="submit-btn">
            Delete User
          </button>
        </div>
      )}

      {activeForm === "updateStudio" && (
        <form className="create-form" onSubmit={handleUpdateStudio}>
          <h3>Update Studio
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <div className="form-grid">
            <label>
              Select Studio (Type Email)
              <EmailAutocomplete
                items={studioOwners}
                value={selectedStudioId}
                onChange={(studio) => {
                  setSelectedStudioId(studio._id);
                  setSelectedStudio(studio);
                  setNewStudio(studio);
                }}
                placeholder="Type studio email..."
                displayField="contactEmail"
              />
            </label>
            <label>
              Studio Email
              <input
                type="email"
                value={newStudio.contactEmail}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    contactEmail: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Registered Address
              <input
                type="text"
                value={newStudio.registeredAddress}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    registeredAddress: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Contact Number
              <input
                type="text"
                value={newStudio.contactNumber}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, contactNumber: e.target.value })
                }
              />
            </label>

            <label>
              GST Number
              <input
                type="text"
                value={newStudio.gstNumber}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, gstNumber: e.target.value })
                }
              />
            </label>

            <label>
              PAN Number
              <input
                type="text"
                value={newStudio.panNumber}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, panNumber: e.target.value })
                }
              />
            </label>

            <label>
              Bank Account Number
              <input
                type="text"
                value={newStudio.bankAccountNumber}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    bankAccountNumber: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Bank IFSC Code
              <input
                type="text"
                value={newStudio.bankIfscCode}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, bankIfscCode: e.target.value })
                }
              />
            </label>

            <label>
              Studio Introduction
              <textarea
                value={newStudio.studioIntroduction}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioIntroduction: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Website
              <input
                type="text"
                value={newStudio.studioWebsite}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, studioWebsite: e.target.value })
                }
              />
            </label>

            <label>
              Facebook
              <input
                type="text"
                value={newStudio.studioFacebook}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, studioFacebook: e.target.value })
                }
              />
            </label>

            <label>
              YouTube
              <input
                type="text"
                value={newStudio.studioYoutube}
                onChange={(e) =>
                  setNewStudio({ ...newStudio, studioYoutube: e.target.value })
                }
              />
            </label>

            <label>
              Instagram
              <input
                type="text"
                value={newStudio.studioInstagram}
                onChange={(e) =>
                  setNewStudio({
                    ...newStudio,
                    studioInstagram: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">
            Update Studio
          </button>
        </form>
      )}

      {activeForm === "deleteStudio" && (
        <form className="create-form" onSubmit={handleDeleteStudio}>
          <h3>Delete Studio
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>

          <label>
            Select Studio (Type Email)
            <EmailAutocomplete
              items={studioOwners}
              value={selectedStudioId}
              onChange={(studio) => setSelectedStudioId(studio._id)}
              placeholder="Type studio email..."
              displayField="contactEmail"
            />
          </label>

          <button type="submit" className="submit-btn">
            Delete Studio
          </button>
        </form>
      )}

      {activeForm === "updateBranch" && (
        <form className="create-form" onSubmit={handleUpdateBranch}>
          <h3>Update Branch
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <div className="form-grid">
            {/* Select Studio */}
            <label>
              Select Studio
              <select
                value={newBranch.studioId || ""}
                onChange={(e) => {
                  const studioId = e.target.value;
                  setNewBranch({ ...newBranch, studioId });
                  fetchBranches(studioId);
                  setSelectedBranchId(""); // reset branch selection
                }}
                required
              >
                <option value="">-- Select Studio --</option>
                {studios.map((studio) => (
                  <option key={studio._id} value={studio._id}>
                    {studio.studioName}
                  </option>
                ))}
              </select>
            </label>

            {/* Select Branch */}
            <label>
              Select Branch
              <select
                value={selectedBranchId}
                onChange={(e) => {
                  const branchId = e.target.value;
                  setSelectedBranchId(branchId);
                  const branch = studioBranches.find((b) => b._id === branchId);
                  if (branch) setNewBranch(branch);
                }}
                required
              >
                <option value="">-- Select Branch --</option>
                {studioBranches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Branch Name */}
            <label>
              Branch Name
              <input
                type="text"
                value={newBranch.name || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, name: e.target.value })
                }
                required
              />
            </label>

            {/* Address */}
            <label>
              Address
              <input
                type="text"
                value={newBranch.address || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, address: e.target.value })
                }
                required
              />
            </label>

            {/* Pincode */}
            <label>
              Pincode
              <input
                type="text"
                value={newBranch.pincode || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, pincode: e.target.value })
                }
                required
              />
            </label>

            {/* Area */}
            <label>
              Area
              <input
                type="text"
                value={newBranch.area || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, area: e.target.value })
                }
                required
              />
            </label>

            {/* Country */}
            <label>
              Country
              <input
                type="text"
                value={newBranch.country || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, country: e.target.value })
                }
                required
              />
            </label>

            {/* State */}
            <label>
              State
              <input
                type="text"
                value={newBranch.state || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, state: e.target.value })
                }
                required
              />
            </label>

            {/* City */}
            <label>
              City
              <input
                type="text"
                value={newBranch.city || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, city: e.target.value })
                }
                required
              />
            </label>

            {/* Contact Number */}
            <label>
              Contact Number
              <input
                type="text"
                value={newBranch.contactNo || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, contactNo: e.target.value })
                }
              />
            </label>

            {/* Google Map Link */}
            <label>
              Google Map Link
              <input
                type="text"
                value={newBranch.mapLink || ""}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, mapLink: e.target.value })
                }
              />
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Update Branch
          </button>
        </form>
      )}

      {activeForm === "deleteBranch" && (
        <form className="create-form" onSubmit={handleDeleteBranch}>
          <h3>Delete Branch
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>

          {/* Select Studio */}
          <label>
            Select Studio
            <select
              value={newBranch.studioId || ""}
              onChange={(e) => {
                const studioId = e.target.value;
                setNewBranch({ ...newBranch, studioId });
                fetchBranches(studioId);
              }}
              required
            >
              <option value="">-- Select Studio --</option>
              {studios.map((studio) => (
                <option key={studio._id} value={studio._id}>
                  {studio.studioName}
                </option>
              ))}
            </select>
          </label>

          {/* Select Branch */}
          <label>
            Select Branch
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              required
            >
              <option value="">-- Select Branch --</option>
              {studioBranches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="submit-btn">
            Delete Branch
          </button>
        </form>
      )}

      {activeForm === "updateBatch" && (
        <form className="create-form" onSubmit={handleUpdateBatch}>
          <h3>Update Batch
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>
          <div className="form-grid">
            {/* Select Studio */}
            <label>
              Select Studio
              <select
                value={newBatch.studioId || ""}
                onChange={(e) => {
                  const studioId = e.target.value;
                  setNewBatch({ ...newBatch, studioId, branch: "" });
                  setSelectedBatchId("");
                }}
                required
              >
                <option value="">-- Select Studio --</option>
                {batchStudios.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.studioName}
                  </option>
                ))}
              </select>
            </label>

            {/* Select Branch */}
            <label>
              Select Branch
              <select
                value={newBatch.branch || ""}
                onChange={(e) => {
                  const branchId = e.target.value;
                  setNewBatch({ ...newBatch, branch: branchId, batchName: "" });
                  setSelectedBatchId("");
                }}
                required
              >
                <option value="">-- Select Branch --</option>
                {branchesForBatch.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Select Batch */}
            <label>
              Select Batch
              <select
                value={selectedBatchId}
                onChange={(e) => {
                  const batchId = e.target.value;
                  setSelectedBatchId(batchId);

                  const batch = batchesForBranch.find((b) => b._id === batchId);
                  if (batch) {
                    setNewBatch({
                      studioId: batch.studioId?._id || "",
                      branch: batch.branch?._id || "",
                      style: batch.style?._id || "",
                      level: batch.level?._id || "",
                      batchName: batch.batchName || "",
                      trainer: batch.trainer || "",
                      fee: batch.fee || "",
                      capacity: batch.capacity || "",
                      startTime: batch.startTime || "",
                      endTime: batch.endTime || "",
                      fromDate: batch.fromDate
                        ? batch.fromDate.split("T")[0]
                        : "",
                      toDate: batch.toDate ? batch.toDate.split("T")[0] : "",
                      days: batch.days || [],
                    });
                  }
                }}
                required
              >
                <option value="">-- Select Batch --</option>
                {batchesForBranch.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </label>

            {/* Batch Fields */}
            <label>
              Batch Name
              <input
                type="text"
                value={newBatch.batchName || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, batchName: e.target.value })
                }
                required
              />
            </label>

            <label>
              Trainer
              <input
                type="text"
                value={newBatch.trainer || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, trainer: e.target.value })
                }
                required
              />
            </label>

            <label>
              Fee
              <input
                type="text"
                value={newBatch.fee || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, fee: e.target.value })
                }
                required
              />
            </label>

            <label>
              Capacity
              <input
                type="text"
                value={newBatch.capacity || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, capacity: e.target.value })
                }
                required
              />
            </label>

            <label>
              Start Time
              <input
                type="time"
                value={newBatch.startTime || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, startTime: e.target.value })
                }
                required
              />
            </label>

            <label>
              End Time
              <input
                type="time"
                value={newBatch.endTime || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, endTime: e.target.value })
                }
                required
              />
            </label>

            <label>
              From Date
              <input
                type="date"
                value={newBatch.fromDate || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, fromDate: e.target.value })
                }
                required
              />
            </label>

            <label>
              To Date
              <input
                type="date"
                value={newBatch.toDate || ""}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, toDate: e.target.value })
                }
                required
              />
            </label>

            <label>
              Days (comma separated)
              <input
                type="text"
                value={newBatch.days?.join(", ") || ""}
                onChange={(e) =>
                  setNewBatch({
                    ...newBatch,
                    days: e.target.value.split(",").map((d) => d.trim()),
                  })
                }
              />
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Update Batch
          </button>
        </form>
      )}

      {activeForm === "deleteBatch" && (
        <form className="create-form" onSubmit={handleDeleteBatch}>
          <h3>Delete Batch
            <span onClick={() => setActiveForm(null)} className="close-btn">✕</span>
          </h3>

          <label>
            Select Studio
            <select
              value={newBatch.studioId || ""}
              onChange={(e) => {
                const studioId = e.target.value;
                setNewBatch({ ...newBatch, studioId, branch: "" });
                setSelectedBatchId("");
              }}
              required
            >
              <option value="">-- Select Studio --</option>
              {batchStudios.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.studioName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Select Branch
            <select
              value={newBatch.branch || ""}
              onChange={(e) => {
                const branchId = e.target.value;
                setNewBatch({ ...newBatch, branch: branchId });
                setSelectedBatchId("");
              }}
              required
            >
              <option value="">-- Select Branch --</option>
              {branchesForBatch.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Select Batch
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              required
            >
              <option value="">-- Select Batch --</option>
              {batchesForBranch.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="submit-btn">
            Delete Batch
          </button>
        </form>
      )}

      {/* Data Cards */}

      <h3 className="section-title">Data Export</h3>
      <div className="data-operations-sections">
        <DataCard title="Dance Studios" type="studios" endpoint="studios" onDownload={handleDownload} />
        <DataCard title="Platform Users" type="users" endpoint="users" onDownload={handleDownload} />
        <DataCard title="Dance Styles" type="dancestyle" endpoint="demographics/dancestyle" onDownload={handleDownload} />
        <DataCard title="Countries" type="country" endpoint="demographics/country" onDownload={handleDownload} />
        <DataCard title="States" type="state" endpoint="demographics/state" onDownload={handleDownload} />
        <DataCard title="Cities" type="city" endpoint="demographics/city" onDownload={handleDownload} />
        <DataCard title="Coupons" type="coupon" endpoint="coupons" onDownload={handleDownload} />
      </div>

    </div>
  );
}
const iconMap = {
  users: <FiUsers />,
  studios: <FiHome />,
  dancestyle: <FiTag />,
  country: <FiGlobe />,
  state: <FiMap />,
  city: <FiMapPin />,
  coupon: <FiTag />,
};

const DataCard = ({ title, type, endpoint, onDownload }) => (
  <div className={`data-card-modern ${type}`}>
    
    <div className="data-card-header">
      <div className="data-card-icon">
        {iconMap[type] || <FiDownloadCloud />}
      </div>

      <div className="data-card-text">
        <h3>{title}</h3>
        <p>Export all {title.toLowerCase()}</p>
      </div>
    </div>

    <button
      className="data-card-btn"
      onClick={() => onDownload(type, endpoint)}
    >
      <FiDownloadCloud /> Download
    </button>

  </div>
);

export default DataOperations;
