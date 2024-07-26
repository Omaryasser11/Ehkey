import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./UserVerifiedPage.scss";
import useAddRecommendedEmail from "../../../hooks/admin/user/useAddRecommendedEmail";

const UserVerifiedPage = ({ onBack }) => {
  const { addRecommendedEmail } = useAddRecommendedEmail();
  const [manualEntry, setManualEntry] = useState({ email: "" });

  const token = localStorage.getItem("authToken");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const users = rows.map((row) => ({ email: row[1] }));

        for (const user of users) {
          await addRecommendedEmail(user.email, token);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleManualEntry = async () => {
    if (manualEntry.email) {
      await addRecommendedEmail(manualEntry.email, token);
      setManualEntry({ email: "" });
    }
  };

  return (
    <div className="user-verified-page mainPage col-12">
      <h1>User Verification</h1>
      <div className="input-section">
        <div className="file-upload">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </div>
        <div className="manual-entry">
          <input
            type="email"
            placeholder="Email"
            value={manualEntry.email}
            onChange={(e) =>
              setManualEntry({ ...manualEntry, email: e.target.value })
            }
          />
          <button onClick={handleManualEntry}>Add User</button>
        </div>
      </div>

    </div>
  );
};

export default UserVerifiedPage;
