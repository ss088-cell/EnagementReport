function importDefectDojoReport() {
  // API details for POST request
  const apiUrl = "https://<your_defect_dojo_url>/api/v2/reports/";  // Replace with your API URL for report generation
  const apiToken = "Token <your_api_token>";  // Replace with your DefectDojo API token

  // Define the payload for the POST request
  const payload = {
    "engagement": <engagement_id>,  // Replace with the actual engagement ID
    "report_type": "JSON",          // You want the report in JSON format
    "title": "Engagement Report",
    "include_finding_notes": true,  // Customize based on your needs
    "include_finding_images": false,
    "include_finding_request_response": false
  };

  // Set up the options for the POST request
  const options = {
    method: "POST",
    headers: {
      "Authorization": apiToken,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload)
  };

  try {
    // Make the POST request to generate the report
    const response = UrlFetchApp.fetch(apiUrl, options);
    const jsonData = JSON.parse(response.getContentText());

    // Check the structure of the response to ensure it's correct
    Logger.log(jsonData);

    // Get the active sheet in the spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EngagementReport");  // Replace with your sheet name

    // Check if the sheet exists, if not, throw an error
    if (!sheet) {
      throw new Error("Sheet 'EngagementReport' not found. Please make sure it exists.");
    }

    // Clear previous data in the sheet if necessary
    sheet.clear();

    // Parse JSON data and insert it into the Google Sheet
    const headers = ["Title", "Severity", "Description"];  // Example headers (adjust to actual field names)
    sheet.appendRow(headers);  // Adding headers to the sheet

    // Assuming jsonData contains an array of findings or results in `findings`
    const reportData = jsonData.findings;  // Adjust based on actual JSON structure
    if (reportData) {
      reportData.forEach(function(finding) {
        // Check if the display_status is "Active"
        if (finding.display_status === "Active") {
          // Extract relevant data from each finding (adjust fields to match actual structure)
          const row = [
            finding.title,
            finding.severity,
            finding.description
            // Removed finding.display_status from the row
          ];
          sheet.appendRow(row);
        }
      });
      Logger.log("Data import complete.");
    } else {
      Logger.log("No findings data found in the report.");
    }
  } catch (error) {
    Logger.log("Error fetching or processing data: " + error.message);
  }
}

